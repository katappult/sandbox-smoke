
Application stack: ReactJS + FLutter + JAVA + SPRINGBOOT
=============================================================

* Java 21
* Docker
* Maven
* PostgresSQL 16
* FLutter
* H2 2.2.200
* ReactJS
* NextJS
* SpringBoot 3.3.x

# Backend

To build the project, run the below command. It will initialize a local H2 database,
populate the data and build the application.

```bash
# Build + initialize local H2 database (first run or clean schema)
mvn clean install -PdropDb,updateDb -DskipTests
```

```bash
# Build and update DB without dropping (preserve data)
mvn install -PdupdateDb -DskipTests
```

```bash
# Run the backend
mvn spring-boot:run
```

```bash
# Run all integration tests
mvn clean verify

# Run a single integration test class
mvn clean verify -Dit.test=CarRentalGeneratedServiceFacadeIT

# Run a single test method
mvn clean verify -Dit.test=CarRentalGeneratedServiceFacadeIT#createCarRental
```

Access the application back office admin at http://localhost:8080

# Frontend NextJS

Install dependencies:

```bash
cd frontend
npm install
```

Run the frontend in development mode:

```bash
cd frontend
npm run dev
```

Access the application front office at http://localhost:3000

# Build

Build the frontend for production:

```
npm run build
```

# Stockage des médias

Positionner la propriété suivante dans `application.properties` :

```properties
katappult.illustrations.root.folder=file:/path/to/local/folder
```


Positionner le nom du bucket dans `application.properties` :

```properties
katappult.gcs.media-library.bucket=nom-du-bucket
```

Fournir également le chemin vers le fichier de compte de service GCP :

```properties
katappult.gcs.media-library.service-account-path=/path/to/service.json
```

# Healthcheck

L'endpoint de healthcheck est exposé via Spring Boot Actuator :

```
GET http://localhost:8080/actuator/health
```

Retourne l'état de l'application (base de données, espace disque, etc.) :

```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "diskSpace": { "status": "UP" },
    "ping": { "status": "UP" }
  }
}
```

> **Note** : L'endpoint `/actuator/health` est autorisé sans authentification via le `SecurityFilterChain` configuré dans `katappult-core`.

# Métriques & Observabilité


Les métriques sont exposées via Spring Boot Actuator au format Prometheus :

```
GET http://localhost:8080/actuator/prometheus
```

Métriques exposées automatiquement (sans code métier) :

| Métrique | Description |
|---|---|
| `http_server_requests_seconds` | Latence et volume par endpoint HTTP |
| `jvm_memory_used_bytes` | Mémoire JVM (heap / non-heap) |
| `jvm_threads_live_threads` | Threads actifs |
| `hikaricp_connections_active` | Connexions base de données actives |
| `tomcat_threads_busy_threads` | Threads Tomcat en cours d'utilisation |
| `process_cpu_usage` | CPU consommé par le process |
| `logback_events_total` | Nombre de logs par niveau (ERROR, WARN, INFO...) |


Configurer Prometheus pour scraper l'endpoint toutes les 15 secondes :

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['backend:8080']
    scrape_interval: 15s
```


```yaml
# alert_rules.yml
groups:
  - name: backend
    rules:
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Taux d'erreurs 5xx élevé sur {{ $labels.uri }}"

      - alert: DatabaseConnectionsHigh
        expr: hikaricp_connections_active / hikaricp_connections_max > 0.8
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Pool de connexions DB saturé à plus de 80%"

      - alert: HighMemoryUsage
        expr: jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} > 0.85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Heap JVM utilisée à plus de 85%"
```

Les alertes sont envoyées via **Alertmanager** (Slack, email, PagerDuty, etc.).

> **Note** : L'endpoint `/actuator/prometheus` est public par défaut. En production, le protéger derrière un réseau interne ou ajouter une authentification.

# Feedback

Contact: support@katappult.cloud
