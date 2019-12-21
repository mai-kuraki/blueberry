import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { reducersObj, rootEffect } from '../reducers';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers(reducersObj),
  composeEnhancer(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootEffect);

export default store;