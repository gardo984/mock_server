
'use strict'

const data = [
	{ id: 'A1', name: 'Vacuum Cleaner', rrp: '99.99', info: 'The worst vacuum in the world.' },
	{ id: 'A2', name: 'Leaf Blower', rrp: '303.33', info: 'This product will blow your socks off.' }
]

module.exports = async function (fastify, opts) {
	fastify.get('/', async function (request, reply) {
		return data
	})
	fastify.post('/', async function( request, reply) {
		const urlPath = request.url
		const category = urlPath.slice(-1) == '/' ? urlPath.slice(1, -1) : urlPath.slice(1)
		request.mockDataInsert(category, data)
		return data
	})
}