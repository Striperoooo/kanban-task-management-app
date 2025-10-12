## What

Day 13 — Stable IDs & Drag-and-Drop

This pull request introduces stable `id` fields for boards, columns, and tasks across the app and implements drag-and-drop task reordering (within and across columns) using `@dnd-kit`. The refactor replaces fragile name/title-based lookups with id-based operations and updates the context API and UI components to operate on IDs. Drag-and-drop uses optimistic UI updates during drag and persists changes on drop.

## Key outcomes

- Stable ids for boards, columns, and tasks everywhere in the runtime data (seed data updated and runtime normalization added).
- Cross-column and within-column drag-and-drop using `@dnd-kit/core` and `@dnd-kit/sortable`.
- Context API refactor: core mutators (`addTask`, `editTask`, `deleteTask`, `moveTask`, `toggleSubtask`) accept and use IDs for lookups and updates.
- Drag handle on `TaskCard` to separate click (open details) from drag interactions and improve accessibility.

## Drag-and-drop functionality

* Integrated `@dnd-kit/core` and `@dnd-kit/sortable` and implemented DnD handlers in `src/components/BoardView.tsx`. Tasks can be reordered within a column and moved across columns. Dragging uses optimistic (in-memory) updates on drag-over to keep the UI smooth and persists the final state on drop.
* `src/components/Column.tsx` and `src/components/TaskCard.tsx` were updated to use `SortableContext`, `useDroppable`, and `useSortable`, enabling draggable tasks and droppable columns (including empty columns).

## Stable ID refactor

* Ensured every board, column, and task has a stable `id`. Seed data was updated and runtime normalization guarantees ids when loading older data. All lookups, keys, and mutations were migrated to use these ids instead of names/titles.
* Updated task creation/editing flows to generate and preserve ids for tasks so subsequent operations (move/edit/delete) are reliable.

## Context & API improvements

* `src/contexts/BoardContext.tsx` was refactored: methods operate on ids for clarity and reliability. A new `moveTask` method supports the DnD handlers and handles both intra-column reordering and cross-column moves. Persistence to storage (existing helper) occurs on confirmed drops.

## UI & usability enhancements

* Status selects and forms now use column ids as values and show human-friendly column names as labels, preventing accidental status mismatches.
* Added a visible drag handle to `TaskCard` to avoid click-vs-drag conflicts: clicking the card body still opens the details modal while dragging is started from the handle.

## Files changed (high level)

- `src/contexts/BoardContext.tsx` — ensure stable ids on load, refactor mutators to use ids, add `moveTask` with optional optimistic behavior.
- `src/components/BoardView.tsx` — DnD wiring (DndContext handlers, drag-over and drop logic).
- `src/components/Column.tsx` — droppable column container and `SortableContext` for tasks.
- `src/components/TaskCard.tsx` — `useSortable` integration and drag handle.
- `src/components/TaskFormModal.tsx` / `src/components/TaskDetailsModal.tsx` — status dropdowns and id-aware save/edit flows.
- `src/types.ts` — types updated to include `id` fields where needed.
- `src/data/data.json` — seed data updated with deterministic ids.
- `src/lib/storage.ts` — unchanged API but consumption updated to store id-based data (no breaking change).

## How to test (quick)

1. Install and run dev server:

```powershell
npm install
npm run dev
```

2. Basic manual checks:

- Open the app and verify boards load correctly (seed or persisted data).
- Drag a task within the same column — the order should update and persist after refresh.
- Drag a task to a different column — it should move, and the change should persist after refresh.
- Try dragging to an empty column — dropping into an empty column should work.
- Click a task card (not the drag handle) to open the details modal; use the drag handle to start dragging.

3. Optional typecheck before committing:

```powershell
npx tsc --noEmit
```

## Notes

- DragOverlay (a smooth drag preview) is a recommended follow-up for further UX polish but is not required for this PR.
- The runtime includes guards to handle older data that may not have ids yet; newly-created items receive stable ids.

## Checklist

- [x] Add stable `id` fields for boards, columns, and tasks (seed + runtime normalization).
- [x] Migrate context and components to use ids for lookups and keys.
- [x] Integrate `@dnd-kit` for drag-and-drop and implement `moveTask`.
- [x] Add drag handle to `TaskCard` to separate click vs drag.
- [x] Ensure droppable empty columns and optimistic drag-over behavior; persist on drop.
- [ ] Add DragOverlay for an improved drag preview (follow-up).

````
