import produce from 'immer';
import fs from 'fs';
import path from 'path';
import Logger from '../../../app/utils/logger';

export default {
  namespace: 'app',
  state: {
    appConfig: {
      workspace: ''
    }
  },
  reducers: {
    updatState(state, action) {
      const { payload: { fields } } = action;
      const newState = produce(state, draft => {
        Object.keys(fields).forEach(o => {
          draft[o] = fields[o];
        })
      })
      return newState;
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
              type: 'updatState',
              payload: {
                fields: {
                  appConfig
                }
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