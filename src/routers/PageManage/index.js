import { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import DirectoryTree from '../../components/DirectoryTree';

@connect(state => state.app)
class PageManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: []
    }
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys
    })
  }

  render() {
    const { projectDir } = this.props;
    return (
      <div style={{height: '2000px'}}>
        <div className={styles.dirTree}>
          <DirectoryTree
            treeData={projectDir}
          />
        </div>
      </div>
    )
  }
}

export default PageManage;