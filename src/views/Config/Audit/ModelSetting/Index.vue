<template>
  <section class="audit-model-set-index">
      <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      @handleDelete="handleHeaderDelete"
      />
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      v-on:handleSelectionChange="handleMultipleSelect"
    >
    <template #itemsName='scope'>
      <div class="itemsName">
        <p class="strategyTitle">{{scope.scope.row.itemsName}}</p>
        <div class="hide">
          <jee-icon
            @click="modelNameDialog(scope.scope.row)"
            iconClass="bianji"
            :class="{'jee-popover':_checkPermission('/auditmodelset', 'POST')}"
          />
        </div>
      </div>
    </template>
    </base-table>
    <form-dialog
      ref="createModel"
      :title='editTitle'
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :buttons="editButtons"
      :formItems="editFormItems"
      @handleConfirm="handleConfirm"
      @handleSelectChange="handleSelectChange"
    >
    <template #strategyType="scope">
        <el-checkbox-group
          v-model="checkedWord"
          v-if="isData"
        >
          <el-checkbox v-for="(item,index) in wordList" :label="item.id" :key="index"
          @change="handleCheckedChange"
          >{{item.itemLabel}}</el-checkbox>
        </el-checkbox-group>
        <p v-else>暂无数据</p>
    </template>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
export default {
  name: 'configAuditModelSeting',
  mixins: [searchHeader, baseHeader, baseTable, formDialog],
  data () {
    const columns = [
      {
        prop: 'modelName',
        label: '内容模型名称',
        minWidth: '160px'
      },
      {
        prop: 'itemsName',
        label: '审核字段',
        minWidth: '400px',
        scopeType: 'slot'
      }
    ]
    return {
      isData: false,
      modelSetId: '',
      modelId: '',

      checkedWord: [],
      checkedIds: [],
      wordList: [],
      list: {
        api: 'fetchAuditmodelsetList',
        columns,
        params: {
          'modelName': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/auditmodelset', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          align: 'left',
          width: '75',
          fixed: 'right'
        },
        showPagination: false,
        showPaginationSimple: false
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '添加模型',
            icon: 'xinjian',
            disabled: !this._checkPermission('/auditmodelset', 'POST')
          },
          {
            type: 'Delete',
            text: '删除模型',
            icon: 'delete',
            disabled: !this._checkPermission('/auditmodelset', 'DELETE')
          }
        ],
        paddingBottom: '10px',
        showAlertIcon: true,
        content: '设置内容模型中参与智能审核的字段，提交审核时文本、图片字段将分别按照对应的收费规则计费；需注意的是提交审核时每个文本字段都会产生一次费用，图片字段按实际图片张数计费。'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'modelName',
            placeholder: '请输入关键词'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'name': '',
        'strategyType': ''
      },
      editRules: {
        name: [this.$rules.required()],
        strategyType: [this.$rules.required()]
      },
      editFormItems: [
        {
          prop: 'name',
          label: '选择内容模型',
          type: 'select',
          options: [],
          disabled: false
        },
        {
          prop: 'strategyType',
          label: '选择字段',
          type: 'slot'
        }
      ],
      editButtons: [
        {
          text: '保存',
          type: 'Submit',
          disabled: !this._checkPermission('/auditmodelset', 'POST')
        }
      ],
      editTitle: '添加模型',
      textChecked: [],
      textList: [],
      type: 'add'
    }
  },
  methods: {
    textShow (row) {
      this.$request.fetchAuditmodelsetItems({ 'modelId': row.modelId }).then(res => {
        if (res.code === 200) {
          this.textList = res.data
        }
      })
      this.textChecked = row.itemIds
    },
    handleCheckedText (val) {

    },
    // 修改内容模型
    editContentModel (item) {
      this.checkedWord = []
      this.type = 'edit'
      this.$refs.createModel.showDialog()
      this.editTitle = '修改模型'
      this.editFormItems.find(v => v.prop === 'name').disabled = true
      this.editForm.name = item.modelName
      this.fetchAuditmodelsetItems(item.modelId)
      if (item.itemsName) {
        // let array = item.itemsName.split('、')
        this.checkedWord = item.itemIds
        this.editForm.strategyType = 'aaa'
      }
      // let array = item.itemsName.split('、')
      // this.checkedWord = array
      this.modelId = item.modelId
      // this.editForm.strategyType = 'aaa'
      this.modelSetId = item.id
    },
    modelNameDialog (item) {
      if (this._checkPermission('/auditmodelset', 'POST')) {
        this.editContentModel(item)
      }
    },
    itemsNameDialog (item) {
      this.editContentModel(item)
    },
    handleHeaderAdd () {
      this.editTitle = '添加模型'
      this.type = 'add'
      this.$refs.createModel.showDialog()
      this.fetchAuditmodelsetModels()
      this.wordList = []
      this.editForm.name = ''
      this.editFormItems.find(v => v.prop === 'name').disabled = false
      this.isData = false
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length > 0) {
        this.deletePort(this.list.selectedKeys)
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    handleTableDelete (row, index) {
      this.deletePort([row.id])
    },
    handleMultipleSelect (data) {
      var ids = data.map(v => v[this.list.rowKey || 'id'])
      this.list.selectedKeys = ids
    },
    handleConfirm () {
      this.checkedIds = []
      // this.checkedWord.forEach(item => {
      //   this.wordList.map(v => {
      //     if (v.itemLabel === item) {
      //       this.checkedIds.push(v.id)
      //     }
      //   })
      // })
      this.checkedIds = this.checkedWord
      this.fetchAddEditAuditmodelset()
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data
      }
    },
    handleCheckedChange () {
      if (this.checkedWord.length) {
        this.editForm.strategyType = 'aaa'
      } else {
        this.editForm.strategyType = ''
      }
    },
    // 添加/修改模型设置
    fetchAddEditAuditmodelset () {
      this.$request.fetchAddEditAuditmodelset({
        'modelId': this.modelId,
        'items': this.checkedIds,
        'id': this.modelSetId
      }).then(res => {
        this.$restBack(res, () => {
          this.handleSearch()
          this.modelSetId = ''
        }, '保存成功')
      })
    },
    // 获取下拉列表
    fetchAuditmodelsetModels () {
      let arr = []
      this.$request.fetchAuditmodelsetModels().then(res => {
        if (res.code === 200) {
          res.data.map(v => {
            if (v.gray) {
              arr.push({
                label: v.modelName,
                value: v.modelId,
                disabled: v.gray
              })
            } else {
              arr.push({
                label: v.modelName,
                value: v.modelId
              })
            }
          })
          console.log(arr)
          this.editFormItems.find(v => v.prop === 'name').options = arr
        }
      })
    },
    // 获取模型设置详情
    fetchAuditmodelsetItems (id) {
      this.$request.fetchAuditmodelsetItems({ 'modelId': id }).then(res => {
        if (res.code === 200) {
          this.wordList = res.data
          if (this.wordList.length) {
            this.isData = true
            if (this.type === 'add') {
              this.wordList.forEach(d => {
                if (d.field === 'title' || d.field === 'content') {
                  this.checkedWord.push(d.id)
                  this.editForm.strategyType = 'aaa'
                }
              })
            }
          } else {
            this.isData = false
            this.editForm.strategyType = ''
          }
        }
      })
    },
    // 删除接口
    deletePort (ids) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchAuditmodelset({
          'ids': ids
        }).then(res => {
          this.$restBack(res, () => {
            this.handleSearch()
          }, '删除成功')
        })
      }).catch(() => {})
    },
    handleSelectChange (item) {
      this.modelId = item
      this.checkedWord = []
      this.fetchAuditmodelsetItems(item)
    }
  }

}
</script>
<style lang="scss" scoped>
.audit-model-set-index{
  .itemsName{
    display: flex;
    align-items: center;
    .strategyTitle{
      margin-right: 20px;
    }
    .jee-svg-icon{
      fill: #777777;
      font-size: 13px;
    }
    .hide{
      display: none;
    }
  }
  .el-checkbox-group{
    border: 1px solid #E8E8E8!important;
    padding: 20px 0 0 20px!important;
    margin-bottom: 0px;
    max-height: 350px;
    overflow-y: auto;
    border-radius: 4px;
    .el-checkbox{
      padding-bottom: 20px!important;
    }
  }
   .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
}
</style>
<style lang="scss">
.audit-model-set-index{
  .el-table__row:hover .hide{
    display: inline-block;
  }
}
.el-select-dropdown__item.is-disabled{
  color: #c0c4cc!important;
}
.model_popover{
    padding: 20px 0 20px 20px!important;
    .el-checkbox-group{
        margin-bottom: -20px!important;
        .el-checkbox{
        width: 80px;
        padding-bottom: 20px!important
      }
    }
}
</style>
