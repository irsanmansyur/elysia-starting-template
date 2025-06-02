# Elysia Starting Template

A modern, high-performance API gateway built with Elysia.js, TypeScript, and Bun runtime. Features PostgreSQL integration with Drizzle ORM, Redis caching, comprehensive logging system, and Docker deployment.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Framework**: [Elysia.js](https://elysiajs.com/) - Fast and friendly Bun web framework
- **Database**: [PostgreSQL](https://postgresql.org/) - Robust relational database
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- **Cache**: [Redis](https://redis.io/) - In-memory data structure store
- **Language**: [TypeScript](https://typescriptlang.org/) - Type-safe JavaScript
- **Containerization**: [Docker](https://docker.com/) - Application containerization

## 📋 Prerequisites

- [Bun](https://bun.sh/) >= 1.2.15
- [PostgreSQL](https://postgresql.org/) >= 12
- [Redis](https://redis.io/) >= 6
- [Docker](https://docker.com/) (optional, for containerized deployment)

## 🛠 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd elysia-starting-template
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# PostgreSQL Configuration
POSTGRES_URL=postgres://username:password@host:port/database

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=10
REDIS_CONNECT_TIMEOUT=5000
```

### Required Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `POSTGRES_URL` | PostgreSQL connection string | - | ✅ |
| `REDIS_HOST` | Redis server host | - | ✅ |
| `REDIS_PORT` | Redis server port | - | ✅ |
| `REDIS_PASSWORD` | Redis authentication password | - | ✅ |
| `REDIS_DB` | Redis database number | 10 | ❌ |
| `REDIS_CONNECT_TIMEOUT` | Redis connection timeout (ms) | 5000 | ❌ |

## 🗄️ Database Setup

1. Ensure PostgreSQL is running and accessible
2. Create a database for the application
3. Run database migrations:
```bash
bun run drizzle-kit generate
bun run drizzle-kit migrate
```

### Database Schema

The application includes a logging system with the following table structure:

- **logs**: Stores application logs with levels, messages, and metadata
  - `id`: Auto-incrementing primary key
  - `timestamp`: Log creation timestamp
  - `level`: Log level (e.g., info, error, debug)
  - `message`: Log message content
  - `metadata`: Additional JSON metadata

## 🏃‍♂️ Development

### Start Development Server

```bash
bun run dev
```

The server will start with hot-reload enabled and be available at `http://localhost:3000`.

### Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server with hot-reload |
| `bun run test` | Run test suite |

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. Copy the example docker-compose file:
```bash
cp docker-compose.example.yml docker-compose.yml
```

2. Update the configuration in `docker-compose.yml` as needed

3. Build and start the services:
```bash
docker-compose up -d --build
```

### Using Docker directly

1. Build the Docker image:
```bash
docker build -t elysia-gateway .
```

2. Run the container:
```bash
docker run -d \
  --name elysia-gateway \
  --env-file .env \
  -p 3000:3000 \
  elysia-gateway
```

## 📁 Project Structure

```
elysia-starting-template/
├── src/
│   ├── database/
│   │   ├── drizle/
│   │   │   └── schema/
│   │   │       └── index.ts      # Database schemas
│   │   └── index.ts              # Database connection & config
│   ├── log/
│   │   └── log.listener.ts       # Logging event handler
│   └── index.ts                  # Application entry point
├── utils/                        # Utility functions
├── drizzle/                      # Database migrations
├── drizzle.config.ts             # Drizzle ORM configuration
├── Dockerfile                    # Docker image configuration
├── docker-compose.example.yml    # Docker Compose example
└── package.json                  # Project dependencies
```

## 🔧 Features

### Database Integration
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **Connection pooling** and health checks
- **Automatic reconnection** on connection failures

### Caching
- **Redis integration** for high-performance caching
- **Connection monitoring** with automatic recovery
- **Configurable timeout** and database selection

### Logging System
- **Event-driven logging** with structured metadata
- **Database persistence** for log entries
- **Multiple log levels** support (info, error, debug, etc.)

### Health Monitoring
- **Database ping** every 30 seconds
- **Redis connectivity** monitoring
- **Automatic reconnection** on failures

### API Documentation
- **Swagger integration** for API documentation
- **CORS support** for cross-origin requests

## 🔍 Health Checks

The application includes built-in health monitoring:

- **Database Health**: Pings PostgreSQL every 30 seconds
- **Redis Health**: Monitors Redis connectivity with automatic reconnection
- **Logs**: Health check results are logged to console

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include environment details and error logs

## 🔄 Version

Current version: 1.0.50

---

**Made with ❤️ using Elysia.js and Bun**