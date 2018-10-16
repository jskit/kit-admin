<template>
  <div class="page-city">
    <!-- 当前城市 -->
    <div class="current-address" @click="currentLocation">
      <p>
        <img src="~assets/icon_location.png" />
        <span>{{ currentCityInfo.currentCity }}</span>
      </p>
      <small v-if="currentCityInfo.tipText !== ''">{{ currentCityInfo.tipText }}</small>
    </div>
    <!-- 最近选择城市 -->
    <div class="city-box" v-if="recentSelectAddress.length">
      <p class="city-list-title">历史访问城市</p>
      <ul class="city-list recent-select-city">
        <li
          v-for="(item, index) in recentSelectAddress"
          :key="'item_'+item.id"
          :data-index="index"
          :data-module="1"
          @click="selectCity">
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <!-- 热门城市 -->
    <div class="city-box" v-if="hotCityList.length">
      <p class="city-list-title">热门城市</p>
      <ul class="hot-city-list">
        <li
          v-for="(item, index) in hotCityList"
          :key="item.id + '_' + index"
          :data-index="index"
          :data-module="2"
          @click="selectCity">
          <span><img :src="item.cover" :alt="item.name" /></span>
        </li>
      </ul>
    </div>
    <!-- 全部城市 -->
    <div class="city-box" v-if="allCityList.length">
      <p class="city-list-title">全部城市</p>
      <ul class="city-list">
        <li
          v-for="(item, index) in allCityList"
          :key="item.id + '_' + index"
          :data-index="index"
          :data-module="3"
          @click="selectCity">
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <!-- 提示 -->
    <p class="city-tip" v-if="allCityList.length">觅食蜂正在为您开拓更多城市，敬请期待</p>
    <!-- end -->
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import api from '@/api';
// import bridge from '@/utils/brigde';
export default {
  name: 'city',
  data() {
    return {
      recentCityList: [], // 最近访问城市
      hotCityList: [], // 热门城市
      allCityList: [], // 全部城市
    };
  },
  beforeCreate() {
    //...
  },
  created() {
    // console.log(this);
    // this.$emit('loca', '哈哈哈');
    // this.$eventSub.onSubscribeEvent(this, 'LOCATION_SUCCESS', function(res) {
    //   console.log('city.vue 定位成功！', res);
    // });
    // this.$eventSub.onSubscribeEvent(this, 'LOCATION_FAIL', function(err) {
    //   console.log('city.vue 定位失败！', err);
    // });
    console.log('city定位:');
    this.getCityList();
    this.getGeo({
      name: 'city',
      success: res => {
        console.log('city.vue geo success:', res);
        // 可能需要 更新 城市
        // 定位成功后发现 为选择城市 需要设置默认值
        if (!this.isSelectCity) {
          // 如果当前定位城市是未开通城市默认修改为：默认城市
          this.comparedCity();
        }
      },
      fail: err => {
        console.log('city.vue geo fail:', err);
      },
    });
  },
  computed: {
    ...mapState({
      isSelectCity: state => state.location.isSelectCity,
      geoInfo: state => state.location.geoInfo,
      locationState: state => state.location.locationState,
      recentSelectAddress: state => state.location.recentSelectAddress,
    }),
    ...mapGetters(['currAddress', 'positionInfo']),
    currentCityInfo() {
      const { code, text } = this.locationState;
      let currentCity = text;
      let tipText = '';
      if (code === 2) {
        currentCity = this.geoInfo.name;
        if (this.geoInfo.isOpen) {
          currentCity += '(暂未开通)';
          tipText = ',您可以选择其他感兴趣的城市';
        } else {
          tipText = '(当前定位)';
        }
      } else if (code === 3) {
        // currentCity = this.positionInfo.name;
        currentCity = '获取定位信息失败，请手动选择';
        // tipText = '(定位失败)';
      }
      return {
        currentCity,
        tipText,
      };
    },
  },
  methods: {
    ...mapActions([
      'getGeo',
      'setSelectCity',
      'comparedCity',
      'setSelectAddress',
    ]),
    // 点击当前位置
    currentLocation() {
      const {
        locationState: { code },
        geoInfo,
      } = this;
      if (code === 1) {
        // 定位中不做相应
      } else if (code === 2) {
        // 选择当前城市
        // 修改
        this.setSelectCity(geoInfo);

        this.$back();
      } else if (code === 3) {
        // 定位失败 点击修改为默认坐标
        this.setSelectCity(this.positionInfo);
        this.$back();
        // 定位失败从新发起定位
        // this.getGeo();
      }
    },
    selectCity(e) {
      const { index, module } = e.currentTarget.dataset;
      const {
        locationState: { code },
        geoInfo,
      } = this;
      let currentData = {};
      switch (parseInt(module, 10)) {
        case 1:
          currentData = this.recentSelectAddress[index];
          break;
        case 2:
          currentData = this.hotCityList[index];
          break;
        case 3:
          currentData = this.allCityList[index];
          break;
        default:
          currentData = {};
      }
      if (code === 2 && currentData.id === geoInfo.id) {
        currentData = geoInfo;
      }
      // 修改
      this.setSelectCity(currentData);
      this.setSelectAddress({}); // 清空已选地址
      this.$back();
    },
    getCityList() {
      //...
      api.zoneList(
        {},
        res => {
          // console.log(res);
          const { hotlist = [], zonelist = [] } = res.data;
          this.hotCityList = hotlist || [];
          this.allCityList = zonelist || [];
        },
        err => {
          console.log(err);
        }
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
  .page-city{
    padding: 0 15px;
    background: #fff;
  }

  /* 当前城市 */
  .current-address{
    line-height: 20px;
    margin-top: 15px;
    p{
      display inline-block
      margin-right: 10px;
      img{
        width: 11px;
        vertical-align: middle;
        margin-right: 10px;
      }
      span{
        font-size: 14px;
        color: #4A4A4A;
        vertical-align: middle;
      }
    }
    small{
      vertical-align:bottom;
      font-size: 10px;
      color: #999;
    }
  }
  
  /* city-box */
  .city-box{
    margin-bottom: 20px;
    margin-top: 15px;
    .city-list-title{
      font-size: 14px;
      color: #231815;
      line-height: 30px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 8px;
      font-weight: bold;
    }
    ul{
      padding: 0;
      margin: 0;
      li{
        list-style: none;
        padding: 0;
        margin: 0;
      }
    }
    .city-list{
      width: 101%;
      display: flex;
      flex-wrap: wrap;
      li{
        width: 33.3333%;
        margin-bottom: 5px;
        span{
          display: flex;
          height: 30px;
          align-items: center;
          justify-content: center;
          background: #F8F8F8;
          font-size: 14px;
          color: #333;
          box-sizing: border-box;
          padding: 5px;
          text-align: center;
          border-radius: 5px;
          margin-right: 5px;
          word-break: break-all;
          white-space: normal;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      &.recent-select-city li span{
        background: #FDCC02;
      }
    }
    
    /* 热门城市 */ 
    .hot-city-list{
      display: flex;
      flex-wrap: wrap;
      width: 101%;
      li{
        flex-shrink: 1;
        width: 50%;
        margin-bottom: 5px;
        span{
          display: block;
          height: 72px;
          background: #F8F8F8;
          margin-right: 5px;
          border-radius: 5px;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  /* tip */
  .city-tip{
    font-size: 12px;
    color: #9B9B9B;
    text-align: center;
    margin-bottom: 30px;
  }
</style>
