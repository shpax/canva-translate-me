import {
  Badge,
  Box,
  Button,
  Column,
  Columns,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { TranslationEntry, TranslationVariant } from "../lib/types";
import * as styles from "styles/components.css";

export interface ReviewTableProps {
  entries: TranslationEntry[];
  onApply: (index: number, variant: TranslationVariant) => void;
  onApplyAll: (variant: TranslationVariant) => void;
  onFinish: () => void;
  onRevert: () => void;
  onCancel: () => void;
}

export function ReviewTable({
  entries,
  onApply,
  onApplyAll,
  onFinish,
  onRevert,
  onCancel,
}: ReviewTableProps) {
  const intl = useIntl();
  const unappliedCount = entries.filter((e) => !e.appliedVariant).length;
  const appliedCount = entries.length - unappliedCount;
  const canApplyAny = entries.some((e) => !e.appliedVariant && e.existsInDesign !== false);

  const elementsFoundText = intl.formatMessage(
    { id: "review.elementsFound", description: "Count of text elements found in the design", defaultMessage: "{count} elements found" },
    { count: entries.length },
  );
  const cancelLabel = intl.formatMessage({ id: "review.cancelButton", description: "Button to cancel the review and revert all changes", defaultMessage: "Cancel" });
  const useALabel = intl.formatMessage({ id: "review.useAButton", description: "Button to apply translation variant A to all unapplied entries", defaultMessage: "Use A" });
  const useBLabel = intl.formatMessage({ id: "review.useBButton", description: "Button to apply translation variant B to all unapplied entries", defaultMessage: "Use B" });
  const useCLabel = intl.formatMessage({ id: "review.useCButton", description: "Button to apply translation variant C to all unapplied entries", defaultMessage: "Use C" });
  const resetLabel = intl.formatMessage({ id: "review.resetButton", description: "Button to revert all applied translations back to the originals", defaultMessage: "Reset" });
  const finishLabel = appliedCount > 0
    ? intl.formatMessage(
        { id: "review.finishWithCount", description: "Finish button showing how many entries were applied out of the total", defaultMessage: "Finish ({appliedCount} of {total} applied)" },
        { appliedCount, total: entries.length },
      )
    : intl.formatMessage({ id: "review.finishWithoutApplying", description: "Finish button shown when no translations have been applied yet", defaultMessage: "Finish without applying" });

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Columns spacing="1u" alignY="center">
          <Column>
            <Text>
              <strong>{elementsFoundText}</strong>
            </Text>
          </Column>
          <Column width="content">
            <Button variant="tertiary" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </Column>
        </Columns>

        <Columns spacing="1u">
          <Column>
            <Button
              variant="secondary"
              onClick={() => onApplyAll("a")}
              disabled={!canApplyAny}
              stretch
            >
              {useALabel}
            </Button>
          </Column>
          <Column>
            <Button
              variant="secondary"
              onClick={() => onApplyAll("b")}
              disabled={!canApplyAny}
              stretch
            >
              {useBLabel}
            </Button>
          </Column>
          <Column>
            <Button
              variant="secondary"
              onClick={() => onApplyAll("c")}
              disabled={!canApplyAny}
              stretch
            >
              {useCLabel}
            </Button>
          </Column>
        </Columns>

        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 2 }}>
            <Button variant="primary" onClick={onFinish} stretch>
              {finishLabel}
            </Button>
          </div>
          <div style={{ flex: 1 }}>
            <Button
              variant="secondary"
              onClick={onRevert}
              disabled={appliedCount === 0}
              stretch
            >
              {resetLabel}
            </Button>
          </div>
        </div>

        {entries.map((entry, index) => (
          <TranslationRow
            key={entry.original}
            entry={entry}
            onApply={(variant) => onApply(index, variant)}
          />
        ))}
      </Rows>
    </div>
  );
}

interface TranslationRowProps {
  entry: TranslationEntry;
  onApply: (variant: TranslationVariant) => void;
}

function TranslationRow({ entry, onApply }: TranslationRowProps) {
  const intl = useIntl();

  const appliedBadgeText = intl.formatMessage({ id: "row.appliedBadge", description: "Badge shown on a translation entry that has been applied to the design", defaultMessage: "Applied" });
  const applyLabel = intl.formatMessage({ id: "row.applyButton", description: "Button to apply a single translation variant to the design", defaultMessage: "Apply" });
  const applyErrorText = intl.formatMessage({ id: "row.applyError", description: "Suffix shown when applying a translation failed to find the text", defaultMessage: " — could not find this text in the design" });
  const notFoundText = intl.formatMessage({ id: "row.notFound", description: "Suffix shown when the original text does not exist in the design", defaultMessage: " — not found in design" });

  if (entry.appliedVariant) {
    return (
      <Box padding="1u" borderRadius="standard" background="neutralSubtle">
        <Columns spacing="1u" alignY="center">
          <Column>
            <Text size="small" tone="secondary">
              {entry.original}
            </Text>
            <Text size="small">{entry[entry.appliedVariant]}</Text>
          </Column>
          <Column width="content">
            <Badge tone="positive" text={appliedBadgeText} />
          </Column>
        </Columns>
      </Box>
    );
  }

  const canApply = entry.existsInDesign !== false;
  const notFoundSuffix = canApply ? null : notFoundText;

  return (
    <Box padding="1u" borderRadius="standard" background="neutralSubtle">
      <Rows spacing="1u">
        <Text size="small" tone={entry.applyError ? "critical" : "secondary"}>
          {entry.original}
          {entry.applyError && applyErrorText}
          {notFoundSuffix}
        </Text>

        {(["a", "b", "c"] as TranslationVariant[]).map((variant) => (
          <Columns key={variant} spacing="1u" alignY="center">
            <Column>
              <Text size="small">
                <strong>{variant.toUpperCase()}.</strong> {canApply ? entry[variant] : <span style={{ userSelect: "text", cursor: "text" }}>{entry[variant]}</span>}
              </Text>
            </Column>
            {canApply && (
              <Column width="content">
                <Button variant="secondary" onClick={() => onApply(variant)}>
                  {applyLabel}
                </Button>
              </Column>
            )}
          </Columns>
        ))}
      </Rows>
    </Box>
  );
}
