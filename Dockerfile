FROM --platform=linux/amd64 node:20-alpine AS build

WORKDIR /app

COPY package.json  tsconfig.json ./
RUN yarn install --frozen-lockfile

COPY src ./src

RUN yarn run build

FROM node:20-alpine as prod

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist

RUN yarn install --frozen-lockfile --production

CMD [ "node", "dist/index.js" ]
