'use strict';

module.exports = user => {

	// Return user data
	return {
		id: user.get('id'),
		display_name: user.displayName(),
		mini_name: user.miniName(),
		username: user.get('username'),
		first_name: user.get('first_name'),
		last_name: user.get('last_name'),
		lang: user.get('lang'),
		image: user.get('image'),
		email: user.get('email'),
		image_type: user.get('image_type'),
		fav_game: user.get('fav_game')
	};

};
