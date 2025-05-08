/**
 * Benzersiz bir işlem ID'si üretir
 * @returns {string} İşlem ID'si
 */
export const generateTransactionId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `TXN-${timestamp}-${random}`;
};
