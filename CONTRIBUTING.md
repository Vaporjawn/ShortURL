# Contributing to ShortURL

First off, thank you for considering contributing to ShortURL! It's people like you that make ShortURL such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what behavior you expected
- **Include screenshots** if relevant
- **Include your environment details** (OS, Node version, MongoDB version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Provide specific examples** to demonstrate the enhancement
- **Explain why this enhancement would be useful**

### Pull Requests

1. **Fork the repository** and create your branch from `master`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Ensure the code lints**: `npm run lint`
6. **Commit your changes** with a clear commit message
7. **Push to your fork** and submit a pull request

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ShortURL.git
   cd ShortURL
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript Style Guide

- Use **TypeScript strict mode**
- Use **explicit types** where appropriate
- Use **interfaces** for object shapes
- Use **async/await** instead of callbacks
- Use **arrow functions** for callbacks
- Use **const** and **let**, never **var**
- Use **template literals** instead of string concatenation

### Code Formatting

- Indent with **2 spaces**
- Use **single quotes** for strings
- Add **semicolons** at the end of statements
- Use **trailing commas** in multiline objects/arrays
- Keep lines **under 100 characters** when possible

### Naming Conventions

- **Variables and functions**: camelCase (`getUserData`)
- **Classes and interfaces**: PascalCase (`ShortUrl`, `IShortUrl`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_URL_LENGTH`)
- **Files**: kebab-case (`error-handler.ts`)

### Comments

- Write clear, concise comments
- Use JSDoc for function documentation
- Explain **why**, not **what** (code should be self-documenting)
- Keep comments up-to-date with code changes

### Example

```typescript
/**
 * Creates a new short URL from a full URL
 * @param fullUrl - The original URL to shorten
 * @returns The created short URL document
 */
async function createShortUrl(fullUrl: string): Promise<IShortUrl> {
  // Validate URL format before creating
  try {
    new URL(fullUrl);
  } catch (error) {
    throw new Error('Invalid URL format');
  }

  return await ShortUrl.create({ full: fullUrl });
}
```

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: Add custom URL aliases

Allow users to specify custom short URLs instead of
auto-generated ones.

Closes #123
```

```
fix: Prevent duplicate URL creation

Check if URL already exists before creating a new
short URL entry in the database.
```

## Testing

Before submitting a pull request:

1. **Test manually** in a browser
2. **Test API endpoints** with curl or Postman
3. **Check for console errors**
4. **Verify MongoDB operations**
5. **Test edge cases** (invalid URLs, missing data, etc.)

## Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Add or modify API endpoints
- Update environment variables
- Change project structure

Areas to update:
- `README.md` - Main documentation
- `CONTRIBUTING.md` - This file
- Code comments
- API documentation

## Questions?

Feel free to reach out:
- Open an issue on GitHub
- Email: victor.williams.dev@gmail.com

Thank you for contributing! 🎉
