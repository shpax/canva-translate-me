# Canva Ukrainian Ad Translator — Plugin Requirements

## Overview

A private Canva Apps SDK plugin that automates the translation of English ad images into
Ukrainian. The plugin exports the current design page as an image, passes it to Claude
vision for intelligent text identification and translation (respecting visual context),
then presents a review table where the user selects preferred variants before applying
them back into the Canva design.

### Goals

- Eliminate manual copy-paste between Canva and an LLM
- Preserve visual formatting by writing translations back via the SDK (not regenerating images)
- Respect product-specific translation rules (e.g. don't translate terminal labels, screen UI)
- Give the user choice: 3 translation variants per text element, applied one-click per element

### Non-goals

- Generating or replacing images
- Supporting languages other than Ukrainian (for now)
- Public marketplace distribution (private integration only)

---

## Architecture

```
[Canva editor]
     │
     │  1. User clicks "Analyze & Translate"
     ▼
[Plugin: export current page]
     │  Connect API → create export job (PNG) → poll → download image bytes
     ▼
[Plugin: call Claude vision]
     │  POST image + system prompt directly to Anthropic API (claude-haiku-4-5)
     │  Claude returns structured JSON: array of { original, variants[3] }
     ▼
[Plugin: display review table]
     │  Each row: original text | variant A | variant B | variant C | Apply button
     ▼
[Plugin: apply selected variant]
     │  editContent() → find matching plaintext → replaceText() → session.sync()
     ▼
[Canva design updated]
```

### Why this architecture

- **Full image to Claude**: Visual context is required to correctly apply translation rules
  (e.g. distinguishing a feature label from UI text inside a device screen mockup).
  Raw text extraction via `editContent()` alone loses this context.
- **Direct API call**: This is a private plugin — it is never published to the Canva
  marketplace and only runs for a single known user. The API key is stored as a build-time
  environment variable and never exposed in a public context.
- **Review before apply**: The system prompt requests 3 variants — the user picks the best
  one per element. Full-auto apply is intentionally not supported.
- **`editContent()` for write-back**: Preserves Canva formatting (font, size, color, weight).
  Does not regenerate or flatten the design.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Plugin framework | Canva Apps SDK (React + TypeScript) |
| UI components | `@canva/app-ui-kit` |
| Design read | `@canva/design` — `editContent()` (Content Querying API) |
| Design export | Canva Connect API — `POST /v1/exports` |
| AI translation | Anthropic API — `claude-haiku-4-5-20251001`, vision |
| Auth | Canva OAuth (handled by SDK) + API key via build-time env var |

---

## Canva SDK Scopes Required

Register these in the Canva Developer Portal under the app's configuration:

- `design:content:read` — read text elements from the design
- `design:content:write` — write translated text back
- `design:context:read` — read current page/design metadata for export
- `asset:read` — may be needed depending on export flow

---

## Plugin UI — States & Screens

### State 1: Idle

```
┌─────────────────────────────────┐
│  🇺🇦 Ukrainian Ad Translator    │
│                                 │
│  Analyzes the current page and  │
│  translates ad text to          │
│  Ukrainian using Claude AI.     │
│                                 │
│  [Analyze & Translate page]     │
└─────────────────────────────────┘
```

### State 2: Loading (three sub-steps shown sequentially)

- "Exporting design…"
- "Analyzing image with Claude…"
- "Building translation table…"

Show a `ProgressBar` with approximate progress per step (30% / 70% / 95%).

### State 3: Review Table

```
┌─────────────────────────────────────────────────────────────────┐
│  7 elements found  [Apply all A]  [Reset]                       │
├──────────────────┬──────────────┬──────────────┬────────────────┤
│ Original (EN)    │  Variant A   │  Variant B   │   Variant C    │
├──────────────────┼──────────────┼──────────────┼────────────────┤
│ Smart Energy     │ Розумна      │ Інтелектуальн│ Економна       │
│ Monitor          │ Енергія      │ ий моніторинг│ Енергія        │
│                  │ [Apply ✓]    │ [Apply]      │ [Apply]        │
├──────────────────┼──────────────┼──────────────┼────────────────┤
│ Monitor your     │ Відстежуйте… │ Контролюйте… │ Стежте за…     │
│ energy usage     │ [Apply ✓]    │ [Apply]      │ [Apply]        │
└──────────────────┴──────────────┴──────────────┴────────────────┘
```

- "Apply" button per variant per row — clicking it immediately calls `editContent()` and
  marks that row as applied (checkmark, muted style)
- "Apply all A" button applies variant A for all unapplied rows in one `editContent()` call
- Applied rows collapse to a single line showing the applied Ukrainian text
- "Reset" returns to idle state

### State 4: Done

```
┌─────────────────────────────────┐
│  ✓ 7 elements translated        │
│                                 │
│  [Translate another page]       │
└─────────────────────────────────┘
```

### State 5: Error

Show the error message and a "Try again" button. Distinguish between:
- Export failure (Canva API issue)
- Claude API failure (proxy/network issue)
- No text found on page
- Parse error (Claude returned malformed JSON)

---

## Export Flow (Connect API)

The plugin must export the current page as a PNG to pass to Claude vision.

```typescript
// 1. Initiate export job
POST /v1/exports
{
  "design_id": "<current design id>",
  "format": { "type": "png", "export_quality": "regular" },
  "pages": [{ "page_index": 0 }]  // current page only
}

// 2. Poll until complete (max 30s, 2s interval)
GET /v1/exports/{job_id}
// → { status: "success", urls: [{ url: "https://..." }] }

// 3. Fetch image bytes from the returned URL
// → ArrayBuffer → base64 encode for Claude vision payload
```

Getting the current design ID:

```typescript
import { getCurrentDesignContext } from "@canva/design";
const context = await getCurrentDesignContext();
const designId = context.designId;
```

Getting the current page index: use `getPageContext()` or derive from the active page.
If the SDK does not expose this directly, export all pages and use index 0 as a fallback
(single-page designs are the primary use case).

### Export Error Handling

- If the export job returns `status: "failed"`, show error state
- If polling times out after 30s, show error state with message "Export timed out"
- If the returned image URL is unreachable, show error state

---

## Anthropic API Call

The plugin calls the Anthropic API directly from the browser using the
`anthropic-dangerous-direct-browser-access` header, which is required for
browser-based API calls. This is acceptable here because the plugin is
private — it is never published to the Canva marketplace.

```typescript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "anthropic-beta": "prompt-caching-2024-07-31",
    "anthropic-dangerous-direct-browser-access": "true",
  },
  body: JSON.stringify({ /* see Claude Vision Request section */ }),
});
```

The API key is injected at build time via a `.env` file and the Canva CLI's
environment variable support — it is never hardcoded in source.

---

## Claude Vision Request

### Model

`claude-haiku-4-5-20251001`

### Prompt caching

The system prompt is static across all images in a session (same product, same rules).
Enable prompt caching so the system prompt is only fully priced on the first call —
subsequent calls in the same session pay the cache read rate (~10× cheaper).

- Cache TTL: 5 minutes, reset on each hit
- Minimum cacheable tokens: 1024 (the system prompt comfortably exceeds this)
- Required header: `"anthropic-beta": "prompt-caching-2024-07-31"`
- Add `cache_control: { type: "ephemeral" }` to the system prompt block (see proxy implementation above)

Cost impact (Haiku):

| | Per token |
|---|---|
| Normal input | $0.80 / 1M |
| Cache write (first call) | $1.00 / 1M |
| Cache read (subsequent calls) | $0.08 / 1M |

For a session translating 10 images, 9 of 10 system prompt reads are at cache-read price.

### System prompt

Use the system prompt verbatim from `ad_translation_only_system_prompt.md`, with one
addition at the end:

```
## Output format

Respond ONLY with a valid JSON array. No preamble, no markdown, no explanation.
Each object in the array represents one translatable text element:

[
  {
    "original": "exact original English text as it appears in the image",
    "a": "first Ukrainian translation variant",
    "b": "second Ukrainian translation variant",
    "c": "third Ukrainian translation variant"
  }
]

If no translatable text is found, return an empty array: []
```

### User message

```json
[
  {
    "type": "image",
    "source": {
      "type": "base64",
      "media_type": "image/png",
      "data": "<base64 string>"
    }
  },
  {
    "type": "text",
    "text": "Translate the text in this ad image."
  }
]
```

### API parameters

```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 2048,
  "system": [
    {
      "type": "text",
      "text": "<system prompt text>",
      "cache_control": { "type": "ephemeral" }
    }
  ],
  "messages": [{ "role": "user", "content": "<above>" }]
}
```

Required headers:
```
anthropic-version: 2023-06-01
anthropic-beta: prompt-caching-2024-07-31
```

---

## Write-back Logic

When the user clicks "Apply" for a variant:

```typescript
import { editContent } from "@canva/design";

async function applyTranslation(original: string, translated: string) {
  await editContent(
    { contentType: "richtext", target: "current_page" },
    async (session) => {
      for (const content of session.contents) {
        if (content.deleted) continue;
        const plaintext = content.readPlaintext().trim();
        if (plaintext === original.trim()) {
          content.replaceText(
            { index: 0, length: plaintext.length },
            translated
          );
        }
      }
      await session.sync();
    }
  );
}
```

### Matching strategy

- Match by exact plaintext equality (`trim()` on both sides)
- If no exact match is found (e.g. Canva split the text across runs), try
  `includes()` as a fallback and log a warning in the console
- Do not silently skip — if a match fails, mark the row with a warning icon
  and tooltip: "Could not find this text in the design. It may have been edited."

### Batch apply ("Apply all A")

Collect all unapplied `original → variantA` pairs, then run a single `editContent()`
session that iterates and replaces all of them, then calls `session.sync()` once.

---

## File Structure

```
canva-ua-translator/
├── src/
│   ├── app.tsx              # Root component, state machine
│   ├── components/
│   │   ├── IdleScreen.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── ReviewTable.tsx
│   │   ├── DoneScreen.tsx
│   │   └── ErrorScreen.tsx
│   ├── hooks/
│   │   ├── useExport.ts     # Connect API export logic
│   │   └── useTranslate.ts  # Anthropic API call + JSON parse
│   ├── lib/
│   │   ├── applyTranslation.ts   # editContent write-back
│   │   ├── exportDesign.ts       # export job polling
│   │   └── types.ts              # shared TypeScript types
│   └── styles/
│       └── components.css
├── public/
│   └── manifest.json
├── .env                     # ANTHROPIC_API_KEY (gitignored)
├── package.json
└── tsconfig.json
```

---

## TypeScript Types

```typescript
// lib/types.ts

export interface TranslationEntry {
  original: string;
  a: string;
  b: string;
  c: string;
  appliedVariant?: "a" | "b" | "c";  // set after apply
  applyError?: boolean;
}

export type AppStatus =
  | "idle"
  | "exporting"
  | "translating"
  | "reviewing"
  | "done"
  | "error";

export interface AppError {
  code: "export_failed" | "claude_failed" | "no_text" | "parse_error" | "timeout";
  message: string;
}
```

---

## Environment & Configuration

```typescript
// Injected at build time via Canva CLI + .env file
const ANTHROPIC_API_KEY = process.env.CANVA_APP_ANTHROPIC_API_KEY!;
```

```bash
# .env  (gitignored)
CANVA_APP_ANTHROPIC_API_KEY=sk-ant-...
```

Canva's CLI supports `.env` files and prefixes env vars with `CANVA_APP_` for
injection into the plugin bundle. The key is never hardcoded in source.

---

## Error Handling Matrix

| Scenario | User-facing message | Recovery |
|---|---|---|
| Export job fails | "Couldn't export the design. Try again." | Retry button |
| Export times out (>30s) | "Export timed out. Try again." | Retry button |
| Anthropic API unreachable | "Translation service unavailable." | Retry button |
| Claude returns non-JSON | "Couldn't parse translation results." | Retry button |
| Claude returns empty array | "No translatable text found on this page." | Retry button |
| `editContent` match not found | Warning icon on row + tooltip | Manual edit |
| `editContent` session expired | "Session expired. Re-open and try again." | Re-open app |

---

## Development Setup

### Prerequisites

- Node.js v20+
- Canva developer account
- Anthropic API key

### Steps

```bash
# 1. Scaffold plugin
npx @canva/cli@latest app create
# Select: React + TypeScript

# 2. Install deps
npm install

# 3. Copy src/ files from this spec

# 4. Create .env
echo "CANVA_APP_ANTHROPIC_API_KEY=sk-ant-..." >> .env

# 5. Run
npm start
# Opens dev tunnel automatically via Canva CLI

# 6. In Canva: Apps → Your apps → Development → [your app name]
```

---

## Constraints & Known Limitations

- **1-minute session timeout**: `editContent()` sessions expire after 60 seconds.
  For designs with many text elements, batch all writes into a single session and call
  `sync()` once at the end. Don't call the Claude API inside the session callback.
- **Current page only**: The Content Querying API target is `current_page`. Multi-page
  support requires iterating pages with the `all_pages` preview API — out of scope for v1.
- **Image size**: Large exports may produce PNG files >5MB. If Claude returns a payload
  size error, retry with `export_quality: "regular"` (already specified above) or
  downscale the image before base64 encoding.
- **Text matching fragility**: If the user edits text between the export and the apply
  step, matches will fail. Warn the user in the review table header: "Don't edit the
  design while reviewing translations."
- **No undo for "Apply all"**: Each individual `sync()` creates an undo step. "Apply all A"
  uses one sync, so it undoes as a single operation — acceptable behavior.
- **Connect API rate limit**: Export jobs are limited to 20 requests/minute per user.
  Not a concern for this use case.

---

## Out of Scope (v1)

- Multi-language support (other than Ukrainian)
- Multi-page batch translation
- Translation memory / caching repeated strings
- Saving preferred variants for reuse across designs
- Font size auto-adjustment for longer Ukrainian strings
- Image regeneration or text overlay replacement
