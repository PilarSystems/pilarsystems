# Legacy Template Code

⚠️ **This folder contains legacy template code that is being phased out.**

## Background

This `src/` folder contains code from the original template/boilerplate that was used to bootstrap the PILAR SYSTEMS project. While some components are still actively imported (e.g., server modules, gym buddy components), much of this code is legacy and will be migrated to the root-level folders.

## Active Components

The following modules in this folder are **still actively used**:

- `src/server/` - Backend server modules (orchestrator, webhooks, workflows, etc.)
- `src/lib/` - Authentication and utility libraries
- `src/components/gymbuddy/` - Gym Buddy feature components

## Migration Plan

1. Server modules will be migrated to root-level `/server/` folder
2. Library code will be migrated to root-level `/lib/` folder
3. Active components will be migrated to root-level `/components/` folder
4. Legacy/unused template code will be removed

## Path Resolution

The `tsconfig.json` uses path aliases that resolve `@/*` to both `./src/*` and `./*`, with `./src/*` taking priority. This allows gradual migration without breaking existing imports.

## Do Not

- Do **not** add new code to this folder
- Do **not** delete this folder without updating all imports first
- Do **not** rely on legacy template components for new features

---

*Last updated: December 2024*
