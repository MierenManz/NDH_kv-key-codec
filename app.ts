// deno-lint-ignore-file

import { pack, unpack } from './src/mod.ts'
import * as TestKey from './testKeySet.ts'

/** set this to the test key to be tested */
const testKey = TestKey.TrueBigInt

// then,    deno run app.ts
// we'll encode, then decode this test key
const packed = pack(testKey.key) 
const unpacked = unpack(packed)

// we'll next report the test results
console.log (`packaging ${testKey.name} - [${testKey.key}]
returned - [${packed}]
expected = ${testKey.expect}
unpacked to: [${unpacked}]
`);