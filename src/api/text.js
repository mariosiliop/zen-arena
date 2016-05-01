/* global appConfig, make_core_text, APIRoute */
'use strict';

/**
 * Returns the core application text for a specified language.
 * @function text
 * @param {JSONResponse} response The response object.
 * @memberof api
 * @returns undefined
 */
var route = new APIRoute((response, req) => {

   let valid_request = req.params && req.params.lang;

   if(!valid_request)
      return response.error('error_invalid_request');

   if(!~appConfig.app_languages.indexOf(req.params.lang))
      return response.error('error_invalid_language');

   response.responseData = coreTextCache[req.params.lang];
   response.end();

});

module.exports = route;
