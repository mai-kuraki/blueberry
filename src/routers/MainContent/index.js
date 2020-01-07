import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import minimizeIcon from '../../assets/svgs/small.svg';
import maximizeIcon from '../../assets/svgs/fullscreen.svg';
import unmaximizeIcon from '../../assets/svgs/screen.svg';
import closeIcon from '../../assets/svgs/close.svg';
import closeWIcon from '../../assets/svgs/close-w.svg';
import EmptyPage from '../../components/EmptyPage';
import Editor from '../../components/Editor';
import styles from './index.scss';
import {
  Tabs
} from 'antd';
const { TabPane } = Tabs;

@connect(state => state)
class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeHover: false,
      render: false
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

  onChange = activeTab => {
    this.props.dispatch({
      type: 'app/updateState',
      payload: {
        fields: {
          activeWindow: activeTab
        }
      }
    })
  }

  addNewWindow = () => {
    this.props.dispatch({
      type: 'app/newWindow',
      payload: {
        id: '12',
        title: 'rrr'
      }
    })
  }

  onEdit = (targetKey, action) => {
    if(action === 'remove') {
      this.props.dispatch({
        type: 'app/closeWindows',
        payload: {
          id: targetKey
        }
      })
    }
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

  render() {
    const {
      app: {
        windows = [],
        activeWindow
      },
      page: {
        item = []
      }
    } = this.props;
    const {
      closeHover
    } = this.state;
    const isMaximized = remote.getCurrentWindow().isMaximized();
    return (
      <Fragment>
        <div className={styles.header}>
          <div className={styles.windowTab}>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={activeWindow}
              type="editable-card"
              onEdit={this.onEdit}
            >
              {
                windows.map(pane => (
                  <TabPane tab={pane.title} key={pane.id}/>
                ))
              }
            </Tabs>
          </div>
          <div className={styles.drag}></div>
          <div className={styles.windowAction}>
              <div className={styles.minimize} onClick={this.minimize}>
                <img src={minimizeIcon}/>
              </div>
              <div className={styles.maximize} onClick={this.maximize}>
                <img src={isMaximized?unmaximizeIcon:maximizeIcon}/>
              </div>
              <div className={styles.close} 
              onClick={this.close} 
              onMouseEnter={() => {
                this.setState({closeHover: true})
              }}
              onMouseLeave={() => {
                this.setState({closeHover: false})
              }}
              >
                <img src={closeHover?closeWIcon:closeIcon}/>
              </div>
            </div>
        </div>
        <div className={styles.windowWrap}>
          {
            (activeWindow && item.length > 0) && (
              item.map(o => <Editor
                key={o.id}
                id={o.id}
              />)
            )
          }
          {
            (!activeWindow || item.length === 0) && <EmptyPage/>
          }
        </div>
      </Fragment>
    )
  }
}

export default MainContent;