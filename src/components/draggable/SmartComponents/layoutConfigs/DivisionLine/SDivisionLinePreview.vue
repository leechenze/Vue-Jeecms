<template>
  <section class="s-division-preview s-draggable-preview">
    <div v-if="deviceTab === 2">
      <el-form-item
        :prop="option.name"
        label-width="0px"
      >
        <div class="division-wrap" :style="[{width:option.width+'%'},
        {margin:option.lineAilgn === 2?'auto':'0'},
        {marginLeft:option.lineAilgn===3?(100 - option.width+'%'):'0'}]">
          <div class="label el-form-item__label" :style="{textAlign:option.titleAilgn===2?'center':(option.titleAilgn===3?'right':'left')}"
            v-if="option.label"><label >{{option.label}}：</label></div>
          <div class="line" :style="[
            {borderStyle:option.borderStyle},
            {borderColor:option.lineColor}
            ]"></div>
          <div class="z-tip-form-item"
           :style="{textAlign:option.tipAilgn===2?'center':(option.tipAilgn===3?'right':'left')}"
            v-if="option.tip">{{option.tip}}</div>
        </div>
      </el-form-item>
    </div>
    <div v-else class="smart-mobile-box">
      <el-form-item
        :prop="option.name"
        label-width="0px"
      >
        <div class="division-wrap">
          <div class="label el-form-item__label"
            v-if="option.label"><label >{{option.label}}：</label></div>
          <div class="line" :style="[
            {borderStyle:option.borderStyle},
            {borderColor:option.lineColor}
            ]"></div>
          <div class="z-tip-form-item"
            v-if="option.tip">{{option.tip}}</div>
        </div>
      </el-form-item>
    </div>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'SDivisionLinePreview',
  mixins: [previewMixin],
  data () {
    return {

    }
  }
}
</script>
<style lang="scss">
  .s-division-preview {
    .division-wrap{
      width: 100%;
      line-height: 1;
      .label{
        font-size: 16px;
        color: #333333;
        padding-bottom: 10px;
        line-height: 1;
        float: none;
        width: 100%;
      }
      .line{
        border-bottom: 1px;
      }
    }
    .z-tip-form-item{
      padding-left: 0;
    }
    .smart-mobile-box{
      .label{
        padding-bottom: 0px;
      }
    }
  }
</style>
