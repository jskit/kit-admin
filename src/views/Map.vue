<template>
  <div class="page-map">
    <!-- map -->
    <div id="container"></div>
    <!-- address info -->
    <div class="card-box">
      <div class="card">
        <div class="line1px bottom address-info">
          <span>{{ title }}</span>
          <p>{{ address }}</p>
        </div>
        <div class="option-box">
          <p @click="packUp">去这里 >></p>
        </div>
      </div>
    </div>
    <div class="path-box" :class="{ 'show' : isShowPath}">
      <div class="pack-up" @click="packUp">
        <span class="btn"></span>
      </div>
      <div class="line1px bottom path-option">
        <div
          class="fashion-item"
          :class="{ 'active': currentItem === 'walk' }"
          @click="selectPath('walk')">步行</div>
        <div
          class="fashion-item"
          :class="{ 'active': currentItem === 'bus' }"
          @click="selectPath('bus')">公交</div>
        <div
          class="fashion-item"
          :class="{ 'active': currentItem === 'driving' }"
          @click="selectPath('driving')">打的</div>
      </div>
      <div class="path-info">
        <!-- <div class="line1px bottom path-sub">
          <p>{{ paths[currentItem].pathText }}</p>
          <span>{{ paths[currentItem].distance | distance }} | {{ paths[currentItem].time * 1000 | formatCountDown('H小时F分钟') }}</span>
        </div> -->
        <div class="detail-box">
          <div class="detail-list" id="panel" ref="panel">
            <!-- <div
              class="path-item"
              v-for="(item, index) in paths[currentItem].steps"
              :key="index">
              <span class="path-icon">1</span>
              <div class="path-detail">
                {{ item.instruction }}
              </div>
            </div> -->

          </div>

        </div>

      </div>
    </div>
  </div>
</template>
<script>
/**
 * query
 * lng=121.479054
 * lat=31.235906
 * title=好伦哥自助餐厅（南京东路店）
 * address=黄浦区南京东路600号亚太广场6楼1室
 */
import { mapActions, mapGetters, mapState } from 'vuex';
import geoUtil from '@/utils/geo';
import MapControl from '@/utils/mapControl';
let mapControl; // 地图控制实例

export default {
  name: 'map-page',
  data() {
    return {
      isShowPath: false,

      currentItem: 'walk', // 默认步行

      paths: {
        // 步行
        walk: {
          time: 0,
          pathText: '',
          distance: 0,
          steps: [],
        },
        // 开车
        driving: {
          time: 0,
          pathText: '',
          distance: 0,
          steps: [],
        },
        // 公交
        bus: {
          time: 0,
          pathText: '',
          distance: 0,
          steps: [],
        },
      },
    };
  },
  created() {
    this.getGeo({
      name: 'map-box',
      success: res => {
        console.log('probeShop.vue geo success:', res);
        // 可能需要 更新 城市
        this.initConfig();
      },
      fail: err => {
        console.log('probeShop.vue geo fail:', err);
        this.initConfig();
      },
    });
  },
  computed: {
    ...mapState({
      location: state => state.location,
    }),
    ...mapGetters(['currAddress']),

    title() {
      let { title } = this.$route.query;
      if (title) {
        return decodeURIComponent(title);
      }
      return '';
    },
    address() {
      let { address } = this.$route.query;
      if (address) {
        return decodeURIComponent(address);
      }
      return '';
    },
  },
  beforeDestroy() {
    // console.log('销毁');
    mapControl = null;
  },
  methods: {
    ...mapActions(['getGeo']),
    initConfig() {
      const { AMap } = window;
      console.log(AMap);
      this.$showLoading();
      if (AMap) {
        this.$nextTick(() => {
          this.initMap();
        });
      } else {
        geoUtil.geoInitGd().then(ret => {
          this.initMap();
        });
      }
    },
    initMap() {
      // const { AMap } = window;
      // const that = this;
      // const { lat: olat, lng: olng } = this.currAddress;
      try {
        const { lat, lng } = this.$route.query;
        console.log(lat, lng);
        // console.log(this.currAddress);
        // 实例化地图控制类 返回 Map实例
        mapControl = new MapControl([lng, lat]);
        console.log(mapControl);
        // mapControl.addMarker();
        mapControl.addPlugin(['AMap.ToolBar']).then(function() {
          const { AMap } = window;
          var tool = new AMap.ToolBar({
            offset: new AMap.Pixel(10, 220),
            locate: true,
            noIpLocate: true,
          });
          mapControl.map.addControl(tool);
        });

        this.initWalk();
        // this.initBus();
      } catch (error) {
        console.log(error);
      }
      //...
    },
    initWalk() {
      if (!mapControl) return;
      const that = this;
      const { lat: olat, lng: olng } = this.currAddress;
      mapControl.addPlugin(['AMap.Walking']).then(function() {
        const { AMap } = window;
        var walkOption = {
          map: mapControl.map,
          hideMarkers: false,
          isOutline: true,
          panel: 'panel',
          outlineColor: '#ffeeee',
          autoFitView: true,
        };
        // mapControl.markerControl(false);
        // 步行导航
        var walking = new AMap.Walking(walkOption);
        walking.clear();
        //根据起终点坐标规划步行路线
        walking.search([olng, olat], mapControl.coordinate, function(
          status,
          result
        ) {
          that.$hideLoading();
          // result即是对应的不行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
          if (status === 'complete') {
            console.log('步行路线数据查询成功', result);
          } else {
            console.error('步行路线数据查询失败' + result);
          }
        });
      });
    },
    initBus() {
      if (!mapControl) return;
      const that = this;
      const { lat: olat, lng: olng, citycode } = this.currAddress;
      mapControl.addPlugin(['AMap.Transfer']).then(function() {
        const { AMap } = window;

        var transferOption = {
          map: mapControl.map,
          nightflag: true, // 是否计算夜班车
          city: citycode,
          panel: 'panel',
          outlineColor: '#ffeeee',
          autoFitView: true,
          policy: AMap.TransferPolicy.LEAST_TIME,
          // 其它policy取值请参照 https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferPolicy
        };

        var transfer = new AMap.Transfer(transferOption);

        //根据起、终点坐标查询公交换乘路线
        transfer.search([olng, olat], mapControl.coordinate, function(
          status,
          result
        ) {
          that.$hideLoading();
          // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferResult
          if (status === 'complete') {
            console.log('公交路线数据查询成功');
          } else {
            console.log('公交路线数据查询失败' + result);
          }
        });
      });
    },
    initDriving() {
      if (!mapControl) return;
      const that = this;
      const { lat: olat, lng: olng } = this.currAddress;
      mapControl.addPlugin(['AMap.Driving']).then(function() {
        const { AMap } = window;
        var drivingOption = {
          policy: AMap.DrivingPolicy.LEAST_TIME,
          // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
          ferry: 1, // 是否可以使用轮渡
          map: mapControl.map,
          panel: 'panel',
        };

        // 构造路线导航类
        var driving = new AMap.Driving(drivingOption);

        // 根据起终点经纬度规划驾车导航路线
        driving.search([olng, olat], mapControl.coordinate, function(
          status,
          result
        ) {
          that.$hideLoading();
          // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
          if (status === 'complete') {
            console.log('获取驾车数据成功');
          } else {
            console.log('获取驾车数据失败：' + result);
          }
        });
      });
    },
    selectPath(pathKey) {
      this.currentItem = pathKey;
      this.$showLoading();
      this.$refs.panel.innerHTML = '';
      if (pathKey === 'walk') {
        //
        this.initWalk();
      } else if (pathKey === 'bus') {
        //
        this.initBus();
      } else if (pathKey === 'driving') {
        //
        this.initDriving();
      }
    },
    packUp() {
      ///..
      this.isShowPath = !this.isShowPath;
    },
  },
};

