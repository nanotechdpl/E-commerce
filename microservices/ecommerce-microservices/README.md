# E-commerce Microservices Application

This project is an e-commerce platform built using a microservices architecture. Each service is designed to handle specific functionalities, ensuring scalability, maintainability, and ease of deployment. The application leverages Docker for containerization and Kong for API gateway management.

## Features

- **Cache Service**: Manages caching for optimized performance using Redis.
- **Chat Service**: Provides real-time chat functionality for users.
- **Customer Service**: Handles customer-related operations such as authentication and profile management.
- **File Service**: Manages file storage and retrieval using cloud storage solutions.
- **Order Service**: Handles order processing and product management.
- **Payment Service**: Manages payment processing and integrations.
- **Shared Utilities**: Includes shared middleware and utility functions for logging, validation, and rate limiting.

## Technologies Used

- **Node.js**: Backend development for microservices.
- **Docker**: Containerization for consistent deployment.
- **Kong**: API gateway for routing and security.
- **Redis**: Caching mechanism for performance optimization.
- **Prisma**: ORM for database management in the `order-service-prisma`.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd ecommerce-microservices
   ```

3. Start the services using Docker Compose:
   ```bash
   docker-compose up
   ```

4. Access the application via the API gateway.

## Folder Structure

- `services/`: Contains individual microservices.
- `shared/`: Includes shared middleware and utilities.
- `keys/`: Stores service account keys for cloud integrations.
- `kong/`: Configuration for the Kong API gateway.

## Contribution

Feel free to contribute to this project by submitting issues or pull requests. Ensure that your code follows the project's coding standards and is well-documented.

## License

This project is licensed under the MIT License.