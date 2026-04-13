# Change Log

All notable changes to the "Patch Picker" extension will be documented in this file.

## [1.0.0] - 2026-04-13

### Added
- Initial release of Patch Picker
- Auto-detect groups of consecutive `+` or `-` lines
- Smart copy that removes diff symbols automatically
- Keyboard shortcut integration with `Ctrl+C` / `Cmd+C`
- Context menu option "Copy Without Diff Symbols"
- Selection mode support for copying specific lines
- Status bar feedback showing number of lines copied
- Support for `.diff`, `.patch`, and `.rej` file types
- Fallback to standard copy for non-diff lines

### Features
- Zero configuration required
- Lightweight and fast
- Only activates for diff/patch files
- No external dependencies
