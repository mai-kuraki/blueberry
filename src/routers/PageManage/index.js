import { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import DirectoryTree from '../../components/DirectoryTree';

@connect(state => state.app)
class PageManage extends Component {
  onExpand = expandedDirKeys => {
    this.props.dispatch({
      type: 'app/updateState',
      payload: {
        fields: {
          expandedDirKeys
        }
      }
     });
  }

  render() {
    const { projectDir, expandedDirKeys } = this.props;
    return (
      <div style={{height: '2000px'}}>
        <div className={styles.dirTree}>
          <DirectoryTree
            treeData={projectDir}
            expandedKeys={expandedDirKeys}
            onExpand={this.onExpand}
          />
        </div>
      </div>
    )
  }
}

export default PageManage;