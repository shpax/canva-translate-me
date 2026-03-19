
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
      description: "Heading shown after translations are applied, showing how many elements were translated",
      defaultMessage: "{count, plural, one {# element translated} other {# elements translated}}",
    },
    { count },
  );
  const buttonLabel = intl.formatMessage({ id: "done.resetButton", description: "Button to start translating another page", defaultMessage: "Translate another page" });

  return (
    <Rows spacing="2u">
      <Title size="small">{title}</Title>
      <Button variant="primary" onClick={onReset} stretch>
        {buttonLabel}
      </Button>
    </Rows>
  );
}
