import manageIcon from '../../assets/svgs/yemianguanli.svg';
import componentIcon from '../../assets/svgs/zujian.svg';
import layoutIcon from '../../assets/svgs/buju.svg';
import PageManage from '../../routers/PageManage';
import ComponentManage from '../../routers/ComponentManage';
import LayoutManage from '../../routers/LayoutManage';

const routeList = [
  {
    title: '页面管理',
    key: 'pageManage',
    icon: manageIcon,
    comp: PageManage
  },
  {
    title: '组件管理',
    key: 'componentManage',
    icon: componentIcon,
    comp: ComponentManage
  },
  {
    title: '布局管理',
    key: 'layoutManage',
    icon: layoutIcon,
    comp: LayoutManage
  }
]

export {
  routeList
}