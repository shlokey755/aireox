# Birthday site

A scroll driven birthday page built with Vite, plain HTML and CSS, and Three.js.
Mobile first, no emojis, no em dashes, no hover effects, no oval shapes.

## Run it

```
npm install
npm run dev
```

Build for hosting with `npm run build` (output in `dist`).

## Make it hers

Everything personal is in `src/config.js`:

- `name` and `from` appear in the hero and the finale.
- `photos` holds one card per photo, each with its own title and caption.
  Drop images into `public/photos` and set `src: "/photos/1.jpg"`.
  Leave `src` empty to keep the placeholder.
- `note` holds the short lines shown before the collage.

The collage artwork (moon, golden flower, pizza, black, Tangled) is drawn in `src/art.js`.

## How it moves

- Cards, note lines and collage tiles pop in as they scroll into view (IntersectionObserver).
- The night sky (stars, a moon that waxes as you scroll, floating lanterns, finale confetti) is Three.js.
- The scroll bands and corner stickers drift with scroll position.
- With reduced motion turned on, everything is shown statically.
