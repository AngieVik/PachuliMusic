# Project Context

- **Type**: Progressive Web App (PWA) - Music Player
- **Stack**: React 19 + Vite + Tailwind CSS 3
- **Purpose**: High-fidelity music player with professional audio engine, neumorphic UI design, and offline capabilities
- **Key Features**: Local file playback, professional EQ/compression, 3D audio, metadata extraction, IndexedDB persistence

# Coding Rules

## Language & Communication

- **Code Language**: Write all code (variables, functions, components, comments) in English
- **Planning Language**: Explain plans, documentation, and discussions in Spanish

## Project Structure

### Folder Organization

```
src/
├── components/     # Reusable UI components (NeumorphicButton, WaveformVisualizer, etc.)
├── pages/          # Full page components (currently using inline pages in App.jsx)
├── hooks/          # Custom React hooks (useAudio, useAudioEngine)
├── context/        # React Context providers (AudioContext)
├── store/          # Zustand state management (usePlayerStore)
├── utils/          # Utility functions (db.js for IndexedDB)
├── assets/         # Static assets (images, icons)
├── App.jsx         # Main app router and page components
├── main.jsx        # App entry point
└── index.css       # Global styles and Tailwind directives
```

## Technology Stack & Libraries

### Core Dependencies

- **React**: v19.2.0 - UI library, prefer functional components with hooks
- **React Router DOM**: v7.10.1 - Client-side routing
- **Vite**: v7.2.4 - Build tool and dev server
- **Tailwind CSS**: v3.4.17 - Utility-first CSS framework

### State Management

- **Zustand**: v5.0.9 - Global state management
  - Use `create()` from zustand for stores
  - Use `persist` middleware for localStorage persistence
  - Store pattern: `src/store/use[Feature]Store.js`

### Audio Engine

- **Tone.js**: v15.1.22 - Professional audio processing library
  - Initialize audio graph: Player → EQ3 → Compressor → StereoWidener → CrossFade → Destination
  - Use refs for audio nodes (player, eq, compressor, widener, analyser)
  - Always call `await Tone.start()` before audio playback

### Data Persistence

- **idb-keyval**: v6.2.2 - Simple IndexedDB wrapper for binary audio files
  - Use `set()`, `get()`, `del()` for CRUD operations
  - Pattern: Store audio files with `audio_${id}` keys
- **Zustand persist**: For metadata and app state in localStorage

### Utilities

- **music-metadata-browser**: v2.5.11 - Extract metadata from audio files
- **clsx**: v2.1.1 - Conditional className composition
- **tailwind-merge**: v3.4.0 - Merge Tailwind classes intelligently

## Component Patterns

### Functional Components

- **Always** use functional components with hooks
- **Export** components as default exports
- **Props destructuring**: Use object destructuring in function parameters
- **PropTypes**: Not used - rely on explicit prop names and JSX validation

### Component Structure

```javascript
import React, { useState, useRef } from "react";
import { useCustomHook } from "../hooks/useCustomHook";

const ComponentName = ({ prop1, prop2, className = "" }) => {
  // Hooks first
  const [state, setState] = useState(initialValue);
  const ref = useRef(null);
  const { method } = useCustomHook();

  // Event handlers
  const handleEvent = (e) => {
    // handler logic
  };

  // Render
  return <div className={`base-classes ${className}`}>{/* JSX */}</div>;
};

export default ComponentName;
```

### Naming Conventions

- **Components**: PascalCase (e.g., `NeumorphicButton.jsx`, `WaveformVisualizer.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAudio.js`, `useAudioEngine.js`)
- **Stores**: camelCase with `use` prefix and `Store` suffix (e.g., `usePlayerStore.js`)
- **Utils**: camelCase (e.g., `db.js`)
- **Context**: PascalCase with `Context` suffix (e.g., `AudioContext.jsx`)
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE (when truly constant)

### File Extensions

