FROM node:18.18.0-alpine as builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma

RUN yarn

COPY . .

RUN yarn build

FROM node:18.18.0-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist


# Copy prisma directory
COPY --from=builder /app/prisma ./prisma


EXPOSE 3334

CMD [ "yarn", "start:migrate:seed:prod"]