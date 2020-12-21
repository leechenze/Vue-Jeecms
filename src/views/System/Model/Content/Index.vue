<template>
  <section class="model-content-index-container">
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
  name: 'modelContentIndex',
  mixins: [indexMixin],
  data () {
    return {
      list: {
        params: {
          tplType: 2,
          isGlobal: '',
          isEnable: '',
          modelName: ''
        }
      },
      addForm: {
        tplType: 2 // 1：栏目模型，2：内容模型
      },
      editForm: {
        tplType: 2 // 1：栏目模型，2：内容模型
      }
    }
  },
  methods: {
    handleModelItem (row, index) {
      this.$router.push(`/system/model/newcontent/detail?id=${row.id}`)
      // this.$router.push(`/system/model/content/detail?id=${row.id}`)
      // window.open(`/#/model/content/detail?id=${row.id}`)
    }
  }
}
</script>
