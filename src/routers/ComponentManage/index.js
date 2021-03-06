import { Component, Fragment } from 'react';
import config from '../../configs/comps';
import styles from './index.scss';
import _ from 'lodash';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  ExperimentTwoTone
} from '@ant-design/icons';

class ComponentManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: _.cloneDeep(config).map(o => {
        o.open = true;
        return o;
      })
    }
  }

  onClick = () => {

  }

  render() {
    const {
      config
    } = this.state;
    return (
      <div className={styles.blockWrap}>
        {
          config.map(o => {
            return (
              <Fragment key={o.key}>
                <div className={styles.blockTitle} onClick={() => {
                  o.open = !o.open;
                  this.setState({
                    config
                  })
                }}>
                  {
                    o.open?
                    <CaretDownOutlined  style={{fontSize: '10px'}}/>:
                    <CaretUpOutlined  style={{fontSize: '10px'}}/>
                  }
                  <span className={styles.text}>{o.groupName}</span>
                </div>
                <div className={`${styles.blockContent} ${o.open?styles.blockContentOpen:''}`}>
                  {
                    (o.item || []).map(s => {
                      return <div key={s.key} className={styles.item}>
                         <ExperimentTwoTone className={styles.icon} />
                        <div className={styles.info}><span className={styles.key}>{s.name}</span></div>
                      </div>
                    })
                  }
                </div>
              </Fragment>
            )
          })
        }
        </div>
    )
  }
}

export default ComponentManage;