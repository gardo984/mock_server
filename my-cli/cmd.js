#!/usr/bin/env node

import got from 'got'
import minimist from 'minimist'
import commist from 'commist'

const API = 'http://localhost:3000'
const categories = ['confectionery', 'electronics']

const usage = (msg = 'Back office for my app') => {
	console.log(`\n${msg}\n`)
	console.log('add:')
	console.log(' order: my-cli add order <id> --amount=<int> --api=<string>')
	console.log('	my-cli <id> add order -n=<int> --api=<string>\n')
	console.log('list:')
	console.log(' cats: my-cli list cats')
	console.log(' ids: my-cli list ids --cat=<string> --api=<string>')
	console.log(' ids: my-cli list ids --c=<string> --api=<string>')
}

const noMatches = commist()
	.register('add order', addOrder)
	.register('list cats', listCats)
	/*.register('list ids', listIds)*/
	.parse(process.argv.slice(2))

if (noMatches) {
	usage()
	process.exit(1)
}

async function addOrder(argv) {
	const args = minimist(argv, {
		alias: {amount: ['n',]},
		string: ["api"],
		default: {
			api: API,
		},
	})
	if (args._.length < 1) {
		usage()
		process.exit(1)
	}

	console.log('args and kwargs:', args)

	const [id] = args._
	const {amount, api} = args
	if (!Number.isInteger(amount)) {
		usage('Error: --amount flag is required and must be an integer')
		process.exit(1)
	}

	try {
		await got.post(`${api}/orders/${id}`, {
			json: { amount }
		})
	} catch (err) {
		console.log(err.message)
		process.exit(1)
	}
}

async function listCats() {
	console.log('\ncategories:\n')
	for (const cat of categories) {
		console.log(cat)
	}
}