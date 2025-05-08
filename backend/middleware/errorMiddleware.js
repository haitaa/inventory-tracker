/**
 * Express hata işleme middleware'i
 * Bu middleware, uygulamada oluşan hataları yakalar ve uygun HTTP yanıtlarını döndürür
 */

/**
 * 404 hatası için middleware - tanımlanmamış rotalar için kullanılır
 */
export const notFound = (req, res, next) => {
  const error = new Error(`URL bulunamadı: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Genel hata işleme middleware'i
 * Uygulamanın herhangi bir yerinde fırlatılan hataları yakalar ve işler
 */
export const errorHandler = (err, req, res, next) => {
  // HTTP durum kodu hata nesnesinden alınır veya varsayılan olarak 500 kullanılır
  const statusCode = err.statusCode || 500;

  // Yanıt
  res.status(statusCode).json({
    message: err.message,
    // Geliştirme ortamında stack trace'i ekle, üretim ortamında eklenmesin
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
