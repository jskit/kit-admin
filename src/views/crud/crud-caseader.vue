<template>
  <el-cascader
    :options="dic"
    v-model="text"
    :placeholder="placeholder || `请选择${label}`"
    :props="props"
    :readonly="readonly"
    :clearable="clearable"
    :expand-trigger="expandTrigger"
    :show-all-levels="showAllLevels"
    :filterable="filterable"
    :separator="separator"
    :disabled="disabled"
    @change="handleChange">
  </el-cascader>
</template>

<script>
import crudComponent from './crud-component.js';

export default {
  name: 'CrudCascader',
  mixins: [crudComponent()],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    expandTrigger: {
      type: String,
      default: 'hover',
    },
    showAllLevels: {
      type: Boolean,
      default: true,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    separator: {
      type: String,
      default: '/',
    },
  },
  data() {
    return {};
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
