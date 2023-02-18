FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY run.sh package.json tsconfig.json ./
RUN pnpm install --offline

EXPOSE 3000 5555
CMD [ "/app/run.sh" ]
