import React, { useState } from "react";
import { Button, FormField, Rows, Text, Title } from "@canva/app-ui-kit";
import { apiKeyStore } from "../lib/apiKeyStore";

export interface KeySetupScreenProps {
  onSaved: () => void;
}

export function KeySetupScreen({ onSaved }: KeySetupScreenProps) {
  const [value, setValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState(false);

  function handleSave() {
    if (!value.trim().startsWith("sk-ant-")) {
      setError(true);
      return;
    }
    apiKeyStore.set(value);
    onSaved();
  }

  return (
    <Rows spacing="2u">
      <Title size="small">Setup — Anthropic API Key</Title>
      <Text size="small" tone="secondary">
        Your key is stored only in this browser (localStorage). It is never
        sent anywhere except directly to Anthropic.
      </Text>

      <FormField
        label="Anthropic API key"
        error={error ? "Must start with sk-ant-" : undefined}
        control={(props) => (
          <input
            {...props}
            type={showKey ? "text" : "password"}
            value={value}
            placeholder="sk-ant-..."
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
        {showKey ? "Hide key" : "Show key"}
      </Button>

      <Button variant="primary" onClick={handleSave} stretch disabled={!value.trim()}>
        Save and continue
      </Button>

      <Text size="small" tone="secondary">
        Get your key at console.anthropic.com → API Keys
      </Text>
    </Rows>
  );
}
