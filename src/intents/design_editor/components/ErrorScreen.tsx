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
    export_failed: intl.formatMessage({ id: "error.exportFailed", defaultMessage: "Couldn't export the design. Please try again." }),
    timeout: intl.formatMessage({ id: "error.timeout", defaultMessage: "Export timed out. Please try again." }),
    claude_failed: intl.formatMessage({ id: "error.claudeFailed", defaultMessage: "Translation service unavailable. Please try again." }),
    parse_error: intl.formatMessage({ id: "error.parseError", defaultMessage: "Couldn't parse translation results. Please try again." }),
    no_text: intl.formatMessage({ id: "error.noText", defaultMessage: "No translatable text found on this page." }),
  };

  const userMessage = messages[error.code] ?? error.message;
  const titleText = intl.formatMessage({ id: "error.title", defaultMessage: "Something went wrong" });
  const retryLabel = intl.formatMessage({ id: "error.retryButton", defaultMessage: "Try again" });

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
