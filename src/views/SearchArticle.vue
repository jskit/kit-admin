<template>
  <div class="page-search-article">
    <Search ref="search" :fixed="true" :placeholder="'搜索觅食笔记，收获一份好心情'" v-model="value" @on-submit="onSubmit" @on-cancel="onCancel" @on-clear="onClear"></Search>
    <Scroll :isLoading="isLoading" :pullLoading="pullLoading" :finished="finished" :listLen="1" @onScrollToLower="onScrollToLower">
      <div class="container">
        <div class="keyword-box" v-show="showType == 1">
          <p class="title">最近搜过的关键字</p>
          <ul class="keyword-ul">
            <li class="keyword-li" v-for="(item, index) in recentList" :key="index" @click="selectValue(item)">{{ item }}</li>
          </ul>
          <p class="title">大家都在搜</p>
          <ul class="keyword-ul">
            <li class="keyword-li" v-for="(item, index) in hotTags" :key="index" @click="selectValue(item.name)">{{ item.name }}</li>
          </ul>
        </div>
        <div class="waterfall-box" v-show="showType == 2">
          <water-fall ref="waterfall" @ontap="onArticleTap"></water-fall>
        </div>
      </div>
    </Scroll>
  </div>
</template>
<script>
import api from '@/api';
import { Search, Scroll } from '@/ui';
import WaterFall from '@/components/WaterFall';
import { storage } from '@/utils/storage';

export default {
  name: 'searcharticle',
  components: {
    Search,
    Scroll,
    WaterFall,
  },
  data() {
    return {
      value: '',
      recentList: storage.get('searcharticle') || [],
      // 1、常用标签，2、搜索结果，3、搜索模糊列表
      showType: 1,
      isLoading: false,
      pullLoading: false,
      finished: false,
      pagination: {
        page_num: 1,
        total_cnt: 0,
        total_page: 0,
        page_serial: '',
      },
    };
  },
  computed: {
    hotTags() {
      return this.$store.state.search.hotTags;
    },
  },
  created() {
    const keyword = this.$route.query.keyword;
    if (keyword) {
      this.onSearchKeyword(keyword);
    }
    if (this.hotTags.length === 0) {
      this.$store.dispatch('GetHotTags');
    }
  },
  methods: {
    getArticleList() {
      if (this.isLoading || this.finished) {
        return;
      }
      const keyword = this.value;
      const page_num = this.pagination.page_num;
      const page_serial = this.pagination.page_serial;
      this.isLoading = true;
      let type = 'push';
      if (page_num == 1) {
        this.pullLoading = false;
        type = 'reset';
      } else {
        this.pullLoading = true;
      }
      let showLoading = !this.pullLoading;
      api.articleList(
        {
          search: keyword,
          page_num: page_num,
          page_limit: 20,
          page_serial: page_serial,
          need_pagination: 1,
          showLoading: showLoading,
        },
        res => {
          console.log(res);
          this.$refs.waterfall.setDate(res.data.list, type);
          this.pagination.page_serial = res.data.page_serial;
          this.pagination.total_cnt = res.data.total_cnt;
          this.pagination.total_page = res.data.total_page;
          if (page_num < res.data.total_page) {
            this.pagination.page_num++;
            this.finished = false;
          } else {
            this.finished = true;
          }
          this.showType = 2;
          this.isLoading = false;
          this.pullLoading = false;
        },
        err => {
          console.log(err);
          this.isLoading = false;
          this.pullLoading = false;
        }
      );
    },
    onSubmit(val) {
      // console.log(val);
      if (val) {
        this.$refs.search.setBlur();
        this.onSearchKeyword(val);
      }
    },
    onCancel() {
      this.finished = false;
      this.showType = 1;
    },
    onClear() {
      this.finished = false;
      this.showType = 1;
    },
    selectValue(val) {
      // console.log(val);
      this.onSearchKeyword(val);
    },
    onArticleTap(id, index) {
      this.$forward('article', { id: id });
    },
    onScrollToLower() {
      this.getArticleList();
    },
    onSearchKeyword(val) {
      this.value = val;
      this.pagination = {
        page_num: 1,
        total_cnt: 0,
        total_page: 0,
        page_serial: '',
      };
      this.finished = false;
      this.getArticleList();
      this.setRecent(val);
    },
    setRecent(val) {
      const oldList = [...this.recentList];
      const len = oldList.length;
      const idx = oldList.indexOf(val);
      if (idx > 0) {
        oldList.splice(idx, 1);
        oldList.unshift(val);
      } else if (idx <= -1) {
        oldList.unshift(val);
        if (len >= 10) {
          oldList.length = 10;
        }
      }
      this.recentList = oldList;
      storage.set('searcharticle', oldList, 0);
    },
  },
};
</script>
<style lang="stylus" scoped>
.page-search-article{
  .container{
    position: relative;
    padding-top: 46px;
  }
  .keyword-box{
    padding: 20px 15px 0px;
    .title{
      color: #4A4A4A;
      font-size: 14px;
      font-weight: bold;
      height: 20px;
      line-height: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #979797;
      box-sizing: content-box;
    }
    .keyword-ul{
      list-style: none;
      padding: 10px 0px 30px;
      margin: 0;
    }
    .keyword-li{
      list-style: none;
      display: inline-block;
      line-height: 20px;
      font-size: 13px;
      white-space: nowrap;
      padding: 5px 10px;
      margin-right: 10px;
      border-radius: 4px;
      border: 1px solid #FDCC02;
    }
  }
  .waterfall-box{
    margin: 0px 10px;
  }
}
</style>
