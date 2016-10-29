/**
 * OAuth request to services.
 */
function OAuth() {
	var errors = 0,
		services = {};
	
	// contacts
	services.contacts = getContactsService();
	if (!services.contacts.hasAccess()) {
		var authorizationUrl = services.contacts.getAuthorizationUrl();
		Logger.log('NO CONTACTS ACCESS, open URL (required):');
		Logger.log(authorizationUrl);
		errors++;
	}
	
	// xing with oauth
	if (options.xing && options.xing !== 1) {
		services.xing = getXingService();
		if (!services.xing.hasAccess()) {
			var authorizationUrl = services.xing.authorize();
			Logger.log('NO XING ACCESS, open URL (or deactivate xing oauth):');
			Logger.log(authorizationUrl);
			errors++;
		}
	}
	
	return errors ? errors : services;
}

/**
 * Create oauth2 contacts service.
 */
function getContactsService(opt) {
	opt = opt || this.options;
	return OAuth2.createService('contacts')
		.setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
		.setTokenUrl('https://accounts.google.com/o/oauth2/token')
		.setClientId(opt.contacts.clientId)
		.setClientSecret(opt.contacts.clientSecret)
		.setCallbackFunction('authCallback')
		.setPropertyStore(PropertiesService.getUserProperties())
		.setScope('https://www.google.com/m8/feeds')
		.setParam('login_hint', Session.getActiveUser().getEmail())
		.setParam('access_type', 'offline')
		.setParam('approval_prompt', 'auto');
}

/**
 * Callback after calling the auth url.
 */
function authCallback(request, options) {
	var error = '',
		name = request.parameter.serviceName,
		nameUcFirst = name[0].toUpperCase() + name.substr(1),
		service = this['get' + nameUcFirst + 'Service'](options);
	try {
		if (service.handleCallback(request)) {
			return HtmlService.createHtmlOutput(
				'<div style="font-family: verdana; color: green;">' +
					'Success! You can close this tab.' +
				'</div>');
		} else error = 'Denied. You can close this tab.';
	} catch(e) {
		error = e;
	}
	return HtmlService.createHtmlOutput(
		'<div style="font-family: verdana; color: red;">' +
			error +
		'</div>');
}
