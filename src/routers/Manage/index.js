import { Component } from 'react';
import { connect } from 'react-redux';
import EmptyIcon from '../../assets/svgs/website.svg';
import styles from './index.scss';

@connect(state => state.app)
class Home extends Component {
  constructor(props) {
    super(props);
  }

  onClick = () => {

  }

  render() {
    return (
      <div className={styles.emptyWrap} onClick={this.onClick}>
        <div className={styles.emptyIcon}>
          <img src={EmptyIcon}/>
        </div>
      </div>
    )
  }
}

export default Home;