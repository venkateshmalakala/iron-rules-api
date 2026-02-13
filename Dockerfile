FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# CRITICAL: Generate the Prisma Client before building
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]