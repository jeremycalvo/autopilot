FROM node:19.2

WORKDIR /server

COPY package.json .
RUN npm i

COPY . .

COPY images images

EXPOSE 8080

CMD ["npm", "start"]
ENV NODE_OPTIONS="--max-old-space-size=2048"