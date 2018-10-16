<template>
  <div class="search-box">
    <cm-search
      class="search-page"
      ref="search"
      v-model="searchVal"
      :placeholder="'测试提示文案'"
      :cancel-text="'取消'"
      @on-submit="onSubmit"
      @on-change="getListData"
      @on-cancel="onCancel">
      </cm-search>

      <button @click="btnEvent">测试</button>
      <test v-model="testVal"></test>
  </div>
</template>
<script>
import { Search } from '@/ui';
import Test from '@/components/test';
import {
  mapActions,
  // mapState,
  // mapGetters,
} from 'vuex';
export default {
  // name: 'demo-header',
  data: function() {
    return {
      // showMenus: false,
      searchVal: '',
      testVal: '1',
    };
  },

  components: {
    [Search.name]: Search,
    Test,
  },
  watch: {
    // searchVal(val, oldVal) {
    //   console.log(val);
    // },
  },
  mounted() {
    console.log(this.$el);
  },
  methods: {
    ...mapActions(['setPageTitle']),
    btnEvent() {
      this.setPageTitle('测试');
    },
    // ...
    getListData(res) {
      console.log('getListData:', res);
    },
    // 取消事件
    onCancel() {
      console.log('你点击了取消');
    },
    onSubmit(val) {
      console.log('onSubmit:', val);
      this.$refs.search.setBlur();
    },
  },
};
</script>
<style lang="stylus" scoped>
  .search-page {
    /* >>> 改变子元素样式 */
  }
</style>
