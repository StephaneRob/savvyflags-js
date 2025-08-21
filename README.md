# SavvyFlags JS client

Client Javascript for savvyflags

## Usage

```js
import { SavvyFlagsClient } from 'savvyflags-js'

const sdkConnectionUrl = 'http://mysavvyflags.com/api/features/sdk_dUJWMldTTEc5e'
const client = new SavvyFlagsClient({
  url: sdkConnectionUrl,
  context: { email: 'john@doe.com' },
  mode: 'plain',
})
await client.init()

const navColor = client.getFlag('nav:color', 'blue')
```
