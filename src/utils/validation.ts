export const parseInputToNumber = (value: string): number | null => {
  if (!value) return null;

  let clean = value.trim();

  if (clean.includes(',') && clean.includes('.')) {
    const lastDotIndex = clean.lastIndexOf('.');
    const lastCommaIndex = clean.lastIndexOf(',');

    if (lastCommaIndex > lastDotIndex) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
  } else {
    clean = clean.replace(/,/g, '.');
  }

  
  const dotCount = (clean.match(/\./g) || []).length;
  if (dotCount > 1) {
    clean = clean.replace(/\./g, ''); 
  }

  const number = parseFloat(clean);

  return isFinite(number) ? number : null;
};