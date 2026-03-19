import { Box, Button, Column, Columns, CogIcon, Rows, Text } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

export interface IdleScreenProps {
  onAnalyze: () => void;
  onSettings: () => void;
}

export function IdleScreen({ onAnalyze, onSettings }: IdleScreenProps) {
  const intl = useIntl();

  const step1 = intl.formatMessage({ id: "idle.step1", description: "Step 1 instruction on the home screen", defaultMessage: "1. Open Settings and pick your target language." });
  const step2 = intl.formatMessage({ id: "idle.step2", description: "Step 2 instruction on the home screen", defaultMessage: "2. Click the button below — the app exports the current page and sends it to Claude AI." });
  const step3 = intl.formatMessage({ id: "idle.step3", description: "Step 3 instruction on the home screen", defaultMessage: "3. Review the 3 translation variants generated for each text element." });
  const step4 = intl.formatMessage({ id: "idle.step4", description: "Step 4 instruction on the home screen", defaultMessage: "4. Click Apply on the variant you like, or use Apply all A to apply everywhere at once." });
  const currentPageNote = intl.formatMessage({ id: "idle.currentPageNote", description: "Warning that only the current page is exported for translation", defaultMessage: "Current page only — navigate to the page you want to translate before clicking the button." });
  const doNotEditNote = intl.formatMessage({ id: "idle.doNotEditNote", description: "Warning not to edit the design while reviewing translations", defaultMessage: "Do not edit the design while reviewing translations." });
  const settingsAriaLabel = intl.formatMessage({ id: "idle.settingsAriaLabel", description: "Accessible label for the settings icon button", defaultMessage: "Settings" });
  const analyzeLabel = intl.formatMessage({ id: "idle.analyzeButton", description: "Primary button that starts the translation process", defaultMessage: "Translate current page" });

  return (
    <Rows spacing="2u">
      <Columns spacing="1u" alignY="center">
        <Column />
        <Column width="content">
          <Button
            variant="tertiary"
            icon={CogIcon}
            onClick={onSettings}
            ariaLabel={settingsAriaLabel}
          />
        </Column>
      </Columns>

      <Box background="neutralSubtle" borderRadius="standard" padding="2u">
        <Rows spacing="1u">
          <Text size="small">{step1}</Text>
          <Text size="small">{step2}</Text>
          <Text size="small">{step3}</Text>
          <Text size="small">{step4}</Text>
        </Rows>
      </Box>

      <Box background="neutral" borderRadius="standard" padding="1u">
        <Rows spacing="1u">
          <Text size="small"><strong>{currentPageNote}</strong></Text>
          <Text size="small" tone="secondary">{doNotEditNote}</Text>
        </Rows>
      </Box>

      <Button variant="primary" onClick={onAnalyze} stretch>
        {analyzeLabel}
      </Button>
    </Rows>
  );
}
