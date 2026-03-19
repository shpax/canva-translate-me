import { AppError, RawTranslationEntry, TranslationEntry } from "./types";
import { Language, findLanguage } from "./languages";
import { isDummyKey, MOCK_ENTRIES } from "./mockTranslation";

function buildSystemPrompt(lang: Language): string {
  const { native } = lang;
  return `You are an expert ${native} advertising copywriter and translator.
Your task is to translate English advertising text into ${native}.

## Translation rules

1. **Translate ad copy, not UI**: Translate marketing headlines, taglines, body copy, and
   call-to-action text. Do NOT translate text that is clearly rendered inside a device screen
   mockup (phone/laptop UI), terminal windows, or code snippets — those are product
   screenshots showing the real interface, not ad copy.

2. **Preserve tone**: Keep the same energy and register as the English original.
   Marketing copy should stay punchy and persuasive. Technical copy should stay precise.

3. **Natural ${native}**: Use modern, colloquial ${native}. Keep the language natural and
   idiomatic for native speakers.

4. **Brand names / product names**: Do not translate brand names or product names.
   Keep them in their original Latin script form.

5. **Numbers, units, symbols**: Keep as-is (e.g. "50%" stays "50%").

6. **Variant diversity**: Each of the 3 variants should differ meaningfully — not just
   synonym swaps. Try different sentence structures, registers, or emphasis.

## Output format

Respond ONLY with a valid JSON array. No preamble, no markdown, no explanation.
Each object in the array represents one translatable text element:

[
  {
    "original": "exact original English text as it appears in the image",
    "a": "first ${native} translation variant",
    "b": "second ${native} translation variant",
    "c": "third ${native} translation variant"
  }
]

If no translatable text is found, return an empty array: []`;
}

export interface AnthropicClientConfig {
  apiKey: string;
  targetLanguageCode?: string;
  fetchFn?: typeof fetch;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
}

export async function translateImageWithClaude(
  base64Image: string,
  config: AnthropicClientConfig,
): Promise<TranslationEntry[]> {
  if (isDummyKey(config.apiKey)) {
    return MOCK_ENTRIES;
  }

  const fn = config.fetchFn ?? fetch;
  const lang: Language = findLanguage(config.targetLanguageCode ?? "en");

  const res = await fn("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "prompt-caching-2024-07-31",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: buildSystemPrompt(lang),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: "Translate the text in this ad image.",
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw buildError("claude_failed", `Anthropic API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  const textBlock = data.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw buildError("parse_error", "Claude returned no text content.");
  }

  return parseTranslationResponse(textBlock.text);
}

// Pure function — parse and validate Claude's JSON output
export function parseTranslationResponse(raw: string): TranslationEntry[] {
  let parsed: unknown;
  try {
    // Strip optional markdown fences if Claude slipped one in
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/```$/m, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw buildError("parse_error", "Couldn't parse translation results.");
  }

  if (!Array.isArray(parsed)) {
    throw buildError("parse_error", "Expected a JSON array from Claude.");
  }

  if (parsed.length === 0) {
    throw buildError("no_text", "No translatable text found on this page.");
  }

  return parsed.map((item, index) => validateEntry(item as RawTranslationEntry, index));
}

function validateEntry(item: RawTranslationEntry, index: number): TranslationEntry {
  const strings: (keyof RawTranslationEntry)[] = ["original", "a", "b", "c"];
  for (const key of strings) {
    if (typeof item[key] !== "string") {
      throw buildError(
        "parse_error",
        `Entry ${index} is missing required field "${key}".`,
      );
    }
  }
  return {
    original: item.original as string,
    a: item.a as string,
    b: item.b as string,
    c: item.c as string,
  };
}

function buildError(code: AppError["code"], message: string): AppError {
  return { code, message };
}
