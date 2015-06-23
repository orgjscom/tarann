var config = {
	"port":  process.env.PORT || "3000",
	"gid": "",
	"uid": "",
	"protocol": "http",
	"layouts": {
		"default": "taracot_default",
		"avail": [
			"taracot_default"
		]
	},
	"locales": {
		"dev_mode": true,
		"detect_from_subdomain": true,
		"detect_from_query": false,
		"detect_from_cookie": false,
		"avail": [
			"en",
			"ru"
		]
	},
	"dir": {
		"storage": "../public/files",
		"storage_url": "/files",
		"avatars": "../public/images/avatars",
		"tmp": "../tmp"
	},
	"cookie": {
		"secret": "NTWXm84H6eUxXmlRNAoFfewvsrTLHcl3",
		"domain": "",
		"prefix": "taracotjs_locale_",
		"httpOnly": false,
		"secure": false,
		"maxAge": null,
		"path": "/"
	},
	"session": {
		"secret": "8XZ4AbgAgs4O7rnnsYhajZp7bo5VhCFb",
		"name": "taracotjs_session",
		"rolling": false,
		"resave": false,
		"proxy": true,
		"saveUninitialized": true,
		"unset": "destroy"
	},
	"salt": "U82ClYO4VIcrrTESXGedc4Q9wTumgn9VorBlqtu4pvf4HNu95aAAb3SSUgroGtS9",
	"redis": {
		"active": true,
		"host": "soapfish.redistogo.com",
		"port": 9817,
		"prefix": "redis://redistogo",
		"url": "redis://redistogo:a9bb306806ca5b9fef42839382b0c62a@soapfish.redistogo.com:9817/",
		"password": "a9bb306806ca5b9fef42839382b0c62a"
	},
	"mailer": {
		"sender": "TaracotJS <noreply@taracot.org>",
		"feedback": "TaracotJS <info@taracot.org>",
		"transport": "sendmail",
		"sendmail": {
			"path": "/usr/sbin/sendmail"
		},
		"smtp": {
			"service": "Gmail",
			"auth": {
				"user": "gmail.user@gmail.com",
				"pass": "password"
			}
		}
	},
	"mongo": {
		"url": "mongodb://taracot_cms:taracot_cms@ds035027.mongolab.com:35027/taracot_cms",
		"options": {
			"server": {
				"auto_reconnect": false,
				"poolSize": 10,
				"socketOptions": {
					"keepAlive": 1
				}
			},
			"db": {
				"numberOfRetries": 10,
				"retryMiliSeconds": 1000
			}
		}
	},
	"captcha": "captcha_native",
	"graphicsmagick": false,
	"max_upload_file_mb": 100,
	"max_upload_image_mb": 5,
	"max_edit_file_kb": 1024,
	"log": {
		"console": {
			"level": "info",
			"colorize": true
		},
		"file": {
			"level": "error",
			"filename": "../logs/taracotjs.log",
			"json": true,
			"maxsize": 1048576,
			"maxFiles": 3
		},
		"stack": true
	}
};

module.exports = config;