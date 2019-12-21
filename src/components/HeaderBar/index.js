import { Component } from 'react';
import { remote } from 'electron';
import logoIcon from '../../assets/svgs/website.svg';
import minimizeIcon from '../../assets/svgs/small.svg';
import maximizeIcon from '../../assets/svgs/fullscreen.svg';
import unmaximizeIcon from '../../assets/svgs/screen.svg';
import closeIcon from '../../assets/svgs/close.svg';
import styles from './index.scss';
import { menusConfig } from '../../configs/headBarMenu';
import WorkspaceModal from '../WorkspaceModal';
import {
  Layout,
  Menu, 
  Dropdown
} from 'antd';
const { 
  Header
} = Layout;
const {
  SubMenu
} = Menu;

export default class HeaderBar extends Component{
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      workspaceModal: false
    }
    this.win = remote.getCurrentWindow();
  }

  componentDidMount() {
    const { render } = this.state;
    this.win.on('unmaximize', () => {
      this.setState({render: !render});
    });
    this.win.on('maximize', () => {
      this.setState({render: !render});
    });
  }

  minimize = () => {
    this.win.minimize();
  }

  maximize = () => {
    const { render } = this.state;
    if(this.win.isMaximized()) {
      this.win.unmaximize();
    }else {
      this.win.maximize();
    }
    this.setState({render: !render});
  }

  close = () => {
    this.win.close();
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

  handleMenuClick = key => {
    switch(key) {
      case 'newProject':
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
    const isMaximized = remote.getCurrentWindow().isMaximized();
    const {
      workspaceModal
    } = this.state;
    return(
      <div className={styles.headerWrap}>
        {
          workspaceModal && <WorkspaceModal
            visible={workspaceModal}
            onCancel={() => this.onWorkspaceClose()}
          />
        }
        <Header className={styles.header}>
          <div className={styles.logo}>
            <img src={logoIcon}/>
          </div>
          <div>
            {
              menusConfig.map(o => {
                return (
                  <div key={o.key} className={styles.menus}>
                    <Dropdown overlay={this.getMenuJSX(o.subItem)} trigger={['click']}>
                      <div tabIndex={-1} className={styles.menuBtn}>{o.title}</div>
                    </Dropdown>
                  </div>
                )
              })
            }
          </div>
          <div className={styles.windowAction}>
            <div className={styles.minimize} onClick={() => this.minimize()}>
              <img src={minimizeIcon}/>
            </div>
            <div className={styles.maximize} onClick={() => this.maximize()}>
              <img src={isMaximized?unmaximizeIcon:maximizeIcon}/>
            </div>
            <div className={styles.close} onClick={() => this.close()}>
              <img src={closeIcon}/>
            </div>
          </div>
        </Header>
      </div>
    )
  }
}