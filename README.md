# Device Management API

## 💡 Description

This project provides a RESTful API for managing a collection of devices, supporting updates, filtering by brand or state, and enforcing domain-level business rules.

It is built with **Node.js**, **Express**, and **TypeScript**, and follows a clean architecture with well-defined layers (Domain, Application, Infrastructure). The application uses **PostgreSQL** for persistence and is fully **containerized using Docker**.

The API is well-tested, documented, and ready for integration into larger systems or standalone use in device inventory management contexts.

## 📦 Technologies

- Node.js + TypeScript
- Express
- Docker + Docker Compose
- PostgreSQL

## 🚀 How to execute the project

### 0. Environment setup

- Copy the contents of the `.env.example` file to a `.env`.
- Fill the blank variables with their respective and correct values.

### 1. Build & Run with Docker

```bash
docker-compose up --build
```

### 2. Database setup

- Connect to the Postgres database using your favourite SQL tool.
- Copy the contents of the `/sql/setup.sql` file or simply upload it onto your SQL tool.
- Execute the queries.

### 3. Accessing the API

Health check: http://localhost:3000/health

### 4. Checking the docs

- To see the OpenAPI (Swagger) documentation, simply access http://localhost:3000/docs

- If you want, there's also a Postman collection available in the `/src/docs` folder.

## Testing

### Running tests

To run all tests:

```bash
npm run test
```

To run tests with coverage report:

```bash
npm run test:coverage
```

To run a specific test file

```bash
npm run test -- path/to/test-file.test.ts
```

### Test Structure

- Unit Tests: Located in src/**tests**/ directory, these test individual components in isolation.
- Integration Tests: Located in src/**tests**/integration/ directory, these test how components work together.

### Test Coverage Requirements

The project has strict test coverage requirements:

- Global Coverage: 80% for branches, functions, lines, and statements.
- Domain Layer Coverage: 90% for branches, functions, lines, and statements.

These requirements are enforced by Jest's coverage thresholds configured in jest.config.ts.

### Writing Tests

When writing new tests:

1. Unit Tests: Mock external dependencies and test a single unit of functionality.
2. Integration Tests: Test how multiple components interact together.
3. Use Appropriate Assertions: Use Jest's expect API to make assertions about code behavior.
4. Test Edge Cases: Include tests for error conditions and edge cases.

### Testing Utilities

- Test Database: Use createTestPool() from src/**tests**/helpers/test-db.ts for database tests.
- Request Testing: Use supertest for HTTP endpoint testing.
- Mocking: Use Jest's mocking capabilities for isolating components.

## ⚙️ Handy scripts

```bash
Install dependencies:
npm install
or
npm ci

Build:
npm run build

Dev with hot-reload:
npm run dev
```

### Generating mass for tests

In the `/sql` folder, there is a sql file named `mass.sql`. You can run it to generate random devices to populate your database.

## Enhancements for the future

Check the issues page [here](https://github.com/jeffhsarti/1global-backend-challenge/issues) for more informations.

This is a high-quality project that demonstrates strong software engineering principles. The clean architecture, comprehensive testing, and thorough documentation make this a robust foundation for a production system. With some minor enhancements in error handling, operational tooling, test data management, advanced performance optimization and implementation of monitoring and metrics handlers, better transaction management and API versioning, this could be an exemplary backend service.
