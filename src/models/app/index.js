import produce from 'immer';
import fs from 'fs';
import path from 'path';
import Logger from '../../../app/utils/logger';
import _ from 'lodash';

export default {
  namespace: 'app',
  state: {
    appConfig: {
      workspace: ''
    },
    projectDir: [],
    windows: [
      {
        title: 'mainpage',
        id: '1'
      },
      {
        title: 'mainpage2',
        id: '2'
      },
      {
        title: 'mainpage3',
        id: '3'
      }
    ],
    activeWindow: '1'
  },
  reducers: {
    updateState(state, action) {
      const { payload: { fields } } = action;
      return produce(state, draft => {
        Object.keys(fields).forEach(o => {
          draft[o] = fields[o];
        })
      })
    },
    updateAppConfig(state, action) {
      const { payload = {} } = action;
      return produce(state, draft => {
        Object.keys(payload).forEach(o => {
          draft.appConfig[o] = payload[o];
        })
      })
    },
    newWindow(state, action) {
      const { payload: { id, title } } = action;
      return produce(state, draft => {
        const { windows = [] } = draft;
        if(_.find(windows, o => o.id === id)) return state;
        windows.push({
          title,
          id
        })
        draft.windows = windows;
        draft.activeWindow = id;
      })
    },
    closeWindows(state, action) {
      const { payload: { id = '', ids = [] } } = action;
      let arr = [];
      if(ids.length > 0) {
        arr = ids;
      }
      if(id) {
        arr.push(id);
      }
      return produce(state, draft => {
        const { windows = [] } = draft;
        let { activeWindow = '' } = draft;
        const newWindows = _.filter(windows, o => arr.indexOf(o.id) === -1);
        if(newWindows.length === 0) {
          activeWindow = '';
        }
        if(arr.length > 1) {
          activeWindow = newWindows[0].id;
        }else {
          const index = _.findIndex(windows, o => o.id === arr[0]);
          if(index > -1) {
            if(activeWindow === windows[index].id) {
              if(index > 0) {
                activeWindow = windows[index - 1].id
              }else {
                activeWindow = windows[index + 1].id
              }
            }
          }
        }
        draft.activeWindow = activeWindow;
        draft.windows = newWindows;
      })
    }
  },
  effects: {
    *readAppConfig({ put }) {
      const { __baseDir = '' } = window.config;
      const configPath = path.join(__baseDir, '/settings/config.json');
      if(fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath);
        if(data) {
          const jsonStr = data.toString();
          try{
            const appConfig = JSON.parse(jsonStr);
            yield put({
              type: 'updateAppConfig',
              payload: {
                ...appConfig
              }
            })
          }catch(e) {
            Logger.error(e);
          }
        }
      }
    }
  }
}