- **Components**: `.jsx` for files with JSX
- **Hooks/Utils/Stores**: `.js` for pure JavaScript
- **Config files**: `.js` (not `.mjs` or `.cjs`)

## Styling Patterns

### Tailwind CSS Usage

- **Primary approach**: Use Tailwind utility classes
- **Custom config**: Extended in `tailwind.config.js` with project-specific values
- **Dark mode**: Use `dark:` variant with class-based dark mode strategy
- **Responsive**: Mobile-first design, use responsive variants when needed

### Design System (Tailwind Config)

```javascript
colors: {
  primary: '#13ec5b',           // Vibrant green accent
  background-light: '#f0f2f5',  // Light mode background
  background-dark: '#121212',   // Dark mode background
  surface-light: '#ffffff',     // Light mode cards
  surface-dark: '#1e1e1e',      // Dark mode cards
  // ... semantic color tokens
}

fontFamily: {
  display: ['Spline Sans', 'sans-serif']
}

boxShadow: {
  'neumorphic-light': '5px 5px 10px #d9dbde, -5px -5px 10px #ffffff',
  'neumorphic-dark': '5px 5px 10px #0d0d0d, -5px -5px 10px #171717',
  'neumorphic-inset-light': 'inset 5px 5px 10px #d9dbde, inset -5px -5px 10px #ffffff',
  'neumorphic-inset-dark': 'inset 5px 5px 10px #0d0d0d, inset -5px -5px 10px #171717'
}
```

### Neumorphic Design Pattern

- **Light/Dark Support**: All neumorphic elements must support both modes
- **Shadow Pattern**: Use `shadow-neumorphic-light dark:shadow-neumorphic-dark`
- **Active/Pressed**: Use inset shadows for pressed states
- **Rounded Corners**: Prefer `rounded-full` for buttons, `rounded-xl` for cards
- **Example**: See `NeumorphicButton.jsx` for reference implementation

### Material Symbols Icons

- **Font**: Material Symbols Outlined (loaded in `index.html`)
- **Usage**: `<span className="material-symbols-outlined">icon_name</span>`
- **Filled variant**: Add `filled` class for filled icons
- **Custom config**: Font variation settings in `index.css`

### Component Styling

- **Base classes first**: Define base styles, then allow override via `className` prop
- **Conditional classes**: Use template literals or `clsx`/`tailwind-merge` for complex conditions
- **Avoid inline styles**: Prefer Tailwind classes unless dynamic values required (e.g., background images)

## State Management Patterns

### Zustand Store Structure

```javascript
export const useFeatureStore = create(
  persist(
    (set, get) => ({
      // State
      stateVar: initialValue,

      // Actions as methods
      action: (params) =>
        set((state) => ({
          /* updates */
        })),

      // Complex actions can use get()
      complexAction: () => {
        const { stateVar } = get();
        // logic using current state
        set({
          /* updates */
        });
      },
    }),
    {
      name: "feature-storage",
      partialize: (state) => ({
        /* only persist specific fields */
      }),
    }
  )
);
```

### Store Usage in Components

```javascript
// Destructure only needed state/actions
const { state, action } = useFeatureStore();
```

### Context Pattern

- **Purpose**: Use for dependency injection (e.g., AudioContext for audio engine)
- **Separate definition**: Context defined in separate file (`AudioContextDefinition.js`)
- **Provider component**: Wrapper that provides hook value (`AudioProvider.jsx`)
- **Custom hook**: Create consumer hook (e.g., `useAudio()`) to access context

## Hook Patterns

### Custom Hooks

- **Always** start with `use` prefix
- **Return object** for multiple values (not array)
- **Include cleanup**: Use `useEffect` cleanup for disposing resources
- **Memoize callbacks**: Use `useCallback` for functions passed to child components
- **Example**: See `useAudioEngine.js` for complex hook with refs and lifecycle

### Common Hook Usage

