import { getCurrency } from './currencies.js';

// Money is stored as an integer count of minor units (cents, pence, fils...)
// rather than a float. 0.1 + 0.2 has no exact binary representation, and a
// balance built out of many such additions eventually drifts off by a cent.
// bigint side-steps that entirely and has no realistic overflow ceiling.
export class Money {
  private constructor(
    readonly minorUnits: bigint,
    readonly currency: string,
  ) {}

  static fromMinorUnits(minorUnits: bigint | number, currency: string): Money {
    getCurrency(currency); // throws on unknown codes
    return new Money(BigInt(minorUnits), currency.toUpperCase());
  }

  static fromDecimalString(value: string, currency: string): Money {
    const { digits } = getCurrency(currency);
    return new Money(parseDecimalToMinorUnits(value, digits), currency.toUpperCase());
  }

  static zero(currency: string): Money {
    return Money.fromMinorUnits(0n, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.minorUnits + other.minorUnits, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.minorUnits - other.minorUnits, this.currency);
  }

  negate(): Money {
    return new Money(-this.minorUnits, this.currency);
  }

  // Rounds to the nearest minor unit. Fine for a tax rate or a discount
  // factor; not meant for chains of multiplications where rounding error
  // needs to be tracked deliberately (see README roadmap).
  multiply(factor: number): Money {
    if (!Number.isFinite(factor)) {
      throw new Error(`factor must be finite, got ${factor}`);
    }
    const rounded = Math.round(Number(this.minorUnits) * factor);
    return new Money(BigInt(rounded), this.currency);
  }

  compare(other: Money): -1 | 0 | 1 {
    this.assertSameCurrency(other);
    if (this.minorUnits < other.minorUnits) return -1;
    if (this.minorUnits > other.minorUnits) return 1;
    return 0;
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.minorUnits === other.minorUnits;
  }

  isZero(): boolean {
    return this.minorUnits === 0n;
  }

  isNegative(): boolean {
    return this.minorUnits < 0n;
  }

  toDecimalString(): string {
    const { digits } = getCurrency(this.currency);
    const negative = this.minorUnits < 0n;
    const magnitude = negative ? -this.minorUnits : this.minorUnits;
    const divisor = 10n ** BigInt(digits);
    const wholePart = magnitude / divisor;
    const fractionPart = magnitude % divisor;
    const fractionStr = digits > 0 ? `.${fractionPart.toString().padStart(digits, '0')}` : '';
    return `${negative ? '-' : ''}${wholePart}${fractionStr}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }
}

function parseDecimalToMinorUnits(value: string, digits: number): bigint {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value.trim());
  if (!match) {
    throw new Error(`invalid decimal amount: "${value}"`);
  }
  const [, sign, wholePart, fractionPart = ''] = match;
  const paddedFraction = (fractionPart + '0'.repeat(digits)).slice(0, digits);
  // extra precision beyond what the currency supports gets rounded away
  // instead of silently truncated, so "1.005" USD becomes 1.01 not 1.00
  const roundingDigit = fractionPart.length > digits ? fractionPart[digits] : '0';
  let minor = BigInt(wholePart + paddedFraction);
  if (roundingDigit >= '5') {
    minor += 1n;
  }
  return sign === '-' ? -minor : minor;
}
