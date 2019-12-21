import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import store from './store';
import Route from './route';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider, message  } from 'antd';
import {
  WIN_SEND_GLOBALCONFIG
} from '../consts/event';

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

render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <Route/>
    </Provider>
  </ConfigProvider>, 
document.getElementById('root'))