import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import { menusConfig } from '../../configs/settings';
import WorkspaceModal from '../WorkspaceModal';
import NewProjectModal from '../NewProjectModal';
import {
  Menu, 
  Dropdown,
  message,
  Icon
} from 'antd';
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

  handleMenuClick = key => {
    switch(key) {
      case 'newProject':
        this.onNewProjectOpen();
        break;
      case 'openProject':
        break;
      case 'workSpace':
        this.onWorkspaceOpen();
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
            <Icon type="setting" style={{color: '#fff', fontSize: '26px'}} />
          </Dropdown>
        </div>
      </Fragment>
    )
  }
}

export default Setting;
