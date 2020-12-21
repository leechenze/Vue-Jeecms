<template>
  <section class="jee-dropdown-container">
    <el-dropdown
      v-bind="props"
      ref='jeeDropDown'
      :class="{'jee-dropdown-visable': dropdownVisable}"
      @visible-change="handleChangeDropdown"
      @command="handleCommand"
    >
      <el-button
        size="medium"
        :type="btnProps.type"
        :disabled="disabled"
      >
        <jee-icon :iconClass="icon" v-if="icon"></jee-icon>
        <span>{{text}}</span>
        <jee-icon iconClass="arrow" class="popper__arrow"></jee-icon>
      </el-button>
      <el-dropdown-menu slot="dropdown" :style="{'min-width':dropdownWidth}">
        <el-dropdown-item v-for="(item, index) in options" :key="index" :command="item.value"
        :disabled="item.disabled"
        >{{item.label}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </section>
</template>

<script>
export default {
  name: 'JeeDropdown',
  data () {
    return {
      dropdownVisable: false,
      dropdownWidth: 0
    }
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      default: () => ({
        placement: 'bottom-start',
        trigger: 'hover'
      })
    },
    btnProps: {
      type: Object,
      default: () => ({
        type: 'primary'
      })
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChangeDropdown (val) {
      if (val) {
        this.$nextTick(() => {
          const el = this.$refs.jeeDropDown
          if (el) {
            this.dropdownWidth = el.$el.offsetWidth + 'px'
          }
        })
      }
      this.dropdownVisable = val
    },
    handleCommand (val) {
      this.$emit('handleCommand', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.jee-dropdown-container{
  .popper__arrow{
    font-size: 12px;
  }
  .jee-dropdown-visable{
    .el-button{
      border-radius: 4px 4px 0 0;
    }
  }
}
</style>
