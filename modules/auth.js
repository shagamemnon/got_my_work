'use strict';

var config = require('../config')
    , Parse = require('parse').Parse
    , payment = require('./payment')
    , parseQuery = require('./parseQuery');

Parse.initialize(config.parse.appId, config.parse.JSKey, config.parse.MsKey);

let loginUser = (data, done, reject) => {
    if (data) {
        Parse.User.enableUnsafeCurrentUser();
        Parse.User.logIn(data.email, data.password, {
            success: (loggedIn) => {
                if( loggedIn.attributes.accountType == "company" )
                    parseQuery.filterObjects({class: 'Company', filters: [{key: 'userId', condition: '=', value: loggedIn.id}], limit: 1},
                        (company) => {
                            loggedIn.company = company.object[0];
                            done({result: 'ok', answer: loggedIn});
                        },
                        (error) =>
                            done({result: 'ok', answer: loggedIn})
                    );
                else
                    done({result: 'ok', answer: loggedIn})
            }

            ,
            error: (user, error) =>
                reject({result: 'error', error: error})
        })
    } else
        reject({result: 'error', error: "missing credentials"});
};

let userSignUp = (data, done, reject) => {
    if ( data ) {
        var user = new Parse.User();
        let userData = {
            username: data.email,
            fullName: data.userName,
            password: data.password,
            email: data.email,
            phone: data.phone
        };
        userData.userRole = data.userRole ? data.userRole : "user";
        userData.accountType = data.accountType ? data.accountType : "free";

        user.signUp(userData, {
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

let companySignUp = (data, done, reject) => {
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
                                done({result: 'ok', user: signUpRes, company: company, payment: charge});
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