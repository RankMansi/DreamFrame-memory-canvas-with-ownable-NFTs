# Memory Photo Editor Component

A premium photo editor component for creating stylized memory cards with captions on the back.

## Features

- **Upload & Preview**: Drop or select photos and see them instantly in stylized frames
- **3D Card Flip Animation**: Smooth flip animation to switch between photo front and caption back
- **Multiple Filter Options**: Polaroid, Vintage, and Pastel filters
- **Rich Text Styling**: Control font family, size, weight, color, and alignment
- **Image Download**: Download both front and back sides as separate high-resolution images

## Usage

```tsx
import MemoryPhotoEditor from '@/components/MemoryPhotoEditor';

export default function MyPage() {
  return (
    <div className="container">
      <MemoryPhotoEditor />
    </div>
  );
}
```

## Technical Details

The component uses:
- Canvas API for image manipulation
- Framer Motion for smooth animations
- React hooks for state management
- Tailwind CSS for styling

## Dependencies

- `framer-motion`: For 3D card flip animations
- `lucide-react`: For UI icons
- UI components from shadcn/ui

## Customization

The component is designed to be customizable:

- Filter presets can be modified in the FILTERS constant
- Font options can be extended in the FONTS, FONT_SIZES, etc. arrays
- Canvas rendering can be customized in the useEffect hooks

## Implementation Notes

The component uses two canvas elements:
1. Front canvas: Displays the photo with applied filters and frame
2. Back canvas: Renders the user's caption with styling options

When downloading, both canvases are converted to PNG images. 