# Arogya Mithra

**Arogya Mithra** is a health-care web application refactored into a microservice architecture. It enables patient registration, health record storage, appointment booking, and notification delivery. This repo is a monorepo that contains multiple microservices for local development and CI/CD.

---

## Live demo
_(Optional — add a deployed URL here if you host a demo)_

---

## Key features
- Patient registration & authentication
- Persistent health records (vitals, diagnoses)
- Appointment scheduling with availability checks
- Email/SMS/push notifications for appointments and alerts
- Event-driven communication for async workflows

---

## Architecture (summary)
- **API Gateway** — routes requests, handles auth token verification
- **Auth Service** — user signup, login, JWT issuance
- **User Service** — patient profile storage and management
- **Health Service** — stores health records, vitals, medical notes
- **Appointment Service** — manages booking, availability, cancellations
- **Notification Service** — sends emails/SMS and handles templates
- **Infrastructure** — PostgreSQL for each service, RabbitMQ for events, Redis for caching

---

## Tech stack
- Services: FastAPI (Python) — lightweight, async-ready
- Messaging: RabbitMQ (event bus)
- Databases: PostgreSQL per service
- Caching: Redis
- API Gateway: Traefik / Nginx (simple gateway for local)
- Containerization: Docker, docker-compose (local); Kubernetes for production
- CI/CD: GitHub Actions (build & push Docker images)
- Observability: Prometheus / Grafana + centralized logging (ELK or Loki)
- Authentication: JWT (OAuth2-compatible flow)

---

## Repo layout (monorepo)