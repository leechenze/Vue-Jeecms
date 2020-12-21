<template>
  <section class='column-form-container'>
    <el-form
      label-suffix="："
      ref="form"
      v-loading="loading"
      :label-width="labelWidth"
      :model="detailForm"
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
      <el-form-item class="column-form-item sm-height-button">
        <el-button
          type="primary"
          size='small'
          @click="handleSubmit"
          :disabled="!_checkPermission('/channel', 'PUT') || !editAble"
        >{{$t('global.save')}}</el-button>
      </el-form-item>
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
        console.log(items)
        return items.sort((a, b) => a.index - b.index)
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
.column-form-container {
  margin-top: -5px;
  .column-form-item{
    margin: 0!important;
    padding: 15px 20px;
  }
  .d-address-preview.z-draggable-preview.new-content{
    .el-form-item.address-item.is-error{
      .el-cascader{
        margin-bottom: 0;
      }
      .el-form-item__error{
        position: static;
      }
    }
  }
}
</style>
