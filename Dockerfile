# Stage 1: Build
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine AS runner

# Install serve to serve the static files
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "3000"]
