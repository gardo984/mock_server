'use strict'

const { promisify } = require('util')
const { PassThrough } = require('stream')
const fp = require('fastify-plugin')
const { default: fastify } = require('fastify')
/*const timeout = promisify(setTimeout)*/


const orders = {
	A1: { total: 3 },
	A2: { total: 7 },
	B1: { total: 101 },
}
const catToPrefix = {
	electronics: 'A',
	confectionery: 'B',
}

const orderStream = new PassThrough({ objectMode: true })
const calculateID = (idPrefix, data) => {
	const sorted = [...(new Set(data.map(({ id }) => id)))]
	const next = Number(sorted.pop().slice(1)) + 1
	return `${idPrefix}${next}`
}

/*async function* realtimeOrdersSimulator() {
	const ids = Object.keys(orders)
	while (true) {
		const delta = Math.floor(Math.random() * 7) + 1
		const id = ids[Math.floor(Math.random() * ids.length)]
		orders[id].total += delta
		const { total } = orders[id]
		const outcome = { id, total }
		console.log("outcome:", outcome)
		yield JSON.stringify(outcome)
		await timeout(1500)
		// or yield new Promise(resolve => setTimeout(resolve, 1500))
	}
}*/

function* currentOrders(category) {
	const idPrefix = catToPrefix[category]
	if (!idPrefix) return
	const ids = Object.keys(orders).filter((id) => id[0] === idPrefix)
	for (const id of ids) {
		yield JSON.stringify({ id, ...orders[id] })
	}
}

async function* realtimeOrders() {
	for await (const { id, total } of orderStream) {
		yield JSON.stringify({ id, total })
	}
}

async function addOrder(id, amount) {
	if (!orders.hasOwnProperty(id)) {
		const err = new Error(`Order ${id} not found`)
		err.status = 400
		throw err
	}
	if (!Number.isInteger(amount)) {
		const err = new Error('Supplied amount must be an integer')
		err.status = 400
		throw err
	}
	orders[id].total += amount
	const { total } = orders[id]
	orderStream.write({ id, total })
}

module.exports = fp(async function (fastify, opts) {
	fastify.decorate('currentOrders', currentOrders)
	/*fastify.decorate('realtimeOrders', realtimeOrdersSimulator)*/
	fastify.decorate('realtimeOrders', realtimeOrders)
	fastify.decorateRequest('mockDataInsert', function insert(category, data) {
		const request = this
		const idPrefix = catToPrefix[category]
		const id = calculateID(idPrefix, data)
		const payload = { id, ...request.body }
		orders[id] = { total: 0 }
		data.push(payload)
	})
	fastify.decorate('addOrder', addOrder)
})