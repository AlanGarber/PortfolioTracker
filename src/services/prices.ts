const GOOGLE_SHEET_CSV_URL = process.env.EXPO_PUBLIC_GOOGLE_SHEET_CSV_URL;

export interface MarketAsset {
  ticker: string;
  price: number;
  currency: string;
  name: string;
}

export const fetchLivePrices = async (): Promise<MarketAsset[]> => {
    if (!GOOGLE_SHEET_CSV_URL) return [];
  
    try {
    const uniqueUrl = `${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`;

    const response = await fetch(uniqueUrl, { 
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    
    const text = await response.text();

    return parseCSV(text);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const parseCSV = (csvText: string): MarketAsset[] => {
  const lines = csvText.split('\n');
  
  return lines.map(line => {
    const parts = line.split(',');

    const ticker = parts[0]?.trim();
    const priceString = parts[1]?.trim();
    const currency = parts[2]?.trim().toUpperCase();
    const name = parts[3]?.trim();

    if (!ticker || !priceString) return null;

    const price = parseFloat(priceString);
    if (isNaN(price)) return null; 

    return { 
      ticker, 
      price, 
      currency: currency || 'USD',
      name: name || ticker 
    };
  }).filter(item => item !== null) as MarketAsset[];
};