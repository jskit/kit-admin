<template>
  <!-- item -->
  <div class="shop-item">
    <div class="shop-detail" data-type="detail" @click="gotoNext">
      <div class="shop-img">
        <img :src="item.branch_head_pic" />
        <!-- <img :src="item.branch_head_pic" onerror="this.style.display='none';this.onerror=null"/> -->
      </div>
      <div class="shop-info">
        <p class="ellipsis shop-title">{{ item.branch_name }}</p>
        <div class="shop-label">
          <p v-if="item.labels && item.labels.length">
            <span v-for="lab in item.labels" :key="lab.id">{{ lab.name }}</span>
          </p>
          <em class="distance">{{ item.distance | distance }}</em>
        </div>
      </div>
    </div>
    <div
      class="imgs-box"
      v-if="item.pic_list && item.pic_list.length"
      data-type="detail"
      @click="gotoNext">
      <div class="one-box" v-if="item.pic_list.length === 1" :class="{'show': item.pic_list.length === 1}">
        <img :src="item.pic_list[0].pic" alt="">
      </div>
      <div class="list-box" v-else>
        <div
          class="img-item"
          v-for="(picItem, index) in item.pic_list.slice(0,4)"
          :key="'pic_' + picItem.id + index">
          <img :src="picItem.pic" alt="" />
        </div>
      </div>
    </div>
    <div class="evaluate-box" v-if="item.article_list && item.article_list.length">
      <div
        class="evaluate-item"
        v-for="(aItem, index) in item.article_list.slice(0,3)"
        :key="'article_' + aItem.id + index"
        data-type="article"
        @click="gotoNext($event, aItem)">
        <div class="user-pic">
          <img :src="aItem.avatar" :alt="aItem.avatar">
        </div>
        <span class="user-name">{{ aItem.nickname }}</span>
        <p class="ellipsis eval-doc">{{ aItem.title }}</p>
      </div>
      <p class="evaluate-more"
        v-if="item.article_cnt > 3"
        data-type="detail"
        @click="gotoNext">查看全部{{ item.article_cnt }}条觅食笔记 >></p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'shop-item',
  props: {
    item: Object,
  },
  data() {
    return {};
  },
  created() {
    //..
  },
  methods: {
    gotoNext(e, aItem = {}) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case 'detail':
          this.$forward('shopdetail', {
            bid: this.item.id,
            target_type: 'native',
          });
          break;
        case 'article':
          this.$forward('article', { id: aItem.id, target_type: 'native' });
          break;
        default:
        // do nothing...
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
  //* 店铺 */
  .shop-item{
    background: #FFF;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    //* 店铺介绍 */
    .shop-detail{
      display: flex;
      //*店铺图*/
      .shop-img{
        width: 40px;
        height: 40px;
        border: 1px solid #e1e1e1;
        background-color: #fff;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 13px;
        line-height: 0;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .shop-info{
        flex: 1;
        overflow: hidden;
        .shop-title{
          font-size: 14px;
          color: #212121;
          font-weight: bold;
          line-height: 20px;
          height: 20px;
        }
        .shop-label{
          margin-top: 5px;
          font-size: 10px;
          color: #999;
          display: flex;
          align-items: center;
          .distance{
            font-style: normal;
          }
          p{
            flex: 1;
            margin-right: 10px;
            span{
              margin-right: 10px;
            }
          }
        }
      }
    }
    //* 图片list */
    .imgs-box{
      margin-top: 8px;
      border-top: 1px solid #eee;
      padding-top: 8px;
      overflow: hidden;
      .one-box{
        display: none;
        width: 100%;
        height: 150px;
        background-color: #eee;
        &.show{
          display: block;
        }
        img{
          width: 100%;
        }
      }
      .list-box{
        display: flex;
        width: 103%;
        height: 75px;
        flex-wrap: wrap;
        .img-item{
          width: 75px;
          height: 75px;
          overflow: hidden;
          margin-right: 6px;
          background-color: #eee;
        }
      }
    }
    //* 评价 */
    .evaluate-box{
      margin-top: 15px;
      .evaluate-item{
        display: flex;
        align-items: center;
        height: 22px;
        line-height: 22px;
        &:last-child{
          margin-bottom:0 px;
        }
        .user-pic{
          width: 15px;
          height: 15px;
          background-color: #ddd;
          border-radius: 100%;
          overflow: hidden;
          margin-right: 7px;
          line-height: 0;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .user-name{
          font-size: 10px;
          color: #4A4A4A;
          margin-right: 20px;
        }
        .eval-doc{
          flex: 1;
          font-size: 10px;
          color: #9B9B9B;
        }
      }
      .evaluate-more{
        margin-top: 8px;
        font-size: 10px;
        color: #4A90E2;
        text-align: center;
      }
    }
  }

</style>
