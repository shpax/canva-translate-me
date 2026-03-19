import React from "react";
import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { AppError, ErrorCode } from "../lib/types";

export interface ErrorScreenProps {
  error: AppError;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const intl = useIntl();

  const messages: Record<ErrorCode, string> = {
    export_failed: intl.formatMessage({ id: "error.exportFailed", description: "Error message when the design export fails", defaultMessage: "Couldn't export the design. Please try again." }),
    timeout: intl.formatMessage({ id: "error.timeout", description: "Error message when the export times out", defaultMessage: "Export timed out. Please try again." }),
    claude_failed: intl.formatMessage({ id: "error.claudeFailed", description: "Error message when the Claude AI translation call fails", defaultMessage: "Translation service unavailable. Please try again." }),
    parse_error: intl.formatMessage({ id: "error.parseError", description: "Error message when the translation response cannot be parsed", defaultMessage: "Couldn't parse translation results. Please try again." }),
    no_text: intl.formatMessage({ id: "error.noText", description: "Error message when no translatable text is found on the page", defaultMessage: "No translatable text found on this page." }),
  };

  const userMessage = messages[error.code] ?? error.message;
  const titleText = intl.formatMessage({ id: "error.title", description: "Heading on the error screen", defaultMessage: "Something went wrong" });
  const retryLabel = intl.formatMessage({ id: "error.retryButton", description: "Button to retry after an error", defaultMessage: "Try again" });

  return (
    <Rows spacing="2u">
      <Title size="small">{titleText}</Title>
      <Text>{userMessage}</Text>
      <Button variant="primary" onClick={onRetry} stretch>
        {retryLabel}
      </Button>
    </Rows>
  );
}
