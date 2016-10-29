# ContactsSocialPhotos for Google Apps Script

ContactsSocialPhotos scans your contacts for social network URL's or ID's and
sets the  profile picture to the social network account profile picture.

## Setup

### OAuth

After the first run you have to open the logs (Cmd|Ctrl + Enter) and open the
OAuth url(s) manually, thusly (a) token(s) will be generated, wich will be
refreshed automatically in the future.

### Options

The options parameter is a JavaScript object:

	{
		// Set 'contacts' (object) to:
		// { clientId: '...', clientSecret: '...' }
		// (Generate credentials for OAuth. In Apps Script:
		//  Resources > Developer Console Project... > 'project-id-...'
		//  > Credentials )
		contacts: {
		  clientId: '...',
		  clientSecret: '...'
		},
		
		// Set 'xing' (object or boolean) to:
		// false to deactivate
		// true to activate without OAuth (only public profiles)
		// { consumerKey : '...', consumerSecret: '...' } to activate with OAuth
		// (Generate test key for OAuth:
		//  https://dev.xing.com/applications/dashboard )
		xing: {
		  consumerKey: '...',
		  consumerSecret: '...'
		},
		
		// boolean, if the contacts url addresses should be checked for facebook
		// profile urls
		facebook: 1,
		
		// boolean, if the contacts email addresses should be checked for
		// gravatars (could slow down the first runs)
		gravatar: 1
	}

## Usage

- Create a [new Google Apps Script file](https://script.google.com/intro) and
give it a project name.
- In `Resources` > `Libraries...` search for the library:  
	`1NKFJku2cBHPRH_lilQPnEH1tduOO2mBm3wAq-nV_mXizNG41Qg7EYJ9v`  
	and click on `Select`.
- Select the newest version and let the development mode turned off.
- Click on `Save` and add the following code:

	// The main function to run the ContactsSocialPhotos
	function contacts() {
		ContactsSocialPhotos.run(opts());
	}
	
	// Options (see "Options" in the README.md)
	function opts() {
		return {
			contacts: {
				clientId: '...',
				clientSecret: '...'
			},
			xing: {
				consumerKey: '...',
				consumerSecret: '...'
			},
			facebook: 1,
			gravatar: 1
		};
	}
	
	// This function will be called after any OAuth authorization.
	function authCallback(request) {
		return ContactsSocialPhotos.authCallback(request, opts());
	}

- Modify the options (the object in the `opts` function), the contacts OAuth
credentials are required (see "[Options](#Options)" above).
- Run the `contacts` function.

### First run

If it is your first run you get an error message. Open the logs (Cmd|Ctrl +
Enter), copy the OAuth links, and open them in a new window. After both OAuth
authorizations succeeded re-run the `contacts` function. This time the script
should load a while (the Google Contacts API is slow).

### Logs and Errors

After each run you can
view the logs to see which contacts profile picture has been successfully
changed.
If you get a timeout error just re-run the script. The script caches some
requests so that it can continue after each crash.

## Add triggers (cron jobs)

Click on `Resources` > `Current project's triggers` to add the `contacts`
function as a Time-driven trigger. You could execute it once or twice a day to
stay updated.