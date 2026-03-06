FROM node:22-alpine AS base
ARG NPM_REGISTRY=https://registry.npmmirror.com/
ENV npm_config_registry=$NPM_REGISTRY
ENV npm_config_fetch_retries=5 \
    npm_config_fetch_retry_maxtimeout=120000 \
    npm_config_fetch_timeout=120000
WORKDIR /repo

RUN apk add --no-cache ca-certificates

FROM base AS pruner
RUN npm i -g turbo@2.5.6
COPY . .
RUN turbo prune --scope=@eventsapp/crm-ui --docker

FROM base AS installer
COPY --from=pruner /repo/out/json/ .
COPY --from=pruner /repo/out/package-lock.json ./package-lock.json
RUN rm -f package-lock.json && npm install --no-audit --no-fund --package-lock=false
COPY --from=pruner /repo/out/full/ .
RUN npx turbo run build --filter=@eventsapp/crm-ui...

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=installer /repo/apps/crm-ui/next.config.ts ./apps/crm-ui/next.config.ts
COPY --from=installer /repo/apps/crm-ui/public ./apps/crm-ui/public
COPY --from=installer /repo/apps/crm-ui/.next/static ./apps/crm-ui/.next/static
COPY --from=installer /repo/apps/crm-ui/.next/standalone ./

EXPOSE 3001
CMD ["node", "apps/crm-ui/server.js"]

