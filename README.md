# Patch Picker

> **Smart copy for diff files** - Automatically removes `+`/`-` symbols when copying code from patch files.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/VoidAxon/PatchPicker)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.75.0+-007ACC.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

- **🎯 Smart Group Detection** - Automatically detects consecutive lines with the same symbol (`+` or `-`)
- **📋 Clean Copy** - Removes `+`/`-` symbols automatically when copying
- **⌨️ Keyboard First** - Works seamlessly with `Ctrl+C` / `Cmd+C`
- **🖱️ Context Menu** - Right-click to "Copy Without Diff Symbols"
- **🎨 Selection Support** - Copy selected lines or let it auto-detect groups
- **⚡ Zero Configuration** - Works instantly on `.diff`, `.patch`, and `.rej` files

## 🚀 Quick Start

### Installation

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for "Patch Picker"
4. Click Install

### Usage

**Method 1: Auto-detect (Recommended)**
1. Open a diff/patch file
2. Place cursor on any `+` or `-` line
3. Press `Ctrl+C` (or `Cmd+C` on Mac)
4. All consecutive lines with the same symbol are copied **without** the symbols! 🎉

**Method 2: Selection**
1. Select the lines you want to copy
2. Press `Ctrl+C`
3. Selected lines are copied without `+`/`-` symbols

**Method 3: Context Menu**
1. Right-click in the editor
2. Select "Copy Without Diff Symbols"

## 📖 Example

### Input (diff file)
```diff
@@ -1,8 +1,10 @@
 function example() {
-  const oldVariable = 'old value';
-  console.log('This will be removed');
-  return oldVariable;
+  const newVariable = 'new value';
+  console.log('This is new code');
+  console.log('Another new line');
+  return newVariable;
 }
```

### Action
Place cursor on `+  const newVariable = 'new value';` and press `Ctrl+C`

### Output (clipboard)
```javascript
  const newVariable = 'new value';
  console.log('This is new code');
  console.log('Another new line');
  return newVariable;
```

**No more manual cleanup!** ✨

## 🎯 Use Cases

Perfect for developers who frequently:
- 📝 Review pull requests and copy code snippets
- 🔧 Apply patches manually
- 📚 Extract code from diff files for documentation
- 🐛 Analyze changes in `.rej` (reject) files
- 💬 Share code snippets from diffs in chat/email

## ⚙️ Supported File Types

- `.diff` - Standard diff files
- `.patch` - Git patch files
- `.rej` - Reject files from failed patches

## 🎨 Smart Behavior

| Scenario | Behavior |
|----------|----------|
| Cursor on `+` line | Auto-detects all consecutive `+` lines and copies without symbols |
| Cursor on `-` line | Auto-detects all consecutive `-` lines and copies without symbols |
| Selection active | Copies selected lines, removing `+`/`-` from each |
| Cursor on context line | Falls back to standard copy (preserves symbols) |
| Non-diff file | Standard copy behavior (extension inactive) |

## 📊 Status Bar Feedback

After copying, the status bar shows:
```
✓ Copied 4 lines (without +/-)
```

## 🔧 Requirements

- Visual Studio Code version 1.75.0 or higher
- No external dependencies

## 🤝 Contributing

Found a bug or have a feature request?

1. Check existing issues on [GitHub Issues](https://github.com/VoidAxon/PatchPicker/issues)
2. Open a new issue with details
3. Pull requests are welcome!

## 📝 Release Notes

### 1.0.0 (Initial Release)

- ✅ Auto-detect groups of `+` or `-` lines
- ✅ Remove diff symbols when copying
- ✅ Keyboard shortcut integration (`Ctrl+C`)
- ✅ Context menu support
- ✅ Selection mode support
- ✅ Status bar feedback

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🌟 Show Your Support

If you find this extension helpful, please:
- ⭐ Star the [repository](https://github.com/VoidAxon/PatchPicker)
- 📝 Leave a review on the [marketplace](https://marketplace.visualstudio.com/)
- 🐦 Share with your team!

---

**Made with ❤️ for developers who love clean code**
