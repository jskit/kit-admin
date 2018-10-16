<template>
  <el-radio-group
    v-model="text"
    @change="handleChange"
    :readonly="readonly"
    :disabled="disabled">
    <el-radio
      v-for="(item,index) in dic"
      :label="item[valueKey]"
      :border="border"
      :key="index">{{item[labelKey]}}</el-radio>
  </el-radio-group>
</template>

<script>
import crudComponent from './crud-component.js';

export default {
  name: 'CrudRadio',
  mixins: [crudComponent()],
  data() {
    return {};
  },
  props: {
    value: {},
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleChange(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style>
</style>
