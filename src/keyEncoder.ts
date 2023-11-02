
import { KeyPart } from './types.ts'
import { encodeBigInt, isBigInt } from './bigIntCodec.ts'
import { encodeDouble } from './doubleCodec.ts'
import { Accumulator }  from './mod.ts'


import {
   BYTES,
   DOUBLE,
   FALSE,
   TRUE,
   NULL,
   STRING,
} from './types.ts'


//===========================================
//  Encode a multipart key to a byte array 
//===========================================

/** 
 * Internal method. Please use pack() below 
 */
const encodeKey = (accumulator: Accumulator, item: KeyPart) => {

   if (item === undefined) throw new TypeError('Packed element cannot be undefined')
   else if (item === null) accumulator.appendByte(NULL)
   else if (item === false) accumulator.appendByte(FALSE)
   else if (item === true) accumulator.appendByte(TRUE)
   else if (item.constructor === Uint8Array || typeof item === 'string') {

      let itemBuf 
      if (typeof item === 'string') {
         itemBuf = new TextEncoder().encode(item)
         accumulator.appendByte(STRING)
      }
      else {
         itemBuf = item
         accumulator.appendByte(BYTES)
      }
      
      for (let i = 0; i < itemBuf.length; i++) {
         const val = itemBuf[i]
         accumulator.appendByte(val)
         if (val === 0)
            accumulator.appendByte(0xff)
      }
      accumulator.appendByte(0)
   
   } else if (Array.isArray(item)) {
      // Embedded child tuple.
      throw new Error('Nested Tuples are not supported!')

   } else if (typeof item === 'number') {
      // Encode as a double precision float.
      accumulator.appendByte(DOUBLE)
      accumulator.appendBuffer(encodeDouble(item))

   } else if (isBigInt(item)) {
      // Encode as a BigInt
      encodeBigInt(accumulator, item as bigint)
   } else {
      throw new TypeError('Packed items must be an array!')
   }
}

function packRawKey(part: KeyPart[]): Uint8Array {

   if (part === undefined
      || Array.isArray(part)
      && part.length === 0) return new Uint8Array(0)

   if (!Array.isArray(part)) {
      throw new TypeError('pack must be called with an array')
   }

   const accumulator = new Accumulator()

   for (let i = 0; i < part.length; i++) {
      encodeKey(accumulator, part[i])
   }

   // finally we extract and return our trimmed buffer
   return accumulator.extract()
}

/**
 * Encode the specified item or array of items into a buffer.
 * pack() and unpack() are the main entry points
 * `pack(x)` is equivalent to `pack([x])` if x is not itself an array. 
 * Packing single items this way is also slightly more efficient.
 */
export function pack(parts: KeyPart[]): Uint8Array {
   const packedKey = packRawKey(parts)
   return packedKey
}
