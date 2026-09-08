export interface CurrencyInfo {
  readonly code: string;
  /** number of digits after the decimal point a minor unit represents */
  readonly digits: number;
  readonly symbol: string;
}

// Not exhaustive. ISO 4217 has ~180 currencies; add more as callers need them
// rather than front-loading a table nobody asked for.
export const CURRENCIES: Readonly<Record<string, CurrencyInfo>> = {
  USD: { code: 'USD', digits: 2, symbol: '$' },
  EUR: { code: 'EUR', digits: 2, symbol: '€' },
  GBP: { code: 'GBP', digits: 2, symbol: '£' },
  JPY: { code: 'JPY', digits: 0, symbol: '¥' },
  BHD: { code: 'BHD', digits: 3, symbol: 'BD' },
};

export function getCurrency(code: string): CurrencyInfo {
  const info = CURRENCIES[code.toUpperCase()];
  if (!info) {
    throw new Error(`unknown currency code: "${code}"`);
  }
  return info;
}
