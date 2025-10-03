# Use the official Node.js image as the base image
FROM node:22-alpine

ARG DOTENV_KEY
ENV DOTENV_PRIVATE_KEY ${DOTENV_KEY}
# Above naming is needed for dotenvx to take in the environment variable to decrypt the .env file

# Set the working directory
WORKDIR /usr/responsy

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# remove development dependencies
RUN npm prune --omit=dev


# Copy the rest of the application code
COPY . .

# Command to run the app
CMD ["npx", "dotenvx", "run", "--", "node", "app.js"]