///...
</script>
<style lang="stylus" scoped>
//...
#container{
  height: 100%;
  z-index: 1;
}
.card-box{
  position: absolute;
  left: 0;
  bottom: 30px;
  width: 100%;
  z-index: 2;
  .card{
    margin: 5px 20px;
    position: relative;
    min-height: 105px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

    .address-info{
      padding: 15px;
      span{
        display: block;
        color: #111;
        font-size: 16px;
        margin-bottom: 5px;
      }
      p{
        font-size: 13px;
        color: #666;
      }
    }
    .option-box{
      p{
        line-height: 38px;
        text-align: center;
        font-size: 13px;
        color: #4A90E2;
        text-decoration: underline;
      }
    }
  }

}
.path-box{
  width: 100%;
  position: fixed;
  left: 0;
  bottom: -370px;
  height: 370px;
  background-color: #fff;
  z-index: 3;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transition: bottom 0.3s 0s ;
  &.show{
    bottom: 0;
  }
  .pack-up{
    height: 25px;
    .btn{
      position: absolute;
      display: inline-block;
      top: 0;
      left: 50%;
      margin-left: -25px;
      width: 50px;
      height: 15px;
      border: 1px solid #e1e1e1;
      border-top: none;
      border-radius: 0 0 5px 5px;
      &::after{
        content: '';
        display: block;
        margin: 0 auto;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid #ffbf00;
      }
    }
  }
  .path-option{
    display: flex;
    align-items: center;
    overflow: hidden;
    .fashion-item{
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      position: relative;
      &.active::before{
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: #ffbf00;
      }
    }
  }

  .path-info{
    flex: 1;
    display: flex;
    flex-direction: column;
    .path-sub{
      padding: 10px 10px 0 10px;
      margin-bottom: 10px;
      overflow: hidden;
      flex-shrink: 0;
      p{
        color: #333;
        font-size: 14px;
        margin-bottom: 5px;
      }
      span{
        font-size: 12px;
        display: block;
        color: #aaa;
        padding-bottom: 5px;
      }
    }
    .detail-box{
      flex: 1;
      overflow: hidden;
      >>>.amap-call{
        display: none !important;
      }
      .detail-list{
        padding: 10px 10px 10px 10px;
        height: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;

        .path-item{
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e1e1e1;
          padding: 10px 0;
          overflow: hidden;
          &:last-child{
            border-bottom: none;
          }
          .path-icon{
            width: 25px;
            height: 25px;
            background-color: #ccc;
            margin-right: 10px;
          }
          .path-detail{
            font-size: 14px;
            color: #333;
          }
        }

      }
    }
  }

}
</style>
