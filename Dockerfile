FROM node:20.19.6-alpine as builder

RUN apk add --no-cache openssl

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./
COPY yarn.lock ./

# Copy prisma schema
COPY prisma ./prisma

RUN yarn

COPY . .

RUN yarn build

FROM node:20.19.6-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist


# Copy prisma directory
COPY --from=builder /app/prisma ./prisma


EXPOSE 3334

CMD [ "yarn", "start:migrate:seed:prod"]