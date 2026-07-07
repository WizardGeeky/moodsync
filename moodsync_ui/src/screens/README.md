# Screens

Every screen in the app lives in its own folder here, named after the screen:

```
screens/
  <screen-name>/
    <screen-name>-screen.tsx   # the screen component, named export e.g. `WelcomeScreen`
    components/                # sub-components used only by this screen
    hooks/                     # hooks used only by this screen
```

`src/app/` holds **routes only** — expo-router file-based routes. A route file never
contains JSX or logic; it just re-exports the matching screen:

```ts
// src/app/index.tsx
export { WelcomeScreen as default } from '@/screens/welcome/welcome-screen';
```

This keeps navigation structure (`src/app/`) and screen implementation (`src/screens/`)
separate, so renaming/moving a route never requires touching the screen's code, and
finding a screen's code never requires knowing the routing tree.

## Adding a new screen

1. Create `screens/<name>/<name>-screen.tsx` exporting a named `<Name>Screen` component.
2. Put anything only that screen needs — local components, hooks, styles — inside
   `screens/<name>/`.
3. Add a route file under `src/app/` that re-exports it.
4. If a component or hook ends up used by two or more screens, move it up to
   `src/components/` or `src/hooks/` instead of duplicating it.
