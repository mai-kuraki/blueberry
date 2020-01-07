import { Component } from 'react';
import { connect } from 'react-redux';
import { remote, ipcRenderer } from 'electron';
import styles from './index.scss';
import {
  Modal,
  Button,
  message
} from 'antd';
import {
  WIN_UPDATECONFIG,
  WIN_UPDATECONFIG_REPLY
} from '../../../app/consts/event';

@connect(state => state.app)
class WorkspaceModal extends Component {
  constructor(props) {
    super(props);
    const { appConfig = {} } = props;
    this.state = {
      path: appConfig.workspace || ''
    }
    this.win = remote.getCurrentWindow();
  }

  componentDidMount() {
    const { onCancel } = this.props;
    ipcRenderer.on(WIN_UPDATECONFIG_REPLY, (e, arg) =>{
      const { error } = arg;
      if(error) {
        message.error(error);
      }
      onCancel();
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(WIN_UPDATECONFIG_REPLY);
  }

  setDirDialog = async () => {
    const { dialog } = remote;
    const { filePaths = [], canceled } = await dialog.showOpenDialog(this.win, {
      properties: ['openDirectory', 'createDirectory', 'promptToCreate']
    })
    if(canceled) return;
    if(filePaths.length === 0) return message.error('读取文件夹错误');
    const path = filePaths[0];
    this.setState({
      path
    })
  }

  onOk = () => {
    const { path } = this.state;
    if(!path) return message.warn('请先选择目录');
    ipcRenderer.send(WIN_UPDATECONFIG, {
      workspace: path
    })
  }

  render() {
    const {
      visible,
      onCancel
    } = this.props;
    const {
      path
    } = this.state;
    return(
      <Modal
        title="设置工作目录"
        visible={visible}
        closable={false}
        maskClosable={true}
        onCancel={onCancel}
        onOk={this.onOk}
      >
        <div className={styles.wrap}>
          <div className={styles.area}>{path}</div>
          <div className={styles.btnWrap}>
            <Button 
              className={styles.button} 
              onClick={this.setDirDialog}
            >选择目录</Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default WorkspaceModal;
