import { Accumulator }  from './mod.ts'
import * as CODE from './types.ts'

//====================================
//            Encode 
//====================================

/** encode */
export const encodeBigInt = (accumulator: Accumulator, item: bigint) => {

   if (typeof item === 'bigint') {
      const biZero = BigInt(0)
      if (item === biZero) {
         accumulator.appendByte(CODE.INTZERO)
      }
      else {
         const isNeg = item < biZero
         const rawHexBytes = (isNeg ? -item : item).toString(16)
         const rawBytes = fromHexString(((rawHexBytes.length % 2 === 1) ? '0' : '') + rawHexBytes)
         const len = rawBytes.length
         if (len > 255)
            throw Error('Tuple encoding does not support bigints larger than 255 bytes.');
         if (isNeg) {
            // Encode using 1s compliment - flip the bits.
            for (let i = 0; i < rawBytes.length; i++)
               rawBytes[i] = ~rawBytes[i]
         }

         if (len <= 8) {
            accumulator.appendByte(CODE.INTZERO + (isNeg ? -len : len))
         }
         else if (len < 256) {
            accumulator.appendByte(isNeg ? CODE.NEGINTSTART : CODE.POSINTEND)
            accumulator.appendByte(isNeg ? len ^ 0xff : len)
         }
         accumulator.appendBuffer(rawBytes)
      }
   }
   else {
      throw new TypeError('Item must be BigInt')
   }
};

//====================================
//            Decode
//====================================

/** decode BigInt */
export function decodeBigInt(buf: Uint8Array, pos: { p: number }, code: number) {
   const { p } = pos
   if (code >= CODE.NEGINTSTART && code <= CODE.POSINTEND) {
      const byteLen = code - CODE.INTZERO
      const absByteLen = Math.abs(byteLen)
      pos.p += absByteLen
      if (code === CODE.INTZERO) return 0;
      return decodeIt(buf, p, absByteLen, byteLen < 0)
   } else {
      throw new TypeError(`Invalid tuple data: code ${code} ('${buf}' at ${pos})`)
   }
}

// *** Decode
function decodeIt(
   buf: Uint8Array,
   offset: number,
   numBytes: number,
   isNeg: boolean
) {
   let num = BigInt(0)
   let shift = 0
   for (let i = numBytes - 1; i >= 0; --i) {
      let b = buf[offset + i]
      if (isNeg) b = ~b & 0xff;
      num += BigInt(b) << BigInt(shift)
      shift += 8
   }
   return isNeg ? -num : num
}

/** create a buffer from a hex string  */
function fromHexString(string: string) {
   const buf = new Uint8Array(Math.ceil(string.length / 2))
   for (let i = 0; i < buf.length; i++) {
      buf[i] = parseInt(string.substr(i * 2, 2), 16)
   }
   return buf
}

// deno-lint-ignore no-explicit-any
export function isBigInt(x: any) { return typeof x === 'bigint' }