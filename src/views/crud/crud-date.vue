<template>
  <el-date-picker
    :type="type"
    v-model="text"
    :size="size"
    :format="format"
    :readonly="readonly"
    :value-format="valueFormat"
    :placeholder="placeholder || `请输入${label}`"
    @change="handleChange"
    :disabled="disabled">
  </el-date-picker>
</template>

<script>
import crudComponent from './crud-component.js';

export default {
  name: 'CrudDate',
  mixins: [crudComponent()],
  data() {
    return {
      text: '',
    };
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      default: 'date',
    },
    valueFormat: {
      default: '',
    },
    format: {
      default: '',
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