- `useState`: Local component state
- `useRef`: DOM references and mutable values that don't trigger re-renders
- `useEffect`: Side effects, subscriptions, cleanup
- `useCallback`: Memoize functions
- `useMemo`: Memoize expensive computations (use sparingly)

## Data Flow & Architecture

### Audio File Handling

1. **File selection**: Use `<input type="file" multiple accept="audio/*">`
2. **Metadata extraction**: `music-metadata.parseBlob(file)`
3. **Storage**: Save blob to IndexedDB via `saveAudioFile(id, file)`
4. **Playback**: Retrieve blob, create Object URL, load into Tone.js Player
5. **Cleanup**: Revoke Object URLs when done

### Application Flow

```
User selects files
  ↓
Extract metadata (music-metadata-browser)
  ↓
Save to IndexedDB (idb-keyval)
  ↓
Add to queue (Zustand store)
  ↓
Load into audio engine (Tone.js via AudioContext)
  ↓
Playback with EQ/effects applied
```

## Code Quality Standards

### Error Handling

- Use try-catch for async operations (file reading, IndexedDB, audio loading)
- Log errors to console with descriptive messages
- Graceful degradation: Show placeholder when data unavailable

### Performance Considerations

- **Lazy load** pages/heavy components when needed
- **Memoize** expensive calculations
- **Cleanup** audio resources and subscriptions in `useEffect` returns
- **Object URLs**: Always revoke when no longer needed to prevent memory leaks

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed (future improvement)
- Keyboard navigation support (future improvement)

## Routing Patterns

### React Router Setup

- Use `BrowserRouter` at app root
- Define routes in `App.jsx` with `<Routes>` and `<Route>`
- Use `useNavigate()` for programmatic navigation
- Use `useLocation()` to detect active route

### Navigation Structure

- **Bottom Navigation Bar**: Fixed bottom nav with 3 main routes (Home, Search, Library)
- **Active State**: Highlight active route with primary color and filled icons
- **Path Pattern**: Root `/` for Now Playing, `/library`, `/search`

## Audio Engine Specifics

### Tone.js Integration

- **Initialization**: Create audio graph in `useEffect` on mount
- **Playback Control**: Use Player methods (start, stop, seek)
- **Effects Chain**: Player → EQ3 → Compressor → StereoWidener → Destination
- **Analyser**: Connect for visualizations (FFT data for waveforms)
- **Volume**: Convert 0-1 to dB using `20 * Math.log10(volume)`
- **Cleanup**: Dispose all audio nodes on unmount

### Audio Node Patterns

- Store nodes in `useRef` (not state) to avoid re-renders
- Check node existence before method calls (`player.current?.method()`)
- Use `await Tone.start()` before first playback (browser autoplay policy)

## Best Practices

### DO

✓ Use functional components exclusively
✓ Destructure props in function parameters
✓ Use Tailwind utility classes for styling
✓ Support dark mode with `dark:` variants
✓ Use Zustand for global state, useState for local state
✓ Return cleanup functions in useEffect when needed
✓ Use semantic, descriptive variable names
✓ Keep components focused and single-purpose
✓ Extract reusable UI into components/
✓ Use IndexedDB for large binary data (audio files)
✓ Use localStorage (via Zustand persist) for metadata

### DON'T

✗ Use class components
✗ Inline complex logic in JSX
✗ Store large data in localStorage (use IndexedDB)
✗ Forget to dispose Tone.js nodes
✗ Mutate state directly (always use setState/set)
✗ Use inline styles unless absolutely necessary (dynamic values)
✗ Create new function instances in render (use useCallback)
✗ Forget mobile responsiveness
✗ Hardcode colors/spacing (use Tailwind tokens)

## Future Considerations

- TypeScript migration (currently vanilla JS)
- Full PWA setup with service worker
- Complete Library and Search pages
- Playlist management UI
- Lyrics support
- Audio visualization enhancements
- Tests (currently no testing framework)
