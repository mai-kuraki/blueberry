import * as sagaEffects from 'redux-saga/effects';
import app from '../models/app';
import page from '../models/page';
const { takeEvery } = sagaEffects;
const reducersObj = {};
const effectsObj = {};
const reducersMap = {};

const updateMap = model => {
  const {
    reducers,
    namespace
  } = model;
  reducersMap[namespace] = reducers;
}

const createReducer = model => {
  const {
    state: initialState,
    namespace
  } = model;
  reducersObj[namespace] = (state = initialState, action) => {
    const { type } = action;
    let space = namespace;
    let actionType = type;
    if(type.indexOf('/') > -1) {
      const arr = type.split('/');
      space = arr[0];
      actionType = arr[1];
    }
    const reducers = reducersMap[space] || {};
    if(reducers[actionType]) {
      return reducers[actionType](state, action);
    }
    return state;
  }
}

const createEffect = model => {
  const {
    namespace,
    effects,
  } = model;
  Object.keys(effects).forEach(o => {
    effectsObj[`${namespace}/${o}`] = effects[o];
  })
}

const run = item => {
  item.forEach(o => {
    updateMap(o);
    createReducer(o);
    createEffect(o);
  })
}

run([
  app,
  page
]);

function *rootEffect() {
  const keys = Object.keys(effectsObj);
  for(let i = 0; i < keys.length; i++) {
    const name = keys[i];
    yield takeEvery(name, effectsObj[name], sagaEffects);
  }
}

export {
  reducersObj,
  rootEffect
}