import axios from 'axios';
import qs from 'qs';
import { clone } from '@/utils';
import mini from '@/utils/mini';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import store from '@/store';
// import router from '@/router';

// 创建axios实例
function noop() {
  console.error('异常流程，不应该进入这里');
}

function checkStatus(res = {}) {
  console.log('check');
  const { status } = res;
  if (status >= 200 && status < 300) {
    return res;
  }
}

const defaultOptions = {
  url: '',
  method: 'get',
  baseURL: '',
  headers: {
    // 'Content-Type': 'application/json; charset=utf-8',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  params: {},
  data: {},
  responseType: 'json',
  withCredentials: true,
};

export default function request({
  url,
  method,
  options = {},
  success = noop,
  fail = noop,
  header,
}) {
  const opts = clone(defaultOptions);
  opts.url = url;
  opts.headers = {
    ...opts.headers,
    ...header,
  };
  let hasLoading = false;
  if (options.showLoading) {
    hasLoading = true;
    mini.showLoading();
  }
  delete options.showLoading; // 删除loading
  if (method === 'GET') {
    opts.method = 'get';
    opts.params = options;
  } else {
    opts.method = 'post';
    // let query = new URLSearchParams();
    // for (let key in options) {
    //   query.append(key, options[key]);
    // }
    // opts.data = query;
    opts.data = qs.stringify(options);
  }

  const successCallBack = data => {
    hasLoading && mini.hideLoading();
    if (typeof success === 'function') {
      success(data);
    }
  };
  const errorCallBack = (err = {}) => {
    hasLoading && mini.hideLoading();
    if (typeof fail === 'function' && fail(err)) {
      return;
    }
    const { errmsg = '网络异常，请稍后重试', errno = 'err' } = err;
    console.warn(JSON.stringify(err));
    // 9610010 未登录 9800001 参数错误
    if (errno === 9610010) {
      store.dispatch('FedLogout');
      if (device.msf) {
        bridge.login({
          success(res) {
            //..
            console.log(res);
            const { data } = res;
            store.commit('SET_USERINFO', data);
          },
          fail(err) {
            //
            console.log('app 登录失败！', err);
            // mini.forward('/index');
            mini.showToast('登录失败，请重试！');
          },
        });
      } else {
        mini.forward('/login');
      }
    } else {
      const message = `${errno}: ${errmsg}`;
      console.log('errmsg:', message);
      mini.showToast(message);
    }
  };

  function log(res) {
    // console.log('44444444');
    console.log(`api: ${method} ${res.status} ${url}`);
    return res;
  }

  axios(opts)
    .then(log)
    .then(checkStatus)
    .then(res => {
      // console.log(JSON.stringify(res));
      if (res.data.errno === 0) {
        successCallBack(res.data);
      } else {
        errorCallBack({
          errno: res.data.errno,
          errmsg: res.data.errmsg,
        });
      }
    })
    .catch(err => {
      // alert(JSON.stringify(err));
      // console.log(err.response);
      errorCallBack({
        errno: 400,
        errmsg: err.message,
      });
    });
}

//以formData形式上传七牛
export function ajaxFormData(formData) {
  return new Promise(function(resolve, reject) {
    axios
      .post('https://up.qbox.me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
