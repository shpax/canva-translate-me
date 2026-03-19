import React from "react";
import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import { AppError, ErrorCode } from "../lib/types";

const USER_MESSAGES: Record<ErrorCode, string> = {
  export_failed: "Couldn't export the design. Please try again.",
  timeout: "Export timed out. Please try again.",
  claude_failed: "Translation service unavailable. Please try again.",
  parse_error: "Couldn't parse translation results. Please try again.",
  no_text: "No translatable text found on this page.",
};

export interface ErrorScreenProps {
  error: AppError;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const userMessage = USER_MESSAGES[error.code] ?? error.message;

  return (
    <Rows spacing="2u">
      <Title size="small">Something went wrong</Title>
      <Text>{userMessage}</Text>
      <Button variant="primary" onClick={onRetry} stretch>
        Try again
      </Button>
    </Rows>
  );
}
