# Install dependencies only when needed
FROM node:lts-alpine AS dependencies

WORKDIR /app
COPY package*.json ./
RUN yarn install --non-interactive --frozen-lockfile

# Rebuild the source code only when needed
FROM node:lts-alpine AS build

ARG PUBLIC_URL=http://localhost:3000
ENV NODE_ENV production
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:lts-alpine

ARG BUILD_ID=local
ARG BUILD_NUMBER=local
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json

RUN echo "NEXT_PUBLIC_BUILD_ID=$BUILD_ID" > ./.env.local \
  && echo "NEXT_PUBLIC_BUILD_NUMBER=$BUILD_NUMBER" >> ./.env.local \
  && chown nextjs:nodejs ./.env.local

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
CMD ["node", "server.js"]