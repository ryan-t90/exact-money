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

### Splitting an amount without losing minor units

Dividing `10.00` three ways as a float gives `3.3333...`; naively rounding
each share to `3.33` only accounts for `9.99`. `divide` and `allocate` fix
that by distributing the leftover minor units across the shares instead of
dropping them:

```ts
const bill = Money.fromDecimalString('10.00', 'USD');
bill.divide(3).map((m) => m.toDecimalString());
// ["3.34", "3.33", "3.33"]

const total = Money.fromDecimalString('100', 'USD');
total.allocate([2, 3, 5]).map((m) => m.toDecimalString());
// ["20.00", "30.00", "50.00"]
```

`allocate` ratios must be non-negative integers, not floats, since a
fractional ratio would just reintroduce the rounding problem this library
exists to avoid.

### Arithmetic guards against mixing currencies

```ts
const usd = Money.fromDecimalString('10', 'USD');
const eur = Money.fromDecimalString('10', 'EUR');
usd.add(eur); // throws: currency mismatch: USD vs EUR
```

## Status

Early skeleton. The `Money`, `format`, and `allocate`/`divide` APIs above are
real and working, and the currency table covers the common ISO 4217 codes,
but `multiply` still rounds through a float intermediate, which is fine for
a tax rate but not for chained rate calculations. There's also no parser for
formatted strings back into `Money`, and no currency conversion yet. See the
roadmap in project notes for what's next.

## License

MIT, see [LICENSE](./LICENSE).
