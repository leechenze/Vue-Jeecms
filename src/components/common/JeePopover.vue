<template>
  <el-popover
    class="jee-popover"
    :placement="placement"
    trigger="hover"
    :width="popoverWidth"
    :content="$t(popoverText)">
    <jee-icon slot="reference" :icon-class="icon" className="tip"/>
  </el-popover>
</template>

<script>
export default {
  name: 'JeePopover',
  props: {
    popoverWidth: {
      type: String,
      default: '300'
    },
    popoverText: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'wenti'
    },
    placement: {
      type: String,
      default: 'right'
    }
  }
}
</script>

<style lang="scss">

</style>
