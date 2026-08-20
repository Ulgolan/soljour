-- Lap 6 — pen and eraser: soft delete for campaigns and entries. No DELETE
-- policies, no hard deletes, no cascades, no restore UI — recovery is
-- dashboard/SQL by design (Data law: every delete undoable). Soft delete
-- rides the existing update policies; the app layer filters
-- `deleted_at is null` on every read.

alter table campaigns add column deleted_at timestamptz default null;
alter table entries add column deleted_at timestamptz default null;
