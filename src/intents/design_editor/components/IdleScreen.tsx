import React from "react";
import { Box, Button, Column, Columns, CogIcon, Rows, Text } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

export interface IdleScreenProps {
  onAnalyze: () => void;
  onSettings: () => void;
}

export function IdleScreen({ onAnalyze, onSettings }: IdleScreenProps) {
  const intl = useIntl();

  const step1 = intl.formatMessage({ id: "idle.step1", defaultMessage: "1. Open Settings and pick your target language." });
  const step2 = intl.formatMessage({ id: "idle.step2", defaultMessage: "2. Click the button below — the app exports your current page and sends it to Claude AI." });
  const step3 = intl.formatMessage({ id: "idle.step3", defaultMessage: "3. Review the 3 translation variants generated for each text element." });
  const step4 = intl.formatMessage({ id: "idle.step4", defaultMessage: "4. Click Apply on the variant you like, or use Apply all A to apply everywhere at once." });
  const noteText = intl.formatMessage({ id: "idle.note", defaultMessage: "Note: Only the current page is translated. Don't edit the design while reviewing." });
  const settingsAriaLabel = intl.formatMessage({ id: "idle.settingsAriaLabel", defaultMessage: "Settings" });
  const analyzeLabel = intl.formatMessage({ id: "idle.analyzeButton", defaultMessage: "Analyze & Translate page" });

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

      <Text tone="secondary" size="small">{noteText}</Text>

      <Button variant="primary" onClick={onAnalyze} stretch>
        {analyzeLabel}
      </Button>
    </Rows>
  );
}
