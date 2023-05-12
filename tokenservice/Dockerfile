# Use a Node.js base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install bcrypt separately to avoid compatibility issues
RUN npm install bcrypt

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your token service is listening
EXPOSE 3001

RUN npm run build

# Start the token service
CMD [ "npm", "run", "start" ]
