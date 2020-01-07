import { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';

@connect(state => state.app)
class PageManage extends Component {
  constructor(props) {
    super(props);
  }

  onClick = () => {

  }

  render() {
    return (
      <div style={{height: '2000px'}}>
        page
      </div>
    )
  }
}

export default PageManage;