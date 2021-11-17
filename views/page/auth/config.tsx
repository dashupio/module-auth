
// import react
import React from 'react';
import { Box, Divider, Query, TextField, MenuItem } from '@dashup/ui';

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

  // return jsx
  return (
    <>
      <TextField
        label="Auth Model"
        value={ props.page.get('data.model') }
        select
        onChange={ (e) => props.setData('model', e.target.value) }
        fullWidth
        helperText="The model this grid will display."
      >
        { getModels().map((option) => (
          <MenuItem key={ option.value } value={ option.value }>
            { option.label }
          </MenuItem>
        ))}
      </TextField>

      { !!props.page.get('data.model') && (
        <TextField
          label="Auth Form"
          value={ Array.isArray(props.page.get('data.form')) ? props.page.get('data.form') : [props.page.get('data.form')].filter((f) => f) }
          select
          onChange={ (e) => props.setData('form', e.target.value) }
          fullWidth
          helperText="The forms that this grid will filter by."
          SelectProps={ {
            multiple : true,
          } }
        >
          { getForms().map((option) => (
            <MenuItem key={ option.value } value={ option.value }>
              { option.label }
            </MenuItem>
          ))}
        </TextField>
      ) }

      { !!props.page.get('data.form') && (
        <TextField
          label="Choose Dashboard(s)"
          value={ props.page.get('data.dashboards') || [] }
          select
          onChange={ (e) => props.setData('dashboards', e.target.value) }
          fullWidth
          helperText="View Dashboards with this grids items.."
        >
          { getDashboards().map((option) => (
            <MenuItem key={ option.value } value={ option.value }>
              { option.label }
            </MenuItem>
          ))}
        </TextField>
      ) }

      { props.getFields && !!props.getFields().length && (
        <>
          <Box my={ 2 }>
            <Divider />
          </Box>
          
          { authFields.map((field, i) => {
            // return jsx
            return (
              <TextField
                key={ `field-${field.name}` }
                label={ `${field.label} Field` }
                value={ props.page.get(`data.field.${field.name}`) }
                select
                onChange={ (e) => onField(`field.${field.name}`, e.target.value) }
                fullWidth
                helperText={ `Auth ${field.label} Field.` }
              >
                { getField(`field.${field.name}`, field.type).map((option) => (
                  <MenuItem key={ option.value } value={ option.value }>
                    { option.label }
                  </MenuItem>
                )) }
              </TextField>
            );
          }) }
            
          <TextField
            label="Tag Field(s)"
            value={ Array.isArray(props.page.get('data.tag')) ? props.page.get('data.tag') : [props.page.get('data.tag')].filter((f) => f) }
            select
            onChange={ (e) => onField('tag', e.target.value) }
            fullWidth
            helperText="Selecting a tag field will allow you to tag tasks."
            SelectProps={ {
              multiple : true,
            } }
          >
            { getField('tag', ['select', 'checkbox']).map((option) => (
              <MenuItem key={ option.value } value={ option.value }>
                { option.label }
              </MenuItem>
            )) }
          </TextField>
            
          <TextField
            label="User Field(s)"
            value={ Array.isArray(props.page.get('data.user')) ? props.page.get('data.user') : [props.page.get('data.user')].filter((f) => f) }
            select
            onChange={ (e) => onField('user', e.target.value) }
            fullWidth
            helperText="Selecting a user field will allow you to assign tasks to that user."
            SelectProps={ {
              multiple : true,
            } }
          >
            { getField('user', ['user']).map((option) => (
              <MenuItem key={ option.value } value={ option.value }>
                { option.label }
              </MenuItem>
            )) }
          </TextField>

          <Box my={ 2 }>
            <Divider />
          </Box>
          
          <Query
            isString

            page={ props.page }
            label="Filter By"
            query={ props.page.get('data.filter') }
            dashup={ props.dashup }
            fields={ props.getFields() }
            onChange={ (val) => props.setData('filter', val) }
            getFieldStruct={ props.getFieldStruct }
          />
        </>
      ) }
    </>
  )
};

// export default
export default PageAuthConfig;