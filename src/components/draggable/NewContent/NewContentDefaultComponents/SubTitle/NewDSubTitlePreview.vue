<template>
  <section class="d-sub-title-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      :class="option.tip?'banShow':''"
    >
      <el-input
        v-model="val"
        :label="option.label"
        :placeholder="option.placeholder"
        :maxlength="option.isLengthLimit ? option.max : 120"
        :show-word-limit="option.isLengthLimit"
        @blur="banBlur(val)"
        :ref="option.label"
      ></el-input>
      <div class="ban-box" @click="banClick(option.label)" v-show="banShow" v-html="banVal"></div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'NewDSubTitlePreview',
  mixins: [previewMixin],
  mounted () {
    this.replace(this.val)
  }
}
</script>

<style lang="scss">
.d-sub-title-preview.new-content{
  .el-form-item{
    .el-input{
      .el-input__inner {
        padding-right: 45px!important;
      }
      .el-input__suffix{
        line-height: normal;
        right: 0px;
        .el-input__count-inner{
          text-align: right;
          padding:0;
          background-color: transparent;
        }
      }
    }
    .el-form-item__error{
      padding-left: 20px;
      z-index: 1;
    }
    &.banShow{
      .el-form-item__error{
        padding-left: 0px!important;
      }
    }
  }
  .ban-box{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    line-height: 35px;
  }
}
.content-block-right .d-sub-title-preview.new-content{
  &.z-draggable-preview > .el-form-item{
    .el-input{
      .el-input__suffix{
        right: 20px;
      }
    }
    .z-tip-form-item{
      padding-left: 20px !important;
    }
  }
}
</style>
