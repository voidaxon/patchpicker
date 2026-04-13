# Publishing to Visual Studio Marketplace

This guide explains how to publish the Patch Picker extension to the Visual Studio Marketplace.

## Prerequisites

1. **Create a Microsoft/Azure Account**
   - Go to https://dev.azure.com
   - Sign in with your Microsoft account (or create one)

2. **Create an Azure DevOps Organization**
   - Click "Create new organization"
   - Choose a name for your organization

3. **Create a Personal Access Token (PAT)**
   - Go to https://dev.azure.com/[your-org]/_usersSettings/tokens
   - Click "New Token"
   - Name: "VS Code Publishing"
   - Organization: Select your organization
   - Scopes: Select "Custom defined"
   - Click "Show all scopes"
   - Check **"Marketplace" > "Manage"**
   - Click "Create"
   - **⚠️ IMPORTANT**: Copy the token immediately (you won't see it again!)

4. **Create a Publisher**
   - Go to https://marketplace.visualstudio.com/manage
   - Click "Create publisher"
   - Publisher ID: Choose a unique ID (e.g., "your-name" or "your-company")
   - Display name: Your display name
   - Fill in other details
   - Click "Create"

## Setup

### 1. Update package.json

Replace `"publisher": "patch-picker"` with your actual publisher ID:

```json
{
  "publisher": "your-publisher-id"
}
```

### 2. Add Icon (Optional but Recommended)

Create or download a 128x128 PNG icon and save it as `icon.png` in the root directory.

If you don't have an icon, you can remove this line from package.json:
```json
"icon": "icon.png",
```

### 3. Update Repository URL

In package.json, update the repository URL to your actual GitHub repository:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/yourusername/patch-picker"
}
```

Or remove this section if you don't have a repository yet.

## Publishing Steps

### First Time Publishing

1. **Login to vsce**
   ```bash
   npx vsce login your-publisher-id
   ```

   When prompted, paste your Personal Access Token (PAT)

2. **Package the extension**
   ```bash
   npm run package
   ```

   This creates a `.vsix` file (e.g., `patch-picker-1.0.0.vsix`)

3. **Publish to Marketplace**
   ```bash
   npx vsce publish
   ```

   Or publish a specific version:
   ```bash
   npx vsce publish minor  # 1.0.0 -> 1.1.0
   npx vsce publish patch  # 1.0.0 -> 1.0.1
   npx vsce publish major  # 1.0.0 -> 2.0.0
   ```

### Manual Publishing (Alternative)

If you prefer not to use the command line:

1. Package the extension:
   ```bash
   npm run package
   ```

2. Go to https://marketplace.visualstudio.com/manage/publishers/your-publisher-id

3. Click "New extension" → "Visual Studio Code"

4. Drag and drop your `.vsix` file

5. Click "Upload"

## Updating the Extension

1. **Update version in package.json**
   ```json
   "version": "1.0.1"
   ```

2. **Update CHANGELOG.md** with your changes

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Release v1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```

4. **Publish the update**
   ```bash
   npx vsce publish
   ```

## Unpublishing

To remove your extension from the marketplace:

```bash
npx vsce unpublish your-publisher-id.patch-picker
```

⚠️ **Warning**: This is permanent and cannot be undone!

## Best Practices

### Before Publishing

- ✅ Test the extension thoroughly in development mode (F5)
- ✅ Test the packaged .vsix file locally
- ✅ Update README.md with clear usage instructions
- ✅ Update CHANGELOG.md with version changes
- ✅ Add screenshots/GIFs to README (highly recommended!)
- ✅ Choose appropriate keywords for discoverability
- ✅ Set up a GitHub repository (optional but recommended)
- ✅ Add license information

### After Publishing

- 📊 Monitor the marketplace page for downloads and ratings
- 💬 Respond to user reviews and issues
- 🐛 Fix bugs promptly
- ✨ Add features based on user feedback

## Testing the Package Locally

Before publishing, test the .vsix file:

1. Package the extension:
   ```bash
   npm run package
   ```

2. Install in VS Code:
   - Press `Ctrl+Shift+P`
   - Type "Extensions: Install from VSIX..."
   - Select the `.vsix` file

3. Test all features

4. Uninstall when done testing

## Troubleshooting

### "Invalid publisher"
- Make sure your publisher ID in package.json matches your marketplace publisher

### "Personal Access Token is invalid"
- Generate a new PAT with "Marketplace > Manage" scope
- Run `npx vsce login your-publisher-id` again

### "Cannot find icon.png"
- Either add the icon file or remove `"icon": "icon.png"` from package.json

### "Missing repository"
- Add a repository URL or remove the repository field from package.json

## Resources

- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Marketplace](https://marketplace.visualstudio.com/)
- [Azure DevOps](https://dev.azure.com/)

## Quick Reference

```bash
# Login
npx vsce login your-publisher-id

# Package
npm run package

# Publish
npx vsce publish

# Publish with version bump
npx vsce publish patch  # 1.0.0 -> 1.0.1
npx vsce publish minor  # 1.0.0 -> 1.1.0
npx vsce publish major  # 1.0.0 -> 2.0.0

# Unpublish
npx vsce unpublish your-publisher-id.patch-picker
```
