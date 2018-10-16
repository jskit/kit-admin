<template>
<div class="pages-setting" :hidden="hiddenPage">
  <div class="personal-info">
    <div v-for="(item, index) in personalInfoList" :key="index" class="info-cell line1px bottom" :class="{ 'avatar-cell': item.cellType == 'avatar' }" @click="goNext(item, index)">
      <span class="cell-title" :class="{ 'desc-title': item.cellType == 'personalDesc' }">{{item.title}}</span>
      <div class="cell-content" :class="{ 'desc-content': item.cellType == 'personalDesc', 'content-def': item.cellType == 'noBirthday' || item.cellType == 'noSex' || item.cellType == 'noPersonalDesc' }">
        <Avatar
        v-if="item.cellType == 'avatar'"
        :src="item.content || avatar"
        :size=100
        class="info-avatar"
        ></Avatar>
        {{item.cellType != 'avatar' ? item.content : ''}}
      </div>
      <div class="cell-right" v-if="index != 0 && index != 4">
        <Icon class="cell-right-arrow" mode="custom" type="arrow-right" :size=1 ></Icon>
      </div>
    </div>
  </div>
  <div class="serve-info">
    <div v-for="(item, index) in serveInfo" :key="index" class="info-cell  line1px bottom" @click="goNext(item, index)">
      <span class="serve-cell-title">{{item.title}}</span>
      <div class="cell-content">
      </div>
      <div class="cell-right">
        <Icon class="cell-right-arrow" mode="custom" type="arrow-right" :size=1 ></Icon>
      </div>
    </div>
  </div>
  <div class="logout" @click="logOut">
    <div class="logout-cell">退出登录</div>
  </div>
  <mt-datetime-picker
    ref="datePicker"
    type="date"
    year-format="{value} 年"
    month-format="{value} 月"
    date-format="{value} 日"
    v-model="pickerVisible"
    :startDate="startDate"
    :endDate="endDate"
    @confirm="handleConfirm">
  </mt-datetime-picker>
  <mt-popup
    v-model="popupVisible"
    position="bottom"
    class="my-popup">
    <mt-picker :slots="slots" showToolbar ref="picker">
      <mt-button class="picker-btn" @click="clickButton('cancel')">取消</mt-button>
      <mt-button class="picker-btn" @click="clickButton('confirm')">确认</mt-button>
    </mt-picker>
  </mt-popup>
