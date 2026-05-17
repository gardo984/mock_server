'use strict'


const data = [
	{
		id: 'B1',
		name: 'Chocolate Bar',
		rrp: '22.40',
		info: 'Delicious overpriced chocolate.'
	}
]

module.exports = async function (fastify, opts) {
	fastify.get("/", async function (request, reply) {
		return data
	})

	fastify.post("/", async function (request, reply) {
		const urlPath = request.url
		const category = urlPath.slice(-1) == '/' ? urlPath.slice(1, -1) : urlPath.slice(1)
		request.mockDataInsert(category, data)
		return data
	})
}