const GOOGLE_SHEET_CSV_URL = process.env.EXPO_PUBLIC_GOOGLE_SHEET_CSV_URL;

export interface Asset {
  ticker: string;
  price: number;
}

export const fetchLivePrices = async (): Promise<Asset[]> => {
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

const parseCSV = (csvText: string): Asset[] => {
  const lines = csvText.split('\n');
  
  return lines.map(line => {
    const parts = line.split(',');

    const ticker = parts[0]?.trim();
    const priceString = parts[1]?.trim();

    if (!ticker || !priceString) return null;

    const price = parseFloat(priceString);
    if (isNaN(price)) return null; 

    return { ticker, price };
  }).filter(item => item !== null) as Asset[];
};