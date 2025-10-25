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

We use a branch-based workflow with protected branches:

#### Branch Strategy

- **`main`** - Production-ready code (protected, requires PR)
- **`feature`** - New features and enhancements (protected, requires PR)
- **`bug/fix`** - Bug fixes and patches (protected, requires PR)

#### Workflow

1. Fork the repo and clone your fork locally
2. Create a feature branch from the appropriate base:
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
3. Set up your environment:
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```
4. Make your changes:
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed
5. Test your changes:
   ```bash
   npm run lint
   npx tsc --noEmit
   npx expo start
   ```
6. Commit your changes:
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
7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. Open a Pull Request:
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
   - Run the SQL migrations from README.md
   - Configure Row Level Security policies

6. Start the dev server:
   ```bash
   npx expo start
   ```

## Code Style

- Use TypeScript for type safety
- Follow existing patterns and conventions
- Keep functions small and focused
- Add comments for complex logic
- Update documentation when needed

## Commit Messages

Follow conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code refactoring
- `test:` for tests
- `chore:` for maintenance

Examples:
```
feat: add upvote animation on feed
fix: resolve crash on empty confession submit
docs: update iOS build instructions
```

## Need Help?

Feel free to open an issue or ask questions in your PR. We're here to help!
```

### 🔧 Useful Commands

```bash
# Development
npx expo start              # Start dev server
npx expo start --ios        # Start iOS simulator
npx expo start --android    # Start Android emulator
npx expo start --clear      # Clear cache and start

# Code Quality
npm run lint                # Run ESLint
npx tsc --noEmit           # TypeScript type checking
npm run lint -- --fix       # Auto-fix lint issues

# Building
eas build --platform ios    # Build iOS (requires EAS account)
eas build --platform android # Build Android APK
eas build --profile preview  # Build preview version

# Troubleshooting
rm -rf node_modules package-lock.json
npm install                 # Clean reinstall
npx expo start --clear      # Clear cache
```

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define interfaces for complex data structures
- Avoid `any` type - use `unknown` if necessary
- Use type inference when obvious

```typescript
// ✅ Good
interface Confession {
  id: number;
  content: string;
  device_name: string | null;
}

// ❌ Avoid
const data: any = await supabase.from('confessions').select('*');
```

### React & React Native
- Use functional components with hooks
- Prefer `const` over `let`
- Use descriptive component names
- Extract reusable logic into custom hooks
- Keep components focused (single responsibility)

```typescript
// ✅ Good
const CommentItem = ({ comment }: { comment: Comment }) => {
  return <View>...</View>;
};

// ❌ Avoid
function comp(props: any) { ... }
```

### Styling
- Use `StyleSheet.create()` for styles
- Group related styles together
- Use semantic names (not presentational)
- Follow existing naming patterns

```typescript
// ✅ Good
const styles = StyleSheet.create({
  commentContainer: { ... },
  commentText: { ... },
});

// ❌ Avoid
const styles = StyleSheet.create({
  box1: { ... },
  redText: { ... },
});
```

### Privacy-First Code
- Never log user identifiable information
- Avoid analytics/tracking code
- Use anonymous device IDs (via deviceName.js)
- Don't collect unnecessary data

```typescript
// ✅ Good
console.log('Confession submitted successfully');

// ❌ Avoid
console.log('User email:', userEmail);
console.log('Confession content:', content);
```

## 🧪 Testing Guidelines

While we don't have automated tests yet (contributions welcome!), please manually test:

### For All Changes
- [ ] App builds without errors
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No console warnings in development

### For UI Changes
- [ ] Works on iOS simulator (if possible)
- [ ] Works on Android emulator (if possible)
- [ ] Responsive to different screen sizes
- [ ] Follows existing design patterns
- [ ] Accessible (proper labels, contrast)

### For Database Changes
- [ ] SQL migration is idempotent (can run multiple times)
- [ ] RLS policies are correct
- [ ] No data loss on migration
- [ ] Tested in Supabase SQL editor

### For New Features
- [ ] Feature works end-to-end
- [ ] Error states are handled
- [ ] Loading states are shown
- [ ] Edge cases considered (empty states, etc.)

## 🔍 Code Review Process

After you submit a PR:

1. **Automated Checks** - CI will run lint and typecheck
2. **Review by Maintainers** - We'll review your code within 1-7 days
3. **Feedback** - We may request changes or ask questions
4. **Approval** - Once approved, we'll merge your PR
5. **Celebrate!** 🎉 - Your contribution is now part of Confessio!

**What we look for:**
- ✅ Code follows project conventions
- ✅ Changes are well-documented
- ✅ No breaking changes (unless discussed)
- ✅ Maintains privacy-first philosophy
- ✅ Tests pass and code works as expected

**Be patient:**
- We're a small team of volunteers
- Reviews may take a few days
- Constructive feedback is always respectful
- We appreciate your contribution!

## 🆘 Getting Help

Stuck? Need clarification? Here's how to get help:

- 💬 **Comment on your PR** - We'll respond within a few days
- 🐛 **Open an issue** - For general questions about contributing
- 📖 **Check documentation** - README.md, docs/ folder
- 🔍 **Search existing issues** - Someone may have asked before

**Before asking:**
1. Read this guide thoroughly
2. Check README.md and other docs
3. Search existing issues/PRs
4. Try debugging yourself (learning opportunity!)

## 🏆 Recognition

We value all contributions! Contributors will be:
- ✨ Listed in [GitHub contributors](../../graphs/contributors)
- 🎉 Mentioned in release notes (for significant contributions)
- ⭐ Acknowledged in our README (coming soon)
- 🙏 Forever appreciated by the community

**Every contribution matters** - from fixing typos to adding major features!

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

<div align="center">

**Thank you for contributing to Confessio!** ❤️

Together, we're building a privacy-first, anonymous confession platform for everyone.

[View Open Issues](../../issues) · [Read Code of Conduct](CODE_OF_CONDUCT.md) · [Security Policy](SECURITY.md)

</div>

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
