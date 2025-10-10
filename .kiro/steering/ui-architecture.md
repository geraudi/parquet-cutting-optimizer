# UI Architecture and Component Guidelines

## shadcn/ui Monorepo Setup

This project uses shadcn/ui components in a monorepo architecture:

- **UI Components Location**: `packages/ui`
- **Component Imports**: Use `@workspace/ui/components/[component-name]` for importing shadcn/ui components
- **Styling**: Components follow shadcn/ui design system and styling patterns
- **Utilities**: Use `@workspace/ui/lib/utils` for utility functions like `cn()` for className merging

## Component Import Examples

```typescript
// Correct imports for shadcn/ui components
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
```

## Design System Guidelines

- Follow shadcn/ui design patterns and component APIs
- Use consistent spacing, colors, and typography from the design system
- Leverage shadcn/ui's built-in accessibility features
- Maintain consistent styling across all components using the established design tokens

## Toast Notifications

For user feedback and notifications:
- Use Sonner toast system via `apps/web/lib/toast.ts` wrapper functions
- Sonner component added via `pnpm dlx shadcn@canary add sonner`
- Toast functions: `showSuccessToast()`, `showErrorToast()`, `showWarningToast()`, `showInfoToast()`
- Toaster component: `<Toaster />` from `@workspace/ui/components/sonner`
- Consistent with shadcn/ui design system and theming

## Adding New shadcn/ui Components

To add new shadcn/ui components to the project:

```bash
cd apps/web
pnpm dlx shadcn@canary add [COMPONENT]
```

Examples:
```bash
pnpm dlx shadcn@canary add button
pnpm dlx shadcn@canary add input
pnpm dlx shadcn@canary add toast
```

## Implementation Notes

When implementing new UI components or features:
1. Always use shadcn/ui components from `packages/ui` when available
2. If a needed component doesn't exist, add it using the CLI command above
3. Follow the established import patterns
4. Maintain consistency with existing component styling
5. Ensure accessibility standards are met
6. Use the `cn()` utility for conditional className merging