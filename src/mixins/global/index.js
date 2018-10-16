/**
 * global 混入
 * 不建议添加生命周期方法，注意！！！！！
 */
export default {
  // created() {
  //   console.log('全局混入 created: ....', this);
  // },
  $showLoading() {
    console.log('global mixin $showLoading......');
  },
};
