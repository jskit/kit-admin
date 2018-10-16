<template>
  <div class="page-login">
    <div class="banner">
      <img class="bg" src="~assets/login/bg_high.png" alt="background-image" />
      <Avatar
        :src="avatar"
        :size=120
        maskColor="transparent"
        mode="scaleToFill"
        @click.native="goNext"
        class="avatar">
      </Avatar>
    </div>

    <div class="close" @click="$router.back()"><Icon type="close-circle-o"></Icon></div>

    <div class="login-form">
      <div class="tip">{{ tip }}</div>
      <div class="form-box">
        <div class="form-item form-input">
          <input
            type="tel"
            v-model.trim="loginForm.mobile"
            ref="mobile"
            maxlength="11"
            class="input-text"
            :class="{error: this.errorMobile}"
            placeholder="手机号码">
        </div>
        <div class="form-item form-input">
          <input
            type="tel"
            v-model.trim="loginForm.code"
            ref="code"
            maxlength="6"
            class="input-text"
            :class="{error: this.errorCode}"
            placeholder="验证码">
          <span class="get-code" @click="goNext('code')">{{ countdownTip }}</span>
        </div>
        <div class="form-item form-text f10">如果尚未注册，则为您注册新账户，查看<span class="agreement" @click="goNext('agreement')">用户协议</span></div>
        <div class="form-item form-btn flex-center" :class="{ disabled: !mobileRight }" @click="goSubmit">{{ btnText }}</div>
      </div>
    </div>

    <!-- <SocialLogin :types="socials"></SocialLogin> -->

  </div>
</template>

<script>
import Icon from '@/ui/Icon';
import Avatar from '@/components/Avatar';
import SocialLogin from '@/components/SocialLogin';
import defaultAvatar from '@/assets/login/default-avatar.png';
import { regMobile, regMobileCode } from '@/utils/validate';
import { sleep } from '@/utils';
// import { session } from '@/utils/storage';
import api from '@/api';

