// require first
const { Module } = require('@dashup/module');

// import base
const AuthPage = require('./pages/auth');

/**
 * export module
 */
class AuthModule extends Module {

  /**
   * construct discord module
   */
  constructor() {
    // run super
    super();
  }
  
  /**
   * registers dashup structs
   *
   * @param {*} register 
   */
  register(fn) {
    // register pages
    fn('page', AuthPage);
  }
}

// create new
module.exports = new AuthModule();
