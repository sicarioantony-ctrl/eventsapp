FROM node:22-alpine AS base
WORKDIR /repo

FROM base AS pruner
RUN npm i -g turbo@2.5.6
COPY . .
RUN turbo prune --scope=@eventsapp/api --docker

FROM base AS installer
COPY --from=pruner /repo/out/json/ .
COPY --from=pruner /repo/out/package-lock.json ./package-lock.json
RUN npm ci --no-audit --no-fund
COPY --from=pruner /repo/out/full/ .
RUN npx turbo run build --filter=@eventsapp/api...

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /repo/node_modules ./node_modules
COPY --from=installer /repo/apps/api/dist ./dist

EXPOSE 3002
ENV PORT=3002
CMD ["node", "dist/main.js"]

