## What

Day 11 — Persistence (localStorage)

Implemented loading boards from `localStorage` (if present) on app start and saving the full boards structure to `localStorage` whenever boards change. Also persisted the currently selected board so the app restores the last-open board after a reload, and added a `resetToDefault()` helper to clear storage and reset to the original seed data (dev helper).

## Changes (persistence only)

- ✅ Load on start: read saved boards from `localStorage` under key `kanban.boards`; fall back to `data.json` if no saved data or parsing errors.
- ✅ Save on change: write the full `boards` object to `localStorage` whenever `boards` state changes.
- ✅ Restore selection: save the active board name under `kanban.selectedBoard` and restore that selection on startup (so refresh returns to the board you were on).
- ✅ Reset helper: `resetToDefault()` clears `kanban.boards` (and resets in-memory state to the seed data) so you can quickly return to the original dataset.

Note: The implementation was then refactored to use the new storage helpers in `src/lib/storage.ts` which use a single key (`kanban-data`) to store a `KanbanData` object. That object contains both `boards` and `selectedBoardName`. The provider now calls `loadData()` on startup and `saveData()` whenever `boards` or the selected board changes; `resetToDefault()` calls `clearData()`.

## How to Test (persistence)

1. Checkout branch:
	```bash
	git checkout feat/persistence-localstorage
	```
2. Install and run:
	```bash
	npm install
	npm run dev
	```
3. Open the app and verify initial load:
	- On first run (or after clearing storage) the app should load the seed data from `data.json`.
4. Make a change and verify save:
	- Add/edit/delete a task or toggle a subtask, then refresh the page. The change should persist.
5. Verify selected-board restore:
	- Switch to a different board (e.g. Board 4), refresh the page, and confirm the same board is selected after reload.
6. Reset to default:
	- Call `resetToDefault()` (temporarily expose it from the provider value or run `localStorage.removeItem('kanban-data')` in the console) and confirm the app returns to the seed data on reload.
7. Optional: run TypeScript check locally:
	```bash
	npx tsc --noEmit
	```

## Files Changed (persistence)

- `src/contexts/BoardContext.tsx` — added localStorage load/save for `boards` and `kanban.selectedBoard`, added `resetToDefault()` helper, and initialized state from stored data when present.
 - `src/contexts/BoardContext.tsx` — now uses `loadData()`/`saveData()` from `src/lib/storage.ts`, initializes state from stored data, and calls `saveData()` when `boards` or the selected board changes. `resetToDefault()` calls `clearData()`.
 - `src/lib/storage.ts` — new storage utilities `loadData()`, `saveData()`, and `clearData()` that read/write a single `kanban-data` key in localStorage containing `{ boards, selectedBoardName }`.
 - `src/types.ts` — extended `KanbanData` type to include `selectedBoardName`.
 - `PR_desc.md` — this PR description file.

If you added a separate storage utility module (e.g. `src/lib/storage.ts`) include that file in the PR as well.

## Notes

- The persistence implementation reads/writes the complete boards structure, which includes nested columns, tasks and subtasks. This keeps the save/load logic simple and predictable for the app's current data shape.
- The app still identifies tasks by title in several places; persistence does not change that. Consider adding stable `id` fields for boards/columns/tasks as a follow-up to avoid brittle title-matching.

## Notes about the storage helpers

- Storage uses the single localStorage key `kanban-data` (see `src/lib/storage.ts`).  
- The saved JSON follows the `KanbanData` shape and includes `boards` and an optional `selectedBoardName`.  
- Centralizing storage in `src/lib/storage.ts` makes unit testing load/save behavior straightforward.

## Checklist (persistence only)

- [x] Load boards from `localStorage` if present.
- [x] Save `boards` to `localStorage` whenever they change.
- [x] Persist and restore selected board after reload (`kanban.selectedBoard`).
- [x] `resetToDefault()` clears storage and resets app state.
- [ ] Add unit tests for storage helpers (recommended).
