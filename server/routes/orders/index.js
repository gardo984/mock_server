
'use strict'

module.exports = async function (fastify, opts) {
	fastify.get('/', {
		websocket: true, 
		exposeHeadRoute: false,
	}, (connection, req) => {
		const socket = connection.socket || connection;
		socket.send(JSON.stringify({ id: 'A1', total: 3 }))
	})
}