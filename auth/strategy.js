'use strict';

const utils = require('../lib/utils');

module.exports = function (PassportOAuth2) {
  const InternalOAuthError = PassportOAuth2.InternalOAuthError;

  return utils.inherit(PassportOAuth2, {
    init: function (config, cb) {
      this.userURL = config.userURL;
      PassportOAuth2.call(this, config, cb);
      return this;
    },

    userProfile: function (accessToken, done) {
      this._oauth2.get(this.userURL, accessToken, function (err, body) {
        if (err) return done(new InternalOAuthError('error fetching user profile', err));

        try {
          done(null, JSON.parse(body));
        } catch (ex) {
          done(ex);
        }
      });
    }
  });
};
