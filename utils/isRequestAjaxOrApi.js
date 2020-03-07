// Uilidad para validar si se olvdidan de agregar el header http.request
function isRequestAjaxOrApi(req) {
  // Si el request no acepta html, es decir es una API o un request.xhr
  return !req.accepts("html") || req.xhr;
}

module.exports = isRequestAjaxOrApi;
