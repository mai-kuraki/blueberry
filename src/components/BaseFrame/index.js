import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { routeList } from '../../configs/route';
import HeaderBar from '../HeaderBar';
import styles from './index.scss';
import {
  Layout,
  Menu,
  Icon
} from 'antd';
const { 
  Content,
  Sider
} = Layout;

const iconStyle = {
  color: '#FFF', 
  fontSize: '28px', 
  margin: '0px'
}

@connect(state => state.app)
class BaseFrame extends Component {
  constructor(props) {
    super(props);
    const path = window.location.pathname;
    const arr = path.split('/');
    const activePath = arr[1] || 'manage';
    this.state = {
      activePath
    }
  }

  route = patch => {
    const { history } = this.props;
    history.push(`/${patch}`);
  }

  render() {
    const {
      activePath
    } = this.state;
    const {
      children
    } = this.props;
    return <Layout className={styles.layout}>
      <HeaderBar/>
      <Layout style={{paddingTop: '40px'}}>
        <Sider width={60}>
          <Menu
            mode="inline"
            defaultSelectedKeys={activePath}
            className={styles.sider}
          >
            {
              routeList.map(o => <Menu.Item key={o.key} title={o.title} onClick={() => this.route(o.key)}>
                <Icon type={o.icon} style={iconStyle}/>
              </Menu.Item>)
            }

          </Menu>
        </Sider>
        <Layout>
          <Content className={styles.mainContent}>
            { children }
          </Content>
        </Layout>
      </Layout>
    </Layout>
  }
}

export default withRouter(BaseFrame);