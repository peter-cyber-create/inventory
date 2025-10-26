# MoH Design System

This directory contains the official design system for the Government of Uganda Ministry of Health Inventory Portal. All UI components, pages, and styles should use these tokens and utilities for a consistent, professional, and accessible experience.

## Structure
- `colors.js`: MoH color palette
- `typography.js`: Font, heading, and text styles
- `spacing.js`: Spacing scale (4px grid)
- `buttons.js`: Button system (primary, secondary, disabled)
- `icons.js`: Central icon registry (SVG)
- `index.js`: Central export for all tokens

## Usage
Import tokens or utilities from the design system in your components:

```js
import { colors, typography, spacing, buttonStyles, Icon } from 'src/design-system';
```

## Guidelines
- **Do not hardcode colors, font sizes, or spacing in components.**
- Use the design system for all new UI work and refactor legacy code to use it.
- Extend the system here if new tokens or components are needed.

## Accessibility
All tokens and components are designed for accessibility and government standards.
