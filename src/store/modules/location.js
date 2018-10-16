// location 定位模块
// 存在 api 循环引用
import api from '@/api';
import { arrayToHeavy, isEmptyObject, isObject } from '@/utils/base';
import { clone } from '@/utils';

import { storage } from '@/utils/storage';
import * as Types from '../types';
import geoUtil from '@/utils/geo';
import device from '@/utils/device';
// 本地 storage key
const LOCATION_KEY = 'msfLocation';
console.log(api);
// 默认数据使用上海，一般情况下是用不到的（城市必选，此数据始终被覆盖）
const defaultInfo = {
  id: 21,
  name: '上海',
  address: '上海市静安区南京西路',
  lng: 121.463,
  lat: 31.234,
  citycode: 21,
  amap_city_id: 21,
  baidu_city_id: 289,
};

const defaultState = {
  // isLocation: false,
  currAddress: {}, // 当前地址
  isSelectCity: false, // 是否选择过城市 用户首次打开 必选城市
  selectCity: {}, // 当前选择城市 默认为定位城市
  selectAddress: {}, // 选择地址信息
  recentSelectAddress: [], // 最近选择城市
  cityList: [], // 城市列表
  geoInfo: {}, // 定位信息
  locationState: {
    code: 1, // 1 定位中，2 定位成功， 3 定位失败
    text: '定位中...',
    time: 0,
  },
};
// 获取 本地 storage 地址信息同步到 state 内

try {
  //...
  const storageLocation = storage.get(LOCATION_KEY);
  console.log(storageLocation);
  if (storageLocation) {
    Object.assign(defaultState, storageLocation);
    // const info = getCurrentAddress(storageLocation);
    // upDataCommonParams(info);
  }
} catch (e) {
  console.error('error get 本地 Location', e);
}

// 获取当前地址
function getCurrentAddress(state) {
  const { selectCity, geoInfo } = state;
  // console.log(geoInfo)

  const info = {
    id: selectCity.id || geoInfo.id || defaultInfo.id,
    name: selectCity.name || geoInfo.name || defaultInfo.name,
    lng: selectCity.lng || geoInfo.lng || defaultInfo.lng,
    lat: selectCity.lat || geoInfo.lat || defaultInfo.lat,
    // 注意这里 address 优先使用选择低点的 name 属性，而不是 address 属性
    address: selectCity.address || geoInfo.address || defaultInfo.address,
    // citycode Map 路径规划时需要使用
    citycode:
      selectCity.amap_city_id || geoInfo.citycode || defaultInfo.amap_city_id,
  };
  return info;
}

// 修改公共参数
function upDataCommonParams(info) {
  console.log('修改公共参数', info);
  api.setCommonParams({
    lat: info.lat,
    lng: info.lng,
    zone_id: info.id,
    // loc_code: info.citycode, // 定位的城市code
    // loc_type: 1, // 1 = 高德（默认）2 = 百度
  });
}

