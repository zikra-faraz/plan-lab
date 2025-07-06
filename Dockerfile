# 1. Use Node.js Alpine (lightweight)
FROM node:18-alpine

# 2. Set working directory
# container k andar folder banana
WORKDIR /app

COPY . .

RUN npm install

# 6. Prisma generate (for types and client)
RUN npx prisma generate

# 7. Build the Next.js app
RUN npm run build

# 8. Expose port 3000 (Next.js default)
EXPOSE 3000

# 9. Start the Next.js app (production mode)
CMD ["npm", "start"]