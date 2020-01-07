import { Component, Fragment } from 'react';
import config from '../../configs/comps';
import styles from './index.scss';
import {
  Icon
} from 'antd';

class ComponentManage extends Component {
  constructor(props) {
    super(props);
  }

  onClick = () => {

  }

  render() {
    return (
      <div className={styles.blockWrap}>
        {
          config.map(o => {
            return (
              <Fragment key={o.key}>
                <div className={styles.blockTitle}>
                  <Icon type="right" /><span className={styles.text}>{o.groupName}</span>
                </div>
                <div className={styles.blockContent}>
                  {
                    (o.item || []).map(s => {
                      return <div key={s.key} className={styles.item}>
                         <Icon type="block" className={styles.icon} />
                        <div className={styles.info}><span className={styles.key}>{s.key}</span></div>
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