# 使用方法

import { Swiper, SwiperItem } from '@/ui';

components: {
  Swiper,
  SwiperItem,
},

<Swiper
  :ratio="ratio"
  :speed="speed"
  :auto="auto"
  :defaultIndex="defaultIndex"
  :continuous="continuous"
  :showIndicators="showIndicators"
  @change="handleChange"
  >
  <SwiperItem>1</SwiperItem>
  <SwiperItem>2</SwiperItem>
  <SwiperItem>3</SwiperItem>
</Swiper>

字段              类型         默认值/必填        说明
ratio            Number       空 / 否           高比宽，例如：1，则为正方形。不传则为自动撑高
speed            Number       300 / 否          播放速度，translate速度
auto             Number       3000 / 否         自动播放间隔时间，为0时，不自动播放
defaultIndex     Number       0 / 否            当前默认帧
continuous       Boolean      true / 否         是否循环播放
showIndicators   Boolean      true / 否         是否显示小圆点
change           Function     空 / 否           改变之后的回调
