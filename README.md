## Introduction

> [CoCursor](https://cocursor-service.vercel.app/)

**CoCursor** is a service that supports real-time cursor tracking for React projects.
Move the cursor from the Figma canvas to your webpage and track it in real-time.

## Installation

First, you need to obtain an API Key for use.  
You can get the API key from [CoCursor](https://cocursor-service.vercel.app/installation).

Then, install the package in your project using your preferred package manager:

```sh
npm i cocursor
```

## CoCursorProvider

Wrap your page component with `CoCursorProvider`.

```tsx
import CoCursorProvider from "cocursor";

export default function PageComponent() {
  return (
    <CoCursorProvider apiKey={process.env.REACT_APP_COCURSOR_API_KEY as string}>
      {/* ... */}
    </CoCursorProvider>
  );
}
```

### Props

| Prop                 | Type                      | Description                                                                         |
| -------------------- | ------------------------- | ----------------------------------------------------------------------------------- |
| `apiKey`             | `string`                  | Required API key                                                                    |
| `children`           | `ReactNode`               | -                                                                                   |
| `channel`            | `string`                  | Set a channel for your project. `channel="team1"`                                   |
| `myName`             | `string`                  | The name that appears on your cursor to other users. `myName="alexgoni"`            |
| `allowMyCursorShare` | `boolean`                 | Whether to send your cursor information to other users. `allowMyCursorShare={true}` |
| `showMyCursor`       | `boolean`                 | Whether to hide your cursor. `showMyCursor={false}`                                 |
| `quality`            | `"high", "middle", "low"` | Quality setting. The default is `"high"`. `quality="middle"`                        |
| `disabled`           | `boolean`                 | Whether to disable CoCursor functionality. `disabled={true}`                        |

## useCoCursor

The useCoCursor hook allows you to modify the settings of **CoCursor** or read the current settings.

```tsx
const {
  // state
  channel,
  myName,
  allowMyCursorShare,
  showMyCursor,
  quality,
  disabled,
  // setState
  setChannel,
  setMyName,
  setAllowInfoSend,
  setShowMyCursor,
  setQuality,
  setDisabled,
} = useCoCursor();
```

## Custom Style

You can customize the style of CoCursor by increasing specificity.
Here is the complete CSS code for the CoCursor project.

```css
.cocursor__cursor-wrapper {
  position: fixed;
  width: 14px;
  height: 14px;
  pointer-events: none;
  z-index: 2147483647;
}

.cocursor__arrow {
  width: 14px;
  height: 14px;
}

.cocursor__label {
  position: absolute;
  top: 8px;
  left: calc(100% + 4px);
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}
```
