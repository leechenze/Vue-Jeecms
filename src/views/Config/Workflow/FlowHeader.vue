<template>
  <section class="flow-header-container" :class="{'isFullscreen': isFullscreen}">
    <el-button type="primary" size="small" @click="$emit('handleCheck')"
      :disabled="!_checkPermission('/workflow/validateRule', 'POST')"
    >
      <jee-icon iconClass="jianchaliucheng"></jee-icon>检查流程
    </el-button>
    <el-button type="primary" size="small" @click="$emit('handleSave')"
      :disabled="!_checkPermission('/workflow', isDetail ? 'PUT' : 'POST')"
    >{{$t('global.save')}}</el-button>
    <el-button type="empty" size="small" @click="handleClickScreenFull">
      <jee-icon :iconClass="isFullscreen?'huanyuanhuabu':'quanping'"></jee-icon>{{$t(isFullscreen? 'global.cancelScreenFull':'global.screenFull')}}
    </el-button>
  </section>
</template>
<script>
import screenFull from '@/components/mixins/screenFull'

export default {
  mixins: [screenFull],
  props: {
    screenFullElement: {
      type: String,
      default: ''
    },
    isDetail: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-header-container{
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  height: 32px;
  .el-button.el-button--small{
    font-size: 14px;
    padding: 0 20px;
    line-height: 30px;
    border-radius: 4px;
    box-sizing: border-box;
    .jee-svg-icon{
      padding-right: 10px;
    }
    &+.el-button{
      margin-left: 10px;
    }
  }
  &.isFullscreen{
    background-color: #F1F0F0;
    padding-left: 157px;
    height: 60px;
  }
}
</style>
