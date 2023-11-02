# DenoKv key-codec

This is an encoder and decoder for the Deno-Kv multipart key format (FDB-Tuple).

app.ts
```javascript
import { pack, unpack } from './src/mod.ts'

const packed = packKey([ "user", 1 ])

console.log(packed) 
// returns - [2,117,115,101,114,0,33,191,240,0,0,0,0,0,0]

console.log(unpackKey(packed))
// [ "user", 1 ]
```
I've provided the Typescript code in the `./src/` folder, as well as a bundled/minified browser compatible version **kvKeyCodec.js** in the root.   

The included `index.html` file exercises the browser version.   
 
<br/>

## about this codec
In order to support FoundationDB in Deploy, Deno adopted the FDB-Tuple encoding format for KvKeys. This is a dynamically typed binary format. Its kind of like JSON, but it's binary and doesn't support associative objects.   

This format has some distinct advantages compared to json or msgpack when encoding the keys of a key-value database like DenoKv.

This format is not specific to FoundationDB nor DenoKv. It can be used in many of other places in place of other encoding methods.

The specification for the FDB-Tuple encoding format itself is [documented here](https://github.com/apple/foundationdb/blob/master/design/tuple.md). 

The deno specific kv-codec can be gleened from the rust source:
https://github.com/denoland/deno/blob/main/ext/kv/codec.rs
    
Note: DenoKv uses a subset of this spec. (see `Valid KvKeyParts` below)

## API
This library has only two public methods - **packKey** and **unpackKey**.   

### packKey(key: KvKey) -> Buffer
Pack the specified KvKey into a buffer. a buffer is returned.    
The key param must be a valid Deno.KvKey - an array of Deno.KvKeyParts.

Valid KvKeyParts are:
- bytes (Uint8Array)
- strings - ( including any unicode characters )
- numbers - ( encoded as a double )
- bigints up to 255 bytes long
- Boolean false
- Boolean true

### unpackKey(val: Buffer) -> KvKey
Unpacks the values in a buffer back into an array of KvKeyParts.   
A KvKey is returned.

This method throws an exception if the buffer does not contain a valid KvKey.
