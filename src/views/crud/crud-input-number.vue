<template>
  <el-input-number
    v-model="text"
    @change="handleChange"
    :precision="precision"
    :size="size"
    :min="minRows"
    :max="maxRows"
    :readonly="readonly"
    :controls-position="controlsPosition"
    :label="placeholder?placeholder:`请输入${label}`"
    :disabled="disabled">
  </el-input-number>
</template>

<script>
import crudComponent from './crud-component.js';

export default {
  name: 'CrudInputNumber',
  mixins: [crudComponent()],
  data() {
    return {};
  },
  props: {
    value: {
      type: Number,
    },
    step: {
      type: Number,
      default: 1,
    },
    controlsPosition: {
      type: String,
      default: 'right',
    },
    precision: {
      type: Number,
      default: 0,
    },
    minRows: {
      type: Number,
      default: -Infinity,
    },
    maxRows: {
      type: Number,
      default: Infinity,
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
