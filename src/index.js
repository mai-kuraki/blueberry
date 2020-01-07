import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import store from './store';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider, message  } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseFrame from './components/BaseFrame';
import {
  WIN_SEND_GLOBALCONFIG,
  WIN_UPDATECONFIG_REPLY
} from '../app/consts/event';

message.config({
  maxCount: 1,
});

window.config = {};
ipcRenderer.on(WIN_SEND_GLOBALCONFIG, (e, arg) => {
  window.config =  {
    ...window.config,
    ...arg
  }
  store.dispatch({
    type: 'app/readAppConfig'
  })
})

ipcRenderer.on(WIN_UPDATECONFIG_REPLY, (e, arg) =>{
  const { success } = arg;
  if(success) {
    store.dispatch({
      type: 'app/readAppConfig'
    })
  }
})

render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <Router>
        <BaseFrame/>
      </Router>
    </Provider>
  </ConfigProvider>, 
document.getElementById('root'))