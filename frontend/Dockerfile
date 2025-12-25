FROM node:20-alpine

WORKDIR /app

# Build argument for API URL
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy application
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
