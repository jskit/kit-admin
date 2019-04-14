import { MiniLink, miniRules } from './index';

const aliapp = new MiniLink(miniRules.aliapp);
const wxapp = new MiniLink(miniRules.wxapp);

const link1 = aliapp
  .input({
    appId: '123456',
    pageName: 'detail',
    pageQuery: { id: 123 },
    bizParams: { spm: 'xxx' },
    webviewUrl: 'https://topic.doweidu.com?id=xxx',
  })
  .mini();
const link2 = wxapp
  .input({
    appId: '123456',
    pageName: 'detail',
    pageQuery: { id: 123 },
    bizParams: { spm: 'xxx' },
    webviewUrl: 'https://topic.doweidu.com?id=xxx',
  })
  .mini();

console.log(link1.toString());

console.log(link1.alipays().toString());
console.log(
  link1
    .alipays()
    .sms()
    .toString()
);

console.log();

console.log(link2.toString());
console.log(link2.mp().toString());
console.log(link2.tweet().toString());
console.log(link2.ad().toString());
