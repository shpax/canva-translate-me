# Support

**App:** TranslateME
**Contact:** [your@email.com]

---

## Getting Started

### 1. Add your Anthropic API key

The App requires a personal Anthropic API key. You can get one at [console.anthropic.com](https://console.anthropic.com).

When you open the App for the first time, you will be prompted to enter your key. It is saved in your browser and never shared with anyone. To update or clear the key, go to **Settings** (the gear icon on the main screen).

### 2. Translate a page

1. Open a design in Canva and navigate to the page you want to translate.
2. Open the App and select your target language in **Settings** (default: English).
3. Click **Analyze & Translate page**.
4. Wait for the export and AI analysis to complete (usually 10–20 seconds).
5. Review the translation table: for each text element you will see 3 variants.
6. Click **Apply** next to the variant you prefer, or use **Apply all A** to apply the first variant everywhere.
7. Click **Finish** when done.

---

## Frequently Asked Questions

**The app says "Translation service unavailable." What should I check?**

- Verify your API key is valid and has available credits at [console.anthropic.com](https://console.anthropic.com).
- Check your internet connection.
- The Anthropic API may be experiencing an outage — check [status.anthropic.com](https://status.anthropic.com).

**Some rows show "not found in design" and have no Apply button.**

Claude identified text in the exported image that the App could not locate in your design's editable text elements. This happens when text is embedded in an image, flattened into a background, or inside a locked element. Those elements must be edited manually.

**I applied a translation but the text didn't update in the design.**

The App matches text by exact content. If the text was edited between when you clicked "Analyze & Translate" and when you clicked "Apply", the match may fail. Click Reset and run the analysis again on the updated page.

**The translation quality isn't good for my language.**

Translation quality depends on the Claude AI model. You can try again to get a different set of variants, or edit the applied text directly in Canva after applying.

**Can I translate multiple pages at once?**

Not currently. The App translates the active page only. To translate additional pages, navigate to each page and run the App again.

**My API key is not accepted.**

Anthropic API keys start with `sk-ant-`. Make sure you are pasting the full key including that prefix. Keys are case-sensitive.

**I accidentally cleared my API key.**

You can re-enter it via the App's first-run setup screen or in **Settings**. Retrieve a key from [console.anthropic.com](https://console.anthropic.com).

**How do I change the target language?**

Open **Settings** (the gear icon on the main screen) and select your preferred language from the dropdown. The setting is saved automatically.

---

## Known Limitations

- **Single page only** — multi-page batch translation is not supported.
- **Editable text only** — text embedded in images or flattened elements cannot be translated.
- **One session at a time** — avoid editing the design while a translation is in progress.
- **API costs** — each translation uses your Anthropic API credits. The App uses prompt caching to reduce costs for repeated sessions.

---

## Contact Support

If your issue is not covered above, email [your@email.com] with:

1. A description of the problem and the steps to reproduce it
2. The error message shown (if any)
3. Your browser name and version
