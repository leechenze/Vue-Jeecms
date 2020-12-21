<template>
  <section class="s-text-desc-preview s-draggable-preview">
    <div v-if="deviceTab === 2">
      <el-form-item
        :prop="option.name"
        label-width="0px"
      >
        <div class="text-desc-wrap" :style="{width:deviceTab === 2?option.width+'%':'100%'}">
          <div class="label" :style="[
          {textAlign:option.titleAilgn===2?'center':(option.titleAilgn===3?'right':'left')},
          {color:option.fontStyle.fontColor},
          {fontSize:option.fontStyle.fontSize+'px'},
          {fontWeight:option.fontStyle.fontWigth}
          ]"
            v-if="option.label"><label >{{option.label}}</label></div>
        </div>
      </el-form-item>
    </div>
    <div v-else class="smart-mobile-box">
      <el-form-item
        :prop="option.name"
        label-width="0px"
      >
        <div class="text-desc-wrap">
          <div class="label" :style="[
          {color:option.fontStyle.fontColor},
          {fontSize:option.fontStyle.fontSize+'px'},
          {fontWeight:option.fontStyle.fontWigth}
          ]"
            v-if="option.label"><label >{{option.label}}</label></div>
        </div>
      </el-form-item>
    </div>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'STextDescPreview',
  mixins: [previewMixin],
  data () {
    return {

    }
  }
}
</script>
<style lang="scss">
  .s-text-desc-preview {
    .text-desc-wrap{
      line-height: 1.5;
    }
  }
</style>
