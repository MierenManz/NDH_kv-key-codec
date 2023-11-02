
import { pack } from './kvKeyCodec.js'
const $ = (id) => document.getElementById(id)
const kvKeyInput = $("keyinput")
const encodeButton = $("encodebtn")
const resultElement = $("result")

kvKeyInput.textContent = '["app", "users", 1]'
kvKeyInput.addEventListener("input", (e) => {
   console.info(e)
}) 

encodeButton.onclick = () => {
   resultElement.textContent =''
   const key = parseKeyInput()
   const encoded = pack(key)
   resultElement.textContent += `
Encodes to: ${encoded}`
}

function parseKeyInput() {
   const val = JSON.parse(kvKeyInput.value)
   console.info(val)
   resultElement.textContent += `
[${val}]`
   return (Array.isArray(val))
   ? val
   : []
}