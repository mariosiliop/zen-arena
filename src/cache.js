'use strict';

module.exports = get_data();

function get_data(){

    log('Getting cache data...');

    return co(function*(){

      var updated;

      global._cache_is_updating = true;
      global._on_cache_updated = new Promise(r => updated = r);

        var configResponse = yield dataTransporter.get({
            query: {},
            collection: 'configuration'
        });

        global.appConfig = {};

        for(let pair of configResponse)
            appConfig[pair.key] = pair.value;

        var textResponse = yield dataTransporter.get({
            query: {},
            collection: 'text'
        });

        global.text = {};

        global.appLanguagesCodes = appConfig.app_languages.map(l => l.code);
        global.appLanguageCodeIndex = {};

        for(let lang of appConfig.app_languages)
         global.appLanguageCodeIndex[lang.code] = lang;

        global.languageCodes = new Set(global.appLanguagesCodes);

        for(let row of textResponse)
            global.text[row.origin] = global.text[row.origin] || {};

        for(let code of global.appLanguagesCodes)
            for(let origin in global.text)
                global.text[origin][code] = {};

        for(let row of textResponse)
            global.text[row.origin][row.language][row.id] = row;

        global._cache_is_updating = false;
        updated();

        global.coreTextCache = {};

        for(let language in global.text.core)
         coreTextCache[language] = make_core_text(language);

         global.coreDbData = {};

         global.coreDbData.games = yield dataTransporter
            .dbc
            .collection('games')
            .find({})
            .sort({order:1})
            .toArray();

        log.green('Cache up to date.');

        //setTimeout(get_data, 5*6e4);

    }).catch(e => instance.emit('error', e));

}
