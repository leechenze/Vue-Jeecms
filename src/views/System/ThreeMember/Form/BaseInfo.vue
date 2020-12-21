<template>
  <section class='column-form-container three-member-colmn'>
    <el-form
      label-suffix="："
      ref="form"
      v-loading="loading"
      :label-width="labelWidth"
      :model="detailForm"
      disabled
    >
      <el-form-item v-if="formListKey === 'formListBase'"
        class="column-form-item sm-height" prop='id' label='栏目ID'>
        <span>{{detailForm.id}}</span>
      </el-form-item>
      <el-form-item v-if="formListKey === 'formListBase'"
      class="column-form-item sm-height" prop='modelName' label='栏目模型'>
        <span>{{detailForm.modelName}}</span>
      </el-form-item>
      <template v-for="(item, index) in formItems">
        <component :key="index" :is="item.preview"
        :index="index" :option="item.value"
        :form="detailForm" v-model="detailForm[item.value.name]"
        :channelId="value"
        />
      </template>
    </el-form>
  </section>
</template>
<script>
import baseform from './baseform'

export default {
  name: 'BaseInfo',
  mixins: [baseform],
  computed: {
    formItems () {
      if (this.detail && this.detail.renderingField) {
        let items = this.detail.renderingField[this.formListKey] || []
        return items.sort((a, b) => a.index - b.index)
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
.three-member-colmn{
  .el-form-item.sm-height{
    padding: 0 15px 15px !important;
    margin-bottom: 0 !important;
    .el-form-item__label{
      line-height: 14px !important;
    }
    .el-form-item__content{
      line-height: 14px !important;
    }
  }
  .d-image-upload-preview{
    .el-form-item{
      padding-top: 0px !important;
    }
  }
  .el-radio-group{
    position: relative;
    // top: 6px;
    .el-checkbox__label{
      color: #c0c4cc !important;
    }
     .radio-other-option{
       padding-bottom: 0px;
     }
  }
  .el-checkbox-group{
    .el-checkbox__label{
      color: #c0c4cc !important;
    }
  }
  .desc,.z-tip-form-item{
    line-height: 1;
  }
  .editor-container{
    border: 1px solid #e8e8e8;
    position: relative;
    top: 10px;
    border-radius: 4px;
    overflow: hidden;
  }
  .d-checkbox-preview.d-checkbox-preview__horizontal .z-checkbox-group.el-checkbox-group .el-checkbox{
    min-height: inherit;
  }
  .d-address-preview .el-form-item .area-wrap{
    padding-bottom: 10px;
  }
  .d-city-preview.z-draggable-preview > .el-form-item{
    padding-bottom: 0;
  }
}
</style>
