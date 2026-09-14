export interface CurrencyInfo {
  readonly code: string;
  /** number of digits after the decimal point a minor unit represents */
  readonly digits: number;
  readonly symbol: string;
}

// Not exhaustive. ISO 4217 has ~180 currencies; add more as callers need them
// rather than front-loading a table nobody asked for. `digits` follows the
// standard's minor-unit exceptions: most currencies use 2, a handful (yen,
// won, most of the zero-decimal African and Asian currencies) use 0, and the
// Gulf dinars use 3.
export const CURRENCIES: Readonly<Record<string, CurrencyInfo>> = {
  USD: { code: 'USD', digits: 2, symbol: '$' },
  EUR: { code: 'EUR', digits: 2, symbol: '€' },
  GBP: { code: 'GBP', digits: 2, symbol: '£' },
  JPY: { code: 'JPY', digits: 0, symbol: '¥' },
  CHF: { code: 'CHF', digits: 2, symbol: 'CHF' },
  CAD: { code: 'CAD', digits: 2, symbol: 'CA$' },
  AUD: { code: 'AUD', digits: 2, symbol: 'A$' },
  NZD: { code: 'NZD', digits: 2, symbol: 'NZ$' },
  CNY: { code: 'CNY', digits: 2, symbol: '¥' },
  HKD: { code: 'HKD', digits: 2, symbol: 'HK$' },
  SGD: { code: 'SGD', digits: 2, symbol: 'S$' },
  INR: { code: 'INR', digits: 2, symbol: '₹' },
  KRW: { code: 'KRW', digits: 0, symbol: '₩' },
  BRL: { code: 'BRL', digits: 2, symbol: 'R$' },
  MXN: { code: 'MXN', digits: 2, symbol: 'MX$' },
  ZAR: { code: 'ZAR', digits: 2, symbol: 'R' },
  SEK: { code: 'SEK', digits: 2, symbol: 'kr' },
  NOK: { code: 'NOK', digits: 2, symbol: 'kr' },
  DKK: { code: 'DKK', digits: 2, symbol: 'kr' },
  PLN: { code: 'PLN', digits: 2, symbol: 'zł' },
  RUB: { code: 'RUB', digits: 2, symbol: '₽' },
  TRY: { code: 'TRY', digits: 2, symbol: '₺' },
  THB: { code: 'THB', digits: 2, symbol: '฿' },
  IDR: { code: 'IDR', digits: 2, symbol: 'Rp' },
  PHP: { code: 'PHP', digits: 2, symbol: '₱' },
  MYR: { code: 'MYR', digits: 2, symbol: 'RM' },
  VND: { code: 'VND', digits: 0, symbol: '₫' },
  AED: { code: 'AED', digits: 2, symbol: 'د.إ' },
  SAR: { code: 'SAR', digits: 2, symbol: '﷼' },
  ILS: { code: 'ILS', digits: 2, symbol: '₪' },
  EGP: { code: 'EGP', digits: 2, symbol: 'E£' },
  CZK: { code: 'CZK', digits: 2, symbol: 'Kč' },
  HUF: { code: 'HUF', digits: 2, symbol: 'Ft' },
  RON: { code: 'RON', digits: 2, symbol: 'lei' },
  ARS: { code: 'ARS', digits: 2, symbol: '$' },
  COP: { code: 'COP', digits: 2, symbol: '$' },
  CLP: { code: 'CLP', digits: 0, symbol: '$' },
  PEN: { code: 'PEN', digits: 2, symbol: 'S/' },
  UAH: { code: 'UAH', digits: 2, symbol: '₴' },
  NGN: { code: 'NGN', digits: 2, symbol: '₦' },
  PKR: { code: 'PKR', digits: 2, symbol: '₨' },
  BHD: { code: 'BHD', digits: 3, symbol: 'BD' },
  KWD: { code: 'KWD', digits: 3, symbol: 'KD' },
  OMR: { code: 'OMR', digits: 3, symbol: 'OMR' },
  JOD: { code: 'JOD', digits: 3, symbol: 'JD' },
  IQD: { code: 'IQD', digits: 3, symbol: 'IQD' },
  TND: { code: 'TND', digits: 3, symbol: 'DT' },
};

export function getCurrency(code: string): CurrencyInfo {
  const info = CURRENCIES[code.toUpperCase()];
  if (!info) {
    throw new Error(`unknown currency code: "${code}"`);
  }
  return info;
}
