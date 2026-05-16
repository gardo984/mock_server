
const API = "http://localhost:3000"

const populateProducts = async (category) => {
  const products = document.querySelector('#products')
  products.innerHTML = ''
  const res = await fetch(`${API}/${category}`)
  const data = await res.json()
  for (const product of data) {
    const item = document.createElement('product-item')
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
category.addEventListener("change", async ({ target }) => {
  console.log("target: ", target.value)
  await populateProducts(target.value)
})

customElements.define('product-item', class Item extends HTMLElement {
  constructor() {
    super()
    const itemTmpl = document.querySelector('#item').content
    this.attachShadow({ mode: 'open' }).appendChild(itemTmpl.cloneNode(true))
  }
})