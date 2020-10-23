
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
    return 'fa fa-users';
  }

  /**
   * returns page type
   */
  get title() {
    // return page type label
    return 'Auth Page';
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      login    : 'login',
      social   : 'social',
      register : 'register',

      view     : 'page/auth/view',
      menu     : 'page/auth/menu',
      config   : 'page/auth/config',
      filter   : 'page/auth/filter',
      connects : 'page/auth/connects',
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
    return 'Page Descripton';
  }
}