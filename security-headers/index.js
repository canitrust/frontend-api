module.exports = {
  apiResponseHeaders: (req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'max-age=0');
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31537000; includeSubDomains'
    );
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    next();
  },

  // Swagger UI requires external resources
  swaggerUIHeaders: (req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; connect-src 'self' petstore.swagger.io; script-src 'self' 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; img-src 'unsafe-inline' 'self' data:"
    );
    next();
  },
};
