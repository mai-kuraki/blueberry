import { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.scss';

@connect(state => state.page)
class Editor extends Component {
  constructor(props) {
    super(props);
    const { item = [], id } = props;
    const data = _.find(item, o => o.id === id);
    this.state = {
      data,
      isScroll: false
    }
  }

  onScroll = () => {
    const { isScroll } = this.state;
    const top = this.scrollBar.getScrollTop();
    if(isScroll !== top > 25) {
      this.setState({
        isScroll: top > 25
      })
    }
  }

  render() {
    const {
      isScroll
    } = this.state;
    return (
      <div className={styles.panelWrap}>
        {
          isScroll && <div className={styles.shadow}></div>
        }
        <Scrollbars
          ref={node => this.scrollBar = node}
          autoHide
          onScroll={this.onScroll}
          className={styles.scrollBar}
          renderThumbVertical={props => {
            return <div {...props } className={styles.thumbBlock}></div>
          }}
          renderThumbHorizontal={props => {
            return <div {...props } className={styles.thumbHorBlock}></div>
          }}
        >
          <div className={styles.panel}>
            dadsadasdsad
          </div>
        </Scrollbars>
      </div>
    )
  }
}

export default Editor;