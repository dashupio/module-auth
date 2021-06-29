// import react
import React, { useRef, useState } from 'react';

// auth login
const AuthRegister = (props = {}) => {
  // state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // ref
  const formRef = useRef(null);

  // expound props
  const { dashup } = props;

  // fields
  const fields = [
    {
      name  : 'name',
      type  : 'text',
      label : 'Name',
    },
    {
      name  : 'username',
      type  : 'text',
      label : 'Username',
    },
    {
      name  : 'email',
      type  : 'email',
      label : 'Email',
    },
    {
      name  : 'password',
      type  : 'password',
      label : 'Password',
    },
    {
      name  : 'passworda',
      type  : 'password',
      label : 'Password Again',
    }
  ];

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
      result = await props.page.register(data);
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
    setSuccess('Successfully registered');
    setLoading(false);
  }

  // get class
  const getClass = (name, def) => {
    // classes
    const classes = props.classes || {};
    
    // check name
    if (!classes[name]) return def;

    // return props
    return classes[name];
  };

  // get action
  const getAction = () => {
    // get dashup and page
    const page = props.page;

    // get url
    return `${dashup.opts.url}/api/auth/${page.get('_id')}/register`;
  };

  // return jsx
  return (
    <form accept-charset="UTF-8" className={ getClass('form', 'dashup-register') } onSubmit={ (e) => onSubmit(e) } role="form" method="post" action={ getAction() }>        
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

      { fields.map((field, i) => {
        // check if field exists
        if (!(field.name.includes('password') || props.page.get(`data.field.${field.name}`))) return null;
        
        // return jsx
        return (
          <div key={ `field-${field.name}` } className={ getClass('formGroup', 'mb-3') }>
            <label htmlFor={ field.name } className="form-label">
              { field.label }
            </label>
            <input className={ getClass('formControl', 'form-control') } placeholder={ field.label } name={ field.name } type={ field.type } id={ field.name } autoComplete={ field.name } />
            <div className="invalid-feedback">
              Please fill in your { field.label }
            </div>
          </div>
        );
      }) }

      <button type="submit" className={ `${getClass('submitButton', 'btn btn-primary btn-lg btn-block')}${loading ? ' disabled' : ''}` } tabIndex={ 4 }>
        { loading ? 'Registering...' : 'Register' }
      </button>
    </form>
  )
};

// export default
export default AuthRegister;