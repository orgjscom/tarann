module.exports = {

    'facebook': {
        'clientID': 'your client ID here',
        'clientSecret': 'your client secret here',
        'requestURL': 'https://www.facebook.com/dialog/oauth?client_id=[client_id]&redirect_uri=[redirect_uri]&response_type=code&scope=email',
        'callbackURL': 'https://demo.taracot.org/auth/facebook'
    },

    'google': {
        'clientID': '456384544947-nfgfo33up10he046213cnv9o0p8gq98m.apps.googleusercontent.com',
        'clientSecret': 'rBCV9SoYlRrjy0IsbjzgwoVP',
        'requestURL': 'https://accounts.google.com/o/oauth2/auth?redirect_uri=[redirect_uri]&response_type=code&client_id=456384544947-nfgfo33up10he046213cnv9o0p8gq98m.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile',
        'callbackURL': 'https://demo.taracot.org/auth/google'
    },

    'yandex': {
        'clientID': 'f7193f7de386490c95cc15ff5b32f123',
        'clientSecret': 'a806bef5a22249109d98558a9441d0f0',
        'requestURL': 'https://oauth.yandex.ru/authorize?response_type=code&client_id=f7193f7de386490c95cc15ff5b32f123',
        'callbackURL': 'https://oauth.yandex.ru/verification_code'
    },

    'vk': {
        'clientID': 'your client ID here',
        'clientSecret': 'your client secret here',
        'requestURL': 'http://oauth.vk.com/authorize?client_id=[client_id]&redirect_uri=[redirect_uri]&response_type=code',
        'callbackURL': 'https://demo.taracot.org/auth/vk'
    }

};
