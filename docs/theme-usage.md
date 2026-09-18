# IntroJS Theme System - Complete Usage Guide

## Overview

The IntroJS theme system allows you to easily customize the look and feel of your tours by loading different CSS themes. You can use pre-registered themes, create custom themes, or even load themes dynamically from external CSS files.

## Features

- ✅ **Dynamic CSS Loading** - Themes automatically load their CSS files
- ✅ **Pre-registered Themes** - Built-in themes: dark, light, modern, flattener, nassim, nazanin, royal
- ✅ **Auto Theme Detection** - Automatically adapts to system dark/light mode preference
- ✅ **Custom Themes** - Load any CSS file as a theme
- ✅ **Theme Registration** - Register custom themes for easy reuse
- ✅ **Tour Options Integration** - Set theme directly in tour options
- ✅ **Live Theme Switching** - Change the theme of a running tour with `tour.setTheme()`

## Quick Start

### 1. Using Pre-registered Themes in Tour Options

The simplest way to use themes is by setting the `theme` option when creating a tour:

```javascript
import introJs from 'intro.js';

// Use dark theme
introJs.tour().setOptions({
  theme: 'dark'
}).start();

// Use light theme
introJs.tour().setOptions({
  theme: 'light'
}).start();

// Use system preference (default)
introJs.tour().setOptions({
  theme: 'auto'
}).start();

// Use any pre-registered theme
introJs.tour().setOptions({
  theme: 'modern'
}).start();
```

### 2. Loading Custom CSS Files

You can load a custom CSS file by providing both `theme` and `themePath` options:

```javascript
import introJs from 'intro.js';

// Load a custom theme from a CSS file
introJs.tour().setOptions({
  theme: 'ocean',
  themePath: 'path/to/themes/introjs-ocean.css'
}).start();

// Load from CDN
introJs.tour().setOptions({
  theme: 'custom',
  themePath: 'https://cdn.example.com/intro-custom-theme.css'
}).start();
```

## Available Pre-registered Themes

The following themes are available out of the box:

| Theme Name | Description | CSS Path |
|------------|-------------|----------|
| `light` | Light theme (default style) | N/A - uses CSS custom properties, no file to load |
| `dark` | Dark theme | N/A - uses CSS custom properties, no file to load |
| `auto` | Follows the system preference, switches automatically | N/A - uses CSS custom properties, no file to load |
| `modern` | Modern theme | `themes/introjs-modern.css` |
| `flattener` | Flat design theme | `themes/introjs-flattener.css` |
| `nassim` | Nassim theme | `themes/introjs-nassim.css` |
| `nazanin` | Nazanin theme (RTL support) | `themes/introjs-nazanin.css` |
| `royal` | Royal theme | `themes/introjs-royal.css` |

> Note: `light`, `dark` and `auto` are implemented purely with CSS classes/custom properties on the tour's root element, so no extra network request happens when you use them. The other themes are loaded on demand from the CSS file shown above.

## Advanced Usage

### 1. Registering Custom Themes

You can register custom themes globally so they can be used by name:

```javascript
import introJs from 'intro.js';

// Register a single theme
introJs.registerTheme('ocean', 'themes/introjs-ocean.css');

// Now you can use it by name
introJs.tour().setOptions({
  theme: 'ocean'
}).start();

// Register multiple themes at once
introJs.registerThemes([
  { name: 'sunset', cssPath: 'themes/introjs-sunset.css' },
  { name: 'forest', cssPath: 'themes/introjs-forest.css' },
  { name: 'corporate', cssPath: 'themes/introjs-corporate.css' }
]);
```

### 2. Changing the Theme of a Running Tour

Every `Tour` instance exposes `setTheme()`/`getTheme()` so you can react to in-app theme toggles without restarting the tour:

```javascript
import introJs from 'intro.js';

const tour = introJs.tour().setOptions({ theme: 'light' });
await tour.start();

console.log(tour.getTheme()); // 'light'

// Switch the running tour to dark mode
await tour.setTheme('dark');
console.log(tour.getTheme()); // 'dark'

// Switch to a custom CSS theme
await tour.setTheme('ocean', 'themes/introjs-ocean.css');
```

Calling `setTheme()` before the tour has started simply stores the choice; it's applied the next time `start()` runs.

### 3. Getting Theme Information

```javascript
import introJs from 'intro.js';

// Get CSS path for a registered theme
const modernPath = introJs.getThemePath('modern');
console.log(modernPath); // 'themes/introjs-modern.css'

// Built-in themes (light/dark/auto) are not file-based, so this is undefined
console.log(introJs.getThemePath('dark')); // undefined

// Get all registered theme names
const allThemes = introJs.getRegisteredThemes();
console.log(allThemes); // ['modern', 'flattener', 'nassim', 'nazanin', 'royal', ...]
```

## Complete Examples

### Example 1: Basic Tour with Dark Theme

```javascript
import introJs from 'intro.js';

introJs.tour().setOptions({
  steps: [
    {
      element: '#step1',
      intro: 'Welcome to our app!'
    },
    {
      element: '#step2',
      intro: 'This is a dark-themed tour.'
    }
  ],
  theme: 'dark'
}).start();
```

### Example 2: Custom Theme with Dynamic Loading

