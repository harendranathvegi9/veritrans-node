'use strict';

const http = require('../http');
const validate = require('./validate_transaction');
const utils = require('../utils');

module.exports = function(Veritrans) {
    const options = {
        authorization: Veritrans.credentials.serverKey + ':',
    };

    const cards = {
        token(payload, callback) {
            validate.validateForToken(payload, err => {
                if (err) {
                    return callback(err);
                }

                http.post(`${Veritrans.baseUrl}/token`, payload, options, (err, response) => {
                    if (err) {
                        return callback(err);
                    }

                    const body = response.body;

                    if (parseInt(body.status_code) >= 400) {
                        const error = new Error(body.status_message);
                        error.code = body.status_code;

                        console.log(error);

                        return callback(error);
                    }

                    return callback(null, body);
                });
            });
        }
    };

    return cards;
};