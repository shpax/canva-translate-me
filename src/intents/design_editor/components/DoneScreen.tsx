import React from "react";
import { Button, Rows, Text, Title } from "@canva/app-ui-kit";

export interface DoneScreenProps {
  count: number;
  onReset: () => void;
}

export function DoneScreen({ count, onReset }: DoneScreenProps) {
  return (
    <Rows spacing="2u">
      <Title size="small">
        {count} {count === 1 ? "element" : "elements"} translated
      </Title>
      <Button variant="primary" onClick={onReset} stretch>
        Translate another page
      </Button>
    </Rows>
  );
}
