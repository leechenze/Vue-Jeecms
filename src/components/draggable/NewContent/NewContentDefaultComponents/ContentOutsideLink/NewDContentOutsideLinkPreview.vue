<template>
  <section class="d-link-preview z-draggable-preview new-link-preview new-content">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      :required="option.isRequired"
    >
      <el-form-item
        label-width="0"
        :prop="`${option.name}.outLink`"
        :rules="getRules"
      >
        <el-input
          v-model="form[option.name].outLink"
          :label="option.label"
          :placeholder="option.placeholder"
          :maxlength="120"
        ></el-input>
        <el-checkbox v-model="form[option.name].isNewTarget" >
          {{option.selectLabel}}
        </el-checkbox>
      </el-form-item>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'NewDContentOutsideLinkPreview',
  mixins: [previewMixin],
  computed: {
    getRules () {
      const { isRequired, isInputLimit, inputLimit, rules } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.required())
      }
      if (isInputLimit && inputLimit) {
        formItemRules.push(this.$rules[inputLimit]())
      }
      if (rules instanceof Array && rules.length) {
        rules.forEach(r => {
          const { rule, params = [] } = r
          if (rule) formItemRules.push(this.$rules[rule](...params))
        })
      }
      return formItemRules
    }
  }
}
</script>

<style lang="scss">
  .d-link-preview.new-link-preview{
    .el-form-item{
      &__content{
        display: flex;
      }
      .el-form-item{
        margin-bottom: 0px!important;
        padding: 0;
      }
      .el-checkbox{
        display: block;
        height: 14px;
        line-height: 14px;
        padding-top: 7px;
        .el-checkbox__label{
          color: #333333;
        }
      }
    }
    .z-tip-form-item{
      line-height: 1;
      padding: 0;
      margin-top: 10px;
      margin-bottom: 10px;
      // margin-left: 120px;
    }
  }
  .content-block-left .new-link-preview .el-form-item__content{
    display: block;
    .el-form-item{
      padding: 0 !important;
      width: 100%;
      margin-right: 20px;
      .el-form-item__content{
        width: 80%;
        // display: block;
        display: flex;
        align-items: center;
      }
    }
    .el-checkbox{
      flex: 1;
      text-align: right;
    }
  }
  .content-block-left .model-left-label.widgetBr .new-link-preview .el-form-item__content{
    display: block;
    margin-bottom: 10px;
    .el-form-item{
      .el-form-item__content{
        margin-bottom: 0px;
      }
    }
    .el-checkbox{
        flex: inherit;
        text-align: left;
      }
  }
  .content-block-right{
    .new-link-preview{
      .z-tip-form-item{
        // margin-left: 30px;
      }
    }
    .new-link-preview .el-form-item__content{
      display: block;
      .el-form-item{
        padding: 0 !important;
        width: 100%;
        margin-right: 20px;
      }
      .el-checkbox{
        flex: inherit;
        text-align: left;
      }
    }
  }

</style>
