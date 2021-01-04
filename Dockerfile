FROM node:12-alpine

WORKDIR /mafia-moderator

COPY ["package.json", "package-lock.json", "./"]
RUN npm install 

COPY . .

CMD ["node", "src/index.js"]
