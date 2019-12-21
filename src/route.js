import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import BaseFrame from './components/BaseFrame';
import ManagePage from './routers/Manage';
import WorkPage from './routers/Work';
import 'reset-css';
import './assets/styles/antd.less';

const RouterConfig = () => (
  <Router>
    <BaseFrame>
      <Switch>
        <Route path="/manage" exact component={ManagePage} />
        <Route path="/work" exact component={WorkPage} />
        <Route path="/" exact component={ManagePage} />
      </Switch>
    </BaseFrame>
  </Router>
)

export default RouterConfig;