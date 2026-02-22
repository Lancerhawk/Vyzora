# Contributing to Vyzora

Thank you for considering contributing to Vyzora! This document outlines the
guidelines to help you get started quickly and keep the codebase clean.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. Follow the [Development Setup](#development-setup) instructions
4. Make your changes on a new branch
5. Open a Pull Request against `main`

---

## Development Setup

### Prerequisites

- Node.js >= 18
- npm >= 9
- PostgreSQL (for backend)
- Git

### Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Runtime SDK
cd ../runtime-sdk && npm install
```

### Environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in DATABASE_URL, JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
```

### Run lint before committing

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint

# SDK
cd runtime-sdk && npm run lint
```

---

## Branch Strategy

| Branch pattern | Purpose |
|---|---|
| `main` | Stable, production-ready code |
| `feat/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `chore/<name>` | Tooling, deps, docs |
| `refactor/<name>` | Code restructuring |

---

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**

```
feat(backend): add project creation endpoint
fix(sdk): handle retry on network timeout
docs: update api-spec with ingest schema
chore(ci): add lint GitHub Action
```

---

## Pull Request Process

1. Ensure your branch is up-to-date with `main`
2. Run `npm run lint` in all changed packages — no errors allowed
3. Fill in the PR template fully
4. Request at least one review
5. Squash and merge once approved

---

## Code Style

- **TypeScript** — strict mode, no `any` unless explicitly justified
- **Formatting** — follow the existing ESLint config per package
- **Naming** — `camelCase` for variables/functions, `PascalCase` for types/classes
- **No console.log** in production paths (use the logger utility when available)

---

## Reporting Bugs

Use the **Bug Report** issue template. Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment (Node version, OS, browser if frontend)
- Relevant logs or screenshots

---

## Feature Requests

Use the **Feature Request** issue template. Describe:
- The problem you're solving
- Your proposed solution
- Any alternatives considered
