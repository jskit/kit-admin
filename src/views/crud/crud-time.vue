<template>
  <el-time-picker
    v-model="text"
    type="date"
    :size="size"
    :format="format"
    :value-format="valueFormat"
    :placeholder="placeholder || `请输入${label}`"
    @change="handleChange"
    :readonly="readonly"
    :disabled="disabled">
  </el-time-picker>
</template>

<script>
import crudComponent from './crud-component.js';

export default {
  name: 'CrudTime',
  mixins: [crudComponent()],
  data() {
    return {};
  },
  props: {
    value: {
      required: true,
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

<style scoped>
</style>
