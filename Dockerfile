# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /regenmedtest

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire app to the working directory
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
