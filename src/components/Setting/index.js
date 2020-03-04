import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import { menusConfig } from '../../configs/settings';
import WorkspaceModal from '../WorkspaceModal';
import NewProjectModal from '../NewProjectModal';
import { ipcRenderer } from 'electron';
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
  WIN_SCAN_PROJECT_REPLY
} from '../../../app/consts/event';
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
    }
  }

  componentDidMount() {
    ipcRenderer.on(WIN_SCAN_PROJECT_REPLY, (e, arg) => {
      const { data } = arg;
     if(data && data.length > 0) {
       const dir = data[0].children;
       console.log(dir)
       this.props.dispatch({
        type: 'app/updateState',
        payload: {
          fields: {
            projectDir: dir
          }
        }
       })
     }
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

  onOpenProject = () => {
    ipcRenderer.send(WIN_SCAN_PROJECT, {});
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
