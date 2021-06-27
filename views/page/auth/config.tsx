
// import react
import React from 'react';
import { Query, Select } from '@dashup/ui';

// create page model config
const PageAuthConfig = (props = {}) => {
  
  // set fields
  const authFields = [
    {
      name  : 'name',
      type  : ['text'],
      label : 'Name'
    },
    {
      name  : 'email',
      type  : ['email'],
      label : 'Email'
    },
    {
      name  : 'username',
      type  : ['text'],
      label : 'Username'
    },
    {
      name  : 'password',
      type  : ['encrypt'],
      label : 'Password'
    },
  ];

  // get forms
  const getModels = () => {
    // get forms
    const models = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'model' && !page.get('archived');
    });

    // return mapped
    return models.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : props.page.get('data.model') === form.get('_id'),
      };
    });
  };

  // get forms
  const getForms = () => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'form' && page.get('data.model') === props.page.get('data.model') && !page.get('archived');
    });

    // return mapped
    return forms.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : props.page.get('data.form') === form.get('_id'),
      };
    });
  };

  // get dashboards
  const getDashboards = () => {
    // get forms
    const dashboards = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'dashboard' && page.get('data.model') === props.page.get('data.model') && !page.get('archived');
    });

    // return mapped
    return dashboards.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : (props.page.get('data.dashboards') || []).includes(form.get('_id')),
      };
    });
  };
  
  // get field
  const getField = (tld, types = []) => {
    // return value
    return props.getFields().map((field) => {
      // check type
      if (types.length && !types.includes(field.type)) return;

      // return fields
      return {
        label : field.label || field.name,
        value : field.uuid,

        selected : (props.page.get(`data.${tld}`) || []).includes(field.uuid),
      };
    }).filter((f) => f);
  };

  // on forms
  const onField = (tld, value) => {
    // set data
    props.setData(tld, value || null);
  };

  // on forms
  const onForm = (value) => {
    // set data
    props.setData('form', value ? value.value : null);
  };

  // on forms
  const onModel = (value) => {
    // set data
    props.setData('model', value ? value.value : null);
  };

  // on forms
  const onDashboards = (value) => {
    // set data
    props.setData('dashboards', value.map((v) => v.value));
  };

  // return jsx
  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          Auth Model
        </label>
        <Select options={ getModels() } defaultValue={ getModels().filter((f) => f.selected) } onChange={ onModel } />
        <small>
          The forms that this grid will filter by.
        </small>
      </div>

      { !!props.page.get('data.model') && (
        <div className="mb-3">
          <label className="form-label">
            Auth Form
          </label>
          <Select options={ getForms() } defaultValue={ getForms().filter((f) => f.selected) } onChange={ onForm } />
          <small>
            The forms that this grid will filter by.
          </small>
        </div>
      ) }

      { !! props.page.get('data.form') && (
        <div className="mb-3">
          <label className="form-label">
            Choose Dashboard(s)
          </label>
          <Select options={ getDashboards() } defaultValue={ getDashboards().filter((f) => f.selected) } onChange={ onDashboards } isMulti />
          <small>
            View Dashboards with this grids items.
          </small>
        </div>
      ) }

      { props.getFields && !!props.getFields().length && (
        <>
          <hr />
          
          { authFields.map((field, i) => {
            // return jsx
            return (
              <div className="mb-3">
                <label className="form-label">
                  { field.label } Field
                </label>
                <Select options={ getField(`field.${field.name}`, field.type) } defaultValue={ getField(`field.${field.name}`, field.type).filter((f) => f.selected) } onChange={ (value) => onField(`field.${field.name}`, value?.value) } isClearable />
                <small>
                  Auth { field.label } Field.
                </small>
              </div>
            );
          }) }
            
          <div className="mb-3">
            <label className="form-label">
              Tag Field(s)
            </label>
            <Select options={ getField('tag', ['select', 'checkbox']) } defaultValue={ getField('tag', ['select', 'checkbox']).filter((f) => f.selected) } onChange={ (value) => onField('tag', value.map((v) => v.value)) } isMulti />
            <small>
              Selecting a tag field will allow you to tag tasks.
            </small>
          </div>
            
          <div className="mb-3">
            <label className="form-label">
              User Field(s)
            </label>
            <Select options={ getField('user', ['user']) } defaultValue={ getField('user', ['user']).filter((f) => f.selected) } onChange={ (value) => onField('user', value.map((v) => v.value)) } isMulti />
            <small>
              Selecting a user field will allow you to assign tasks to that user.
            </small>
          </div>
            
          <div className="mb-3">
            <label className="form-label">
              Filter By
            </label>
            <Query
              isString

              page={ props.page }
              query={ props.page.get('data.filter') }
              dashup={ props.dashup }
              fields={ props.getFields() }
              onChange={ (val) => props.setData('filter', val) }
              getFieldStruct={ props.getFieldStruct }
              />
          </div>
        </>
      ) }
    </>
  )
};

// export default
export default PageAuthConfig;