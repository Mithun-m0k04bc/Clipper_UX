# Living Design System Implementation

## Overview
This document outlines the Living Design System components and custom icons integrated into the Clipper Product Details Page.

## Components Created

### 1. Living Design Tag Component
**Location:** `src/ProductDetailsPage/components/shared/Tag.tsx`

A reusable tag component following Living Design specifications:
- **Variants:** blue, purple, green, orange, gray, red
- **Sizes:** sm, md
- **Features:** Optional remove button, proper color tokens
- **Font:** Bogle (Living Design standard)

**Usage:**
```tsx
import Tag from './shared/Tag'

<Tag variant="blue">Active</Tag>
<Tag variant="green" onRemove={() => console.log('Removed')}>Label</Tag>
```

### 2. Custom Entity Icons Library
**Location:** `src/ProductDetailsPage/components/shared/CustomIcons.tsx`

Custom SVG icons matching your Figma design:

#### Entity Icons (Colored)
- **IconOrg** - Blue (#1A7FE0) - Organization level
- **IconSubOrg** - Purple (#73478B) - Sub-organization level
- **IconPillar** - Cyan (#008DAA) - Pillar level
- **IconSubPillar** - Green (#00B69B) - Sub-pillar level
- **IconProduct** - Pink (#D0419B) - Product level
- **IconApp** - Gray (#9E9FA3) - Application level

#### Utility Icons
- **ChevronDown** - Dropdown indicator
- **ChevronUp** - Collapse indicator
- **MagicIcon** - AI/Sparkle icon (purple #7B61FF)
- **TrophyIcon** - Achievements/strengths (gold)
- **ExclamationCircleIcon** - Warnings/critical issues (red)
- **ListBoxIcon** - Action items (blue)
- **CheckCircleFillIcon** - Verification/completion (green)

**Usage:**
```tsx
import { IconOrg, IconProduct, MagicIcon } from './shared/CustomIcons'

<IconOrg size={20} />
<MagicIcon className="text-purple-500" />
```

## Components Updated

### 1. ProductHeader
- ✅ Uses Living Design Tag for "Active" status
- ✅ ID tag with copy functionality
- ✅ Bogle font family applied
- ✅ Living Design color tokens

### 2. Breadcrumb
- ✅ Custom entity icons (Org, Sub-Org, Sub-Pillar, Product)
- ✅ Hover states with transitions
- ✅ Bogle font family
- ✅ Proper hierarchy visualization

### 3. TeamMembers
- ✅ Living Design Tag for member IDs
- ✅ CheckCircleFillIcon for verification badges
- ✅ Bogle font family applied
- ✅ Improved visual consistency

### 4. MainContent (Tab Navigation)
- ✅ MagicIcon for AI Insights tab
- ✅ Living Design Tag for "NEW" badge
- ✅ Tab styling with Living Design tokens
- ✅ Active state with bottom indicator bar

## Living Design Styling

### CSS Module: TabNavigation.module.css
Uses Living Design CSS tokens for:
- Tab container border
- Tab item padding, fonts, colors
- Active state indicator
- Hover, focus, active states
- Badge styling

### Global Styles: index.css
Imports:
```css
@import '@livingdesign/tokens/dist/css/light/regular/globals.css';
@import '@livingdesign/tokens/dist/css/light/regular/components/TabNavigation.css';
```

## Living Design Tokens Used

### Colors
- `--color-core-blue-100` - Primary blue (#0071DC)
- `--color-core-blue-10` - Light blue backgrounds
- `--color-core-blue-110` - Dark blue text
- Tab navigation specific color tokens

### Typography
- `--component-tab-navigation-item-label-font-family` - Bogle
- `--component-tab-navigation-item-label-font-size`
- `--component-tab-navigation-item-label-font-weight`
- `--component-tab-navigation-item-label-line-height`

### Layout
- `--component-tab-navigation-item-padding-horizontal`
- `--component-tab-navigation-item-padding-vertical`
- `--component-tab-navigation-item-indicator-height`
- Border widths and colors

## Benefits

1. **Consistency** - All components follow Living Design specifications
2. **Accessibility** - Proper color contrast, focus states, semantic HTML
3. **Reusability** - Modular components can be used throughout the app
4. **Maintainability** - Token-based styling allows easy theme updates
5. **Visual Hierarchy** - Custom icons provide clear entity-level distinction

## Testing

Run the development server and navigate to:
```
http://localhost:5174/
```

All Living Design components should be visible with:
- Proper Bogle font rendering
- Living Design color scheme
- Interactive states (hover, focus, active)
- Entity icons in the breadcrumb
- Tags in various locations
- AI Insights tab with magic icon

## Future Enhancements

Consider adding:
- More gtp-shared-icons integration
- Additional Living Design components (buttons, inputs, cards)
- Dark mode support with Living Design tokens
- Animation/transitions using Living Design motion tokens
- More entity types if needed

