const cookiesRepository = require('./cookies.repository.js');
const prompt = require('./prompt.service.js');
const http = require('./http.service.js');

function formatCookies(res) {
    return res.raw.headers['set-cookie'].reduce((concatenated, cookie) => concatenated.concat('; ').concat(cookie));
}


exports.signIn = function () {
    return cookiesRepository
        .load()
        .then(cookies => http.fetchJSON('https://mtgahelper.com/api/Account', cookies)
            .then(account => assertCurrentCookiesAreValid(account, cookies)))
        .catch(error => signInForNewCookie(error));
}


function assertCurrentCookiesAreValid(account, cookies) {
    if (account.isAuthenticated) {
        console.log(">>>>> valid user cookie was found! \\o/");
        return cookies;
    } else {
        throw new Error('valid-cookie-unavailable', 'Invalid Cookie');
    }
}

function signInForNewCookie(error) {
    if (error.code !== 'ENOENT' && error.name !== 'valid-cookie-unavailable') {
        console.log(error);
    }
    console.log('>>>>> Unable to use an existing cookie. Attempting to aquire a new one. =(');
    return fetchPreSignInCookies().then(cookies => fetchValidUserCookies(cookies));
}

function fetchPreSignInCookies() {
    return http.fetch('https://mtgahelper.com/api/User/Register').then(formatCookies)
}

function fetchValidUserCookies(cookies) {
    console.log(">>>>> signing in...");

    return prompt
        .prompt('user: ')
        .then(user => setUser(user))
        .then(auth => prompt.prompt('password: ', true).then(password => setPassword(password, auth)))
        .then(auth => http.fetch('https://mtgahelper.com/api/Account/Signin?email=' + auth.user.replace('@', '%40') + '&password=' + auth.password, cookies)
            .then(res => {
                signIn = JSON.parse(res.data);
                if (signIn.isAuthenticated === false) {
                    throw new Error('failed-signin-attempt', signIn.message);
                }
                return res;
            })
            .then(formatCookies)
            .then(cookies => {
                cookiesRepository.store(cookies);
                console.log(">>>>> signed in successfully!");
                return cookies;
            }));
}

function setUser(user) {
    if (!user) {
        throw new Error('no-user-given');
    }
    return { user: user }
}

function setPassword(password, auth) {
    if (!password) {
        throw new Error('no-password-given')
    }
    auth.password = password;
    return auth;
}
