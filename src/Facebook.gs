/**
 * Get the facebook profile picture url.
 */
function getFacebook(contact) {
	var fbId = getFacebookId(contact);
	if (fbId) {
		var url = 'http://graph.facebook.com/v2.8/' + fbId + '/picture?' +
				'width=500&height=500',
			fetch = UrlFetchApp.fetch(url, {
				followRedirects: false
			}),
			location = fetch.getHeaders().Location;
		if (location && location.indexOf('scontent.') != -1) {
			return location;
		}
	}
	return 0;
}

/**
 * Get the facebook id of a contact (not the name or username).
 */
function getFacebookId(contact) {
	// "return getFacebookIm(contact) || getFacebookUrl(contact);" didn't work,
	// no idea why
	var id = getFacebookIm(contact);
	if (id) return id;
	else return getFacebookUrl(contact);
}

/**
 * Get the facebook id by IM (jabber).
 */
function getFacebookIm(contact) {
	var ims = contact.getIMs(ContactsApp.Field.JABBER);
	for (var x in ims) {
		var addr = ims[x].getAddress(),
			m = (/^\-?(.*)\@chat\.facebook\.com$/).exec(addr);
		if (m) return m[1];
	}
	return 0;
}

/**
 * Get the facebook id by a url entry. The facebook id will be extracted by the
 * username.
 */
function getFacebookUrl(contact) {
	var urls = contact.getUrls(), addr, m;
	for (var x in urls) {
		addr = urls[x].getAddress();
		var pat = /(?:facebook\.com|fb\.me|fb\.com)\/(.*)(\/|\?|$)/;
		m = pat.exec(addr);
		if (!m) {
			pat = /(?:facebook\.com|fb\.me|fb\.com)\/profile\.php\?.*?id=(\d+)/;
			m = pat.exec(addr);
		}
		if (m) {
			if ((/^\d+$/).test(m[1])) return m[1];
			else return getFacebookIdByName(m[1]);
		}
	}
	return 0;
}

/**
 * Get facebook id by username.
 */
function getFacebookIdByName(name) {
	var fetch = UrlFetchApp.fetch('http://findmyfbid.com/', {
		method: 'post',
		payload: 'url=' + encodeURIComponent(name)
	});
	var m = (/<code>(\d+)<\/code>/).exec(fetch.getContentText());
	if (m) return m[1];
	else return 0;
}
