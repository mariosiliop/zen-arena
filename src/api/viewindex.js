/* global co, APIRoute, factory, routes, log, make_core_text */
'use strict';

/**
 * Returns the core application text for a specified language.
 * @function text
 * @param {JSONResponse} response The response object.
 * @memberof api
 * @returns undefined
 */
var route = new APIRoute((response,req) => co(function*(){

   response.responseData = {
      html: yield factory.viewindex.make(
         req,
         make_core_text(req.lang),
         req.__user,
         req.body.message.depth,
         req.lang
      )
   };

   response.end();

}).catch(log.error));

route.prependRoute(routes.authentication.route);

module.exports = route;
