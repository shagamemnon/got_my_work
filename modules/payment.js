var config = require('../config')
    , stripe = require("stripe")(config.stripe);

var makeCharge = (data, done, reject) =>
    stripe.charges.create({
        amount: data.amount * 100, /* amount should be in cents */
        currency: config.currency,
        source: data.source, // obtained with Stripe.js
        description: data.description
    }, (err, charge) => {
        if (!err)
            done({result: 'ok', payment: charge});
        else {
            console.log("payment error", err);
            reject({result: 'error', error: err});
        }
    });

exports.makeCharge = makeCharge;