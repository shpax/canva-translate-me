import React from "react";
import { LoadingIndicator, Rows, Text } from "@canva/app-ui-kit";
import { AppStatus } from "../lib/types";

const STEP_LABELS: Record<Extract<AppStatus, "exporting" | "translating">, string> = {
  exporting: "Exporting design…",
  translating: "Analyzing image with Claude…",
};

export interface LoadingScreenProps {
  status: Extract<AppStatus, "exporting" | "translating">;
}

export function LoadingScreen({ status }: LoadingScreenProps) {
  return (
    <Rows spacing="2u">
      <LoadingIndicator size="medium" />
      <Text alignment="center">{STEP_LABELS[status]}</Text>
    </Rows>
  );
}
