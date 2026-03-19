import React, { useState } from "react";
import {
  Button,
  FormField,
  Rows,
  Select,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { apiKeyStore } from "../lib/apiKeyStore";
import { settingsStore } from "../lib/settingsStore";
import { LANGUAGES } from "../lib/languages";

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

  const currentKey = apiKeyStore.get();

  function handleLangChange(code: string) {
    settingsStore.setLanguageCode(code);
    setLangCode(code);
  }

  function handleSave() {
    if (!newKey.trim().startsWith("sk-ant-")) {
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

  return (
    <Rows spacing="2u">
      <Button
        variant="tertiary"
        icon={() => <span>←</span>}
        onClick={onBack}
        ariaLabel="Back"
      />

      <Title size="small">Settings</Title>

      <FormField
        label="Target language"
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
        <Text size="small" tone="secondary">
          Current key
        </Text>
        <Text size="small">{maskKey(currentKey)}</Text>
      </Rows>

      <FormField
        label="Replace with a new key"
        error={error ? "Must start with sk-ant-" : undefined}
        control={(props) => (
          <input
            {...props}
            type={showKey ? "text" : "password"}
            value={newKey}
            placeholder="sk-ant-..."
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
        {showKey ? "Hide key" : "Show key"}
      </Button>

      <Button
        variant="primary"
        onClick={handleSave}
        stretch
        disabled={!newKey.trim()}
      >
        {saved ? "Saved!" : "Save new key"}
      </Button>

      <Button variant="secondary" onClick={handleClear} stretch>
        Clear saved key
      </Button>
    </Rows>
  );
}
