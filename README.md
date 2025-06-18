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

### 1. Build & Run with Docker

```bash
docker-compose up --build
```

### 2. Accessing the API

Health check: http://localhost:3000/health

## ⚙️ Handy scripts

Install dependencies:

```bash
npm install
```

or

```bash
npm ci
```

Build:

```bash
npm run build
```

Dev with hot-reload:

```bash
npm run dev
```
