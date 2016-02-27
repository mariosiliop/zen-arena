/* global co, templates, appConfig, factory, Timer, log */
'use strict';

/**
 * Produces html for the home view and returns it asynchronously.
 * @method factory.home
 * @param {object} coreText The core application text to use.
 * @returns Promise
 */
module.exports = coreText => co(function*(){
   log.debug('factory.home: Making...');
   var timer = new Timer();
   var posts = [];

   for(let index in appConfig.home_posts)
      posts[index] = yield factory.post(posts[index], coreText);

   var result = templates.home({
      coreText,
      posts
   });

   log.debug(`factory.home: Done. (${timer.click()}ms)`);
   return result;
});
