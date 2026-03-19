# Testing Guide

To test TranslateME without an Anthropic API key, open the app in Canva and enter `dummy-key` as the API key (either on the first-run setup screen or via the Settings gear icon). No real API credentials are required in this mode.

Click **Analyze & Translate page** as normal. The app will export your current design page, then skip the Anthropic API call and return a set of pre-defined sample translations in French. The review table will display 5 text elements, each with 3 translation variants labelled A, B, and C. You can use the **Use A / Use B / Use C** buttons at the top to apply a variant to all rows at once, or use the individual **Apply** buttons to apply variants one at a time.

To test text replacement, add one of the sample source strings to your design as an editable text element before clicking Analyze. The sample strings are: *Smart Energy Monitor*, *Track your energy usage in real time*, *Save up to 40% on your electricity bill*, *Get Started Free*, and *No credit card required*. When the matching text is present in the design, clicking Apply will replace it with the selected French variant and mark the row as applied. If no matching text is found, the row shows an inline error message — this is the expected error state and can also be observed during testing.
