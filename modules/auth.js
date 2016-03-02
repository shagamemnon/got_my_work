var config = require('../config')
    , Parse = require('parse').Parse
    , payment = require('./payment');

Parse.initialize(config.parse.appId, config.parse.JSKey, config.parse.MsKey);

var loginUser = (data, done, reject) => {
    if (data) {
        Parse.User.enableUnsafeCurrentUser();
        Parse.User.logIn(data.email, data.password, {
            success: (loggedIn) =>
                done({result: 'ok', answer: loggedIn})
            ,
            error: (user, error) =>
                reject({result: 'error', error: error})
        })
    } else
        reject({result: 'error', error: "missing credentials"});
};

var userSignUp = (data, done, reject) => {
    if ( data ) {
        var user = new Parse.User();
        user.set('username', data.email);
        user.set('fullName', data.userName);
        user.set('password', data.password);
        user.set('email', data.email);
        user.set('userRole', data.userRole ? data.userRole : "user");
        user.set('accountType', data.accountType ? data.accountType : "free");

        user.signUp(null, {
            success: (user) =>
                loginUser(data,
                    (loginRes) => done(loginRes),
                    (loginError) => reject(loginError)
                ),
            error: (user, error) =>
                reject({result: 'error', error: error})
        });
    } else
        reject({result: 'error', error: "missing data"});
};

var companySignUp = (data, done, reject) => {
    if ( data ) {
        var user = new Parse.User()
            , Company = Parse.Object.extend("Company")
            , query = new Company();

        query.set("name", data.companyName);
        data.accountType = "company";

        data.payment = {
            amount: config.accounts.company.payment,
            source: data.stripeToken,
            description: "Charge for company account on igotmyworks.com"
        };

        userSignUp(data,
            (signUpRes) => {
                console.log('company Sign', signUpRes);
                query.set('userId', signUpRes.answer.id);
                query.save(null, {
                    success: (company) => {
                        payment.makeCharge(data.payment,
                            (charge) => {
                                console.log(charge);
                                done({result: 'ok', user: signUpRes,  company: company, payment: charge});
                            },
                            (charge) =>
                                done({result: 'ok', user: signUpRes, company: company, payment: charge.error})
                        );
                    },
                    error: (obj, error) =>
                        reject({result: 'error', error: error})
                });
            },
            (signUpError) => reject(signUpError)
        );
    } else
        reject({result: 'error', error: "missing data"});
};

exports.loginUser = loginUser;
exports.userSignUp = userSignUp;
exports.companySignUp = companySignUp;