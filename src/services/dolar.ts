export const fetchDollarRate = async (): Promise<number> => {
  try {
    
    const response = await fetch('https://dolarapi.com/v1/dolares/bolsa', {
      cache: 'no-store' // Importante para no guardar valores viejos
    });

    if (!response.ok) {
      throw new Error('Error al obtener cotización del dólar');
    }

    const data = await response.json();
    
    return data.compra || 1500;

  } catch (error) {
    console.error("Error fetching dollar rate:", error);
    return 1500;
  }
};