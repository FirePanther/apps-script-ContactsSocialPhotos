/**
 * Create oauth1 xing service.
 */
function getXingService(opt) {
	opt = opt || this.options;
	return OAuth1.createService('xing')
		.setAccessTokenUrl('https://api.xing.com/v1/access_token')
		.setRequestTokenUrl('https://api.xing.com/v1/request_token')
		.setAuthorizationUrl('https://api.xing.com/v1/authorize')
		.setConsumerKey(opt.xing.consumerKey)
		.setConsumerSecret(opt.xing.consumerSecret)
		.setPropertyStore(PropertiesService.getUserProperties())
		.setCallbackFunction('authCallback');
}

/**
 * Get the xing username of a contact.
 */
function getXing(contact) {
	var urls = contact.getUrls(), addr, m;
	for (var x in urls) {
		addr = urls[x].getAddress();
		m = (/xing\.com\/profile\/(.*)(\?|$|\/)/).exec(addr);
		if (m) return getXingPicture(m[1]);
	}
	return 0;
}

/**
 * get the xing profile picture url by a username.
 */
function getXingPicture(user) {
	if (typeof this.options.xing === 'object') {
		// with oauth
		var xingService = getXingService(options),
			url = 'https://api.xing.com/v1/users/' + user + '.json?' +
				'fields=photo_urls',
			fetch = xingService.fetch(url),
			arr = JSON.parse(fetch.getContentText());
		if (arr && arr.users && arr.users[0] && arr.users[0].photo_urls) {
			return arr.users[0].photo_urls.size_256x256;
		} else {
			return 0;
		}
	} else {
		// without oauth (only public profiles)
		var fetch = UrlFetchApp.fetch('https://www.xing.com/profile/' + user),
			src = fetch.getContentText(),
			m = (/<meta name="twitter:image" content="([^"]+)"/).exec(src);
		if (m) return m[1];
		else return 0;
	}
}
