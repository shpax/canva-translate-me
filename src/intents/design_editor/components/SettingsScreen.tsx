import { useState } from "react";
import {
  Button,
  Column,
  Columns,
  FormField,
  Rows,
  Select,
  Text,
  TextInput,
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

const LANGUAGE_OPTIONS = LANGUAGES.map((l) => ({
  value: l.code,
  label: l.label,
}));

export function SettingsScreen({ onBack, onKeyCleared }: SettingsScreenProps) {
  const [newKey, setNewKey] = useState("");
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [langCode, setLangCode] = useState(() =>
    settingsStore.getLanguageCode(),
  );
  const intl = useIntl();

  const currentKey = apiKeyStore.get();

  function handleLangChange(code: string) {
    settingsStore.setLanguageCode(code);
    setLangCode(code);
  }

  function handleSave() {
    if (
      !newKey.trim().startsWith("sk-ant-") &&
      newKey.trim() !== DUMMY_API_KEY
    ) {
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

  const titleText = intl.formatMessage({ id: "settings.title", description: "Heading on the settings screen", defaultMessage: "Settings" });
  const langFieldLabel = intl.formatMessage({ id: "settings.langFieldLabel", description: "Label for the target language dropdown", defaultMessage: "Target language" });
  const currentKeyLabel = intl.formatMessage({ id: "settings.currentKeyLabel", description: "Label above the masked display of the currently saved API key", defaultMessage: "Current key" });
  const replaceFieldLabel = intl.formatMessage({ id: "settings.replaceFieldLabel", description: "Label for the input field to enter a new API key", defaultMessage: "Replace with a new key" });
  const errorText = intl.formatMessage({ id: "settings.error", description: "Validation error when the entered API key has an invalid format", defaultMessage: "Must start with sk-ant-" });
  const placeholder = intl.formatMessage({ id: "settings.placeholder", description: "Placeholder text for the API key input in settings", defaultMessage: "sk-ant-..." });
  const savedLabel = intl.formatMessage({ id: "settings.savedButton", description: "Save button label shown briefly after a successful key save", defaultMessage: "Saved!" });
  const saveNewKeyLabel = intl.formatMessage({ id: "settings.saveNewKeyButton", description: "Button to save the newly entered API key", defaultMessage: "Save new key" });
  const clearLabel = intl.formatMessage({ id: "settings.clearButton", description: "Button to delete the saved API key", defaultMessage: "Clear saved key" });
  const backLabel = intl.formatMessage({ id: "settings.closeButton", description: "Button to close the settings screen and return to the home screen", defaultMessage: "Close" });

  return (
    <Rows spacing="2u">
      <Columns spacing="1u" alignY="center">
        <Column>
          <Title size="small">{titleText}</Title>
        </Column>
        <Column width="content">
          <Button variant="tertiary" onClick={onBack}>
            {backLabel}
          </Button>
        </Column>
      </Columns>

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
        <Text size="small" tone="secondary">
          {currentKeyLabel}
        </Text>
        <Text size="small">{maskKey(currentKey)}</Text>
      </Rows>

      <FormField
        label={replaceFieldLabel}
        error={error ? errorText : undefined}
        control={(props) => (
          <TextInput
            {...props}
            value={newKey}
            placeholder={placeholder}
            error={!!error}
            onChange={(val) => {
              setNewKey(val);
              setError(false);
              setSaved(false);
            }}
          />
        )}
      />

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
