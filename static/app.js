
const API = "http://localhost:3000"
const WS_API = "ws://localhost:3000"

const populateProducts = async (category, method = 'GET', payload) => {
  const products = document.querySelector('#products')
  products.innerHTML = ''
  const send = method === 'GET' ? {} : {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }
  const res = await fetch(`${API}/${category}`, { method, ...send })
  const data = await res.json()
  for (const product of data) {
    const item = document.createElement('product-item')
    item.dataset.id = product.id
    for (const key of ['name', 'rrp', 'info']) {
      const span = document.createElement('span')
      span.slot = key
      span.textContent = product[key]
      item.appendChild(span)
    }
    products.appendChild(item)
  }
}

/*document.querySelector('#fetch').addEventListener('click', async () => {
  await populateProducts()
})*/
 

const category = document.getElementById("category")
const registrationForm = document.getElementById("add")

let socket = null

const realTimeOrders = (category) => {
  if (socket) socket.close()
  socket = new WebSocket(`${WS_API}/orders/${category}`)
  socket.addEventListener('message', ({ data }) => {
    try {
      const { id, total } = JSON.parse(data)
      const item = document.querySelector(`[data-id="${id}"]`)
      if (item == null) return
      const span = item.querySelector('[slot="orders"]') || document.createElement('span')
      span.slot = "orders"
      span.textContent = total
      item.appendChild(span)
    } catch (err) {
      console.log(err);
    }
  })
}

category.addEventListener("change", async ({ target }) => {
  console.log("target: ", target.value)
  registrationForm.style.display = 'block'
  await populateProducts(target.value)
})

registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const { target } = e
  const payload = {
    name: target.name.value,
    rrp: target.rrp.value,
    info: target.info.value,
  }
  await populateProducts(category.value, 'POST', payload)
  realTimeOrders(category.value)
  target.reset()
})

customElements.define('product-item', class Item extends HTMLElement {
  constructor() {
    super()
    const itemTmpl = document.querySelector('#item').content
    this.attachShadow({ mode: 'open' }).appendChild(itemTmpl.cloneNode(true))
  }
})