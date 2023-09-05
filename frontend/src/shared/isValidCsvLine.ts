export default function isValidCsvLine(
  productCode: string,
  newPrice: string
): boolean {
  if (isNaN(parseInt(productCode)) || isNaN(parseFloat(newPrice))) {
    return false;
  }
  return true;
}
