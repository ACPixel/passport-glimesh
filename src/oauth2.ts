// @ts-nocheck

import Axios from "axios";

/**
 * Module dependencies.
 */
var util = require("util"),
  OAuth2Strategy = require("passport-oauth").OAuth2Strategy,
  InternalOAuthError = require("passport-oauth").InternalOAuthError;

/**
 * Setting the Mixer.com url.
 */
var GLIMESH_LINK = "https://glimesh.tv/";

/**
 * `Strategy` constructor.
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL || GLIMESH_LINK + "oauth/authorize";
  options.tokenURL = options.tokenURL || GLIMESH_LINK + "api/oauth/token";
  options.approval_prompt = true;
  OAuth2Strategy.call(this, options, verify);

  this.name = "glimesh";
  this._oauth2.setAuthMethod("OAuth");
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Mixer.Com.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `mixer`
 *   - `id`
 *   - `username`
 *   - `email`
 *   - `_raw`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  let q = `
  {
    myself {
      username,
      avatar,
      id,
      displayname
    }
  }
  `;
  Axios.post(
    `${GLIMESH_LINK}/api`,
    { query: q },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
    }
  )
    .then(({ data }) => {
      data.data.myself.avatar = "https://glimesh.tv" + data.data.myself.avatar;
      done(null, data.data.myself);
    })
    .catch(({ response }) => {
      done(response.data);
      console.error(response.data);
    });
};

/**
 * Return extra parameters to be included in the authorization request.
 *
 * Some OAuth 2.0 providers allow additional, non-standard parameters to be
 * included when requesting authorization.  Since these parameters are not
 * standardized by the OAuth 2.0 specification, OAuth 2.0-based authentication
 * strategies can overrride this function in order to populate these parameters
 * as required by the provider.
 *
 * @param {Object} options
 * @return {Object}
 */

Strategy.prototype.authorizationParams = function (options) {
  return { approval_prompt: "force" };
};

/**
 * Expose `Strategy`.
 */
export default Strategy;
