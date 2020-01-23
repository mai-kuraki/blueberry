import { Component } from 'react';
import styles from './index.scss';
import {
  Input
} from 'antd';
const { 
  Search
} = Input;

class SearchComp extends Component{
  constructor(props) {
    super(props);
    this.state = {
     
    }
  }

  render() {
    const {
      shadow
    } = this.props;
    return(
      <div className={styles.wrap}>
        <div className={styles.searchWrap}>
          <Search
            className={styles.input}
            placeholder="查找"
            onSearch={value => console.log(value)}
            style={{ width: '90%' }}
            allowClear
          />
        </div>
        {
          shadow && <div className={styles.shadow}></div>
        }
      </div>
    )
  }
}

export default SearchComp;
