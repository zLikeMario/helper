# @zlikemario/helper

A utility library with number operations and common helper functions.

## Installation

```bash
npm install @zlikemario/helper
# or
yarn add @zlikemario/helper
# or
pnpm add @zlikemario/helper
```

## Usage

### Number Operations

```typescript
import { BigNumber, isNumber, simplifyNumber } from '@zlikemario/helper/number'

// Check if a value is a number
console.log(isNumber('123')) // true

// Simplify large numbers
console.log(simplifyNumber(1234567)) // "1.2M"

// Use BigNumber for precise calculations
const result = new BigNumber('0.1').plus('0.2')
console.log(result.toString()) // "0.3"
```

### Utility Functions

```typescript
import { sleep, encrypt, isEmail } from '@zlikemario/helper/utils'

// Sleep function
await sleep(1000) // Wait for 1 second

// Encrypt sensitive data
console.log(encrypt('1234567890', 2, 2)) // "12****90"

// Validate email
console.log(isEmail('user@example.com')) // true
```

## API Reference

### Number Module (`@zlikemario/helper/number`)

- `BigNumber` - BigNumber.js instance for precise calculations
- `isNumber(num, isInt?)` - Check if value is a number
- `simplifyNumber(num, decimal?, rm?)` - Simplify large numbers (1.2K, 3.4M)
- `readabilityNumber(num)` - Add thousand separators
- `toPercentage(num, precision?, isHiddenUnit?)` - Convert to percentage
- `formatPrecision(num, precision?)` - Format with specific precision
- `readableNumber(num, decimals?)` - Advanced readable formatting
- `sum(data)` - Sum array of numbers
- `sumBy(data, key)` - Sum by object property or function

### Utils Module (`@zlikemario/helper/utils`)

- `sleep(interval?)` - Async sleep function
- `encrypt(text, prefix?, suffix?, placeholder?)` - Mask sensitive data
- `isUndefined(v)` - Check if value is undefined
- `isHasUndefined(...vs)` - Check if any value is undefined
- `isPromise(v)` - Check if value is a Promise
- `uint8ArrayToBase64(array)` - Convert Uint8Array to Base64
- `base64ToUint8Array(base64)` - Convert Base64 to Uint8Array
- `arrayBufferToBase64(buffer)` - Convert ArrayBuffer to Base64
- `isDomain(text)` - Validate domain name
- `isEmail(text)` - Validate email address
- `tryCatchAsync(p, catchFn?)` - Async try-catch wrapper
- `preventTimeout(callback, options?)` - Execute with timeout protection

## License

MIT
