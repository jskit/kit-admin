<template>
  <el-select
    v-model="text"
    :size="size"
    :multiple="multiple"
    :clearable="clearable"
    :readonly="readonly"
    :placeholder="placeholder || `请选择${label}`"
    @change="handleChange"
    :disabled="disabled">
    <el-option
      v-for="(item,index) in dic"
      :key="index"
      :label="item[labelKey]"
      :value="item[valueKey]">
    </el-option>
  </el-select>
</template>

<script>
import crudComponent from './crud-component.js';

export default {
  name: 'CrudSelect',
  mixins: [crudComponent()],
  data() {
    return {};
  },
  props: {
    value: {},
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleChange(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
};
</script>

<style>
</style>
