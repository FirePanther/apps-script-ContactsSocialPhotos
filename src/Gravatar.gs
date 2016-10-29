/**
 * Get gravatar url of any email address of a contact.
 */
function getGravatar(contact) {
	var emails = contact.getEmails();
	for (var i = 0; i < emails.length; i++) {
		var gr = checkGravatar(emails[i].getAddress());
		if (gr) return gr;
	}
	return 0;
}

/**
 * Check if the mail address has a gravatar image.
 */
function checkGravatar(mail) {
	var prop = PropertiesService.getScriptProperties(),
		md5 = md5hash(mail.toLowerCase()),
		url = 'https://secure.gravatar.com/avatar/' + md5 + '?' +
			'd=http%3A%2F%2Fi.imgur.com%2FEhkWU8S.jpg',
		propObj = {
			check: new Date().getTime(),
			success: 0
		};
	
	if (prop.getProperty(md5) !== null) {
		var cache = JSON.parse(prop.getProperty(md5));
		// gravatar requests are slow, let's just recheck it once per week
		if (cache.check > new Date().getTime() - 1000 * 3600 * 24 * 7) {
			return cache.success ? url : 0;
		}
	}
	
	var fetchHeader = UrlFetchApp.fetch(url, {
		followRedirects: false
	});
	// otherwise the user just has the default gravatar (and gravatar wants to
	// redirect, 302)
	if (fetchHeader.getResponseCode() === 200) {
		propObj.success = 1;
	}
	
	prop.setProperty(md5, JSON.stringify(propObj));
	return propObj.success ? url : 0;
}

/**
 * Returns an MD5 checksum of a string.
 */
function md5hash(str) {
	var dec = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, str),
		hex = '';
	for (i = 0; i < 16; i++) {
		var b = dec[i] < 0 ? dec[i] + 256 : dec[i];
		hex += (b < 16 ? '0' : '') + b.toString(16);
	}
	return hex;
}
