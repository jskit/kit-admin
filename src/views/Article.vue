<template>
  <div class="article-page">
    <div class="block">
      <div class="article-swiper">
        <Swiper
          :ratio="ratio"
          :continuous="true"
          :showIndicators="false"
          :auto="6000"
          :speed="500"
          @change="handleChange"
          >
          <SwiperItem v-for="(item,index) in swiperList" :key="index">
            <div class="swiper-block">
              <img :src="item" alt="" class="swiper-image">
            </div>
          </SwiperItem>
          <p class="swiper-indi" slot="footer">
            {{curIndex}}/{{swiperList && swiperList.length}}
          </p>
        </Swiper>
      </div>
      <div class="author">
        <FollowItem :item="authorItem" @toggleFollow="toggleFollow"></FollowItem>
      </div>
      <div class="article-content">
        <div class="a-title">
          {{articleDesc.title}}
        </div>
        <div class="a-content">
          {{articleDesc.content}}
        </div>
        <div class="a-star">
          <div class="star-title">
            推荐指数:
          </div>
          <div class="score">
            <RecommentStar :star="starObj"></RecommentStar>
          </div>
        </div>
        <div class="a-tag" v-if="articleDesc.tags && articleDesc.tags.length">
          <div class="tag-item" :class="{ disabled: item.state == 2 }" @click="tagsClick(item.name,item.state)" v-for="item in articleDesc.tags" :key="item.name">
            {{item.name}}
          </div>
        </div>
        <div class="a-address">
          <div class="address" @click="goMap">
            <img :src="localImg" alt="" v-if="articleDesc.address">
            <span>{{articleDesc.address}}</span>
          </div>
          <div class="time">
            发布于  {{dealTime(articleDesc.time)}}
          </div>
        </div>
      </div>
      <div class="merchant" v-if="merchant.show">
        <div class="merchant-block">
          <div class="merchant-title">
            <span>前往探店</span>
          </div>
          <div class="merchant-desc" @click="goBranch(merchant.id)">
            <div class="merchant-avatar">
              <img :src="merchant.avatar" alt="">
            </div>
            <div class="merchant-info">
              <div class="merchant-name">
                {{merchant.name}}
              </div>
              <div class="merchant-add">
                {{merchant.address}}
              </div>
            </div>
            <div class="distance">
              {{merchant.distance | distance}}
            </div>
          </div>
        </div>
      </div>
      <div class="comments">
        <div class="comments-title">
          <div class="title-block">
            <div class="switch-btn" :class="{ active: switchTab == 'like' }" @click="funcSwitchTab(1)">
              赞 &middot; {{like_num}}
            </div>
            <div class="switch-btn" :class="{ active: switchTab == 'comments' }" @click="funcSwitchTab(2)">
              评论 &middot; {{comment_num}}
            </div>
            <div class="switch-btn" :class="{ active: switchTab == 'fav' }" @click="funcSwitchTab(3)">
              收藏 &middot; {{favorite_num}}
            </div>
          </div>
        </div>
        <div class="comment-block" v-show="switchTab == 'comments'">
          <div class="add-comment">
            <AddComment @onEnter="onEnter" :userAvatar="userAvatar" :articleId="articleId" placeholder="加入讨论可以赢取蜂蜜哦！"></AddComment>
          </div>
          <template v-if="comments.length > 0">
            <CommentItem v-for="(item,index) in comments" :key="index" :item="item"></CommentItem>
            <div class="more-comments">
              <div class="more-com-btn" @click="goCommentsList()">
                查看全部 >>
              </div>
            </div>
          </template>
          <div class="item-empty" v-else>
            成为第一个评论的人吧！
          </div>
        </div>
        <div class="like-block" v-show="switchTab == 'like'">
          <template v-if="likeList.length > 0">
            <div class="avatar-item" v-for="(item,index) in likeList" :key="index" @click="goProfile(item.user_id)">
              <Avatar
                :src="item.avatar"
                :size=40
                bg="white"
                class="avatar">
              </Avatar>
            </div>
            <!-- <div class="more-comments">
              <div class="more-com-btn" @click="goCommentsList()">
                查看全部 >>
              </div>
            </div> -->
          </template>
          <div class="item-empty" v-else>
            成为第一个点赞的人吧！
          </div>
        </div>
        <div class="like-block" v-show="switchTab == 'fav'">
          <template v-if="favoriteList.length > 0">
            <div class="avatar-item" v-for="(item,index) in favoriteList" :key="index" @click="goProfile(item.user_id)">
              <Avatar
                :src="item.avatar"
                :size=40
                bg="white"
                class="avatar">
              </Avatar>
            </div>
            <!-- <div class="more-comments">
              <div class="more-com-btn" @click="goCommentsList()">
                查看全部 >>
              </div>
            </div> -->
          </template>
          <div class="item-empty" v-else>
            成为第一个收藏的人吧！
          </div>
        </div>
      </div>
      <div class="recommend">
        <div class="recommend-title">
          <span>
            更多觅食笔记
          </span>
        </div>
        <div class="recommend-list">
          <water-fall ref="waterfall" @ontap="ontap"></water-fall>
        </div>
      </div>
    </div>
    <FooterBar :list="footerBarList" @footerBarClick='footerBarClick'></FooterBar>
    <AppBottomBtn :btnList="btnList" @appBottomBtnClick="appBottomBtnClick" :showBottomBtn="showBottomBtn" @toggleAppBottomBtn="toggleAppBottomBtn"></AppBottomBtn>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from '@/ui';
