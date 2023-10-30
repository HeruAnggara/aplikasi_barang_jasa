# Use the official Node.js image as the base image.
FROM node:18

# Set the working directory in the container.
WORKDIR /aplikasi-barang-jasa

# Copy package.json and package-lock.json to the container's working directory.
COPY package.json ./ 

# Install npm
RUN npm install -g npm@9.6.4

# Install your project dependencies.
RUN npm install

# Remove any existing 'bcrypt' package (if any).
RUN npm uninstall bcrypt

# Install the 'bcrypt' package.
RUN npm install bcrypt

# Copy the rest of your application code to the container.
COPY . .

# Generate Prisma client.
RUN npx prisma generate

# Build your Node.js application.
RUN npm run build

# Define the command to start your application (modify this based on your project setup).
CMD ["npm", "run", "start:prod"]