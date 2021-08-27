
// import page interface
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class AuthPage extends Struct {

  /**
   * returns page type
   */
  get type() {
    // return page type label
    return 'auth';
  }

  /**
   * returns page type
   */
  get icon() {
    // return page type label
    return 'fad fa-users text-primary';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'Authentication';
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view   : 'page/auth',
      config : 'page/auth/config',
      
      login    : 'login',
      social   : 'social',
      register : 'register',
    };
  }

  /**
   * returns category list for page
   */
  get categories() {
    // return array of categories
    return ['API'];
  }

  /**
   * returns page descripton for list
   */
  get description() {
    // return description string
    return 'Embedable login, registration, and forgot password API';
  }
}