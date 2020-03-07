import { useState, useEffect, Fragment } from 'react';
import { 
  FolderOutlined, 
  FolderOpenOutlined, 
  FileOutlined, 
  CaretDownOutlined, 
  CaretRightOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import styles from './index.scss';

const TreeNode = ({
  title,
  icon,
  type,
  children,
  deep,
  onExpand,
  data,
  expanded
}) => {
  const indents = [];
  for(let i = 0; i < deep; i ++) {
    indents.push(<div className={styles.indent}></div>);
  }
  return (
    <Fragment key={data.key}>
      <div className={styles.treeNode} onClick={() => {
          if(type === 'dir') {
            onExpand(data.key, !expanded);
          }
        }}>
        {indents}
        {type === 'dir' && <div className={styles.treeSwitch}>{expanded?<CaretDownOutlined/>:<CaretRightOutlined/>}</div>}
        {type === 'file' && <div className={styles.indent2}></div>}
        <div className={styles.treeContentWrap}>
          <div className={styles.treeIcon}>{icon}</div>
          <div className={styles.treeTitle}>{title}</div>
        </div>
      </div>
      {expanded && children}
    </Fragment>
  )
}

const DirctoryTree = ({
  treeData: initData = [],
  expandedKeys = [],
  onFileClick = () => {},
  onExpand = () => {}
}) => {
  const [treeData, setTreeData] = useState(initData);

  useEffect(() => {
    setTreeData(_.cloneDeep(initData));
  }, [initData]);

  const setDirStatus = (key, status) => {
    let newExpandedKeys = _.cloneDeep(expandedKeys);
    if(status) {
      if(newExpandedKeys.indexOf(key) === -1) {
        newExpandedKeys.push(key);
      }
    }else { 
      newExpandedKeys = newExpandedKeys.filter(o => o!== key);
    }
    onExpand(newExpandedKeys);
  }

  const getTreeNode = (data) => {
    const render = (items, deep) => {
      return items.map(o => {
        const { title, key, children, type } = o;
        const inExpanded = expandedKeys.indexOf(key) > -1;
        if(children) {
          let nextDeep = deep + 1;
          return <TreeNode 
            title={title} 
            key={key} 
            type={type}
            expanded={inExpanded}
            onExpand={setDirStatus}
            icon={inExpanded?<FolderOpenOutlined/>:<FolderOutlined/>}
            deep={deep}
            data={o}
          >
            {render(children, nextDeep)}
          </TreeNode>
        }else {
          if(type === 'dir') {
          return <TreeNode 
              title={title}
              key={key} 
              type={type}
              expanded={inExpanded}
              onExpand={setDirStatus}
              icon={inExpanded?<FolderOpenOutlined/>:<FolderOutlined/>}
              deep={deep}
              data={o}
            />
          }else {
            return <TreeNode 
              title={title} 
              key={key}
              type={type}
              icon={<FileOutlined/>} 
              onClick={onFileClick}
              deep={deep}
              data={o}
            />
          }
        }
      })
    }
    return render(data, 0);
  }
  return (
    <div>
      {getTreeNode(treeData)}
    </div>
  )
};

export default DirctoryTree;