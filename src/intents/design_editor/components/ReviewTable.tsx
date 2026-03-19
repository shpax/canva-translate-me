import React from "react";
import {
  Badge,
  Box,
  Button,
  Column,
  Columns,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import { TranslationEntry, TranslationVariant } from "../lib/types";
import * as styles from "styles/components.css";

export interface ReviewTableProps {
  entries: TranslationEntry[];
  onApply: (index: number, variant: TranslationVariant) => void;
  onApplyAll: (variant: TranslationVariant) => void;
  onFinish: () => void;
  onReset: () => void;
}

export function ReviewTable({
  entries,
  onApply,
  onApplyAll,
  onFinish,
  onReset,
}: ReviewTableProps) {
  const unappliedCount = entries.filter((e) => !e.appliedVariant).length;
  const appliedCount = entries.length - unappliedCount;
  const finishLabel =
    appliedCount > 0
      ? `Finish (${appliedCount} of ${entries.length} applied)`
      : "Finish without applying";

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Columns spacing="1u" alignY="center">
          <Column>
            <Text>
              <strong>{entries.length} elements found</strong>
            </Text>
          </Column>
          <Column width="content">
            <Button
              variant="secondary"
              onClick={() => onApplyAll("a")}
              disabled={unappliedCount === 0}
            >
              Use A
            </Button>
          </Column>
          <Column width="content">
            <Button
              variant="secondary"
              onClick={() => onApplyAll("b")}
              disabled={unappliedCount === 0}
            >
              Use B
            </Button>
          </Column>
          <Column width="content">
            <Button
              variant="secondary"
              onClick={() => onApplyAll("c")}
              disabled={unappliedCount === 0}
            >
              Use C
            </Button>
          </Column>
          <Column width="content">
            <Button variant="tertiary" onClick={onReset}>
              Reset
            </Button>
          </Column>
        </Columns>

        <Button variant="primary" onClick={onFinish} stretch>
          {finishLabel}
        </Button>

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
            <Badge tone="positive" text="Applied" />
          </Column>
        </Columns>
      </Box>
    );
  }

  const canApply = entry.existsInDesign !== false;
  const notFoundSuffix = canApply ? null : " — not found in design";
  const applyLabel = "Apply";

  return (
    <Box padding="1u" borderRadius="standard" background="neutralSubtle">
      <Rows spacing="1u">
        <Text size="small" tone={entry.applyError ? "critical" : "secondary"}>
          {entry.original}
          {entry.applyError && " — could not find this text in the design"}
          {notFoundSuffix}
        </Text>

        {(["a", "b", "c"] as TranslationVariant[]).map((variant) => (
          <Columns key={variant} spacing="1u" alignY="center">
            <Column>
              <Text size="small">
                <strong>{variant.toUpperCase()}.</strong> {entry[variant]}
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
