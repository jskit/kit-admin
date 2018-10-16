import Vue from 'vue';
import { formatCountDown } from '@/utils/base';
// 距离
Vue.filter('distance', distance => {
  let str = '';
  const tempSistance = distance || 0;
  if (tempSistance < 1000) {
    str = tempSistance + 'm';
  } else if (tempSistance >= 1000) {
    if (tempSistance >= 1000 * 100) {
      str = '>100km';
    } else {
      str = (tempSistance / 1000).toFixed(1) + 'km';
    }
  }
  return str;
});

Vue.filter('formatCountDown', formatCountDown);
