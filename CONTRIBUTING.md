# Contributing to Confessio

Thank you for your interest in contributing to Confessio! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Your environment (OS, Expo version, device/simulator)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- Detailed description of the proposed feature
- Why this enhancement would be useful
- Possible implementation approach (optional)

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Set up your environment**:
   ```bash
   npm install
   ```
3. **Make your changes**:
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes**:
   ```bash
   npm run lint
   npx tsc --noEmit
   npx expo start
   ```
5. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format (e.g., `feat:`, `fix:`, `docs:`)
6. **Push to your fork** and submit a pull request

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/confessio.git
   cd confessio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a Supabase project
   - Run the SQL schema from README.md
   - Update `lib/supabase.js` with your credentials

4. Start the development server:
   ```bash
   npx expo start
   ```

## Project Structure

```
confessio/
├── app/                 # Expo Router screens
│   ├── write.tsx       # Write confession screen
│   ├── feed.tsx        # Confession feed
│   ├── about.tsx       # About/Privacy/T&C
│   └── _layout.tsx     # Tab navigation
├── lib/                # Utilities
│   ├── supabase.js     # Supabase client
│   ├── deviceName.js   # Anonymous codename generator
│   └── terms.ts        # Privacy & Terms text
├── assets/             # Images and static files
└── README.md
```

## Coding Guidelines

### TypeScript/JavaScript

- Use TypeScript for new files when possible
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for exported functions

### React/React Native

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### Styling

- Use StyleSheet.create for styles
- Keep styles close to components
- Use consistent spacing and naming

### Privacy-First Development

This app is privacy-focused. When contributing:

- **Never** add tracking or analytics
- **Never** collect personal data
- Keep the anonymous codename local
- Document any data flow changes

## Testing

Before submitting a PR:

1. Run linter:
   ```bash
   npm run lint
   ```

2. Run type checks:
   ```bash
   npx tsc --noEmit
   ```

3. Test on a device or simulator:
   ```bash
   npx expo start
   ```

4. Test key flows:
   - Write and submit a confession
   - View confessions in feed
   - Pull-to-refresh feed
   - Navigate between tabs

## Questions?

Feel free to open an issue for any questions or clarifications!

---

Thank you for contributing to Confessio! 🎉
