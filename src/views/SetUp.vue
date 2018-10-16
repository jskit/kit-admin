<template>
  <div class="pages-set-up">
    <Header
    :left-options="{showBack: false}"
    :title="headerTitle">
      <span class="my-letf" slot="left" @click="onClickBack">取消</span>
      <span class="header-right" :class="{ disabled: isDisabled }" slot="right" @click="onClickDone">完成</span>
    </Header>
    <span class="set-title">{{setTitle}}</span>
    <div v-if="editUserName" class="set-input">
      <input class="input-area input-name" type="text" autofocus="autofocus" maxlength="24" minlength="2" ref="inputName" v-model="currText" @input="onInput">
    </div>
    <div v-else class="set-input">
      <textarea class="input-area input-desc" name="" id="" maxlength="100" autofocus="autofocus" @input="descInput" v-model="currText" ref="inputDesc"></textarea>
      <span class='textNum'>{{inputNum}}</span>
    </div>
    <div class="err-content" v-if="showErrContent">{{errContent}}</div>
  </div>
</template>
<script>
import Header from '@/ui/Header';
import api from '@/api';
export default {
  name: 'setup',
  components: {
    Header,
  },
  data() {
    return {
      editUserName: false,
      inputNum: 100,
      currText: '',
      autofocus: true,
      showErrContent: false,
      isDisabled: false,
      errContent: '',
    };
  },
  computed: {},
  created(opts) {
    const isEditUserName = this.$route.query.editUserName || false;
    this.currText = this.$route.query.currText || '';
    this.dealPageData(isEditUserName);
  },
  methods: {
    // 处理页面数据
    dealPageData(isEditUserName) {
      const textLength = this.currText.length || 0;
      this.inputNum -= textLength;
      this.editUserName = isEditUserName;
      this.isDisabled = this.editUserName && textLength < 3;
      this.headerTitle = isEditUserName ? '设置昵称' : '设置个人描述';
      this.setTitle = isEditUserName
        ? '2-24个字符，一个自然月只能申请修改一次'
        : '个人描述写得好，小伙伴不会少';
    },
    // 计算text-area还可输入字数
    descInput() {
      const textNum = this.currText.length || 0;
      this.inputNum = 100 - textNum;
    },
    // 点击取消
    onClickBack() {
      this.$back();
    },
    // 完成编辑
    onClickDone() {
      let param = {};
      if (this.editUserName) {
        if (this.isDisabled) return;
        param = { nickname: this.$refs.inputName.value };
      } else {
        param = { introduction: this.$refs.inputDesc.value };
      }
      this.getUpdateInfo(param);
    },
    // 监测input内容长度
    onInput() {
      const inputLength = this.$refs.inputName.value.length || 0;
      if (inputLength && inputLength >= 2) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    // 请求修改信息接口
    getUpdateInfo(param) {
      api.updateInfo(
        param,
        res => {
          const { data } = res;
          const { result } = data;
          if (result == 'success') {
            this.$showToast('修改成功！');
            this.$back();
          }
        },
        err => {
          if (err.errno == 9140003) {
            this.$showToast('网络连接超时，请重试');
          } else {
            this.errContent = err.errmsg;
            this.showErrContent = true;
          }
          return true;
        }
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
.pages-set-up {
  position: relative;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  font-size: 13px;
  background-color: rgb(245, 245, 245);
}
.my-letf {
  color: #231815;
}
.header-right {
  display: block;
  width: 100px;
  text-align: right;
  font-size: 14px;
  color: #FDCC02;
}
.disabled {
  color: #9B9B9B;
}
.set-title {
  display: block;
  color: #9B9B9B;
  padding: 10px 15px;
}
.set-input {
  position: relative;
}
.input-area {
  border: none;
  color: #000000;
  width: 100%;
}
.input-name {
  padding-left: 15px;
  height: 44px;
}
.input-desc {
  resize: none;
  padding: 5px 15px 10px 15px;
  line-height: 26px;
  height: 144px;
}
.textNum {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-size: 13px;
  color: #9B9B9B;
}
.err-content {
  margin: 10px 20px 0 15px;
  font-size: 14px;
  color: #D0021B;
}
</style>
