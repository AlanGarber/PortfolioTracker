const CURRENCY_CONFIG: Record<string, { symbol: string; prefix: boolean }> = {
  USD: { symbol: 'US$', prefix: true },
  ARS: { symbol: 'AR$', prefix: true },
  EUR: { symbol: 'EU€', prefix: true },
  DEFAULT: { symbol: '$', prefix: true }
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