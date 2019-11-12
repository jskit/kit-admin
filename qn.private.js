use strict';

// AccessKey/SecretKey
const ASKey = {
  // 2014-09-11
  new: {
    ak: '***REMOVED***',
    sk: '***REMOVED***',
  },
  // 2013-08-01
  old: {
    ak: '***REMOVED***',
    sk: '***REMOVED***',
  },
};

// 使用 old, 这里执行上传七牛时报 { error: 'bad token' } 错误
const curASKey = ASKey['new'];

module.exports = {
  // cdn资源合一
  cdn: {
    prefix: '',
    ak: curASKey.ak,
    sk: curASKey.sk,
    bucket: 'xxx', // your bucket name
    domain: 'https://img.xxx.com/', //xxxx.xxx.xx.glb.clouddn.com
    path: '', // [hash]
  },
  zt: {
    prefix: '',
    ak: curASKey.ak,
    sk: curASKey.sk,
    bucket: 'www-doweidu-com', // your bucket name
    domain: 'https://static.doweidu.com/',
    path: '', // [hash]
  },
  hsq: {
    prefix: '', // v2/
    ak: curASKey.ak,
    sk: curASKey.sk,
    bucket: 'm-haoshiqi-net', // your bucket name
    domain: 'https://img1.haoshiqi.net/',
    path: '', // [hash]
  },
  mob: {
    prefix: '',
    ak: curASKey.ak,
    sk: curASKey.sk,
    bucket: 'm-haoshiqi-net', // your bucket name
    domain: 'https://img1.haoshiqi.net/',
    path: '', // [hash]
  },
  iqg: {
    prefix: '',
    ak: curASKey.ak,
    sk: curASKey.sk,
    bucket: 'm-iqianggou-com', // your bucket name
    domain: 'https://img1.iqianggou.com/',
    path: '', // [hash]
  },
  stats: {
    prefix: '',
    ak: curASKey.ak,
    sk: curASKey.sk,
    bucket: 'm-iqianggou-com', // your bucket name
    domain: 'https://img1.iqianggou.com/',
    path: '', // [hash]
  },
};
