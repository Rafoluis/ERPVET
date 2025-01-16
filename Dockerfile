# Use Node.js as the base image
FROM node:22.12.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies, including devDependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Database
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable to development
ENV NODE_ENV=development

# Start the application in development mode
CMD ["npm", "run", "dev"]
