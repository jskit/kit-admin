<template>
  <div class="page-search-shop">
    <search
      ref="shopSearch"
      fixed
      placeholder="商圈,街道,地区"
      v-model="value"
      @on-submit="onSubmit"
      @on-change="placeSearchEvent"
      @on-cancel="onCancel"
      @on-clear="onClear"></search>
    <div class="centent-box">
      <div class="address-box clearfix">
        <!-- 当前城市 -->
        <div class="current-address" @click="currentLocation">
          <p>
            <img src="~assets/icon_location.png" />
            <span>{{ currentAddress.address }}</span>
          </p>
          <small v-if="currentAddress.tipText !== ''">{{ currentAddress.tipText }}</small>
        </div>
        <!-- 附近商圈 -->
        <div class="city-box" v-if="nearbyAddress.length">
          <p class="city-list-title">附近商圈</p>
          <ul class="city-list">
            <li
              v-for="(item, index) in nearbyAddress"
              :key="'item_' + index + item.id"
              @click="selectCurrentAddress(item)">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
        <!-- 热门商圈 -->
        <div class="city-box" v-if="hotAddress.length">
          <p class="city-list-title">热门商圈</p>
          <ul class="city-list">
            <li
              v-for="(item, index) in hotAddress"
              :key="'item_' + index + item.id"
              @click="selectCurrentAddress(item)">
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 搜索结果 -->
      <div v-if="searchResultList.length" class="search-result" :class="{'show': searchResultList.length}" >
        <div class="mask"></div>
        <div class="result-list">
          <div
            class="line1px bottom result-item"
            v-for="(item, index) in searchResultList"
            :key="'_' + index + item.id"
            @click="selectSearchAddress(item)">
            <span>{{ item.name }}</span>
            <p>{{ item.address }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import api from '@/api';
import { Search } from '@/ui';
import geoUtil from '@/utils/geo';

let placeSearch; // 搜索

export default {
  name: 'shopsearch',
  components: {
    Search,
  },
  data() {
    return {
      value: '',
      hotAddress: [],
      nearbyAddress: [],
      // 1、常用标签，2、搜索结果，3、搜索模糊列表
      isShowResult: 1,
      searchResultList: [],
    };
  },
  created() {
    console.log('created');
    this.$showLoading();
    this.getGeo({
      name: 'shop-search',
      success: res => {
        console.log('probeShop.vue geo success:', res);
        // 可能需要 更新 城市
        this.getData();
        this.initConfig();
      },
      fail: err => {
        console.log('probeShop.vue geo fail:', err);
        this.getData();
        this.initConfig();
      },
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.shopSearch.setFocus();
    });
  },
  computed: {
    ...mapState({
      location: state => state.location,
    }),
    ...mapGetters(['currAddress', 'defaultInfo']),
    currentAddress() {
      const { locationState, geoInfo } = this.location;
      const { code, text } = locationState;
      let address = text;
      let tipText = '';
      if (code === 2) {
        address = geoInfo.address;
        tipText = '(当前定位)';
      } else if (code === 3) {
        address = this.defaultInfo.address;
        tipText = '(定位失败)';
      }
      return {
        address,
        tipText,
      };
    },
  },
  methods: {
    ...mapActions(['getGeo', 'setSelectCity', 'setSelectAddress']),
    // 点击当前位置
    currentLocation() {
      const {
        locationState: { code },
        geoInfo,
      } = this.location;
      if (code === 1) {
        // 定位中不做相应
      } else if (code === 2) {
        // 选择当前城市
        // 修改
        this.setSelectCity(geoInfo);
      } else if (code === 3) {
        // 定位失败从新发起定位
        // this.getGeo();
        this.setSelectCity(this.defaultInfo);
      }
      this.selectCurrentAddress({}); // 清空已选地址
    },
    selectCurrentAddress(item) {
      //...
      this.setSelectAddress(item);
      this.$back();
    },
    selectSearchAddress(item) {
      const { location, address, name } = item;
      console.log(location, address, name);
      const info = {
        address: address,
        lat: location.lat,
        lng: location.lng,
        name: name,
        // zone_id: 21
      };
      this.selectCurrentAddress(info);
    },
    onSubmit(val) {
      console.log(val);
    },
    onCancel() {
      this.searchResultList = [];
    },
    onClear() {
      this.searchResultList = [];
    },
    getData() {
      //...
      // const { geoInfo, selectCity } = this.location;
      api.nearcbd(
        {},
        res => {
          console.log(res);
          const { hot = [], near = [] } = res.data;
          this.hotAddress = hot;
          this.nearbyAddress = near;
        },
        err => {
          console.log(err);
        }
      );
    },
    initConfig() {
      const { AMap } = window;
      console.log(AMap);

      if (AMap) {
        this.initPlaceSearch();
      } else {
        geoUtil.geoInitGd().then(ret => {
          this.initPlaceSearch();
        });
      }
    },
    initPlaceSearch() {
      const { AMap } = window;
      const that = this;
      console.log(that.currAddress.citycode);
      // var map = new AMap.Map("container", {
      //   resizeEnable: true,
      // });
      const { citycode } = this.currAddress;
      const tempCityCode = citycode < 100 ? '0' + citycode : citycode;
      AMap.plugin('AMap.PlaceSearch', function() {
        const placeSearchOptions = {
          //构造地点查询类
          pageSize: 50,
          pageIndex: 1,
          city: tempCityCode, //城市
          citylimit: true, // 限制在设置的城市内搜索
        };
        placeSearch = new AMap.PlaceSearch(placeSearchOptions);
      });
      //关键字查询，您如果想修改结果展现效果，请参考页面：https://lbs.amap.com/fn/css-style/
    },
    placeSearchEvent(res) {
      //...
      console.log(res);
      if (res !== '') {
        placeSearch.search(res, this.placeSearchCallBack);
      } else {
        this.searchResultList = [];
      }
    },
    placeSearchCallBack(status, result) {
      console.log(status, result);
      if (status === 'complete' && result.info === 'OK') {
        //
        const { poiList } = result;
        this.searchResultList = poiList.pois || [];
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.page-search-shop{
  padding-top: 46px;
}
.centent-box{
  position: relative;
  height: 100%;
}
.address-box{
  padding: 0 15px;
  background: #fff;
  height: 100%;
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
    }
  }
}
.search-result{
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &.show{
    display: block;
  }
  .mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
  }
  .result-list{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    .result-item{
      padding: 5px 15px;
      span,p{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        max-width: 100%;
      }
      span{
        display: block;
        color: #333;
        font-size: 14px;
        margin-bottom: 5px;
      }
      p{
        color: #999;
        font-size: 12px;
      }
    }
  }
}
</style>
