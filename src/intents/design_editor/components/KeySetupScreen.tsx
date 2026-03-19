import { useState } from "react";
import { Button, FormField, Rows, Text, TextInput, Title } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { apiKeyStore } from "../lib/apiKeyStore";
import { DUMMY_API_KEY } from "../lib/mockTranslation";

export interface KeySetupScreenProps {
  onSaved: () => void;
}

export function KeySetupScreen({ onSaved }: KeySetupScreenProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const intl = useIntl();

  function handleSave() {
    if (!value.trim().startsWith("sk-ant-") && value.trim() !== DUMMY_API_KEY) {
      setError(true);
      return;
    }
    apiKeyStore.set(value);
    onSaved();
  }

  const titleText = intl.formatMessage({ id: "keySetup.title", description: "Heading on the API key setup screen", defaultMessage: "Setup — Anthropic API Key" });
  const descText = intl.formatMessage({ id: "keySetup.description", description: "Explanation of how the API key is stored and used", defaultMessage: "Your key is stored only in this browser (localStorage). It is never sent anywhere except directly to Anthropic." });
  const fieldLabel = intl.formatMessage({ id: "keySetup.fieldLabel", description: "Label for the API key input field", defaultMessage: "Anthropic API key" });
  const errorText = intl.formatMessage({ id: "keySetup.error", description: "Validation error shown when the API key format is invalid", defaultMessage: "Must start with sk-ant-" });
  const placeholder = intl.formatMessage({ id: "keySetup.placeholder", description: "Placeholder text for the API key input", defaultMessage: "sk-ant-..." });
  const saveLabel = intl.formatMessage({ id: "keySetup.saveButton", description: "Button to save the API key and proceed", defaultMessage: "Save and continue" });
  const helpText = intl.formatMessage({ id: "keySetup.helpText", description: "Helper text directing users to get their API key", defaultMessage: "Get your key at console.anthropic.com → API Keys" });

  return (
    <Rows spacing="2u">
      <Title size="small">{titleText}</Title>
      <Text size="small" tone="secondary">{descText}</Text>

      <FormField
        label={fieldLabel}
        error={error ? errorText : undefined}
        control={(props) => (
          <TextInput
            {...props}
            value={value}
            placeholder={placeholder}
            error={!!error}
            onChange={(val) => {
              setValue(val);
              setError(false);
            }}
          />
        )}
      />

      <Button variant="primary" onClick={handleSave} stretch disabled={!value.trim()}>
        {saveLabel}
      </Button>

      <Text size="small" tone="secondary">{helpText}</Text>
    </Rows>
  );
}
