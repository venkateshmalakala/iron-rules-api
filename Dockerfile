FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Copy prisma folder FIRST so npm install (postinstall) can find the schema
COPY prisma ./prisma/ 
RUN npm install
COPY . .
ENV DATABASE_URL="postgresql://user:password@db:5432/fitness?schema=public"
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]