const CURRENCY_CONFIG: Record<string, { symbol: string; prefix: boolean; flag: string }> = {
  USD: { symbol: 'US$', prefix: true, flag: '🇺🇸' },
  ARS: { symbol: 'AR$', prefix: true, flag: '🇦🇷' },
  EUR: { symbol: 'EU€', prefix: true, flag: '🇪🇺' },
  DEFAULT: { symbol: '$', prefix: true, flag: '🏳️' }
};

export const getCurrencyFlag = (currency: string) => {
  return (CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.DEFAULT).flag;
};

export const formatCurrency = (value: number, currency: string = 'USD') => {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.DEFAULT;

  const formattedNumber = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return config.prefix 
    ? `${config.symbol} ${formattedNumber}` 
    : `${formattedNumber} ${config.symbol}`;
};

export const formatPercentage = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};