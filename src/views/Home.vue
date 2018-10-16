<template>
  <div class="page-home">
    <img alt="Vue logo" src="~assets/logo.png">
    <div @click="click">
      <Icon type="bug" />
      <Icon type="icon" />
    </div>
    <a @click="$router.push('About')">转到About</a>
    <!-- <mt-spinner type="fading-circle" :size="24"></mt-spinner> -->
    <div v-for="item in list" :key="item.id">
      {{ item.id }}
    </div>
    {{ aa }}
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld';
import Icon from '@/ui/Icon';
import { Spinner } from 'mint-ui';

// console.log(Spinner);
export default {
  name: 'home',
  components: {
    [Spinner.name]: Spinner,
    HelloWorld,
    Icon,
  },
  data() {
    const list = [
      {
        id: 1,
        name: 'xxx',
      },
      {
        id: 2,
        name: 'xxxxx',
      },
    ];
    return {
      a: 1,
      b: 2,
      list,
    };
  },
  computed: {
    aa() {
      // console.log(111);
      return this.a * this.b + 3;
    },
  },
  methods: {
    click() {
      console.log(111111);
      this.a = 2;
      this.$router.push({
        name: 'login',
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-home {
  text-align: center;
}
.box {
  margin: 20px 0;
  height: 100px;
  background: green;
}
</style>
