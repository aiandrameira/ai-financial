FROM node:22 AS deps
WORKDIR /workspace
ARG NPM_AUTH_TOKEN
ENV NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN
COPY package.json package-lock.json .npmrc ./
RUN npm install

FROM deps AS build
COPY . .
RUN npx nx run web:build:production

FROM nginx:1.27-alpine AS runner
COPY --from=build /workspace/dist/apps/web/browser /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
