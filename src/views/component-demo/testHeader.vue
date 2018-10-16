<template>
  <div class="test-box">
    <cm-header1 test="1" :data="[1, 2, 3]">
      s
      <span slot="right">right</span>
    </cm-header1>
  </div>
</template>
<script>
import Header from '@/ui/Header.1';
export default {
  name: 'testHeader',
  components: {
    [Header.name]: Header,
  },
  data() {
    return {
      header: {
        center: {
          text: '测试header牛逼的很',
          event: () => {
            console.log('title click');
          },
          render: (h, params) => {
            return h(
              'div',
              {
                on: {
                  click: () => {
                    console.log('titler render click.', params);
                  },
                },
              },
              '返回'
            );
          },
        },
        left: {
          text: 'left',
          event: () => {
            console.log('left click');
          },
        },
        right: {
          text: 'rigth',
          event: () => {
            console.log('rigth click');
          },
        },
      },
    };
  },
};
</script>
<style lang="stylus" scoped>
  .test-box{
    border: 1px solid #f00;
  }
</style>
