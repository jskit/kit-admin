//
import Header from './Header';
import { Swiper, SwiperItem } from './Swiper';
import { TabBar, TabBarItem } from './tabbar';
import ViewBox from './view-box';
import Search from './Search';
import Scroll from './Scroll';
import Tags from './Tags';

const version = '0.0.01';
const install = function(Vue, config = {}) {
  if (install.installed) return;
};

export {
  install, // 暂时不支持以插件的形式引入
  version,
  Header,
  Swiper,
  SwiperItem,
  TabBar,
  TabBarItem,
  ViewBox,
  Search,
  Scroll,
  Tags,
};