// https://github.com/egoist/vue-final-form
// https://github.com/PeakTai/vue-verify
export default {
  name: 'login',
  components: {
    Icon,
    Avatar,
    SocialLogin,
  },
  data() {
    return {
      loginForm: {
        mobile: '',
        code: '',
      },
      countdown: 60,
      countdownTip: '获取验证码',
      socials: [
        { type: 'wechat' },
        // { type: 'alipay' },
      ],
      avatar: defaultAvatar,
      tip: '现在就加入觅食蜂的大家庭吧',
      errorMobile: false,
      errorCode: false,
      // 昵称
      btnText: '立即加入',
      // 绑定手机号，完成注册
    };
  },
  computed: {
    mobileRight() {
      const { mobile, code } = this.loginForm;
      // this.checkRight();
      // return regMobile.test(mobile) && regMobileCode.test(code);
      return regMobile.test(mobile) && code;
    },
  },
  methods: {
    checkRight() {
      const { mobile, code } = this.loginForm;
      this.errorMobile = mobile && !regMobile.test(mobile);
      this.errorCode = code && !regMobileCode.test(code);
      return this.errorMobile && this.errorCode;
    },
    checkForm(checks = ['mobile', 'code']) {
      const { mobile, code } = this.loginForm;
      this.errorMobile = false;
      if (checks.includes('mobile')) {
        if (!mobile) {
          this.$showToast('请输入手机号');
          this.errorMobile = true;
          return;
        }
        if (!regMobile.test(mobile)) {
          this.$showToast('手机号格式不正确');
          this.errorMobile = true;
          return;
        }
      }
      this.errorCode = false;
      if (checks.includes('code')) {
        if (!code) {
          this.$showToast('请输入手机校验码');
          this.errorCode = true;
          return;
        }
        if (!regMobileCode.test(code)) {
          this.$showToast('验证码格式不正确');
          this.errorCode = true;
          return;
        }
      }

      // if (!this.errorTip) e.preventDefault();

      return !this.errorMobile && !this.errorCode;
    },
    goSubmit() {
      const that = this;
      // e.preventDefault();
      if (!this.checkForm()) return;
      const { mobile, code } = this.loginForm;
      this.$store
        .dispatch('Login', {
          login_type: 1,
          mobile,
          auth_code: code,
        })
        .then(async res => {
          console.log(res.data);
          this.$showToast('登录成功');
          await sleep(2000);
          // redirect
          // console.log(that);
          const { query = {} } = that.$route;
          const redirectQuery = query.redirectQuery
            ? JSON.parse(query.redirectQuery)
            : {};
          query.redirect
            ? that.$forward(query.redirect, redirectQuery)
            : that.$back();
        })
        .catch(err => {
          console.log(err);
        });
      // api.login(
      //   {
      //     login_type: 1,
      //     mobile: this.mobile,
      //     auth_code: this.code,
      //   },
      //   res => {
      //     const { data } = res;
      //     console.log(data);
      //     // commit('SET_USERINFO', data);
      //     // storage.set("userInfo", { ...state });
      //     // resolve(res);
      //   },
      //   err => {
      //     // reject(err);
      //   }
      // );
    },
    goNext(type) {
      const that = this;
      switch (type) {
        case 'agreement':
          this.$forward('rule?id=2');
          break;
        case 'code': {
          // 43秒后可重新获取
          if (this.clearId) return;
          if (!this.checkForm(['mobile'])) return;
          that.countdownTip = `${that.countdown}s`;
          that.clearId = setInterval(() => {
            that.countdown--;
            if (that.countdown > 0) {
              that.countdownTip = `${that.countdown}s`;
            } else {
              clearInterval(that.clearId);
              that.countdownTip = '获取验证码';
              that.countdown = 60;
            }
          }, 1000);
          api.mobileCode(
            {
              mobile: this.loginForm.mobile,
              type: 1,
            },
            res => {
              const { data } = res;
              console.log(data);
              that.$showToast('获取验证码成功');
              // commit('SET_USERINFO', data);
              // storage.set("userInfo", { ...state });
              // resolve(res);
            },
            err => {
              // reject(err);
            }
          );
          break;
        }
        default:
        // do nothing...
      }
      // this.avatar = defaultAvatar;
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../style/var';

$textColor = #9B9B9B;
$yellowColor = #FDCC02;
$errorColor = #D0021B;

// (1- Math.sqrt(3)/2)/2
// $hgap = 6.69872981077807;

.page-login {
  background: #fff;

  .close {
    position: absolute;
    padding: 10px;
    top: 10px;
    right: 10px;
    font-size: 20px;
  }
}
.banner {
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 60px;

  .bg {
    height: 100%;
    margin-top: -30px;
  }
}

.avatar {
  position: absolute;
  left: 50%;
  bottom: -90px;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  // filter: drop-shadow(0 4px 4px rgba(0,0,0,.1));
}

.login-form {
  margin: 0 auto 20px;
  width: 240px;
  text-align: center;

  .tip {
    font-size: 17px;
    font-weight: bold;
  }
  .form-input {
    position: relative;
    margin: 10px 0;
    // overflow: hidden;
  }
  .input-text {
    height: 36px;
    width: 100%;
    padding: 8px 16px;
    font-size: 14px;
    // border: none;
    // color: $textColor;
    border-radius: 10px;
    border: 1px solid $textColor;
    // 解决IOS端微信浏览器input，textarea有内上边框阴影
    // box-shadow: none;
    -webkit-appearance: none;

    &::-webkit-input-placeholder {
      color: $textColor;
    }

    &:focus {
      border-color: $yellowColor;

      // + .get-code {
      //   color: inherit;
      // }
    }
    &.error {
      border-color: $errorColor;
    }
  }
  .get-code {
    position: absolute;
    right: 10px;
    top: 13px;
    font-size: 12px;
    color: $textColor;

    &.disabled {
      color: $textColor;
    }
  }

  .form-text {
    margin: 0 -30px;
    font-size: 12px;
    color: $textColor;

    .agreement {
      text-decoration: underline;
    }
  }

  .form-btn {
    position: relative;
    margin: 10px auto;
    height: 36px;
    background-color: $yellowColor;
    border-radius: 10px;
    color: #000;
    width: 100%;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    border: 1px solid transparent;
    font-size: 14px;

    &.disabled {
      border-color: #EAEAEA;
      background: #fff;
      color: $textColor;
      box-shadow: none;
    }

    &:active {
      top: 1px;
    }
  }
}
</style>
