# Use Node.js as the base image
FROM node:20-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight server for serving the static files
FROM node:20-slim

WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies (for serving if needed, though we'll use a static server)
RUN npm install --only=production
RUN npm install -g serve

# Expose the port (3000 as per AI Studio constraints and standard)
EXPOSE 3000

# Start the application using 'serve'
CMD ["serve", "-s", "dist", "-l", "3000"]
