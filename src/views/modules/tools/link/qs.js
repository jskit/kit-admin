// https://github.com/unshiftio/querystringify/blob/master/index.js

const has = Object.prototype.hasOwnProperty;

export function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

export function parse(query) {
  const parser = /([^=?&]+)=?([^&]*)/g;
  const result = {};
  let part;

  for (
    ;
    (part = parser.exec(query));
    result[decode(part[1])] = decode(part[2])
  );

  return result;
}

// parse('id=123');

export function stringify(obj, prefix = '') {
  const pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  // if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? pairs.join('&') : '';
}

// function stringify(params = {}) {
//   if (typeof params === 'string') return params;
//   const temp = params;
//   const arr = [];
//   for (const key in params) {
//     if (!temp[key]) {
//       delete temp[key];
//     } else {
//       arr.push(`${key}=${encodeURIComponent(temp[key])}`);
//     }
//   }
//   return arr.join('&');
// }

// function parse(url, key) {
//   const searchReg = /([^&=?#]+)=([^&#]+)/g;
//   const urlReg = /\/+.*\?/;
//   const arrayReg = /(.+)\[\]$/;

//   if (!url) return;

//   const params = {};
//   let match;
//   let name;
//   let value;
//   let isArray;

//   // 处理不符合 search 参数格式的情况
//   url = url[0] !== '?' ? '?' + url : url;
//   // 处理异常参数，如多个 ?
//   url = url.replace(/\?/g, '&').replace('&', '?');

//   /* eslint prefer-destructuring: 0 */
//   while ((match = searchReg.exec(url))) {
//     name = match[1];
//     value = match[2];
//     isArray = name.match(arrayReg);
//     // 处理参数为url这种情况
//     if (urlReg.test(value)) {
//       params[name] = url.substr(url.indexOf(value));
//       break;
//     }
//     if (isArray) {
//       name = isArray[1];
//       params[name] = params[name] || [];
//       params[name].push(value);
//     } else {
//       params[name] = value;
//     }
//   }
//   return params;
// }

// function mergeParams() {
//   const arr = Array.prototype.slice.call(arguments);
//   const result = arr.reduce((obj, item) => {
//     Object.assign(obj, parse(item));
//     return obj;
//   }, {});
//   return stringify(result);
// }