import Avatar from '@/components/Avatar';
import AddComment from '@/components/AddComment';
import RecommentStar from '@/components/RecommentStar';
import FollowItem from '@/components/FollowItem';
import CommentItem from '@/components/CommentItem';
import WaterFall from '@/components/WaterFall';
import FooterBar from '@/components/FooterBar';
import AppBottomBtn from '@/components/AppBottomBtn';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import api from '@/api';
import scroll from '@/utils/scroll';
import { loadImg } from '@/utils';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    Swiper,
    SwiperItem,
    FollowItem,
    CommentItem,
    WaterFall,
    FooterBar,
    Avatar,
    RecommentStar,
    AddComment,
    AppBottomBtn,
  },
  data() {
    return {
      ratio: 1,
      authorItem: {},
      articleDesc: {},
      swiperList: [],
      curIndex: 1,
      merchant: {},
      comments: [],
      switchTab: 'comments',
      footerBarList: [],
      like_num: 0,
      favorite_num: 0,
      comment_num: 0,
      article_id: '',
      favoriteList: [],
      likeList: [],
      starObj: {},
      articleId: 0,
      userAvatar: '',
      btnList: [
        {
          id: 1,
          text: '举报内容',
          color: '#ff3b30',
        },
        // {
        //   id: 2,
        //   text: '删除',
        //   color: '#007AFF',
        // },
      ],
      showBottomBtn: false,
    };
  },
  created() {
    const that = this;
    if (!this.$route.query.id) {
      return;
    }
    this.articleId = parseInt(this.$route.query.id);
    this.getGeo({
      name: 'article',
      success: res => {
        console.log('article.vue geo success:', res);
        that.getDetail();
      },
      fail: err => {
        console.log('article.vue geo fail:', err);
        that.getDetail();
      },
    });
    // if (device.msf) {
    //   bridge.enableRefresh(); // 开启刷新
    //   // 监听下拉刷新
    //   bridge.onPullRefresh({
    //     success(res) {
    //       that.getDetail();
    //     },
    //   });
    // }
  },
  // 组件销毁前调用
  beforeDestroy() {
    // if (device.msf) {
    //   bridge.disableRefresh(); // 禁止 下拉刷新
    //   bridge.offPullRefresh(res => {
    //     console.log('app off PullRefresh', res);
    //   });
    // }
  },
  watch: {
    $route(val, oldVal) {
      if (val.query.id != oldVal.query.id) {
        this.getDetail();
        let dom = scroll.getScrollEventTarget(this.$el);
        scroll.setScrollTop(dom, 0);
      }
    },
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    }),
  },
  methods: {
    ...mapActions(['getGeo', 'setShareMask']),
    getDetail() {
      // const self = this;
      api.articleDetail(
        {
          id: this.$route.query.id,
        },
        res => {
          const { data = {} } = res;
          this.dealData(data);
          this.getCommendList();
          // if (device.msf) {
          //   // 停止刷新
          //   bridge.stopRefresh();
          // }
          if (device.wechat) {
            bridge.setShare({
              title: this.articleDesc.title || '觅食蜂 美食探索进行时',
              desc: '来觅食蜂查看 @' + this.authorItem.name + ' 的觅食笔记吧！',
              link: location.href,
              imgUrl: this.authorItem.avatar,
            });
          }
        },
        err => {
          console.log(err);
          // if (device.msf) {
          //   // 停止刷新
          //   bridge.stopRefresh();
          // }
        }
      );
    },
    getCommendList() {
      api.articleInterestList(
        {
          id: this.$route.query.id,
        },
        res => {
          console.log(res);
          let { list = [] } = res.data;
          this.dealInterestList(list);
        },
        err => {
          console.log(err);
        }
      );
    },
    dealData(data) {
      const that = this;
      if (device.msf && data.user_id != this.userInfo.id) {
        bridge.addNavigationBarMenu({
          success(res) {
            if (res.data.id == 2) {
              that.toggleAppBottomBtn(true);
            }
          },
          right: [
            {
              id: 2,
              icon: 'bg_more',
              text: '更多',
              color: '#ff0000',
              fontSize: '',
            },
          ],
          // left: [
          //   {
          //     id: 1,
          //     icon: 'bg_back',
          //     text: '返回',
          //     color: '#ff0000',
          //     fontSize: '',
          //   },
          // ],
        });
      }

      // swiper比例
      this.ratio = data.height / data.width || 1;
      this.swiperList = data.pics || [];
      this.authorItem = {
        avatar: data.avatar,
        followed: data.followed || false,
        name: data.nickname,
        article: data.article_num,
        fans: data.fans_num,
        id: data.user_id,
      };
      this.articleDesc = {
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        address: data.address,
        time: data.created_at,
      };
      this.merchant = {
        show: data.branch_id && data.branch_lng && data.branch_lat,
        avatar: data.branch_head_pic,
        name: data.branch_name,
        address: data.branch_address,
        distance: data.branch_distance || 0,
        id: data.branch_id,
      };
      this.mapQuery = {
        lng: data.lng,
        lat: data.lat,
        title: data.title,
        address: data.address,
        target_type: 'native',
      };
      this.comments =
        data.comments &&
        data.comments.map(item => {
          return {
            avatar: item.avatar,
            userName: item.nickname,
            content: item.content,
            time: item.created_at * 1000,
            id: item.user_id,
          };
        });
      this.userAvatar = data.avatar;
      this.like_num = data.likes_num;
      this.comment_num = data.comment_num;
      this.favorite_num = data.favorite_num;
      this.article_id = data.id;
      this.likeImg = loadImg('article/like-active.png');
      this.unLikeImg = loadImg('article/like.png');
      this.favoriteImg = loadImg('article/favorite-active.png');
      this.unFavoriteImg = loadImg('article/favorite.png');
      this.localImg = loadImg('article/location.png');
      this.starObj = {
        max: 50,
        singleSize: 10,
        width: 18,
        height: 18,
        select: data.star,
        allowHalf: false,
        normalIcon: loadImg('article/rate-disabled.png'),
        activeIcon: loadImg('article/rate-active.png'),
      };
      console.log('aiaushoifuhqowhdo    ====== ', data.star);

      this.footerBarList = [
        {
          icon: data.likes_status ? this.likeImg : this.unLikeImg,
          content: '点赞 &middot; ' + data.likes_num,
          type: 'dianzan',
        },
        {
          icon: loadImg('article/comment.png'),
          content: '评论 &middot; ' + data.comment_num,
          type: 'pinglun',
        },
        {
          icon: data.favorite_status ? this.favoriteImg : this.unFavoriteImg,
          content: '收藏 &middot; ' + data.favorite_num,
          type: 'shoucang',
        },
        {
          icon: loadImg('article/share.png'),
          content: '分享',
          type: 'fenxiang',
        },
      ];
      console.log(data);
    },
    dealInterestList(list = []) {
      let newList = list.map(item => {
        return {
          id: item.id,
          pic: item.pic,
          width: item.pic_width,
          height: item.pic_height,
          ratio: item.pic_height / item.pic_width,
          title: item.title,
          user_avatar: item.avatar,
          user_nickname: item.nickname,
          likes_num: item.likes_num,
        };
      });
      this.$nextTick(() => {
        this.$refs.waterfall && this.$refs.waterfall.setDate(newList, 'reset');
      });
    },
    funcSwitchTab(index) {
      switch (index) {
        case 1:
          this.getLikeList();
          break;
        case 2:
          this.switchTab = 'comments';
          break;
        case 3:
          this.getFavoriteList();
          break;
        default:
          console.log('点击按钮');
      }
    },
    // 请求点赞列表
    getLikeList() {
      // 当存在的时候不需要请求接口
      this.switchTab = 'like';
      // if (this.likeList.length > 0) {
      //   return;
      // }
      api.articleLikesList(
        {
          id: this.$route.query.id,
        },
        res => {
          this.likeList = res.data.list.slice(0, 16);
          this.switchTab = 'like';
        },
        err => {
          console.log(err);
        }
      );
    },
    // 请求收藏列表
    getFavoriteList() {
      // 当存在的时候不需要请求接口
      this.switchTab = 'fav';
      // if (this.favoriteList.length > 0) {
      //   return;
      // }
      api.articleFavoriteList(
        {
          id: this.$route.query.id,
        },
        res => {
          this.favoriteList = res.data.list.slice(0, 16);
          // this.switchTab = 'fav';
        },
        err => {
          console.log(err);
        }
      );
    },
    toggleLikes() {
      const self = this;
      api.toggleLike(
        {
          id: this.$route.query.id,
        },
        res => {
          const imgSrc = res.data.status == 1 ? this.likeImg : this.unLikeImg;
          self.$set(self.footerBarList[0], `icon`, imgSrc);
          self.$set(
            self.footerBarList[0],
            `content`,
            '点赞 &middot; ' + res.data.likes_num
          );
          self.like_num = res.data.likes_num;
        },
        err => {
          console.log(err);
        }
      );
    },
    toggleFavorite() {
      api.toggleFavorite(
        {
          id: this.$route.query.id,
        },
        res => {
          const self = this;
          const imgSrc =
            res.data.status == 1 ? this.favoriteImg : this.unFavoriteImg;
          self.$set(self.footerBarList[2], `icon`, imgSrc);
          self.$set(
            self.footerBarList[2],
            `content`,
            '收藏 &middot; ' + res.data.favorite_num
          );
          self.favorite_num = res.data.favorite_num;
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    },
    toggleFollow(result) {
      let followed = result == 3 ? false : true;
      this.authorItem.followed = followed;
    },
    appBottomBtnClick(id) {
      console.log('bbbbbbbb ', id);
      const that = this;
      if (id == 1) {
        console.log('举报');
        bridge.showAlert({
          content: '确认举报这篇觅食笔记吗？',
          btns: [
            {
              id: 1,
              type: 'cancel',
              text: '取消',
            },
            {
              id: 2,
              type: 'sure',
              text: '确定举报',
            },
          ],
          success(res) {
            const { data } = res;
            that.toggleAppBottomBtn();
            if (data.id == 2) {
              console.log('点击确认举报按钮');
              that.doReport();
            } else {
              console.log('点击取消按钮');
            }
          },
        });
      }
    },
    doReport() {
      api.articleReport(
        {
          article_id: this.$route.query.id,
        },
        res => {
          bridge.showToast({
            content: res.data.content,
          });
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    },
    handleChange(index) {
      this.curIndex = index + 1;
    },
    footerBarClick(type) {
      switch (type) {
        case 'dianzan':
          this.toggleLikes();
          break;
        case 'shoucang':
          this.toggleFavorite();
          break;
        case 'pinglun':
          this.goCommentsList();
          console.log('跳转到评论列表');
          break;
        case 'fenxiang':
          console.log('点击分享按钮');
          if (device.msf) {
            bridge.showShare({
              type: 1,
              title: this.articleDesc.title || '觅食蜂 美食探索进行时',
              desc: '来觅食蜂查看 @' + this.authorItem.name + ' 的觅食笔记吧！',
              link: location.href,
              imgUrl: this.authorItem.avatar,
              url: location.href,
              success(res2) {
                console.log(res2);
              },
            });
          } else {
            // 显示分享遮罩
            this.setShareMask(true);
          }
          break;
        default:
          console.log('点击按钮');
          break;
      }
    },
    ontap(id, index) {
      console.log(arguments);
      this.$forward('article', { id });
    },
    onEnter(data) {
      console.log('新增了评论');
      const comment = {
        avatar: data.avatar,
        userName: data.nickname,
        content: data.content,
        time: data.created_at * 1000,
      };
      this.comments = [comment, ...this.comments].slice(0, 5);
      this.comment_num = data.comment_num;
      this.$set(
        this.footerBarList[1],
        `content`,
        '评论 &middot; ' + data.comment_num
      );
    },
    toggleAppBottomBtn(val = false) {
      this.showBottomBtn = val;
    },
    goBranch(id) {
      console.log('去探店，id=', id);
      this.$forward('shopdetail', { bid: id, target_type: 'native' });
    },
    goCommentsList() {
      console.log('去评论列表，id=', this.article_id);
      this.$forward('comments', {
        id: this.$route.query.id,
        target_type: 'native',
      });
    },
    tagsClick(name, state) {
      if (state == 2) {
        return;
      }
      this.$forward('searcharticle', { keyword: name, target_type: 'native' });
      console.log('跳转到name == ', name, '的搜索页面');
    },
    dealTime(times) {
      // 获取当天0:00 13位时间戳
      let today = new Date();
      let newTime = new Date(times * 1000);
      let str = '';

      if (newTime.getFullYear() != today.getFullYear()) {
        str = newTime.getFullYear() + '-';
      }
      str += newTime.getMonth() + 1 + '-' + newTime.getDate();
      return str;
    },
    goMap() {
      console.log('跳转地图');
      this.$forward('map', this.mapQuery);
    },
    goProfile(id) {
      if (!id) {
        return;
      }
      this.$forward('profile', { userId: id, target_type: 'native' });
    },
  },
};
</script>

<style lang="stylus" scoped>

.article-page{
  background-color: #fff;
  padding-bottom: 55px;
}
.author{
  padding: 0 15px;
}
.article-content{
  padding: 15px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);
  margin-bottom: 15px;
}
.a-title{
  font-weight: 500;
  font-size: 17px;
  color: #212121;
}
.a-content{
  font-size: 14px;
  color: #666;
  line-height: 22px;
  margin: 10px 0 30px 0;
}
.a-star{
  font-size: 14px;
  color: #666;
  line-height: 22px;
  margin-bottom: 10px;
  display: flex;
  height: 22px;
  align-items: center;
}
.star-title{
  margin-right: 10px;
}
.a-tag{
  display: flex;
  margin-bottom: 15px;
  flex-wrap: wrap
}
.score{
  position: relative;
}
.tag-item{
  margin-right: 10px;
  font-size: 13px;
  color: #666;
  text-align: center;
  line-height: 20px;
  padding: 0 14px;
  margin-bottom: 5px;
  border: 1px solid #FDCC02;
  border-radius: 4px;
}
.disabled{
  border: 1px solid #e2e2e2;
}
.a-address{
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #4A4A4A;
}
.a-address .time{
  min-width: 80px;
  text-align: center;
  display: flex;
  align-items: flex-end;
}
.swiper-block{
  position: relative;
  width: 100%;
  height: 100%;
}
.swiper-image{
  width: 100%;
  height: 100%;
}
.swiper-indi{
  position: absolute;
  right: 15px;
  bottom: 10px;
  background: rgba(35,24,21,0.50);
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  padding: 0 12px;
  z-index: 60;
}
.merchant{
  padding: 0 10px;
  margin-bottom: 20px;
}
.merchant-block{
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.15);
  border-radius: 10px;
  padding: 0 5px;
}
.merchant-title{
  line-height: 35px;
  text-align: center;
  width: 100%;
  border-bottom: 1px solid #e2e2e2;
  font-size: 14px;
  font-weight: 500;
}
.merchant-title span{
  display: inline-block;
  border-bottom: 3px solid #fccb2f;
}
.merchant-desc{
  position: relative;
  font-size: 10px;
  display: flex;
  padding: 15px;
}
.item-empty{
  font-size: 13px;
  color: #4A4A4A;
  text-align: center;
  width: 100%;
}
.switch-btn{
  padding: 0 10px;
}
.address{
  display: flex;
  align-items: center;
  line-height: 14px;
  padding-right: 5px;
}
.address img{
  height: 14px;
  margin-right: 5px;
  display: block;
}
.merchant-add{
  color: #999;
  max-width: 180px;
  text-overflow: ellipsis;
  word-break: normal;
  white-space: nowrap;
  overflow: hidden;
}
.distance{
  position: absolute;
  right: 15px;
  bottom: 15px;
  color: #999;
}
.comments-title{
  padding: 0 10px;
}
.title-block{
  display: flex;
  border-bottom: 1px solid #e2e2e2;
  line-height: 30px;
  justify-content: space-between;
  font-size: 14px;
  color: #231815;
  padding: 0 10px;
}
.title-block .active{
  border-bottom: 3px solid #fccb2f;
  font-weight: 500;
}
.comment-block{
  margin: 0 0 20px 0;
}
.add-comment{
  margin: 10px 0;
}
.merchant-info{
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 285px;
  padding-right: 60px;
  position: relative;
}
.merchant-name{
  font-weight: 500;
  font-size: 14px;
  color: #212121;
}
.more-comments{
  width: 100%;
  text-align: center;
  margin-top: 15px;
  padding: 0 15px;
  font-size: 12px;
  color: #4A4A4A;
  line-height: 24px;
}
.more-com-btn{
  width: 100%;
  background-color: #f2f2f2;
}
.recommend{
  width: 100%;
  padding: 0 10px;
  margin-bottom: 10px;
}
.recommend-title{
  width: 100%;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  color: #231815;
  line-height: 32px;
  border-bottom: 1px solid #f2f2f2;
}
.recommend-title span{
  display: inline-block;
  border-bottom: 3px solid #FDCC02;
}
.like-block{
  display: flex;
  flex-wrap: wrap;
  padding: 0 15px;
  justify-content: start;
  margin: 20px 0;
}
.avatar-item{
  width: 12.5%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-bottom 10px;
}
.merchant-avatar{
  width: 40px;
  height: 40px;
  background-color: #e2e2e2;
  flex-shrink: 0;
}

.merchant-avatar img{
  width: 100%;
  height: 100%;
}
</style>
