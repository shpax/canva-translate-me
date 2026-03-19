import React from "react";
import { Button, Rows, Title } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";

export interface DoneScreenProps {
  count: number;
  onReset: () => void;
}

export function DoneScreen({ count, onReset }: DoneScreenProps) {
  const intl = useIntl();

  const title = intl.formatMessage(
    {
      id: "done.title",
      defaultMessage: "{count, plural, one {# element translated} other {# elements translated}}",
    },
    { count },
  );
  const buttonLabel = intl.formatMessage({ id: "done.resetButton", defaultMessage: "Translate another page" });

  return (
    <Rows spacing="2u">
      <Title size="small">{title}</Title>
      <Button variant="primary" onClick={onReset} stretch>
        {buttonLabel}
      </Button>
    </Rows>
  );
}
