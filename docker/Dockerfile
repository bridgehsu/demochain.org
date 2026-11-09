# ---- build ----
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG NEXT_PUBLIC_CF_BEACON_TOKEN=
ENV NEXT_PUBLIC_CF_BEACON_TOKEN=$NEXT_PUBLIC_CF_BEACON_TOKEN

RUN pnpm build

# ---- runtime ----
FROM nginx:1.27-alpine

COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
