FROM node:18-alpine3.16 as build

RUN apk update && apk upgrade

RUN npm config set cache /tmp --global

RUN mkdir -p /usr/src/app && chown 1000:1000 -R /usr/src/app

WORKDIR /usr/src/app

COPY .yarn/ ./.yarn
COPY package.json yarn.lock .npmrc .yarnrc ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=5120"
ENV CI=false
ENV DISABLE_ESLINT_PLUGIN=true

RUN npm run build:no-stats

###
# Runtime
##
FROM macbre/nginx-http3:latest as run

# Move to app dir
WORKDIR /usr/share/nginx/html

# Copy the modules from the build step
COPY --from=build /usr/src/app/build .
COPY --from=build /usr/src/app/nginx/default.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK  --interval=1m --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

EXPOSE 80
