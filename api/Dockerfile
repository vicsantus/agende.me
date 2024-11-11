FROM node:16.14-alpine
WORKDIR /api
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 9393

RUN apk add --no-cache tzdata

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# RUN npm run migrate
# RUN ping database:3306
ENTRYPOINT [ "npm", "run" ]
CMD [ "dev" ]