</div>
</template>
<script>
import Vue from 'vue';
import api from '@/api';
import { formatDate } from '@/utils/base/date';
import Avatar from '@/components/Avatar';
import Icon from '@/ui/Icon';
import defaultAvatar from '@/assets/login/default-avatar.png';
import { DatetimePicker, Picker, Popup, Button } from 'mint-ui';
import { mapActions } from 'vuex';
// 组件注册不能写在一起
Vue.component(Popup.name, Popup);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Picker.name, Picker);
Vue.component(Button.name, Button);
// 初始化个人信息
const personalInfoList = [
  { title: '头像', content: '', cellType: 'avatar' },
  { title: '昵称', content: '', cellType: 'userName' },
  { title: '性别', content: '你是小哥哥还是小姐姐？', cellType: 'noSex' },
  { title: '生日', content: '悄悄地告诉我吧！', cellType: 'noBirthday' },
  { title: '手机号码', content: '18612345678', cellType: 'mobile' },
  {
    title: '个人描述',
    content: '签名写得好，小伙伴不会少',
    cellType: 'noPersonalDesc',
  },
];
// 初始化服务信息
const serveInfo = [
  { title: '服务条款', link: '', cellType: 'serve' },
  { title: '关于我们', link: '', cellType: 'aboutUs' },
];
// 初始化性别选项
const slots = [{ flex: 1, values: ['小哥哥', '小姐姐'], defaultIndex: 0 }];
export default {
  name: 'setting',
  components: {
    Icon,
    Avatar,
  },
  data() {
    return {
      avatar: defaultAvatar,
      personalInfoList,
      serveInfo,
      hiddenPage: true,
      pickerVisible: '1990-01-01', // 默认选中
      startDate: new Date('1950-01-01'), // 日期选择开始日期
      endDate: new Date(), // 日期选择结束日期
      slots,
      popupVisible: false, // 控制pop显示／隐藏
      showToolbar: true, // 设置是否在picker组件顶部显示一个 toolbar，内容自定义
      sexDefaultIndex: 0, // 性别选项初始选中的index
      introduction: '', // 个人描述
    };
  },
  computed: {},
  created() {
    this.getSetting();
  },
  methods: {
    ...mapActions(['Logout']),
    //请求设置接口
    getSetting() {
      api.getSetting(
        {},
        res => {
          const { data } = res;
          this.personalInfoList.forEach((item, index) => {
            const opts = { item, index, data };
            item = this.dealCellContent(opts);
          });
          this.serveInfo.forEach((item, index) => {
            if (index == 0) {
              item.link = data.service_terms;
            } else {
              item.link = data.aboutus;
            }
          });
          this.introduction = data.introduction;

          this.slots[0].defaultIndex =
            data.gender - 1 == 2 ? 0 : data.gender - 1;
          this.hiddenPage = false;
        },
        err => {}
      );
    },
    // 处理页面个人信息部分内容 0.头像 1.昵称 2.性别 3.生日 4.手机号码 5. 个人描述
    dealCellContent(opts) {
      const { item, index, data } = opts;
      switch (index) {
        case 0: // 头像
          if (data.avatar) {
            item.content = data.avatar;
          }
          return item;
        case 1: // 昵称
          if (data.nickname) {
            item.content = data.nickname;
          }
          return item;
        case 2: // 性别
          if (data.gender && data.gender != 3) {
            item.cellType = 'sex';
            item.content = data.gender == 1 ? '小哥哥' : '小姐姐';
          }
          return item;
        case 3: // 生日
          if (data.birthday) {
            item.cellType = 'birthday';
            item.content = data.birthday;
            this.pickerVisible = data.birthday;
          }
          return item;
        case 4: // 手机号码
          item.content = data.mobile;
          return item;
        case 5: // 个人描述
          if (data.introduction) {
            item.cellType = 'personalDesc';
            item.content = data.introduction;
          } else {
            item.cellType = 'noPersonalDesc';
            item.content = '签名写得好，小伙伴不会少';
          }
          return item;
      }
    },
    // 退出登录
    logOut() {
      const that = this;
      this.Logout().then(function() {
        that.$forward('index');
      });
    },
    // 点击事件
    goNext(obj, index) {
      const { cellType = '' } = obj;
      if (cellType == 'serve' || cellType == 'aboutUs') {
        let id;
        switch (index) {
          // 0.服务条款 1.关于我们
          case 0:
            id = 2;
            break;
          case 1:
            id = 3;
            break;
        }
        this.$forward('rule', { id });
      } else {
        // 0.头像 1.昵称 2.性别 3.生日 4.手机号码 5. 个人描述
        switch (index) {
          case 0: // 头像
            break;
          case 1: // 昵称
            this.$forward('setup', {
              editUserName: true,
              currText: this.personalInfoList[1].content,
            });
            break;
          case 2: // 性别
            this.popupVisible = true;
            break;
          case 3: // 生日
            this.openPicker();
            break;
          case 4: // 手机号码
            break;
          case 5: // 个人描述
            this.$forward('setup', {
              editUserName: false,
              currText: this.introduction,
            });
            break;
        }
      }
    },
    // 点击修改生日，打开datePicker
    openPicker() {
      this.$refs.datePicker.open();
    },
    // 选择生日
    handleConfirm(e) {
      const newBirth = formatDate(e, 'Y-M-D');
      this.updateInfo('birthday', newBirth);
    },
    // 点击选择性别picker中的button
    clickButton(clickType) {
      if (clickType == 'confirm') {
        const value = this.$refs.picker.getValues() || [];
        this.updateInfo('gender', value[0]);
      }
      this.popupVisible = false;
    },
    // 请求更新信息接口
    updateInfo(par, value) {
      let params = {};
      if (par == 'birthday') {
        params = { birthday: value };
      } else {
        value == '小哥哥' ? (params = { gender: 1 }) : (params = { gender: 2 });
      }
      api.updateInfo(
        params,
        res => {
          const { data } = res;
          if (data.result == 'success') {
            if (par == 'birthday') {
              this.personalInfoList[3].content = value;
              this.personalInfoList[3].cellType = 'birthday';
              return;
            }
            this.personalInfoList[2].content = value;
            this.personalInfoList[2].cellType = 'sex';
          }
        },
        err => {}
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
.pages-setting {
  position: relative;
  padding: 0;
  margin: 0;
  background: rgb(245, 245, 245);
  height: 100%;
}
.personal-info, .serve-info, .logout {
  position: relative;
  background: #FFFFFF;
  padding: 0 15px;
  font-size: 13px;
  color: #000000;
  margin-bottom: 10px;
}
.info-cell {
  display: flex;
  padding: 12px 0;
  align-items: center;
}
.info-cell:last-child::after {
  display: none;
}
.avatar-cell {
  padding: 17px 0;
  line-height: 100px;
}
.cell-title {
  min-width: 75px;
  color: #9B9B9B;
}
.serve-cell-title {
  width: 75px;
}
.content-def {
  color: #9B9B9B;
}
.cell-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  word-wrap: break-word;
  word-break: normal;
}
.cell-right {
  width: 10px;
}
.desc-title {
  align-self: flex-start;
}
.desc-content {
  margin-right: 6px;
}
.logout-cell {
  padding: 12px 0;
  text-align: center;
}
.my-popup {
  width: 100%;
}
.picker-btn {
  width: 50%;
  color: rgb(34, 176, 250);
  font-size: 16px;
  background-color: #FFFFFF;
}
.confirm {
  color: red;
}
</style>