// 修改本地地址信息
function upDateStorageLocation(options = {}, reset) {
  const storageLocation = storage.get(LOCATION_KEY);
  let location = defaultState;
  if (storageLocation && isObject(storageLocation)) {
    Object.assign(storageLocation, options);
    location = storageLocation;
  }
  storage.set(LOCATION_KEY, location, 43200); // 暂存12小时
}
// getters
const getters = {
  // 当前地址
  currAddress: state => {
    // console.log(state);
    // console.log(geoInfo)
    const info = getCurrentAddress(state);
    upDataCommonParams(info);
    return info;
  },
  defaultInfo: state => {
    return defaultInfo;
  },
  positionInfo: state => {
    const {
      locationState: { code },
      geoInfo,
    } = state;
    if (code === 2) {
      return geoInfo;
    }
    return defaultInfo;
  },
};
// mutations
const mutations = {
  //
  // 修改城市列表
  [Types.SET_CITY_LIST](state, payload) {
    const { cityList = [] } = payload;
    state.cityList = cityList;
    upDateStorageLocation({
      cityList,
    });
  },
  // 修改当前定位状态
  [Types.SET_LOCATED_STATE](state, payload) {
    const { stateCode } = payload;
    let newState = '';
    let time = 0;
    switch (stateCode) {
      case 1: // 定位中...
        newState = '定位中...';
        time = 0;
        break;
      case 2: // 定位成功
        newState = '定位成功';
        time = new Date().getTime();
        break;
      case 3: // 定位失败
        newState = '定位失败';
        time = 0;
        break;
      default:
        newState = '定位中...';
        time = 0;
    }
    // state.locationStateCode = state
    const locationState = {
      code: stateCode,
      text: newState,
      time,
    };
    state.locationState = locationState;
    upDateStorageLocation({
      locationState,
    });
  },
  // 修改定位信息
  [Types.SET_GEO_INFO](state, payload) {
    const { geoInfo = {} } = payload;
    state.geoInfo = geoInfo;

    // 设置是否提示用户切换城市 1 不切换
    // storage.SessionStorage.set('isComparedCityTag', 1);
    // storage.set('isComparedCityTag', 1, 43200); // 暂存12小时

    upDateStorageLocation({
      geoInfo,
    });
  },
  // 修改选择城市
  [Types.SET_CITY_INFO](state, payload) {
    //...
    const { city } = payload;
    state.selectCity = city;
    let tempArray = state.recentSelectAddress;
    if (tempArray.length === 3) {
      tempArray.splice(0, 1, city);
    } else {
      tempArray.unshift(city);
    }
    //  去重
    tempArray = arrayToHeavy(tempArray, 'id');

    state.recentSelectAddress = tempArray;
    // 更新当前地址公共参数
    const info = getCurrentAddress(state);
    upDataCommonParams(info);

    upDateStorageLocation({
      currAddress: info,
      selectCity: city,
      recentSelectAddress: tempArray,
    });
    // ...
  },
  // 修改选择地址
  [Types.SET_ADDRESS_INFO](state, payload) {
    // console.log(payload)
    const { address } = payload;
    state.selectAddress = address;
    upDateStorageLocation({
      selectAddress: address,
    });
  },
  // 修改是否选择城市状态
  [Types.SET_IS_SELECT_CITY](state, flag) {
    //...
    state.isSelectCity = flag;
    // 更新当前地址公共参数
    const info = getCurrentAddress(state);
    upDataCommonParams(info);

    upDateStorageLocation({
      currAddress: info,
      isSelectCity: flag,
    });
  },
};

// 定位请求队列
// let geoEventList = [];
// 暂时改为 单个事件
/**
 * 暂时改为 单个事件
 * 原因:
 * 使用定位事件队列时,
 * 如果是多个页面调用 getGeo 方法，会把调用回调存在事件队列中，当定位成功后逐个执行事件队列中的回调
 * 但是 我们是单页应用，离开页面时并没有销毁 事件队列中的回调，会导致回调中的方法报错
 * 故: 暂使用单个事件回调
 */
