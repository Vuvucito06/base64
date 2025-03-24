# Use Node.js 18 Alpine as the base image for a lightweight container
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to install dependencies
COPY package.json package-lock.json ./

# Install project dependencies using PNPM
RUN npm install

# Set the environment to production for optimized builds
ENV NODE_ENV=production

# Copy the rest of the project files into the container
COPY . .

# Build the Next.js application using PNPM
RUN npm run build

# Install PM2 globally using PNPM to manage the application process
RUN npm install -g pm2

# Expose port 3000, the default for Next.js
EXPOSE 3000

# Start the application using PM2 and PNPM
CMD ["pm2-runtime", "pnpm", "--", "start"]