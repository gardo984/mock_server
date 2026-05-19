# Mock App

## Frontend

Run the following command:
```sh
serve -p 8080 static/
```

## Backend

> #### Important
> Recommended version `fastify-cli@5.8.0`.

- To generate a new project:
```sh
npm install fastify-cli@5.8.0
./node_modules/.bin/fastify generates server
cd server
npm install
```

- To install app dependencies and run it:
```sh
cd server
npm install
npm run dev
```

## Helpers

- To create a directory:
```sh
node -e "require('node:fs').mkdirSync('static')"
```
- To remove a directory:
```sh
node -e "fs.unlinkSync('server.js')"
```