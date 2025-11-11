# Torq Task - NX Monorepo with Vue 3

A modern monorepo architecture built with NX, featuring a modular IP Lookup application with reusable components.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Applications](#applications)
- [Shared Libraries](#shared-libraries)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Technology Stack](#technology-stack)
- [Testing](#testing)

---

## 🎯 Overview

This project is a **monorepo** managed by **NX**, containing two Vue 3 applications and a set of reusable libraries. The main feature is an **IP Lookup tool** that allows users to search for IP address information including country, flag, and local time.

### Key Features

- 🏗️ **Monorepo Architecture** with NX
- 🔄 **Reusable Components** via shared libraries
- 🌐 **IP Lookup Tool** with real-time validation
- ✅ **Comprehensive Testing** with Vitest
- 📦 **Modular Design** for scalability
- 🎨 **SCSS Styling** with BEM methodology

---

## 🏛️ Architecture

The project follows a **modular monorepo architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              NX Workspace                       │
│                                                 │
│  ┌───────────────┐      ┌──────────────────┐   │
│  │               │      │                  │   │
│  │  Shell App    │      │  IP Lookup App   │   │
│  │  (Container)  │◄─────┤  (Feature)       │   │
│  │               │      │                  │   │
│  └───────────────┘      └──────────────────┘   │
│         │                        │              │
│         │                        │              │
│         └────────────┬───────────┘              │
│                      │                          │
│                      ▼                          │
│         ┌────────────────────────┐              │
│         │                        │              │
│         │   Shared Libraries     │              │
│         │                        │              │
│         │  • List Components     │              │
│         │  • List Types          │              │
│         │  • List Utils          │              │
│         │  • List Composables    │              │
│         │                        │              │
│         └────────────────────────┘              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Domain-Driven Design**: Each application owns its domain logic
2. **Shared Libraries**: Common functionality extracted into reusable libs
3. **Loose Coupling**: Applications depend on libraries, not on each other
4. **Type Safety**: TypeScript throughout the codebase
5. **Testability**: Comprehensive test coverage with isolated unit tests

---

## 📁 Project Structure

```
torq-task/
│
├── apps/
│   ├── shell/                    # Shell/Container Application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layouts/      # Layout components
│   │   │   │   ├── views/        # Route views
│   │   │   │   ├── router/       # Vue Router configuration
│   │   │   │   └── App.vue
│   │   │   ├── styles/
│   │   │   └── main.ts
│   │   └── index.html
│   │
│   └── ip-lookup/                # IP Lookup Feature Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/   # IP-specific components
│       │   │   ├── models/       # Data models
│       │   │   ├── services/     # API services
│       │   │   ├── views/        # Route views
│       │   │   └── router/       # Router config
│       │   ├── public-api/       # Public exports
│       │   └── styles/
│       └── index.html
│
├── libs/
│   └── list/                     # List Library Package
│       ├── components/           # Reusable Vue components
│       │   ├── src/lib/
│       │   │   ├── list/
│       │   │   ├── list-item/
│       │   │   └── list-add-button/
│       │   └── src/public-api/
│       │
│       ├── types/                # TypeScript types & interfaces
│       │   └── src/lib/models/
│       │
│       ├── utils/                # Utility functions
│       │   └── src/lib/
│       │
│       └── composables/          # Vue composables
│           └── src/lib/
│
├── package.json
├── nx.json
├── tsconfig.base.json
└── README.md
```

---

## 🚀 Applications

### 1. Shell Application (`apps/shell`)

The **Shell** is the main container application that hosts and orchestrates other micro-applications.

**Purpose:**
- Acts as the application shell/container
- Handles routing and navigation
- Provides layouts and structure
- Imports and displays the IP Lookup feature

**Key Files:**
- `App.vue` - Root component
- `router/index.ts` - Main routing configuration
- `layouts/MainLayout.vue` - Main layout wrapper
- `views/Home.vue` - Home page that displays IP Lookup

**Run Command:**
```bash
npm run start:shell
```

---

### 2. IP Lookup Application (`apps/ip-lookup`)

A **feature application** that provides IP address lookup functionality with visual feedback.

**Purpose:**
- Lookup IP address information
- Display country, flag, and local time
- Real-time IP validation
- User-friendly error handling

**Features:**
- ✅ IP address format validation
- 🔍 Real-time API search
- 🚩 Country flag display
- 🕐 Local time for IP location
- ⚠️ Error handling with tooltips
- ➕ Add/Remove multiple IPs

**Key Components:**
- `IpLookupItem.vue` - Individual IP entry with all features
- `MainView.vue` - Main view that manages the list
- `ipLookup.service.ts` - API integration service
- `ipLookup.model.ts` - Data models and types

**Run Command:**
```bash
npm run start:ip-lookup
```

**API Integration:**
Uses `ip-api.com` for IP geolocation data.

---

## 📚 Shared Libraries

### 1. List Components (`libs/list/components`)

**Reusable Vue components** for building list-based UIs.

**Components:**
- `ListComponent` - Main list container with virtual scroll support
- `ListItemComponent` - Generic list item template
- `ListAddButtonComponent` - Button to add new items

**Features:**
- Virtual scrolling for large lists
- Empty state handling
- Customizable via slots
- Event-driven architecture

---

### 2. List Types (`libs/list/types`)

**TypeScript definitions** for type-safe list operations.

**Exports:**
```typescript
// List Item Model
interface ListItemModel {
  id: string;
  value: string;
}

// Event Types
interface ItemEvents {
  itemChange: (payload: ItemChangePayload) => void;
  itemBlur: (payload: ItemBlurPayload) => void;
  itemDelete: (payload: ItemDeletePayload) => void;
}

// List Events
interface ListEvents {
  add: () => void;
  // ... other events
}
```

---

### 3. List Utils (`libs/list/utils`)

**Utility functions** for common list operations.

**Functions:**
```typescript
// IP Validation
function isValidIp(ip: string): boolean

// List ID Generation
function generateListId(): string
```

**Features:**
- IPv4 validation with regex
- Unique ID generation
- Pure functions (no side effects)
- Fully tested

---

### 4. List Composables (`libs/list/composables`)

**Vue composables** for reactive list management.

**Composables:**
```typescript
// List Management
function useList<T>(initialItems?: T[])

// Virtual Scroll
function useVirtualScroll(options)
```

**Benefits:**
- Reactive state management
- Reusable logic
- Composition API patterns
- Performance optimizations

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd torq-task

# Install dependencies
npm install
```

### Development

```bash
# Run Shell application (main container)
npm run start:shell

# Run IP Lookup application (standalone feature)
npm run start:ip-lookup

# Run all tests
npm test

# Run specific app tests
npm run test:shell
npm run test:ip-lookup

# Lint code
npm run lint
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:shell` | Start Shell application in dev mode |
| `npm run start:ip-lookup` | Start IP Lookup app in dev mode |
| `npm run build:shell` | Build Shell app for production |
| `npm run build:ip-lookup` | Build IP Lookup app for production |
| `npm test` | Run all tests in the workspace |
| `npm run test:shell` | Run Shell app tests only |
| `npm run test:ip-lookup` | Run IP Lookup tests only |
| `npm run lint` | Lint all projects |
| `npm run lint:shell` | Lint Shell app |
| `npm run lint:ip-lookup` | Lint IP Lookup app |

---

## 🛠️ Technology Stack

### Core Technologies

- **[NX](https://nx.dev)** - Monorepo management and build system
- **[Vue 3](https://vuejs.org)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev)** - Next-generation frontend tooling
- **[Vue Router](https://router.vuejs.org)** - Official router for Vue.js

### Development Tools

- **[Vitest](https://vitest.dev)** - Blazing fast unit test framework
- **[Vue Test Utils](https://test-utils.vuejs.org)** - Official testing library
- **[ESLint](https://eslint.org)** - Code linting
- **[Prettier](https://prettier.io)** - Code formatting
- **[SCSS](https://sass-lang.com)** - CSS preprocessor

### UI & Styling

- **BEM Methodology** - CSS naming convention
- **SCSS Variables** - Consistent theming
- **Responsive Design** - Mobile-first approach

---

## ✅ Testing

### Test Coverage

The project has **comprehensive test coverage** across all applications and libraries:

- **50+ Unit Tests** covering all components and services
- **Integration Tests** for complex workflows
- **100% Critical Path Coverage** for IP lookup functionality

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific app
npm run test:shell
npm run test:ip-lookup

# Run tests in watch mode
nx test shell --watch

# Run tests with coverage
nx test ip-lookup --coverage
```

### Test Structure

```
├── apps/
│   ├── shell/
│   │   └── src/app/
│   │       ├── App.spec.ts
│   │       ├── views/*.spec.ts
│   │       └── layouts/*.spec.ts
│   │
│   └── ip-lookup/
│       └── src/app/
│           ├── components/*.spec.ts
│           ├── services/*.spec.ts
│           └── views/*.spec.ts
│
└── libs/
    └── list/
        ├── components/src/lib/**/*.spec.ts
        ├── utils/src/lib/**/*.spec.ts
        └── types/src/lib/**/*.spec.ts
```

---

## 🎨 Code Style

### Naming Conventions

- **Components**: PascalCase (`IpLookupItem.vue`)
- **Files**: kebab-case (`ip-lookup.service.ts`)
- **CSS Classes**: BEM notation (`.ip-item__input--error`)
- **TypeScript**: Interfaces with `Model` suffix (`IpLookupItemModel`)

### Best Practices

1. **Single Responsibility**: Each component has one clear purpose
2. **Type Safety**: All code is fully typed with TypeScript
3. **Documentation**: JSDoc comments for all public APIs
4. **Testing**: Test-driven development approach
5. **Modularity**: Reusable components via shared libraries

---

## 📝 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using NX and Vue 3**
