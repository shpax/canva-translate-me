import React from "react";
import { LoadingIndicator, Rows, Text } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { AppStatus } from "../lib/types";

export interface LoadingScreenProps {
  status: Extract<AppStatus, "exporting" | "translating">;
}

export function LoadingScreen({ status }: LoadingScreenProps) {
  const intl = useIntl();

  const labels: Record<Extract<AppStatus, "exporting" | "translating">, string> = {
    exporting: intl.formatMessage({ id: "loading.exporting", defaultMessage: "Exporting design…" }),
    translating: intl.formatMessage({ id: "loading.translating", defaultMessage: "Analyzing image with Claude…" }),
  };

  return (
    <Rows spacing="2u">
      <LoadingIndicator size="medium" />
      <Text alignment="center">{labels[status]}</Text>
    </Rows>
  );
}
