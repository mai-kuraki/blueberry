import EmptyIcon from '../../assets/svgs/website.svg';
import styles from './index.scss';
// eslint-disable-next-line react/display-name
export default () => <div className={styles.emptyWrap}>
<div className={styles.emptyIcon}>
  <img src={EmptyIcon}/>
</div>
</div>