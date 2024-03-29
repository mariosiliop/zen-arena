'use strict';

var r = new PageRoute();

r.setName('post');

module.exports = r;

r.setHandler(response => co(function*() {

   var post = yield data.getPostViewData(
                     response.request,
                     +response.request.params.post_id,
                     response.pageData.coreText,
                     response.request.__user && response.request.__user.get('id')
                  );

   response.pageData.meta.title =
   response.pageData.meta.og_title =
      post.title ||
      (response.pageData.coreText.post_by + ' ' +
       post.publisher_display_name + ' - ' +
       appConfig.site_name);

   response.pageData.meta.description = post.text.substr(0, 200) + ' ...';

   if(post.image)
      response.pageData.meta.og_image = post.image;

   response.responseData = yield factory.index.make(
       response.request,
       response.pageData,
       yield factory.view.post.make(
         response.request,
         response.pageData.coreText,
         response.request.__user,
         0,
         response.request.params.post_id)
     );

  response.end();

}).catch(e => instance.emit('error', e)));
