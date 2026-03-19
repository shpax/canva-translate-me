import React from "react";
import { Box, Button, Column, Columns, CogIcon, Rows, Text } from "@canva/app-ui-kit";

export interface IdleScreenProps {
  onAnalyze: () => void;
  onSettings: () => void;
}

const step1 = "1. Open Settings and pick your target language.";
const step2 = "2. Click the button below — the app exports your current page and sends it to Claude AI.";
const step3 = "3. Review the 3 translation variants generated for each text element.";
const step4 = "4. Click Apply on the variant you like, or use Apply all A to apply everywhere at once.";
const noteText =
  "Note: Only the current page is translated. Don't edit the design while reviewing.";

export function IdleScreen({ onAnalyze, onSettings }: IdleScreenProps) {
  return (
    <Rows spacing="2u">
      <Columns spacing="1u" alignY="center">
        <Column />
        <Column width="content">
          <Button
            variant="tertiary"
            icon={CogIcon}
            onClick={onSettings}
            ariaLabel="Settings"
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
        Analyze &amp; Translate page
      </Button>
    </Rows>
  );
}
