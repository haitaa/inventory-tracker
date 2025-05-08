/**
 * HTTP hata objesi oluşturan yardımcı fonksiyon.
 * Express hata işleme mekanizmasıyla uyumludur.
 *
 * @param {number} statusCode - HTTP durum kodu
 * @param {string} message - Hata mesajı
 * @returns {Error} - Durum kodu ve mesajı içeren hata objesi
 */
export const httpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
