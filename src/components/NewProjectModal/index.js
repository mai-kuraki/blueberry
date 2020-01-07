import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import styles from './index.scss';
import {
  WIN_UPDATECONFIG,
  WIN_COPY_TEMPLATE,
  WIN_COPY_TEMPLATE_REPLY
} from '../../../app/consts/event';
import {
  Modal,
  Input,
  Button,
  message,
  Progress
} from 'antd';

@connect(({ app }) => app)
class NewProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dir: ''
    }
  }

  componentDidMount() {
    const { onCancel, appConfig = {} } = this.props;
    const {
      workspace
    } = appConfig;
    ipcRenderer.on(WIN_COPY_TEMPLATE_REPLY, (e, arg) => {
      const { success, error } = arg;
      if(success) {
        const { dir } = this.state;
        const dirPath = path.join(workspace, dir);
        message.success('创建项目成功');
        ipcRenderer.send(WIN_UPDATECONFIG, {
          lastOpenDir: dirPath
        });
        onCancel();
      }else {
        message.error(error);
        onCancel();
      }
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(WIN_COPY_TEMPLATE_REPLY);
  }

  onOk = () => {
    const { dir } = this.state;
    const { appConfig = {} } = this.props;
    const {
      workspace
    } = appConfig;
    if(!dir) {
      this.input.input.focus();
      return message.warn('请输入项目名称');
    }
    const dirPath = path.join(workspace, dir);
    if(fs.existsSync(dirPath)) return message.warn('该目录已存在');
    this.setState({
      loading: true
    })
    ipcRenderer.send(WIN_COPY_TEMPLATE, {
      dir: dirPath
    });
  }

  render() {
    const {
      visible,
      onCancel,
      appConfig = {}
    } = this.props;
    const {
      loading,
      dir
    } = this.state;
    const {
      workspace
    } = appConfig;
    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        closable={false}
        footer={
          <Fragment>
            <Button key="back" onClick={onCancel}>
              取消
            </Button>
            {
              !loading && 
              <Button key="submit" type="primary" onClick={this.onOk}>
                确认
              </Button>
            }
          </Fragment>
        }
      >
        {
          loading?
          <Progress
            className={styles.progress}
            showInfo={false}
            status="active"
            percent={100}
          />
          :
          <Fragment>
            <div className={styles.workspace}>{workspace.length > 36?workspace.replace(/\\/g, '/'):''}</div>
            <Input
              ref={node => this.input = node}
              value={dir}
              autoFocus
              addonBefore={workspace.length > 36?'/':`${workspace.replace(/\\/g, '/')}/`}
              placeholder="输入项目名称"
              onChange={e => {
                this.setState({
                  dir: e.target.value
                })
              }}
            />
          </Fragment>
        }
      </Modal>
    )
  }
}

export default NewProjectModal;