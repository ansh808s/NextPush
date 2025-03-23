FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/
COPY desc.d.ts ./ 

RUN npm ci

RUN npx prisma generate

COPY src ./src

RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist

EXPOSE 9000

CMD ["node", "dist/index.js"]