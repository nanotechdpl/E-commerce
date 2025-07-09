FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache openssl python3 make g++

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3007

# Start the application with migration
CMD ["sh", "-c", "sleep 5 && npx prisma migrate deploy && npm start"]
