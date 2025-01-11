FROM node:lts AS builder
WORKDIR /app
# Use enable-corepack base image
RUN corepack enable
RUN corepack prepare pnpm@9.12.3 --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm install -g turbo
COPY . .
RUN turbo prune --scope=@lumpick/api --docker

# Use pnpm official image for installer
FROM node:lts AS installer
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@9.12.3 --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=@lumpick/api...

# Use pnpm official image for runner
FROM node:lts-slim AS runner
WORKDIR /app
RUN corepack disable
RUN npm install -g pnpm@9.12.3
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH "

# Copy built application
COPY --from=installer /app .

WORKDIR /app/apps/api

EXPOSE 8080
CMD ["pnpm", "run", "dev"]