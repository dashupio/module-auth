
// import dependencies
import React, { useState } from 'react';
import { Page, Grid, View, Hbs } from '@dashup/ui';
import { Dropdown, OverlayTrigger, Popover, Button } from 'react-bootstrap';

// create model page
const AuthPage = (props = {}) => {
  // groups
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevent, setPrevent] = useState(false);
  const [selected, setSelected] = useState({ type : 'items', items : [] });

  // required
  const required = [{
    key   : 'data.model',
    label : 'Model',
  }, {
    key   : 'data.form',
    label : 'Form',
  }];

  // load data
  const loadData = async () => {
    // get total
    const newTotal = await props.getQuery().count();

    // set number total
    setTotal(newTotal);

    // return items
    return {
      total : newTotal,
      items : await props.getQuery().skip(skip).limit(props.page.get('data.limit') || 25).listen(),
    };
  };

  // render field
  const renderField = (item, column) => {
    // find field
    const field = props.getField(column.field);

    // save item
    const saveItem = async () => {
      // set saving
      setSaving(true);

      // save
      await item.save();

      // set saving
      setSaving(false);
    };

    // check if custom
    if (column.field === 'custom') return (
      <div className="grid-column-content">
        <Hbs template={ column.view || '' } data={ item.toJSON() } />
      </div>
    );

    // return no field
    return field && (
      <OverlayTrigger trigger="click" placement="bottom-start" className="grid-column-content" rootClose overlay={ (
        <Popover className="popover-grid">
          <div className="p-2">
            <View
              view="input"
              type="field"
              item={ item }
              field={ field }
              value={ item.get(field.name || field.value) }
              struct={ field.type }
              dashup={ props.dashup }
              column={ column }
              onChange={ (f, value) => item.set(field.name || field.value, value) }
              setPrevent={ setPrevent }
            >
              <div className="text-center">
                <i className="fa fa-spinner fa-spin" />
              </div>
            </View>
            <Button variant="primary" disabled={ saving || prevent } className="w-100" onClick={ (e) => saveItem() }>
              { prevent ? 'Uploading...' : (saving ? 'Saving...' : 'Submit') }
            </Button>
          </div>
        </Popover>
      ) }>
        <div className="grid-column-content">
          <View
            view="view"
            type="field"
            item={ item }
            field={ field }
            value={ item.get(field.name || field.value) }
            struct={ field.type }
            dashup={ props.dashup }
            column={ column }
            >
            <div className="text-center">
              <i className="fa fa-spinner fa-spin" />
            </div>
          </View>
        </div>
      </OverlayTrigger>
    );
  };

  // set actions
  const actions = [
    ...(props.getForms().map((form) => {
      return {
        id      : form.get('_id'),
        icon    : form.get('icon'),
        content : form.get('name'),
      };
    })),

    ...(props.getForms().length ? ['divider'] : []),

    ...(props.getForms()[0] && props.getForms()[0].get ? [{
      id   : 'remove',
      href : (item) => {
        return props.getForms()[0] ? `/app/${props.getForms()[0].get('_id')}/${item.get('_id')}/remove?redirect=${window.location.href}` : null;
      },
      icon    : 'trash fas',
      content : 'Remove',
      variant : 'danger',
    }] : []),
  ];

  // set sort
  const setSort = async (column, way) => {
    // let sort
    let sort;
    
    // set sort
    if (!column) {
      sort = null;
    } else {
      // create sort
      sort = {
        way,
  
        id    : column.id,
        sort  : column.sort,
        field : column.field,
      };
    }

    // set loading
    setLoading(true);

    // set data
    await props.setData('sort', sort);

    // set loading
    setLoading(false);
  };

  // set sort
  const setLimit = async (limit = 25) => {
    // set loading
    setLoading(true);

    // set data
    await props.setData('limit', limit);

    // set loading
    setLoading(false);
  };

  // set columns
  const setColumns = async (columns) => {
    // set page data
    props.setData('columns', columns);
  };

  // is selected
  const isSelected = (item) => {
    // check type
    if (selected.type === 'all') return true;
    if (selected.type === 'items') return selected.items.includes(item.get('_id'));
    if (selected.type === 'minus') return !selected.items.includes(item.get('_id'));
  };

  // on select
  const onSelect = (item) => {
    // set selected

    // check type
    if (item === 'clear') {
      // fix clear
      selected.type  = 'items';
      selected.items = [];
    } else if (item === 'all') {
      if (selected.type === 'all') {
        selected.type = 'items';
      } else {
        selected.type  = 'all';
        selected.items = [];
      }
    } else {
      // is selected
      const isItemSelected = isSelected(item);
  
      // check type
      if (selected.type === 'all') {
        selected.type  = 'minus';
        selected.items = [item.get('_id')];
      } else if (selected.type === 'items' && isItemSelected) {
        // set item
        selected.items = selected.items.filter((id) => id !== item.get('_id'));
      } else if (selected.type === 'minus' && isItemSelected) {
        // push item
        selected.items.push(item.get('_id'));
      } else if (!isItemSelected) {
        // check minus
        if (selected.type === 'minus') {
          // filter minused item
          selected.items = selected.items.filter((id) => id !== item.get('_id'));

          // check minus
          if (!selected.items.length) selected.type = 'all';
        } else {
          // push
          selected.items.push(item.get('_id'));
        }
      }
    }

    // total
    if (selected.type === 'all') selected.total = total;
    if (selected.type === 'minus') selected.total = total - (selected.items.length);
    if (selected.type === 'items') selected.total = selected.items.length;

    // set selected
    setSelected({ ...selected });
  };

  // return jsx
  return (
    <Page { ...props } loading={ loading } require={ required } bodyClass="flex-column">

      <Page.Config show={ config } onHide={ (e) => setConfig(false) } />

      <Page.Menu onConfig={ () => setConfig(true) } onShare>
        <>
          { !props.page.get('data.group') && (
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-limit" className="me-2">
                Per Page:
                <b className="ms-1">{ props.page.get('data.limit') || 25 }</b>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={ (e) => props.setData('limit', 25) }>
                  25
                </Dropdown.Item>
                <Dropdown.Item onClick={ (e) => props.setData('limit', 50) }>
                  50
                </Dropdown.Item>
                <Dropdown.Item onClick={ (e) => props.setData('limit', 75) }>
                  75
                </Dropdown.Item>
                <Dropdown.Item onClick={ (e) => props.setData('limit', 100) }>
                  100
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) }
          { props.dashup.can(props.page, 'submit') && !!props.getForms().length && (
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-create" className="me-2">
                <i className="fat fa-plus me-2" />
                Create
              </Dropdown.Toggle>

              <Dropdown.Menu>
                { props.getForms().map((form) => {

                  // return jsx
                  return (
                    <Dropdown.Item key={ `create-${form.get('_id')}` } onClick={ (e) => props.setData('limit', 25) }>
                      <i className={ `me-2 fa-${form.get('icon') || 'pencil fas'}` } />
                      { form.get('name') }
                    </Dropdown.Item>
                  );
                }) }
              </Dropdown.Menu>
            </Dropdown>
          ) }
        </>
      </Page.Menu>
      SUB MENU
      <Page.Body>
        <Grid
          id={ props.page.get('_id') }
          skip={ skip }
          sort={ props.page.get('data.sort') || {} }
          limit={ props.page.get('data.limit') || 25 }
          columns={ props.page.get('data.columns') || [] }
          available={ props.getFields() }

          canAlter={ props.dashup.can(props.page, 'alter') }
          canSubmit={ props.dashup.can(props.page, 'submit') }

          setSort={ setSort }
          setSkip={ setSkip }
          actions={ actions }
          loadData={ loadData }
          setLimit={ setLimit }
          setColumns={ setColumns }
          renderField={ renderField }
        >
          <Grid.Group
            onSelect={ onSelect }
            selected={ selected }
            isSelected={ isSelected }
          />
        </Grid>
      </Page.Body>
    </Page>
  );
};

// export default model page
export default AuthPage;