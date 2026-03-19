import React, { useState } from "react";
import {
  Button,
  FormField,
  Rows,
  Select,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { apiKeyStore } from "../lib/apiKeyStore";
import { settingsStore } from "../lib/settingsStore";
import { LANGUAGES } from "../lib/languages";
import { DUMMY_API_KEY } from "../lib/mockTranslation";

export interface SettingsScreenProps {
  onBack: () => void;
  onKeyCleared: () => void;
}

function maskKey(key: string): string {
  if (key.length <= 12) return "••••••••";
  return key.slice(0, 10) + "••••" + key.slice(-4);
}

const LANGUAGE_OPTIONS = LANGUAGES.map((l) => ({ value: l.code, label: l.label }));

export function SettingsScreen({ onBack, onKeyCleared }: SettingsScreenProps) {
  const [newKey, setNewKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [langCode, setLangCode] = useState(() => settingsStore.getLanguageCode());
  const intl = useIntl();

  const currentKey = apiKeyStore.get();

  function handleLangChange(code: string) {
    settingsStore.setLanguageCode(code);
    setLangCode(code);
  }

  function handleSave() {
    if (!newKey.trim().startsWith("sk-ant-") && newKey.trim() !== DUMMY_API_KEY) {
      setError(true);
      return;
    }
    apiKeyStore.set(newKey);
    setNewKey("");
    setSaved(true);
    setError(false);
    onBack();
  }

  function handleClear() {
    apiKeyStore.clear();
    onKeyCleared();
  }

  const backAriaLabel = intl.formatMessage({ id: "settings.backAriaLabel", defaultMessage: "Back" });
  const titleText = intl.formatMessage({ id: "settings.title", defaultMessage: "Settings" });
  const langFieldLabel = intl.formatMessage({ id: "settings.langFieldLabel", defaultMessage: "Target language" });
  const currentKeyLabel = intl.formatMessage({ id: "settings.currentKeyLabel", defaultMessage: "Current key" });
  const replaceFieldLabel = intl.formatMessage({ id: "settings.replaceFieldLabel", defaultMessage: "Replace with a new key" });
  const errorText = intl.formatMessage({ id: "settings.error", defaultMessage: "Must start with sk-ant-" });
  const placeholder = intl.formatMessage({ id: "settings.placeholder", defaultMessage: "sk-ant-..." });
  const showKeyLabel = intl.formatMessage({ id: "settings.showKey", defaultMessage: "Show key" });
  const hideKeyLabel = intl.formatMessage({ id: "settings.hideKey", defaultMessage: "Hide key" });
  const savedLabel = intl.formatMessage({ id: "settings.savedButton", defaultMessage: "Saved!" });
  const saveNewKeyLabel = intl.formatMessage({ id: "settings.saveNewKeyButton", defaultMessage: "Save new key" });
  const clearLabel = intl.formatMessage({ id: "settings.clearButton", defaultMessage: "Clear saved key" });

  return (
    <Rows spacing="2u">
      <Button
        variant="tertiary"
        icon={() => <span>←</span>}
        onClick={onBack}
        ariaLabel={backAriaLabel}
      />

      <Title size="small">{titleText}</Title>

      <FormField
        label={langFieldLabel}
        control={(props) => (
          <Select
            {...props}
            options={LANGUAGE_OPTIONS}
            value={langCode}
            onChange={handleLangChange}
            stretch
          />
        )}
      />

      <Rows spacing="1u">
        <Text size="small" tone="secondary">{currentKeyLabel}</Text>
        <Text size="small">{maskKey(currentKey)}</Text>
      </Rows>

      <FormField
        label={replaceFieldLabel}
        error={error ? errorText : undefined}
        control={(props) => (
          <input
            {...props}
            type={showKey ? "text" : "password"}
            value={newKey}
            placeholder={placeholder}
            onChange={(e) => {
              setNewKey(e.target.value);
              setError(false);
              setSaved(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px",
              borderRadius: "4px",
              border: error
                ? "1px solid var(--ui-kit-color-content-critical)"
                : "1px solid var(--ui-kit-color-border-default)",
              background: "var(--ui-kit-color-bg-default)",
              color: "var(--ui-kit-color-content-primary)",
              fontSize: "13px",
            }}
          />
        )}
      />

      <Button variant="tertiary" onClick={() => setShowKey((v) => !v)}>
        {showKey ? hideKeyLabel : showKeyLabel}
      </Button>

      <Button
        variant="primary"
        onClick={handleSave}
        stretch
        disabled={!newKey.trim()}
      >
        {saved ? savedLabel : saveNewKeyLabel}
      </Button>

      <Button variant="secondary" onClick={handleClear} stretch>
        {clearLabel}
      </Button>
    </Rows>
  );
}
