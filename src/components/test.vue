<template>
    <div>
        test{{ test }}
        <button @click="btnEvent">setModel</button>
    </div>
</template>
<script>
export default {
  name: 'test',
  components: {},
  props: {
    test: String, // 需要与model prop 一致
  },
  model: {
    prop: 'test', // 自定义 model prop key
  },
  data() {
    return {};
  },
  created() {
    // console.log(this);
  },
  methods: {
    // ...
    btnEvent() {
      this.$emit('input', this.test + 1);
    },
  },
};
</script>
<style lang="stylus" scoped>
/* d d s */
</style>
