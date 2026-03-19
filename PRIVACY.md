# Privacy Policy

**Last updated:** March 18, 2026
**Developer:** Maksym Piven

---

## Overview

TranslateME is designed with a minimal data footprint. The developer does not operate any backend server and does not collect, receive, store, or process any personal data or design content from users.

---

## 1. Data We Collect

**We collect nothing.** The developer has no server, no database, and no analytics pipeline. No data from your use of the App is ever transmitted to the developer.

---

## 2. Data Stored Locally in Your Browser

The App stores the following data in your browser's `localStorage`:

| Data                       | Purpose                                           | Location          |
| -------------------------- | ------------------------------------------------- | ----------------- |
| Anthropic API key          | Authenticate requests to the Anthropic API        | Your browser only |
| Target language preference | Remember your last selected translation language  | Your browser only |

This data never leaves your device except as described in Section 3. You can clear it at any time via the App's Settings screen or by clearing your browser's localStorage.

---

## 3. Data Sent to Third Parties

When you click "Analyze & Translate", the App sends the following directly from your browser to **Anthropic's API**:

- A PNG image of your current Canva design page
- Your Anthropic API key (in the request header, as required for authentication)

This transmission is made directly between your browser and Anthropic's servers — it does not pass through any server controlled by the developer.

Anthropic processes this data according to their own policies:

- [Anthropic Privacy Policy](https://www.anthropic.com/legal/privacy)
- [Anthropic Usage Policy](https://www.anthropic.com/legal/aup)

The App also operates within the Canva platform. Canva's data practices are governed by [Canva's Privacy Policy](https://www.canva.com/policies/privacy-policy/).

---

## 4. Canva SDK Permissions

The App requests the following Canva SDK permissions:

| Permission              | Why it is needed                                               |
| ----------------------- | -------------------------------------------------------------- |
| `design:content:read`   | Read text elements from the current page to match translations |
| `design:content:write`  | Write the selected translation back into the design            |
| `design:context:read`   | Export the current design page as a PNG for analysis           |

These permissions are used only during active App operation and only on the current design page.

---

## 5. Children's Privacy

The App is not directed at children under 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect information from children.

---

## 6. Changes to This Policy

If this policy changes in a material way, the "Last updated" date at the top will be revised. We encourage you to review this policy periodically.

---

## 7. Contact

For privacy questions or data requests, contact: translate.splashy812@simplelogin.com