```javascript
import introJs from 'intro.js';

// Register your custom theme
introJs.registerTheme('mycompany', 'assets/css/intro-mycompany-theme.css');

// Use it in your tour
introJs.tour().setOptions({
  steps: [
    {
      element: '#welcome',
      intro: 'Welcome to our custom-themed tour!'
    }
  ],
  theme: 'mycompany'
}).start();
```

### Example 3: System-Adaptive Theme

```javascript
import introJs from 'intro.js';

// This tour will automatically use dark theme in dark mode
// and light theme in light mode, and keeps reacting if the
// user's OS theme changes while the tour is open
introJs.tour().setOptions({
  steps: [
    {
      intro: 'This tour adapts to your system theme!'
    }
  ],
  theme: 'auto' // This is the default
}).start();
```

### Example 4: Changing Theme Mid-Tour

```javascript
import introJs from 'intro.js';

const tour = introJs.tour().setOptions({
  steps: [
    {
      intro: 'Starting with light theme'
    },
    {
      intro: 'Now switching to dark theme'
    }
  ],
  theme: 'light'
});

tour.onBeforeChange(async function (targetElement) {
  if (this.getCurrentStep() === 1) {
    // Switch the already-running tour to dark theme on step 2
    await this.setTheme('dark');
  }
});

tour.start();
```

## Creating Custom Theme CSS

To create your own theme, create a CSS file with the following structure:

```css
/* Custom Theme Example - themes/introjs-ocean.css */

.introjs-overlay {
  background: #004d7a;
  opacity: 0.8;
}

.introjs-helperLayer {
  background: #00a3cc;
}

.introjs-tooltip {
  background-color: #006994;
  color: #ffffff;
}

.introjs-tooltipbuttons {
  background: #004d7a;
}

.introjs-button {
  color: #ffffff;
  border: 2px solid #00a3cc;
  background: transparent;
}

.introjs-button:hover {
  background: #00a3cc;
  color: #ffffff;
}

.introjs-disabled {
  color: #7d7d7d;
  border-color: #7d7d7d;
}

/* Add more custom styles as needed */
```

Then use it:

```javascript
import introJs from 'intro.js';

introJs.tour().setOptions({
  theme: 'ocean',
  themePath: 'themes/introjs-ocean.css'
}).start();
```

## TypeScript Support

The theme system is fully typed:

```typescript
import introJs, { type ThemeType } from 'intro.js';

// Theme types
const theme: ThemeType = 'dark'; // 'light' | 'dark' | 'auto' | string

// Register theme with types
introJs.registerTheme('custom', 'path/to/custom.css');

// Use in tour with types
introJs.tour().setOptions({
  theme: 'dark',
  themePath: 'path/to/theme.css' // optional
}).start();
```

## Best Practices

1. **Use `auto` for Better UX**: Let users' system preferences determine the theme
   ```javascript
   introJs.tour().setOptions({ theme: 'auto' }).start();
   ```

2. **Register Themes Early**: Register all custom themes at app initialization
   ```javascript
   // app-init.js
   import introJs from 'intro.js';

   introJs.registerThemes([
     { name: 'brand', cssPath: 'themes/brand.css' },
     { name: 'seasonal', cssPath: 'themes/seasonal.css' }
   ]);
   ```

3. **Keep CSS Files Small**: Only include necessary styles in theme CSS files

4. **Test Themes**: Test your themes in both light and dark system modes

5. **Provide Fallbacks**: Always have a fallback theme in case custom CSS fails to load

## Troubleshooting

### Theme CSS Not Loading

**Problem**: Custom theme CSS file is not loading

**Solutions**:
- Check that the CSS file path is correct
- Verify the CSS file is accessible from your web server
- Check browser console for 404 errors
- Ensure CORS headers are set if loading from a different domain

### Theme Not Applying

**Problem**: Theme is registered but not applying

**Solutions**:
- Make sure you call `introJs.registerTheme()` before starting the tour
- Verify the theme name matches exactly
- Check that the CSS selectors in your theme file are correct
- Ensure no other CSS is overriding your theme styles

### Multiple CSS Files Loading

**Problem**: Multiple theme CSS files are being loaded

**Solutions**:
- The system automatically prevents duplicate loading of the same CSS file
- When you call `tour.setTheme()` with a different custom theme, the previous theme's `<link>` is removed automatically
- Use the same theme name consistently

## API Reference

### Tour Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `ThemeType` | `'auto'` | Theme name ('light', 'dark', 'auto', or custom) |
| `themePath` | `string` | `undefined` | Path to custom CSS file |

### Tour Instance Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `tour.setTheme(theme, themePath?)` | `theme: ThemeType, themePath?: string` | `Promise<Tour>` | Change the theme; applies immediately if the tour is running |
| `tour.getTheme()` | - | `'light' \| 'dark' \| undefined` | The currently resolved theme, or `undefined` before the tour starts |

### `introJs` Theme Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `introJs.registerTheme(name, cssPath)` | `name: string, cssPath: string` | `void` | Register a custom theme |
| `introJs.registerThemes(themes)` | `themes: ThemeRegistration[]` | `void` | Register multiple themes |
| `introJs.getThemePath(name)` | `name: string` | `string \| undefined` | Get the CSS path for a theme (built-in themes return `undefined`) |
| `introJs.getRegisteredThemes()` | - | `string[]` | List the names of all registered themes |
