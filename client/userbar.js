/* global za, clientData */
za.userBar = {

   // logged or not, defaults to not
   _status: false,

   setImage: function(url){
      $('.navigation .player-info .user-image')
         .css('background-image', 'url(' + url + ')');
      return this;
   },

   setName: function(string){
      $('.navigation .player-info .user-display-name').html(string);
      return this;
   },

   setStatus: function(status){
      if(status === za.userBar.status)
         return this;

      za.userBar.status = status;

      $('.navigation .player-info > *')
      .animate({opacity:0},300,'swing',function(){

         var block_selector = status ? '.user-ui' : '*:not(.user-ui)';

         $('.navigation .player-info > *').css('display', 'none');

         $('.navigation .player-info > '+block_selector)
         .css('display', 'inline-block')
         .animate({opacity:1},300,'swing');

      });

      return this;
   },

   setUser: function(user) {
      za.userBar
         .setName(user.display_name)
         .setImage(user.image || '/img/defaultusr.jpg')
         .setStatus(true);
      return this;
   }

};

$(window).ready(function(){
   if(clientData.user_data)
      za.userBar.setUser(clientData.user_data);
});
