<template>
  <section class="model-header-container" :class="{'show-in-page': !isFullscreen}">
    <el-row :gutter="20">
      <el-col :span="19" :offset="isFullscreen?5:0">
        <el-button
          :disabled="!_checkPermission('/modelItem', 'POST')"
          type="primary" size="small" @click="$emit('handleSave')">{{$t('global.save')}}</el-button>
          <el-button type="empty" size="small" @click="handleClickScreenFull">
          <jee-icon :iconClass="isFullscreen?'huanyuanhuabu':'quanping'"></jee-icon>{{$t(isFullscreen? 'global.cancelScreenFull':'global.screenFull')}}
        </el-button>
      </el-col>
    </el-row>
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .model-header-container{
    background-color: #F1F0F0;
    display: flex;
    align-items: center;
    padding: 0 30px;
    height: 60px;
    .el-row{
      flex: 1;
      .el-button{
        font-size: 14px;
        padding: 0 20px;
        line-height: 30px;
        border-radius: 4px;
        box-sizing: border-box;
        .jee-svg-icon{
          padding-right: 10px;
        }
        &+.el-button{
          margin-left: 20px;
        }
      }
      .model-label{
        font-size: 14px;
        color: #666666;
        padding-left: 20px;
      }
      .model-name{
        font-size: 14px;
        color: #333333;
      }
    }
    &.show-in-page{
      background-color: #ffffff;
      height: 32px;
      padding: 0;
      .el-row{
        margin: 0!important;
      }
    }
  }
</style>
