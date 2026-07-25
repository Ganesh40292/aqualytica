# Aqualytica - Backend Services Gateway

This directory houses the backend microservices that drive **Aqualytica – AI-Powered Water Quality Intelligence Platform**.

---

## Backend Services

### 1. Spring Boot REST API (`/springboot-api`)
- **Language**: Java / Spring Boot 3
- **Database Connection**: MySQL JPA / Hibernate ORM
- **Responsibility**: Exposes CRUD endpoints to query sensor telemetry records, log diagnostic checkpoints, save ML prediction logs, and manage user profile tables.
- **Port**: `8080`

### 2. Python ML API Gateway (`/python-ml-api`)
- **Language**: Python 3 / Flask
- **Predictive Engine**: Scikit-learn (Random Forest Model)
- **Responsibility**: Exposes `POST /predict` API to run input parameters through feature scaling pipelines and output class predictions with confidence percentages.
- **Port**: `5000`
