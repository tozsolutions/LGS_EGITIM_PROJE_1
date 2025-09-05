FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
 || (echo "Falling back to full install" && npm install --omit=dev --no-audit --no-fund)

# Copy source
COPY tsconfig*.json ./
COPY src ./src

# Build server
RUN npm run build:server

# Expose port
EXPOSE 3000

# Run the server
ENV NODE_ENV=production
CMD ["node", "dist/server/index.js"]

