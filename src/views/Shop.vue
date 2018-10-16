<template>
  <div class="page-probe-shop" :class="{'is-header': isShowHeader}">
    <!-- header -->
    <cm-header class="shop-header" :class="{ 'show': isShowHeader }" :left-options="{showBack: false}" fixed>
      <div slot="left" class="currentCity" data-type="city" @click="gotoNext">
        <span>{{currentCity}}</span>
        <i class="icon-down"></i>
      </div>
      <p class="currentAddress" data-type="shopsearch" @click="gotoNext">
        <i class="icon-loaction"></i>
        <span>{{ currentAddress }}</span>
        <i class="icon-down"></i>
      </p>
      <div slot="right" class="search-btn" data-type="searcharticle" @click="gotoNext"><img src="~assets/index/nav_search.png" alt="" /></div>
    </cm-header>
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck" >

      <div class="probe-shop-list">
        <!-- item -->
        <shop-item v-for="(item, index) in listData" :key="'shop_' + index + item.id" :item="item"></shop-item>
      </div>
    </vue-scroll>
    <!-- list  -->
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import PullListMixin from '@/mixins/pull-list';
import api from '@/api';
import { Header, Scroll } from '@/ui';
import ShopItem from '@/components/ShopItem';
import { isEmptyObject } from '@/utils/base';
import device from '@/utils/device';
// import { on } from '@/utils/event';
import bridge from '@/utils/bridge';
console.log(device);
export default {
  name: 'shop',
  mixins: [PullListMixin],
  components: {
    [Header.name]: Header,
    [Scroll.name]: Scroll,
    [ShopItem.name]: ShopItem,
  },
  data() {
    return {};
  },
  beforeCreate() {
    //...
  },
  created() {
    console.log('probe-shop定位:');
    this.$showLoading();
    this.getGeo({
      name: 'probe-shop',
      success: res => {
        console.log('probeShop.vue geo success:', res);
        // 可能需要 更新 城市
        this.getData();
      },
      fail: err => {
        console.log('probeShop.vue geo fail:', err);
        this.getData();
      },
    });
    console.log(1);
    const that = this;
    if (device.msf) {
      bridge.enableRefresh(); // 开启刷新
      // 监听 位置信息改变
      bridge.onLocationChanged({
        success(res) {
          console.log(res);
          const { data = {} } = res;
          // console.log(data);
          const { area } = data;
          const selectCity = {
            id: data.id,
            lat: data.lat,
            lng: data.lng,
            name: data.name,
            address: data.address,
            // amap_city_id: data.cityId,
          };
          // console.log(selectCity);
          let selectAddress = {};
          if (data.area) {
            selectAddress = {
              id: area.zoneId,
              lat: area.lat,
              lng: area.lng,
              name: area.name,
              address: area.address,
              // amap_city_id: area.cityId,
            };
          }
          // console.log(selectAddress);

          that.setSelectCity(selectCity);
          that.setSelectAddress(selectAddress);

          // 更新列表数据
          that.getData();
        },
      });
      // 监听下拉刷新
      bridge.onPullRefresh({
        success(res) {
          that.getData();
        },
      });
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log(this.$refs.shopScroll);
    //   on(this.$refs.shopScroll.$el, 'scroll', function() {
    //     console.log(this);
    //   });
    // });
  },
  computed: {
    ...mapState({
      location: state => state.location,
    }),
    ...mapGetters(['currAddress']),
    currentCity() {
      const {
        locationState: { code, text },
      } = this.location;
      let currentCity = text;
      if (code === 2 || code === 3) {
        currentCity = this.currAddress.name;
      }
      return currentCity;
    },
    currentAddress() {
      if (isEmptyObject(this.location.selectAddress)) {
        return this.location.selectAddress.name;
      }
      return '附近美食';
    },
    isShowHeader() {
      if (device.msf) {
        return false;
      }
      return true;
    },
  },
  beforeDestroy() {
    if (device.msf) {
      bridge.offLocationChanged(res => {
        console.log('app off locationChanged', res);
      });
      bridge.disableRefresh(); // 禁止 下拉刷新
      bridge.offPullRefresh(res => {
        console.log('app off PullRefresh', res);
      });
    }
  },
  methods: {
    ...mapActions(['getGeo', 'setSelectCity', 'setSelectAddress']),
    getData() {
      this.$showLoading();
      this.initPullList();
      // this.pullParams.page_limit = 5;

      const { selectAddress } = this.location;
      if (isEmptyObject(selectAddress)) {
        this.pullParams.lng = selectAddress.lng;
        this.pullParams.lat = selectAddress.lat;
      }
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.branchListFull.apply(this, rest);
    },
    dealList(list = []) {
      return list.map(item => {
        let labels = [];
        if (item.cat_info) {
          labels.push(item.cat_info);
        }
        // cbd_name 商圈名
        if (item.cbd_info) {
          labels.push(item.cbd_info);
        }
        return {
          id: item.id,
          branch_name: item.branch_name,
          branch_head_pic: item.branch_head_pic,
          labels,
          distance: item.distance,
          pic_list: item.pic_list,
          article_cnt: item.article_cnt,
          article_list: item.article_list,
        };
      });
    },

    gotoNext(e) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case 'city':
          this.$forward(type);
          break;
        case 'shopsearch':
          this.$forward(type);
          break;
        case 'searcharticle':
          this.$forward(type);
          break;
        default:
        // do nothing...
      }
    },
  },
};
</script>
<style lang="stylus" scoped>

  .page-probe-shop{
    background: #fff;
    &.is-header{
      padding-top: 46px;
    }
    .shop-header{
      background-image: linear-gradient(-135deg, #FEDB4D 0%, #FFEFAA 100%);
      display: none;
      &.show{
        display: block;
      }
      .icon-down{
        display: inline-block;
        vertical-align: middle;
        width: 10px;
        height: 8px;
        background: url('~assets/index/nav_cityselect.png') no-repeat center center;
        background-size: 100%;
      }
      .currentCity{
        font-size: 14px;
        color: #231815;
        span{
          vertical-align: middle;
        }
        i.icon-down{
          margin-left: 5px;
        }
      }
      .currentAddress{
        text-align: center;
        font-size: 17px;
        color: #231815;
        i.icon-loaction{
          display: inline-block;
          vertical-align: middle;
          width: 11px;
          height: 14px;
          margin-right: 5px;
          background: url('~assets/icon_location.png') no-repeat center center;
          background-size: 100%;
        }
        i.icon-down{
          margin-left: 5px;
        }
        span{
          vertical-align: middle;
          font-weight: bold;
        }
      }
      .search-btn{
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        img{
          width: 16px;
          display: inline;
        }
      }
    }
    //*list*/
    .probe-shop-list{
      padding:10px 10px 0 10px;
    }
  }

</style>
