<template>
  <section class="model-column-index-container">
    <base-header v-bind="headers"
      @handleCommandCreate="handleCommand"
      @handleDelete="handleHeaderDelete"
    />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    ></search-header>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      @handleModelItem="handleModelItem"
      @handleEdit="handleModelEdit"
      @handleStatus="handleModelStatus"
      :onDropEnd="handleDragEnd"
    ></base-table>
    <form-dialog
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      @handleConfirm="handleConfirmAdd"
    ></form-dialog>
    <form-dialog
      ref="editDialog"
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :formItems="addFormItems"
      :buttons="editBtns"
      title="详情"
      @handleConfirm="handleConfirmEdit"
    ></form-dialog>
  </section>
</template>

<script>
import indexMixin from '../indexMixin'
export default {
  name: 'modelColumnIndex',
  mixins: [indexMixin]
}
</script>
<style lang="scss">
.model-column-index-container{
  .el-button{
      margin-bottom: 0 !important;//删除操作说明新增样式
    }
}
</style>
