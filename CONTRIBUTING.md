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

We use a **branch-based workflow** with protected branches:

#### Branch Strategy

- **`main`** - Production-ready code (protected, requires PR)
- **`feature`** - New features and enhancements (protected, requires PR)
- **`bug/fix`** - Bug fixes and patches (protected, requires PR)

#### Workflow

1. **Fork the repo** and clone your fork locally
2. **Create a feature branch** from the appropriate base:
   - For new features: branch from `feature`
     ```bash
     git checkout feature
     git pull origin feature
     git checkout -b feature/your-feature-name
     ```
   - For bug fixes: branch from `bug/fix`
     ```bash
     git checkout bug/fix
     git pull origin bug/fix
     git checkout -b fix/issue-name
     ```
3. **Set up your environment**:
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```
4. **Make your changes**:
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed
5. **Test your changes**:
   ```bash
   npm run lint
   npx tsc --noEmit
   npx expo start
   ```
6. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     - `feat:` for new features
     - `fix:` for bug fixes
     - `docs:` for documentation
     - `style:` for formatting changes
     - `refactor:` for code refactoring
     - `test:` for tests
     - `chore:` for maintenance
   - Examples:
     ```
     feat: add upvote animation on feed
     fix: resolve crash on empty confession submit
     docs: update iOS build instructions
     ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request**:
   - Target `feature` for new features
   - Target `bug/fix` for bug fixes
   - Fill out the PR template
   - Link related issues
   - Wait for CI to pass
   - Respond to review feedback

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/confessio.git
   cd confessio
   ```

2. Checkout the appropriate base branch:
   - For features: `git checkout feature`
   - For bug fixes: `git checkout bug/fix`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

5. Set up Supabase database:
   - Create a Supabase project at https://supabase.com
   - Run the SQL migrations from README.md:
     - Initial schema (confessions table)
     - Upvote system migration (if implementing upvotes)
   - Configure Row Level Security policies

6. Start the development server:
   ```bash
   npx expo start
   ```

7. Test on your device:
   - iOS: Press `i` or scan QR with Camera app
   - Android: Press `a` or scan QR with Expo Go
   - Web: Press `w`

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

1. **Run linter**:
   ```bash
   npm run lint
   ```

2. **Run type checks**:
   ```bash
   npx tsc --noEmit
   ```

3. **Test on a device or simulator**:
   ```bash
   npx expo start
   ```

4. **Test key flows**:
   - Write and submit a confession
   - View confessions in feed
   - Upvote/un-upvote confessions
   - Pull-to-refresh feed
   - Navigate between tabs (Write, Feed, About)
   - Test on both iOS and Android if possible

5. **Check CI status**:
   - Push your branch and ensure GitHub Actions pass
   - Fix any lint or type errors reported by CI

## Review Process

1. All PRs require at least one review before merging
2. CI checks (lint + typecheck) must pass
3. Address review feedback promptly
4. Once approved, maintainers will merge to the target branch
5. Periodically, `feature` and `bug/fix` are merged to `main` for releases

## Questions?

Feel free to open an issue for any questions or clarifications!

---

Thank you for contributing to Confessio! 🎉
