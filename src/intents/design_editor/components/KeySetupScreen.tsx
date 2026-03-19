import React, { useState } from "react";
import { Button, FormField, Rows, Text, Title } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { apiKeyStore } from "../lib/apiKeyStore";

export interface KeySetupScreenProps {
  onSaved: () => void;
}

export function KeySetupScreen({ onSaved }: KeySetupScreenProps) {
  const [value, setValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState(false);
  const intl = useIntl();

  function handleSave() {
    if (!value.trim().startsWith("sk-ant-")) {
      setError(true);
      return;
    }
    apiKeyStore.set(value);
    onSaved();
  }

  const titleText = intl.formatMessage({ id: "keySetup.title", defaultMessage: "Setup — Anthropic API Key" });
  const descText = intl.formatMessage({ id: "keySetup.description", defaultMessage: "Your key is stored only in this browser (localStorage). It is never sent anywhere except directly to Anthropic." });
  const fieldLabel = intl.formatMessage({ id: "keySetup.fieldLabel", defaultMessage: "Anthropic API key" });
  const errorText = intl.formatMessage({ id: "keySetup.error", defaultMessage: "Must start with sk-ant-" });
  const placeholder = intl.formatMessage({ id: "keySetup.placeholder", defaultMessage: "sk-ant-..." });
  const showKeyLabel = intl.formatMessage({ id: "keySetup.showKey", defaultMessage: "Show key" });
  const hideKeyLabel = intl.formatMessage({ id: "keySetup.hideKey", defaultMessage: "Hide key" });
  const saveLabel = intl.formatMessage({ id: "keySetup.saveButton", defaultMessage: "Save and continue" });
  const helpText = intl.formatMessage({ id: "keySetup.helpText", defaultMessage: "Get your key at console.anthropic.com → API Keys" });

  return (
    <Rows spacing="2u">
      <Title size="small">{titleText}</Title>
      <Text size="small" tone="secondary">{descText}</Text>

      <FormField
        label={fieldLabel}
        error={error ? errorText : undefined}
        control={(props) => (
          <input
            {...props}
            type={showKey ? "text" : "password"}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px",
              borderRadius: "4px",
              border: error ? "1px solid var(--ui-kit-color-content-critical)" : "1px solid var(--ui-kit-color-border-default)",
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

      <Button variant="primary" onClick={handleSave} stretch disabled={!value.trim()}>
        {saveLabel}
      </Button>

      <Text size="small" tone="secondary">{helpText}</Text>
    </Rows>
  );
}
