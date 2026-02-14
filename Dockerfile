FROM node:22-alpine

# Install postgresql-client so the 'psql' command is available for seeding
RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./
# Copy prisma folder FIRST so npm install (postinstall) can find the schema
COPY prisma ./prisma/ 

RUN npm install

COPY . .

# The DATABASE_URL is typically provided by docker-compose, but this ensures a fallback
ENV DATABASE_URL="postgresql://user:password@db:5432/fitness?schema=public"

RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]