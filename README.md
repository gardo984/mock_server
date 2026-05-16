# Notes

- To create a directory:
```sh
node -e "require('node:fs').mkdirSync('static')"
```
- To remove a directory:
```sh
node -e "fs.unlinkSync('server.js')"
```

## Fastify

- Recommended version `fastify-cli@5.8.0`:
```sh
npm install fastify-cli@5.8.0
./node_modules/.bin/fastify generates mock-srv
cd mock-srv
npm install
npm install @fastify/cors@8.5.0 --save
```
- Finally:
```sh
npm run start
```