<template>
  <a class="cm-tabbar-item"
    @click="$parent.$emit('tab-click', id, $event)"
    :class="{ 'is-selected': $parent.value === id }">
    <div class="tabbar-icon">
      <slot name="tab-icon"></slot>
    </div>
    <div class="tabbar-label">
      <slot></slot>
    </div>
  </a>
</template>
<script>
export default {
  name: 'cm-tabbar-item',
  props: ['id'],
};
</script>
<style lang="stylus">

  @import '../styles/var.styl';

  .cm-tabbar-item{
    display: block;
    padding: 7px 0;
    flex: 1;
    text-decoration: none;
    user-select: none;
    
    .tabbar-icon{
      size: 24px;
      margin: 0 auto 5px;
      &:empty {
        display: none;
      }
      & > * {
        display: block;
        size: 100% !important;
      }
    }

    .tabbar-label{
      color: inherit;
      font-size: 12px;
      line-height: 1;
    }
    
    &.is-selected{
      .tabbar-icon{}
      .tabbar-label{}
    }
  }
</style>
