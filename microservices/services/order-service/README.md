# Order Service Backend

## Overview
This service manages orders, users, payments, communications, file uploads, and service-specific order types (e.g., technical orders) for a multi-service order management platform.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your values.

3. **Run the service:**
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login and get JWT
- `POST /api/orders/` — Create an order (authenticated)
- `GET /api/orders/` — List all orders (authenticated)
- `PATCH /api/orders/:id/status` — Update order status (authenticated)
- `POST /api/payments/` — Create a payment (authenticated)
- `POST /api/communications/` — Add a message (authenticated)
- `POST /api/files/` — Upload a file (authenticated, 1MB limit)
- `POST /api/technical-orders/` — Create a technical order (authenticated)

## Database
- PostgreSQL is required. See `src/config/database.js` for schema setup.

## Extending
- Add new service-specific order types by creating new models, controllers, and routes.
- Use the provided structure for rapid extension. 

## PayPal Integration

Add these to your `.env`:

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
NODE_ENV=development

- The service uses PayPal for order, agency, and security deposit payments.
- See `src/config/paypal.js` for configuration. 