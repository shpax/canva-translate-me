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
    exporting: intl.formatMessage({ id: "loading.exporting", description: "Status text shown while the design is being exported", defaultMessage: "Exporting design…" }),
    translating: intl.formatMessage({ id: "loading.translating", description: "Status text shown while Claude AI is processing the image", defaultMessage: "Analyzing image with Claude…" }),
  };

  return (
    <Rows spacing="2u">
      <LoadingIndicator size="medium" />
      <Text alignment="center">{labels[status]}</Text>
    </Rows>
  );
}
