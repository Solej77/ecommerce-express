const Sentry = require("@sentry/node");
const boom = require('boom');
const { config } = require('../../config');
const isRequestAjaxOrApi = require('../isRequestAjaxOrApi');

Sentry.init({ dsn: `https://${config.sentryDns}@sentry.io/${config.sentryId}` });

// Helper, boom por defecto no tien el stack por lo que si estamos
// en modo desarrollo devemos de incluir el stack
function withErrorStack(err, stack) {
  if (config.dev) {
    return { ...err, stack } // Object.assign({}, err, stack)
  }
}

// Nos va ayudar a verificar si el error no esta wrapeado en boom lo haga
function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err))
  }

  next(err);
}

function logErrors(err, req, res ,next) {
  Sentry.captureException(err);
  console.log(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload }
  } = err;

  // catch errors for AJAX request or if an error ocurrs while streaming
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack));
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload }
  } = err;

  res.status(statusCode);
  res.render("error", withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler,
}