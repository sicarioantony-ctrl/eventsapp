FROM node:22-alpine AS base
ARG NPM_REGISTRY=https://registry.npmjs.org/
ENV npm_config_registry=$NPM_REGISTRY
ENV npm_config_fetch_retries=5 \
    npm_config_fetch_retry_maxtimeout=120000 \
    npm_config_fetch_timeout=120000
WORKDIR /repo

RUN apk add --no-cache ca-certificates

FROM base AS pruner
RUN npm i -g turbo@2.5.6
COPY . .
RUN turbo prune --scope=@eventsapp/api --docker

FROM base AS installer
COPY --from=pruner /repo/out/json/ .
COPY --from=pruner /repo/out/package-lock.json ./package-lock.json
RUN rm -f package-lock.json && npm install --no-audit --no-fund --package-lock=false
COPY --from=pruner /repo/out/full/ .
COPY tsconfig.base.json ./tsconfig.base.json
RUN npx turbo run build --filter=@eventsapp/api...

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /repo/node_modules ./node_modules
COPY --from=installer /repo/apps/api/dist ./dist

EXPOSE 3002
ENV PORT=3002
CMD ["node", "dist/main.js"]

