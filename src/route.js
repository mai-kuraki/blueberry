import { Route, Switch } from 'react-router-dom';
import { routeList } from './configs/route';
import 'reset-css';
import './assets/styles/antd.less';

const RouterConfig = () => (
  <Switch>
    {
      routeList.map(o => <Route key={o.key} path={`/${o.key}`} exact component={o.comp} />)
    }
    <Route path="/" exact component={routeList[0].comp} />
  </Switch>
)

export default RouterConfig;