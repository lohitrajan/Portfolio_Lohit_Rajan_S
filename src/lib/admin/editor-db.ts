import { updateRow } from "./db";
import { moveItem, duplicateValues as makeDuplicate, type Values } from "./forms";
import type { AdminTable, Row } from "./db";

export { insertRow, updateRow, deleteRows, listQuery } from "./db";

/** Reorder the collection; the database remains the authority on access. */
export function moveRows(rows: Row[], index: number, direction: -1 | 1) {
  return moveItem(rows as (Row & { id: string; sort_order: number })[], index, direction);
}

export async function updateRows(table: AdminTable, changes: { id: string; sort_order: number }[]) {
  await Promise.all(changes.map((change) => updateRow(table, change.id, { sort_order: change.sort_order })));
}

export function duplicateValues(row: Values, options: { titleKey: string; hasStatus: boolean; sortOrder: number }) {
  return makeDuplicate(row, options);
}
