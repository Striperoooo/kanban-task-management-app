# Kanban Task Management App 

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev) [![Vitest](https://img.shields.io/badge/Vitest-8B5CF6?style=flat&logo=vitest&logoColor=white)](https://vitest.dev) [![DndKit](https://img.shields.io/badge/DndKit-7C3AED?style=flat&logo=web&logoColor=white)](https://github.com/clauderic/dnd-kit)


A responsive and accessible Kanban-style task manager built with React + TypeScript. Demonstrates task and board CRUD, component-driven UI, predictable state, keyboard-accessible drag-and-drop, and fast provider-level tests.

Highlights
-----------------
- State management: React Context with clear mutators and normalized IDs.
- Testing: fast and deterministic provider-level tests (Vitest).
- Accessibility & DnD (Drag-and-Drop): keyboard-accessible interactions powered by `@dnd-kit`.

Live demo
-----------------
- Live demo: https://kanban-striperooo.netlify.app/ 
- Demo GIF / video: [PLACEHOLDER]

Tech
----
- React 19 + TypeScript — component UI & typed code (https://reactjs.org, https://www.typescriptlang.org)
- Vite — dev server & build (https://vitejs.dev)
- Tailwind CSS — utility-first styling (https://tailwindcss.com)
- Vitest — unit tests (https://vitest.dev)
- @dnd-kit/core + @dnd-kit/sortable — drag & drop (https://github.com/clauderic/dnd-kit)

Features
--------
- Multiple boards with columns and tasks
- Create / edit / delete boards and tasks
- Drag and drop tasks within and across columns (keyboard accessible)
- Subtasks with completion toggles
- Local persistence (storage helper; mocked in tests)
- Provider-level unit tests for core logic (`BoardContext`)

Selected fixes & impact
---------------------------------

1) Fixing unreliable task moves
- Problem: Drag-and-drop sometimes triggered render-loop errors during rapid drags.
- Solution: Skip no-op moves in drag handlers, use shallow-copy updates, and add an ErrorBoundary for the DnD area.
- Result: Stable drag interactions; no more maximum-update-depth errors during rapid dragging.
- Next: Add DragOverlay for a polished drag preview and an end-to-end drag test.

2) Making tests fast and deterministic
- Problem: Tests flaked due to reliance on real localStorage and a test helper that didn't observe provider updates.
- Solution: Mock `src/lib/storage`, fix the `Grabber` helper to observe context changes, and focus tests at the provider level.
- Result: Fast, deterministic unit tests that validate core business logic without brittle UI dependencies.
- Next: Optionally add CI or a small UI smoke test for board creation.

Quick start (local)
-------------------
1. Install dependencies

```powershell
npm ci
```

2. Run dev server

```powershell
npm run dev
```

3. Run tests

```powershell
npm run test -- --run
```

Contributing
------------
This is a personal project. Feel free to open issues or PRs with suggestions.

License
-------
MIT
