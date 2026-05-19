
'use strict'

module.exports = async function (fastify, opts) {
	
	function monitorIncomingMessages(socket) {
		socket.on('message', (data) => {
			try {
				const decodedData = JSON.parse(data)
				const { cmd, payload } = decodedData
				fastify.log.info('new msg payload: %o', decodedData)
				if (cmd === 'update-category') {
					sendCurrentOrders(payload.category, socket)
				}
			} catch (err) {
				fastify.log.warn(
					'WebSocket message data=%o , error=%s',
					data,
					err.message
				)
			}
		})
	}

	function sendCurrentOrders(category, socket) {
		for (const order of fastify.currentOrders(category)) {
			socket.send(order)
		}
	}

	fastify.get('/', {
		websocket: true, 
		exposeHeadRoute: false,
	}, async (connection, req) => {
		const socket = connection.socket || connection;
		const category = req.query.category
		monitorIncomingMessages(socket)
		sendCurrentOrders(category, socket)
		for await (const order of fastify.realtimeOrders()) {
			if (socket.readyState >= socket.CLOSING) break
			socket.send(order)
		}
	})

	fastify.post('/:id', async (request) => {
		fastify.log.info('url params: %o', request.params)
		fastify.log.info('body payload: %o', request.body)
		const product_id = request.params.id
		fastify.addOrder(product_id, request.body.amount)
		return { ok: true }
	})
}