# exact-money

A small TypeScript library for currency amounts that doesn't use floating
point for arithmetic.

`0.1 + 0.2` is not `0.3` in IEEE 754, and neither is a sum of a thousand
`19.99` line items. Most of the time that's a rounding error nobody notices.
Occasionally it's a balance that's off by a cent and nobody can figure out
why. `exact-money` stores every amount as an integer count of "minor units"
(cents, pence, fils, whatever the currency's smallest unit is) using
`bigint`, so addition and subtraction are exact by construction.

No dependencies. Standard library only.

## Usage

```ts
import { Money, format } from './src/index.js';

const price = Money.fromDecimalString('19.99', 'USD');
const tax = price.multiply(0.0875); // rounds to the nearest cent
const total = price.add(tax);

console.log(total.toDecimalString()); // "21.74"
```

### Human-readable vs. JSON output

Anywhere you'd print a `Money` value, `format` gives you either a
locale-formatted string or a machine-readable JSON string from the same
call, so a CLI-style tool built on this library can support `--json` without
a second code path:

```ts
format(total);
// "$21.74"

format(total, { json: true });
// '{"currency":"USD","amount":"21.74","minorUnits":"2174"}'

format(total, { locale: 'de-DE' });
// "21,74 $"
```

`toJson(money)` returns the same shape as an object instead of a string, for
callers that are going to embed it in a larger JSON document rather than
print it directly.

### Currencies with different minor-unit precision

Not every currency has two decimal places. Japanese yen has zero, Bahraini
dinar has three. `exact-money` looks the precision up per currency instead
of assuming cents:

```ts
Money.fromDecimalString('500', 'JPY').toDecimalString(); // "500"
Money.fromDecimalString('1.500', 'BHD').toDecimalString(); // "1.500"
```

### Arithmetic guards against mixing currencies

```ts
const usd = Money.fromDecimalString('10', 'USD');
const eur = Money.fromDecimalString('10', 'EUR');
usd.add(eur); // throws: currency mismatch: USD vs EUR
```

## Status

Early skeleton. The `Money` and `format` APIs above are real and working,
but the currency table is short and `multiply` rounds through a float
intermediate, which is fine for a tax rate but not for chained rate
calculations. See the roadmap in project notes for what's next.

## License

MIT, see [LICENSE](./LICENSE).
