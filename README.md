# Optimizing floorboard cut-outs
Enter the room dimensions and the length of all floorboards, then click on calculate.
The application will calculate the board cut-outs. You can then drag and drop the lines or strips to customize them.

## How to use this repo
This app use [Turborepo](https://turbo.build/), [Nextjs](https://nextjs.org/) and [shadcn/ui](https://ui.shadcn.com/) (Tailwindcss).


To get started:
```
pnpm i
pnpm run dev
```


## shadcn/ui monorepo

### Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
or
pnpm dlx shadcn@canary add card
```

This will place the ui components in the `packages/ui/src/components` directory.

### Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/ui/button"
```

