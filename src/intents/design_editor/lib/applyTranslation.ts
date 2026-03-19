import { editContent } from "@canva/design";

export interface ApplyResult {
  matched: boolean;
}

// Applies a single translation to the current page.
// Isolated into its own module so it can be mocked in hook tests.
export async function applyTranslation(
  original: string,
  translated: string,
): Promise<ApplyResult> {
  let matched = false;

  await editContent(
    { contentType: "richtext", target: "current_page" },
    async (session) => {
      for (const content of session.contents) {
        if (content.deleted) continue;

        const plaintext = content.readPlaintext().trim();

        if (plaintext === original.trim()) {
          content.replaceText({ index: 0, length: plaintext.length }, translated);
          matched = true;
          continue;
        }

        // Fallback: partial match for text split across runs
        if (!matched && plaintext.includes(original.trim())) {
          console.warn(
            `[TranslateME] Partial match for "${original}" — using includes() fallback.`,
          );
          content.replaceText({ index: 0, length: plaintext.length }, translated);
          matched = true;
        }
      }

      await session.sync();
    },
  );

  return { matched };
}

// Read all editable plaintext strings from the current page.
export async function readTextElements(): Promise<string[]> {
  const texts: string[] = [];

  await editContent(
    { contentType: "richtext", target: "current_page" },
    async (session) => {
      for (const content of session.contents) {
        if (content.deleted) continue;
        const plaintext = content.readPlaintext().trim();
        if (plaintext) texts.push(plaintext);
      }
      await session.sync();
    },
  );

  return texts;
}

// Read-only scan: returns the subset of originals that exist on the current page.
// Uses editContent (read path only) — sync() is called but nothing is replaced.
export async function checkTextsExist(
  originals: string[],
): Promise<Set<string>> {
  const found = new Set<string>();
  const trimmed = originals.map((o) => o.trim());

  await editContent(
    { contentType: "richtext", target: "current_page" },
    async (session) => {
      for (const content of session.contents) {
        if (content.deleted) continue;
        const plaintext = content.readPlaintext().trim();
        for (const original of trimmed) {
          if (plaintext === original || plaintext.includes(original)) {
            found.add(original);
          }
        }
      }
      await session.sync();
    },
  );

  return found;
}

// Batch apply: single editContent session for all pairs to stay within the 60s limit.
export async function applyAllTranslations(
  pairs: Array<{ original: string; translated: string }>,
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>(
    pairs.map(({ original }) => [original, false]),
  );

  await editContent(
    { contentType: "richtext", target: "current_page" },
    async (session) => {
      for (const content of session.contents) {
        if (content.deleted) continue;
        const plaintext = content.readPlaintext().trim();

        for (const { original, translated } of pairs) {
          if (plaintext === original.trim()) {
            content.replaceText({ index: 0, length: plaintext.length }, translated);
            results.set(original, true);
            break;
          }
        }
      }

      await session.sync();
    },
  );

  return results;
}
