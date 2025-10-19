# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/alzplat

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# remove development dependencies
RUN npm prune --omit=dev


# Copy the rest of the application code
COPY . .

# Command to run the app
CMD ["node", "app.js"]