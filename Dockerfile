FROM node:20-alpine

# Stage 1: Install dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build the application
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build
COPY . .

# Build the Next.js application for production
RUN npm run build

# Stage 3: Production server
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
# Expose the application port (assuming your app runs on port 3000)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]