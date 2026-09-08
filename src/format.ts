import { Money } from './money.js';
import { getCurrency } from './currencies.js';

export interface FormatOptions {
  /** return a JSON string instead of a human-readable one */
  json?: boolean;
  /** BCP 47 locale for the human-readable form, defaults to en-US */
  locale?: string;
}

export interface MoneyJson {
  currency: string;
  amount: string;
  minorUnits: string;
}

export function toJson(money: Money): MoneyJson {
  return {
    currency: money.currency,
    amount: money.toDecimalString(),
    // bigint has no native JSON representation, so it travels as a string
    minorUnits: money.minorUnits.toString(),
  };
}

// The two output modes are meant to be interchangeable at a call site: a
// script printing to a terminal wants format(m), a script piping into
// another tool wants format(m, { json: true }). Neither should require a
// different code path to obtain the amount.
export function format(money: Money, options: FormatOptions = {}): string {
  if (options.json) {
    return JSON.stringify(toJson(money));
  }
  const { digits } = getCurrency(money.currency);
  return new Intl.NumberFormat(options.locale ?? 'en-US', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(money.toDecimalString()));
}
