<script>
import Icon from '@/ui/Icon';
import oauth from '@/utils/oauth';

// const scopes = {
//   wechat: ['snsapi_base', 'snsapi_userinfo'],
//   alipay: ['auth_base', 'ant_member_info', 'auth_life_msg'],
// };

export default {
  name: 'SocialLogin',
  props: {
    types: {
      type: Array,
      scope: String,
      // scopes: VueTypes.oneOf(scopes).def('base'),
      // validator(value) {
      //   // 这个值必须匹配下列字符串中的一个
      //   return ['wechat', 'aliapp'].indexOf(value) !== -1;
      // },
    },
  },
  components: {
    Icon,
  },
  methods: {
    goOauth(type) {
      const url = oauth.getOauthUrl(type);

      debugger;
      if (url) {
        location.href = url;
      }
    },
  },

  render(h) {
    // https://alligator.io/vuejs/jsx-render-functions/
    const items = this.$props.types.map(item => {
      return (
        <div class="oauth-btn" onClick={this.goOauth.bind(this, item.type)}>
          <span class="oauth-btn-icon">{<Icon type={item.type} />}</span>
          <span class="oauth-btn-text">{item.name}</span>
        </div>
      );
    });
    return <div class="social-login">{items}</div>;
  },
};
</script>

<style lang="stylus" scoped>
.social-login {
  display: flex;
  align-items: center;
  justify-content: center;
}
.oauth-btn {
  margin-top: -8px;
  padding: 4px 16px;
  font-size: 20px;
  color: #9b9b9b;
}
.oauth-btn-text {
  display: none;
}
</style>
