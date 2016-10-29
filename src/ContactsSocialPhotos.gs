/**
 * Sets the profile picture of all contacts to the profile picture of their
 * social network accounts account. After the first run you have to open the
 * logs and open the url(s) manually, thusly (a) token(s) will be generated,
 * wich will be refreshed automatically in the future.
 */
function run(options) {
	this.options = options;
	this.services = OAuth();
	
	// run script or request to authorize
	if (typeof services === 'object') {
		parseContacts(function(contact) {
			parsePicture(contact, setPicture);
		});
	} else throw 'Please check the logs (ctrl/cmd + enter) to authorize.';
}

/**
 * execute callback (cb) to every contact.
 */
function parseContacts(cb) {
	var contacts = ContactsApp.getContacts();
	
	for (var x in contacts) {
		cb(contacts[x]);
	}
}

/**
 * download profile pic and execute callback (cb) to the contact with the
 * picture url.
 */
function parsePicture(contact, cb) {
	var pictureUrl = 0;
	
	// xing
	if (this.options.xing && !pictureUrl) {
		var xing = getXing(contact);
		if (xing) pictureUrl = xing;
	}
	// facebook
	if (this.options.facebook && !pictureUrl) {
		var fb = getFacebook(contact);
		if (fb) pictureUrl = fb;
	}
	// gravatar
	if (this.options.gravatar && !pictureUrl) {
		var gr = getGravatar(contact);
		if (gr) pictureUrl = gr;
	}
	
	if (pictureUrl) cb(contact, pictureUrl);
}

/**
 * set the contacts picture to the image of the url, but only if the image has
 * been updates (last-modified header).
 */
function setPicture(contact, url) {
	var prop = PropertiesService.getScriptProperties(),
		lm = UrlFetchApp.fetch(url).getHeaders()['Last-Modified'],
		id = contact.getId().replace(/^.*\/([^\/]+)$/g, '$1'),
		service = getContactsService();
	
	if (prop.getProperty('lm-' + id) != lm) {
		var blob = UrlFetchApp.fetch(url).getBlob();
		try {
			UrlFetchApp.fetch(
				'https://www.google.com/m8/feeds/photos/media/default/' + id,
				{
					headers: {
						'If-Match': '*',
						'Authorization': 'Bearer ' + service.getAccessToken()
					},
					method: 'put',
					contentType: 'image/*',
					payload: blob.getBytes()
				});
			Logger.log('Avatar changed for ' + contact.getFullName());
			prop.setProperty('lm-' + id, lm);
		} catch(e) {
			Logger.log('Error: Avatar couldn\'t be changed for ' +
				contact.getFullName() + ', please try again.');
		}
	}
}
