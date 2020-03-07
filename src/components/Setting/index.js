import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import { menusConfig } from '../../configs/settings';
import WorkspaceModal from '../WorkspaceModal';
import NewProjectModal from '../NewProjectModal';
import { remote, ipcRenderer } from 'electron';
import {
  Menu, 
  Dropdown,
  message
} from 'antd';
import {
  SettingOutlined
} from '@ant-design/icons';
import {
  WIN_OPEN_DEV,
  WIN_SCAN_PROJECT,
  WIN_SCAN_PROJECT_REPLY,
  WIN_WILL_CLOSE
} from '../../../app/consts/event';
import db from '../../../app/utils/db';
import workdb from '../../../app/utils/workdb';
const {
  SubMenu
} = Menu;

@connect(({ app }) => app)
class Setting extends Component{
  constructor(props) {
    super(props);
    this.state = {
      workspaceModal: false,
      newProjectModal: false
    };
    this.win = remote.getCurrentWindow();
  }

  openLastProject = () => {
    const lastOpenDir = db.get('lastOpenDir').value();
    const expandedDirKeys = workdb(lastOpenDir).get('expandedDirKeys').value();
    lastOpenDir && this.onOpenProject(lastOpenDir);
    if(expandedDirKeys) {
      this.props.dispatch({
        type: 'app/updateState',
        payload: {
          fields: {
            expandedDirKeys
          }
        }
       });
    }
  }

  saveProjectDirectory = () => {
    const { expandedDirKeys = [], appConfig = {} } = this.props;
    const { lastOpenDir } = appConfig;
    workdb(lastOpenDir).set('expandedDirKeys', expandedDirKeys).write();
  }

  componentDidMount() {
    this.openLastProject();
    ipcRenderer.on(WIN_SCAN_PROJECT_REPLY, (e, arg) => {
      const { data, path } = arg;
     if(data && data.length > 0) {
       const dir = data[0].children;
       this.props.dispatch({
        type: 'app/updateState',
        payload: {
          fields: {
            projectDir: dir
          }
        }
       });
       db.set('lastOpenDir', path).write();
     }
    });
    ipcRenderer.on(WIN_WILL_CLOSE, () => {
      this.saveProjectDirectory();
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(WIN_SCAN_PROJECT_REPLY);
  }

  onWorkspaceOpen = () => {
    this.setState({
      workspaceModal: true
    })
  }

  onWorkspaceClose = () => {
    this.setState({
      workspaceModal: false
    })
  }

  onNewProjectOpen = () => {
    const { appConfig = {} } = this.props;
    const { workspace } = appConfig;
    if(!workspace) return message.warn('请先设置工作目录');
    this.setState({
      newProjectModal: true
    })
  }

  onNewProjectClose = () => {
    this.setState({
      newProjectModal: false
    })
  }

  onOpenDev = () => {
    ipcRenderer.send(WIN_OPEN_DEV);
  }

  onOpenProject = async (dir) => {
    if(dir) {
      return ipcRenderer.send(WIN_SCAN_PROJECT, { path: dir });
    }
    const { dialog } = remote;
    const { filePaths = [], canceled } = await dialog.showOpenDialog(this.win, {
      properties: ['openDirectory', 'promptToCreate']
    })
    if(canceled) return;
    if(filePaths.length === 0) return message.error('读取文件夹错误');
    const path = filePaths[0];
    ipcRenderer.send(WIN_SCAN_PROJECT, { path });
  }

  handleMenuClick = key => {
    switch(key) {
      case 'newProject':
        this.onNewProjectOpen();
        break;
      case 'openProject':
        this.onOpenProject();
        break;
      case 'workSpace':
        this.onWorkspaceOpen();
        break;
      case 'openDev':
        this.onOpenDev();
        break;
      default:
        return;
    }
  }

  getMenuJSX = (config = []) => {
    return (
      <Menu className={styles.menu} mode="vertical">
        {
          config.map(o => {
            if(o.subItem) {
              return (
                <SubMenu
                  key={o.key}
                  title={o.title}
                  popupClassName={styles.subMenu}
                >
                  {
                    o.subItem.map(sub => <Menu.Item 
                      key={sub.key}
                      onClick={() => this.handleMenuClick(sub.key)}
                    >{sub.title}</Menu.Item>)
                  }
                </SubMenu>
              )
            }else {
              return <Menu.Item 
                key={o.key}
                onClick={() => this.handleMenuClick(o.key)}
              >{o.title}</Menu.Item>
            }
          })
        }
      </Menu>
    )
  }

  render() {
    const {
      workspaceModal,
      newProjectModal,
    } = this.state;
    return(
      <Fragment>
        {
          workspaceModal && <WorkspaceModal
            visible={workspaceModal}
            onCancel={this.onWorkspaceClose}
          />
        }
        {
          newProjectModal && <NewProjectModal
            visible={newProjectModal}
            onCancel={this.onNewProjectClose}
          />
        }
        <div tabIndex={-1} className={styles.btn}>
          <Dropdown overlay={this.getMenuJSX(menusConfig)} trigger={['click']}>
            <SettingOutlined style={{color: '#fff', fontSize: '26px'}}/>
          </Dropdown>
        </div>
      </Fragment>
    )
  }
}

export default Setting;
