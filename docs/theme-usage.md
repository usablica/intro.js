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

## Quick Start

### 1. Using Pre-registered Themes in Tour Options

The simplest way to use themes is by setting the `theme` option when creating a tour:

```javascript
import introJs from 'intro.js';

// Use dark theme
introJs().setOptions({
  theme: 'dark'
}).start();

// Use light theme
introJs().setOptions({
  theme: 'light'
}).start();

// Use system preference (default)
introJs().setOptions({
  theme: 'auto'
}).start();

// Use any pre-registered theme
introJs().setOptions({
  theme: 'modern'
}).start();
```

### 2. Loading Custom CSS Files

You can load a custom CSS file by providing both `theme` and `themePath` options:

```javascript
import introJs from 'intro.js';

// Load a custom theme from a CSS file
introJs().setOptions({
  theme: 'ocean',
  themePath: 'path/to/themes/introjs-ocean.css'
}).start();

// Load from CDN
introJs().setOptions({
  theme: 'custom',
  themePath: 'https://cdn.example.com/intro-custom-theme.css'
}).start();
```

## Available Pre-registered Themes

The following themes are available out of the box:

| Theme Name | Description | CSS Path |
|------------|-------------|----------|
| `light` | Light theme (default style) | `themes/introjs-light.css` |
| `dark` | Dark theme | `themes/introjs-dark.css` |
| `auto` | System preference (switches automatically) | N/A (uses classes only) |
| `modern` | Modern theme | `themes/introjs-modern.css` |
| `flattener` | Flat design theme | `themes/introjs-flattener.css` |
| `nassim` | Nassim theme | `themes/introjs-nassim.css` |
| `nazanin` | Nazanin theme (RTL support) | `themes/introjs-nazanin.css` |
| `royal` | Royal theme | `themes/introjs-royal.css` |

## Advanced Usage

### 1. Registering Custom Themes

You can register custom themes globally so they can be used by name:

```javascript
import { registerTheme, registerThemes } from 'intro.js/theme';
import introJs from 'intro.js';

// Register a single theme
registerTheme('ocean', 'themes/introjs-ocean.css');

// Now you can use it by name
introJs().setOptions({
  theme: 'ocean'
}).start();

// Register multiple themes at once
registerThemes([
  { name: 'sunset', cssPath: 'themes/introjs-sunset.css' },
  { name: 'forest', cssPath: 'themes/introjs-forest.css' },
  { name: 'corporate', cssPath: 'themes/introjs-corporate.css' }
]);
```

### 2. Using Theme API Directly

For more control, you can use the theme API directly:

```javascript
import { applyTheme, getTheme } from 'intro.js/theme';

// Apply a theme to a specific root element
const root = document.getElementById('my-tour-container');
applyTheme({ 
  root: root, 
  theme: 'dark' 
});

// Get current theme instance
const theme = getTheme();
console.log(theme.currentTheme); // 'dark'
console.log(theme.value); // 'dark' or 'light'

// Change theme dynamically
await theme.setTheme('light');

// Clean up when done
theme.destroy();
```

### 3. Getting Theme Information

```javascript
import { getThemePath, getRegisteredThemes } from 'intro.js/theme';

// Get CSS path for a specific theme
const darkPath = getThemePath('dark');
console.log(darkPath); // 'themes/introjs-dark.css'

// Get all registered theme names
const allThemes = getRegisteredThemes();
console.log(allThemes); // ['dark', 'light', 'modern', ...]
```

## Complete Examples

### Example 1: Basic Tour with Dark Theme

```javascript
import introJs from 'intro.js';

introJs().setOptions({
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
import { registerTheme } from 'intro.js/theme';

// Register your custom theme
registerTheme('mycompany', 'assets/css/intro-mycompany-theme.css');

// Use it in your tour
introJs().setOptions({
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
// and light theme in light mode
introJs().setOptions({
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

const tour = introJs().setOptions({
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

tour.onBeforeChange(function(targetElement) {
  if (this.getCurrentStep() === 1) {
    // Switch to dark theme on step 2
    this.setOption('theme', 'dark');
    // Re-initialize theme
    this.exit().then(() => {
      this.setCurrentStep(1);
      this.start();
    });
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

introJs().setOptions({
  theme: 'ocean',
  themePath: 'themes/introjs-ocean.css'
}).start();
```

## TypeScript Support

The theme system is fully typed:

```typescript
import introJs from 'intro.js';
import { ThemeType, registerTheme, applyTheme } from 'intro.js/theme';

// Theme types
const theme: ThemeType = 'dark'; // 'light' | 'dark' | 'auto' | string

// Register theme with types
registerTheme('custom', 'path/to/custom.css');

// Use in tour with types
introJs().setOptions({
  theme: 'dark',
  themePath: 'path/to/theme.css' // optional
}).start();
```

## Best Practices

1. **Use `auto` for Better UX**: Let users' system preferences determine the theme
   ```javascript
   introJs().setOptions({ theme: 'auto' }).start();
   ```

2. **Register Themes Early**: Register all custom themes at app initialization
   ```javascript
   // app-init.js
   import { registerThemes } from 'intro.js/theme';
   
   registerThemes([
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
- Make sure you call `registerTheme()` before starting the tour
- Verify the theme name matches exactly
- Check that the CSS selectors in your theme file are correct
- Ensure no other CSS is overriding your theme styles

### Multiple CSS Files Loading

**Problem**: Multiple theme CSS files are being loaded

**Solutions**:
- The system automatically prevents duplicate loading
- Use the same theme name consistently
- Call `theme.destroy()` when switching themes programmatically

## API Reference

### Tour Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `ThemeType` | `'auto'` | Theme name ('light', 'dark', 'auto', or custom) |
| `themePath` | `string` | `undefined` | Path to custom CSS file |

### Theme Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `registerTheme(name, cssPath)` | `name: string, cssPath: string` | `void` | Register a custom theme |
| `registerThemes(themes)` | `themes: ThemeRegistration[]` | `void` | Register multiple themes |
| `getThemePath(name)` | `name: string` | `string \| undefined` | Get CSS path for a theme |
| `getRegisteredThemes()` | -
