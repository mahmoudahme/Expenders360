# Project Management System

A comprehensive NestJS application with MySQL and MongoDB for project-vendor matching system.

## Features

- **JWT Authentication** with role-based access control (client/admin)
- **Dual Database Architecture**: MySQL for relational data, MongoDB for documents
- **Project-Vendor Matching** with intelligent scoring algorithm
- **Document Management** with full-text search capabilities
- **Analytics Dashboard** with cross-database queries
- **Email Notifications** for new matches and SLA warnings
- **Scheduled Jobs** for daily match refresh and SLA monitoring
- **RESTful API** with Swagger documentation
- **Dockerized Deployment** ready

## Tech Stack

- **Backend**: NestJS (TypeScript)
- **Databases**: MySQL 8.0, MongoDB 7
- **Authentication**: JWT with Passport
- **ORM**: TypeORM (MySQL), Mongoose (MongoDB)
- **Queue**: Bull with Redis
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## Project Structure

```
src/
├── auth/                 # JWT authentication & guards
├── clients/             # Client management
├── projects/            # Project CRUD operations
├── vendors/             # Vendor management
├── matches/             # Project-vendor matching logic
├── documents/           # MongoDB document storage
├── analytics/           # Cross-database analytics
├── notifications/       # Email notifications & scheduling
└── main.ts             # Application entry point
```

## Installation

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0
- MongoDB 7
- Redis 7

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd project-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start services with Docker**
```bash
docker-compose up -d mysql mongodb redis
```

5. **Run the application**
```bash
npm run start:dev
```

### Docker Deployment

1. **Build and run all services**
```bash
docker-compose up --build
```

2. **Access the application**
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs

## Database Schema

### MySQL Tables

#### clients
- id (PK)
- company_name
- contact_email (unique)
- password
- role (client/admin)
- created_at, updated_at

#### projects
- id (PK)
- client_id (FK)
- country
- services_needed (JSON array)
- budget (decimal)
- status
- created_at, updated_at

#### vendors
- id (PK)
- name
- countries_supported (JSON array)
- services_offered (JSON array)
- rating (decimal 0-5)
- response_sla_hours
- last_response_at
- created_at, updated_at

#### matches
- id (PK)
- project_id (FK)
- vendor_id (FK)
- score (calculated match score)
- created_at, updated_at
- Unique index on (project_id, vendor_id)

### MongoDB Collections

#### documents
- title
- content
- tags (array)
- projectId (reference to MySQL projects.id)
- fileName, fileSize, mimeType
- timestamps

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Projects
- `GET /projects` - List projects (filtered by user role)
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/:id/matches/rebuild` - Rebuild vendor matches

### Vendors (Admin only)
- `GET /vendors` - List all vendors
- `POST /vendors` - Create new vendor
- `GET /vendors/:id` - Get vendor details
- `PATCH /vendors/:id` - Update vendor
- `DELETE /vendors/:id` - Delete vendor

### Documents
- `GET /documents` - List documents (with project filter)
- `POST /documents` - Upload new document
- `GET /documents/search` - Search documents by query/tags
- `GET /documents/:id` - Get document details
- `PATCH /documents/:id` - Update document
- `DELETE /documents/:id` - Delete document

### Analytics
- `GET /analytics/top-vendors` - Cross-database analytics

### Matches
- `GET /matches/project/:projectId` - Get matches for project

## Matching Algorithm

The vendor matching system uses the following scoring formula:

```
Score = (Services Overlap × 2) + Vendor Rating + SLA Weight

Where:
- Services Overlap: Number of matching services between project needs and vendor offerings
- Vendor Rating: 0-5 rating score
- SLA Weight: 
  - ≤12 hours: +2 points
  - ≤24 hours: +1 point  
  - ≤48 hours: +0.5 points
  - >48 hours: 0 points
```

Matching Criteria:
1. Vendor must support the project's target country
2. At least one service overlap required
3. Results ordered by score (descending)

## Scheduled Jobs

### Daily Match Refresh (2:00 AM)
- Refreshes matches for all active projects
- Sends notifications for new high-scoring matches

### SLA Monitoring (3:00 AM)
- Identifies vendors with expired response SLAs
- Sends warning emails to administrators

## Email Notifications

### New Match Notifications
Sent when new vendor matches are created with:
- Project details
- Vendor information
- Match score
- Call-to-action link

### SLA Warning Notifications
Sent to administrators when vendors exceed response SLAs:
- Vendor details
- SLA threshold
- Last response time

## Environment Variables

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_NAME=project_management

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/project_management_docs

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
PORT=3000
NODE_ENV=development
```

## Deployment Options

### Free Cloud Providers

1. **Railway**
   - Connect GitHub repository
   - Add MySQL and MongoDB services
   - Set environment variables
   - Deploy automatically

2. **Render**
   - Web service for the API
   - PostgreSQL database (adapt TypeORM config)
   - Redis instance
   - MongoDB Atlas for documents

3. **AWS Free Tier**
   - EC2 t2.micro instance
   - RDS MySQL (free tier)
   - DocumentDB or MongoDB Atlas
   - ElastiCache Redis (free tier)

### Production Considerations

1. **Security**
   - Use strong JWT secrets
   - Enable HTTPS/TLS
   - Set up proper CORS policies
   - Implement rate limiting

2. **Performance**
   - Database indexing
   - Connection pooling
   - Caching strategies
   - Image optimization

3. **Monitoring**
   - Application logs
   - Database performance
   - Queue monitoring
   - Email delivery tracking

## API Documentation

Visit `/api/docs` when the application is running to access the interactive Swagger documentation.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```
