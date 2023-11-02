
import { pack } from './kvKeyCodec.js'
const $ = (id) => document.getElementById(id)
const keyInput = $("inp")
const btn = $("btn")
const pre = $("pre")

keyInput.textContent = '["user", 1]'
keyInput.addEventListener("input", (e) => {
   console.info(e)
}) 

btn.onclick = () => {
   const key = parseInput()
   const encoded = pack(key)
   pre.textContent += `
Encoded = ${encoded}`
}

function parseInput() {
   const val = JSON.parse(keyInput.value)
   console.info(val)
   pre.textContent += `
${val} type ${typeof val }`
   return (Array.isArray(val))
   ? val
   : []
}