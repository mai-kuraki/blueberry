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
  data
}) => {
  const indents = [];
  for(let i = 0; i < deep; i ++) {
    indents.push(<div className={styles.indent}></div>);
  }
  const { open } = data;
  return (
    <Fragment>
      <div className={styles.treeNode} key={data.key} onClick={() => {
          if(type === 'dir') {
            onExpand(data, !open);
          }
        }}>
        {indents}
        {type === 'dir' && <div className={styles.treeSwitch}>{open?<CaretDownOutlined/>:<CaretRightOutlined/>}</div>}
        {type === 'file' && <div className={styles.indent2}></div>}
        <div className={styles.treeContentWrap}>
          <div className={styles.treeIcon}>{icon}</div>
          <div className={styles.treeTitle}>{title}</div>
        </div>
      </div>
      {open && children}
    </Fragment>
  )
}

const DirctoryTree = ({
  treeData: initData = [],
  onFileClick = () => {}
}) => {
  const [treeData, setTreeData] = useState(initData);
  const [expandedKeys, setExpandedKeys] = useState([]);
  
  useEffect(() => {
    setDirStatus(null, true)
  }, []);

  useEffect(() => {
    const newTreeData = mergeDataStatus(_.cloneDeep(initData));
    setTreeData(newTreeData);
  }, [initData])

  const mergeDataStatus = tree => {
    const loop = (data) => {
      data.forEach(o => {
        const { children, key } = o;
        if(expandedKeys.indexOf(key) > -1) {
          o.open = true;
        }
        if(children) {
          loop(children);
        }
      })
    }
    loop(tree);
    return tree;
  }

  const setDirStatus = (node, status) => {
    const newData = _.cloneDeep(treeData);
    let keys = _.cloneDeep(expandedKeys);
    const loop = (data) => {
      data.forEach(o => {
        const { children } = o;
        if(node) {
          const { key } = node;
          if(o.key === key) {
            o.open = status;
          }
        }else {
          o.open = status;
        }
        if(o.open) {
          if(keys.indexOf(o.key) === -1) {
            keys.push(o.key);
          }
        }else {
          keys = _.filter(keys, k => k !== o.key);
        }
        if(children) {
          loop(children);
        }
      })
    }
    loop(newData);
    setTreeData(newData);
    setExpandedKeys(keys);
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