let geoEvent;
let isLocation;
// actions
const actions = {
  //
  getGeo(context, payload = {}) {
    // ..
    console.log('location.js getGeo 进来了。。。');
    const { state } = context;
    // ...
    // let index = -1;
    // // 检查是否存在重复添加
    // for (let i = 0; i < geoEventList.length; i++) {
    //   if (geoEventList[i]['name'] === payload.name) {
    //     index = i;
    //     break;
    //   }
    // }
    // // 删除重复订阅
    // if (index !== -1) {
    //   geoEventList.splice(index, 1);
    // }
    // geoEventList.push(payload);
    // 赋值 回调方法
    geoEvent = payload;
    // app
    if (device.msf) {
      context.commit({ type: Types.SET_LOCATED_STATE, stateCode: 2 });
      // console.log(geoEventList);
      // if (geoEventList.length) {
      //   for (let i = 0; i < geoEventList.length; i++) {
      //     geoEventList[i]['success'].call(this, state.geoInfo);
      //   }
      // }
      if (geoEvent) {
        geoEvent.success.call(this, state.geoInfo);
        // geoEvent = null;
      }
      return;
    }
    // 检查是否存在定位信息
    if (state.locationState.code === 2 && state.locationState.time !== 0) {
      const currentTime = new Date().getTime();
      const often = currentTime - state.locationState.time;
      const itmeLong = 60 * 60 * 1000;
      // const itmeLong = 60 * 60 * 1000;
      if (often < itmeLong) {
        console.warn('定位相隔时差小于1个小时');
        // if (geoEventList.length) {
        //   for (let i = 0; i < geoEventList.length; i++) {
        //     geoEventList[i]['success'].call(this, state.geoInfo);
        //   }
        // }
        if (geoEvent) {
          geoEvent.success.call(this, state.geoInfo);
          // geoEvent = null;
        }
        return false;
      }
    }
    //....
    // 判断 在此之前是否有定位
    // if (geoEventList.length === 1) {
    if (!isLocation) {
      //
      isLocation = true;
      geoProcess(context).then(
        res => {
          console.log('function geoProcess callBack: success:', res);
          isLocation = false;
          // if (geoEventList.length) {
          //   for (let i = 0; i < geoEventList.length; i++) {
          //     geoEventList[i]['success'].call(this, res);
          //   }
          //   geoEventList = [];
          // }
          if (geoEvent) {
            geoEvent.success.call(this, state.geoInfo);
            // geoEvent = null;
          }
        },
        err => {
          console.log('function geoProcess callBack: fail:', err);
          isLocation = false;
          // if (geoEventList.length) {
          //   for (let i = 0; i < geoEventList.length; i++) {
          //     geoEventList[i]['fail'].call(this, err);
          //   }
          //   geoEventList = [];
          // }
          if (geoEvent) {
            geoEvent.success.call(this, state.geoInfo);
            // geoEvent = null;
          }
        }
      );
    }
  },
  // 选择城市
  setSelectCity({ commit, state }, payload) {
    commit({ type: Types.SET_CITY_INFO, city: payload });
    // 修改是否选择城市状态
    commit(Types.SET_IS_SELECT_CITY, true);
  },
  // 选择地址
  setSelectAddress({ commit, state }, payload) {
    commit({ type: Types.SET_ADDRESS_INFO, address: payload });
  },
  // 切换到定位城市
  // 如果当前定位城市是未开通城市默认修改为：默认城市
  comparedCity({ commit, state }) {
    const { geoInfo, cityList } = state;
    let city = isOpenCity(cityList, geoInfo);
    if (!city) city = defaultInfo;
    commit({ type: Types.SET_CITY_INFO, city });
    commit(Types.SET_IS_SELECT_CITY, true);
  },
};
// 定位流程
async function geoProcess({ commit, state }) {
  //
  // const { success, fail } = payload;
  try {
    commit({ type: Types.SET_LOCATED_STATE, stateCode: 1 });
    // 获取地址位置
    console.info('开始定位。。。');
    const { geoInfo, error } = await geoUtil.getGeo();
    if (geoInfo) {
      const { selectCity, cityList = [] } = state;
      console.log('action getGeo: success:', geoInfo);
      let tempCityList = clone(cityList);
      if (!cityList.length) {
        const { allCityList, error: err } = await getCityList();
        if (allCityList && allCityList.length) {
          // 更新城市列表
          commit({ type: Types.SET_CITY_LIST, cityList: allCityList });

          tempCityList = allCityList;
        } else {
          throw err;
        }
      }
      let city = isOpenCity(tempCityList, geoInfo);
      if (!city) {
        city = defaultInfo;
        geoInfo.isOpen = true;
      }
      geoInfo.id = city.id; // zone_id
      commit({ type: Types.SET_GEO_INFO, geoInfo });
      commit({ type: Types.SET_LOCATED_STATE, stateCode: 2 });
      // 如果没有选择默认当前城市
      if (!isEmptyObject(selectCity)) {
        commit({ type: Types.SET_CITY_INFO, city: geoInfo });
        // 修改是否选择城市状态
        // :!geoInfo.isOpen 未选择
        commit(Types.SET_IS_SELECT_CITY, !geoInfo.isOpen);
      }
      return { geoInfo };
    } else {
      commit({ type: Types.SET_LOCATED_STATE, stateCode: 3 });
      // 抛出
      throw error;
    }
  } catch (error) {
    //..
    console.log('function geoProcess: fail:', error);
    // 抛出
    throw error;
  }
}
// 返回当前已开通城市
function isOpenCity(cityList, geoInfo) {
  return cityList.find(item => {
    return item[geoInfo.type + '_city_id'] === parseInt(geoInfo.citycode, 10);
  });
}
// 获取城市列表
function getCityList() {
  return new Promise(function(resolve, reject) {
    api.zoneList(
      {
        showLoading: false,
      },
      res => {
        // console.log(res);
        const { zonelist = [] } = res.data;
        resolve({
          allCityList: zonelist,
        });
      },
      err => {
        resolve({
          error: err,
        });
        return;
      }
    );
  });
}

export default {
  state: defaultState,
  getters,
  mutations,
  actions,
};
