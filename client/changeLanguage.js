za.changeLanguage = function(){

   var selector = new za.ui.DataSelector({
      title: 'select_language',
      message: 'select_language_message',
      search: false,
      searchPlaceholder: 'search',
      buffered: true,
      multiSelect: false,
      cancelable: true,
      dataSource: '/api/selector/language/$i?q=$q',
      selection: [{ code: clientData.lang }],
      rowTitle: 'name'
   });

   selector.spawn();

   selector.on('new', function(selection){
      if(selection.code != clientData.lang){
         za.send('/api/text/' + selection.code).success(function(response){
            za._language_change_handler(response);
            clientData.lang = selection.code;
            $('.update-lang-letters').html('('+selection.code+')');
         });
      }
   });

};
