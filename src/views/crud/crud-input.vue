<template>
  <el-input
    :size="size"
    :clearable="clearable"
    v-model="text"
    :readonly="readonly"
    :type="typeParam"
    :autosize="{ minRows: minRows, maxRows: maxRows}"
    :placeholder="placeholder?placeholder:`请输入${label}`"
    @change="handleChange"
    :disabled="disabled">
  </el-input>
</template>

<script>
import crudComponent from './crud-component.js';

export default {
  name: 'CrudInput',
  mixins: [crudComponent()],
  data() {
    return {};
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    minRows: {
      type: String,
      default: '3',
    },
    maxRows: {
      type: String,
      default: '4',
    },
  },
  watch: {},
  computed: {
    typeParam: function typeParam() {
      if (this.type === 'textarea') {
        return 'textarea';
      } else if (this.type === 'password') {
        return 'password';
      } else {
        return 'text';
      }
    },
  },
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
