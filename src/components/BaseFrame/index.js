import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { routeList } from '../../configs/route';
import MainContent from '../../routers/MainContent';
import Route from '../../route';
import Setting from '../Setting';
import Search from '../Search/';
import LogoIcon from '../../assets/svgs/lanmei.svg';
import styles from './index.scss';
import {
  RENDER_SIDE_MINIWIDTH
} from '../../../app/consts/app';
import {
  Layout,
  Menu
} from 'antd';
const { 
  Content,
  Sider
} = Layout;

@withRouter
@connect(state => state.app)
class BaseFrame extends Component {
  constructor(props) {
    super(props);
    const path = window.location.pathname;
    const arr = path.split('/');
    const activePath = arr[1] || 'manage';
    this.state = {
      activePath,
      position: 260,
      dragStart: false,
      isScroll: false
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  route = patch => {
    const { history } = this.props;
    history.push(`/${patch}`);
  }

  dragMouseDown = e => {
    this.setState({
      dragStart: true
    })
    this.x = e.clientX;
  }

  widthDrag = e => {
    const { position } = this.state;
    const minWidth = RENDER_SIDE_MINIWIDTH;
    const maxWidth = window.innerWidth - minWidth;
    const x = e.clientX;
    const offset = parseInt(x - this.x, 10);
    this.x = x;
    // if(offset > 0 && position === maxWidth) return;
    if(offset < 0 && position === minWidth) return;
    const sider = document.querySelector('#routeSider');
    const siderWidth = sider.offsetWidth;
    let newPosition = siderWidth + offset;
    if(newPosition < minWidth) {
      newPosition = minWidth;
    }else if(newPosition > maxWidth) {
      // newPosition = maxWidth;
    }
    this.setState({
      position: newPosition
    })
  }

  onMouseMove = e => {
    if(this.state.dragStart) {
      this.widthDrag(e);
    }
  }

  onMouseUp = () => {
    this.setState({
      dragStart: false
    })
  }

  onScroll = () => {
    const { isScroll } = this.state;
    const top = this.scrollBar.getScrollTop();
    if(isScroll !== top > 0) {
      this.setState({
        isScroll: top > 0
      })
    }
  }

  render() {
    const {
      activePath,
      position,
      dragStart,
      isScroll
    } = this.state;
    return <Layout className={styles.layout}
      style={{cursor: dragStart?'ew-resize':''}}
    >
      <Layout style={{ position: 'relative' }}>
        <div
          style={{left: `${position + 60 - 2}px`}}
          className={styles.widthDragBar}
          onMouseDown={this.dragMouseDown}
        ></div>
        <Sider width={60} style={{zIndex: 100, background: 'none'}}>
          <div className={styles.siderWrap}>
            <div className={styles.logo}>
              <img src={LogoIcon}/>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={activePath}
              className={styles.sider}
            >
              {
                routeList.map(o => <Menu.Item key={o.key} title={o.title} onClick={() => this.route(o.key)}>
                  <img src={o.icon} className={styles.icon}/>
                </Menu.Item>)
              }
            </Menu>
            <div className={styles.drag}></div>
            <Setting/>
          </div>
        </Sider>
        <div id="routeSider" style={{width: `${position}px`}} className={styles.routeSider}>
          <Search
            shadow={isScroll}
          />
          <div className={styles.scroll}>
            <Scrollbars
              ref={node => this.scrollBar = node}
              autoHide
              onScroll={this.onScroll}
              renderThumbVertical={props => {
                return <div {...props } className={styles.thumbBlock}></div>
              }}
              renderThumbHorizontal={props => {
                return <div {...props } className={styles.thumbHorBlock}></div>
              }}
            >
              <Route/>
            </Scrollbars>
          </div>
        </div>
        <Layout>
          <Content className={styles.mainContent}>
            <MainContent/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  }
}

export default BaseFrame;