// import react
import React, { useRef, useState } from 'react';

// auth login
const AuthLogin = (props = {}) => {
  // state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // ref
  const formRef = useRef(null);

  // expound props
  const { dashup } = props;

  // on submit
  const onSubmit = async (e) => {
    // if event
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // run
    setError(null);
    setSuccess(null);
    setLoading(true);

    // get data
    const data = {
      id : props.page.get('_id'),
    };
    let result = null;

    // setup data
    (new FormData(formRef.current)).forEach((value, key) => data[key] = value);

    // try/catch
    try {
      // call on dashup
      result = await props.page.login(data.email, data.password);
    } catch (e) {
      // do error
      if (props.error) {
        props.error(e);
      }
      
      // set error
      setError(e.toString());
      setLoading(false);
    }

    // on success
    if (props.success) {
      // do success
      props.success(result);
    }

    // set error
    setSuccess('Successfully logged in');
    setLoading(false);
  };

  // get class
  const getClass = (name, def) => {
    // classes
    const classes = props.classes || {};
    
    // check name
    if (!classes[name]) return def;

    // return props
    return classes[name];
  };

  // return jsx
  return (
    <form accept-charset="UTF-8" ref={ formRef } className={ getClass('form', 'dashup-login') } onSubmit={ (e) => onSubmit(e) } role="form">        
      <input className={ getClass('inputHidden', 'd-none') } name="key" value={ dashup.opts.key } type="hidden" />

      { !!error && (
        <div className={ getClass('alertError', 'alert alert-danger') } role="alert">
          { error }
        </div>
      ) }
      { !!success && (
        <div className={ getClass('alertSuccess', 'alert alert-success') } role="alert">
          { success }
        </div>
      ) }

      <div className={ getClass('formGroup', 'mb-3') }>
        <label htmlFor="email" className="form-label">Email</label>
        <input className={ getClass('formControl', 'form-control') } tabIndex={ 1 } placeholder="Email" name="email" type="email" autoComplete="email" />
        <div className="invalid-feedback">
          Please fill in your email
        </div>
      </div>

      <div className={ getClass('formGroup', 'mb-3') }>
        { !!props.forgotUrl && (
          <div className="float-right">
            <a href={ props.forgotUrl } className="text-small">
              Forgot Password?
            </a>
          </div>
        ) }
        <label htmlFor="password" className="form-label">Password</label>
        <input className={ getClass('formControl', 'form-control') } tabIndex={ 2 } placeholder="Password" name="password" type="password" autoComplete="current-password" />
        <div className="invalid-feedback">
          please fill in your password
        </div>
      </div>

      <div className={ getClass('formGroup', 'mb-3') }>
        <div className="form-check">
          <input type="checkbox" name="remember" className="form-check-input" tabIndex={ 3 } id="remember-me" />
          <label className="form-check-label" htmlFor="remember-me">Remember Me</label>
        </div>
      </div>

      <button type="submit" className={ `${getClass('submitButton', 'btn btn-primary btn-lg btn-block')}${loading ? ' disabled' : ''}` } tabIndex={ 4 }>
        { loading ? 'Logging in...' : 'Login' }
      </button>
    </form>
  );
};

// export default
export default AuthLogin;