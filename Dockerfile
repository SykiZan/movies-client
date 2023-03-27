FROM node:18-alpine 



WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn install

COPY . .

ENV REACT_APP_API_URL http://localhost:8000/api/v1

EXPOSE 3000

CMD [ "yarn", "start" ]