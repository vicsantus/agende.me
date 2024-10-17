FROM node:16.14-alpine
WORKDIR /api
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 9393
ENTRYPOINT [ "npm", "run" ]
CMD [ "dev" ]