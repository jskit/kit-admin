<template>
  <el-checkbox-group
    v-model="text"
    :readonly="readonly"
    :disabled="disabled"
    @change="handleChange">
    <el-checkbox
      v-for="(item,index) in dic"
      :label="item[valueKey]"
      :border="border"
      :min="min"
      :max="max"
      :key="index">{{item[labelKey]}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import crudComponent from './crud-component.js';

export default {
  name: 'CrudCheckbox',
  mixins: [crudComponent()],
  data() {
    return {};
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
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
