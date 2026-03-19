# 📚 Library Book Borrowing System

A NestJS backend system for managing library book borrowing operations with member management, inventory tracking, and penalty system.

## 🎯 Features

- **Book Management**: Create, read, update, delete books with inventory tracking
- **Member Management**: Register and manage library members
- **Book Borrowing**: Borrow books with validations (max 2 per member, no duplicates, penalty checks)
- **Book Return**: Return books with automatic penalty if overdue (>7 days)
- **Penalty System**: 3-day penalty blocks borrowing for returning late books

## 🛠️ Tech Stack

- **Framework**: NestJS 11.0.1
- **Language**: TypeScript
- **Database**: PostgreSQL + MikroORM
- **API Docs**: Swagger/OpenAPI
- **Testing**: Jest (93 tests, 100% coverage on critical logic)
- **Architecture**: Domain-Driven Design (DDD)

## 📁 Project Structure (Domain-Driven Design)

The project follows **Domain-Driven Design (DDD)** pattern with layered architecture:

```
src/modules/{moduleName}/
├── domain/
│   ├── entities/          # Core business entities (Book, Member, Borrowing)
│   ├── interfaces/        # Repository interfaces
│   └── validators/        # Business rule validations
├── application/
│   ├── dtos/              # Data Transfer Objects for requests/responses
│   └── use-cases/         # Application logic orchestrating domain layer
└── infrastructure/
    ├── {moduleName}.orm-entity.ts  # Database ORM entities
    ├── mappers/           # Domain ↔ ORM entity mapping
    └── repositories/      # Repository implementations
```

**DDD Layers Explained:**

- **Domain Layer**: Pure business logic, independent of frameworks
- **Application Layer**: Use cases that orchestrate domain objects and repositories
- **Infrastructure Layer**: Database persistence, ORM, and external integrations

**Example Flow**: `Controller` → `UseCase` → `Repository` → `Domain Entity` → Database

## 💻 Installation

```bash
npm install
```

## ⚙️ Environment Setup

Create `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=library_db
```

## 🚀 Running

```bash
npm run start:dev       # Development mode
npm run start:prod      # Production mode
npm test                # Run tests
npm run test:cov        # Coverage report
npm run migration:up    # Run migrations
npm run seeder:run      # Seed mock data
```

## 🌐 API Endpoints

### Books

- `GET /books` - List all books
- `POST /books` - Create book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

### Members

- `GET /members` - List all members
- `POST /members` - Create member
- `PUT /members/:id` - Update member
- `DELETE /members/:id` - Delete member

### Borrowing

- `POST /borrowing/borrow` - Borrow a book
- `POST /borrowing/return` - Return a book

**Swagger UI**: http://localhost:3000/api-docs

## 📊 Business Rules

### Borrowing Validations

- ✅ Member exists and not penalized
- ✅ Member can borrow max 2 books
- ✅ Book must be available (in stock)
- ✅ Book not borrowed by another member

### Return & Penalty

- ✅ Book must have been borrowed by member
- ✅ Auto-penalty if > 7 days (3-day block)
- ✅ Auto stock increase on return

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:cov      # Show coverage
npm run test:watch    # Watch mode
```

**Test Results**: 17 suites, 93 tests, all passing ✅

## 📦 Mock Data

**Books** (5 seeded):

- JK-45: Harry Potter by J.K Rowling
- SHR-1: A Study in Scarlet by Arthur Conan Doyle
- TW-11: Twilight by Stephenie Meyer
- HOB-83: The Hobbit by J.R.R. Tolkien
- NRN-7: The Lion, the Witch and the Wardrobe by C.S. Lewis

**Members** (3 seeded):

- M001: Angga
- M002: Ferry
- M003: Putri

## 📝 License

MIT
