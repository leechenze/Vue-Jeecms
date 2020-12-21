<template>
  <div class="edition-content-detail">
    <table-dialog
        ref="tableDialog"
        v-bind="tablelist"
        :buttons="[]"
        :showPagination="false"
        @handleBtnAll="handleBtnAll"
        @handleRoutePush="handleRoutePush"
        @handleSelectionChange="handleTableDialogSelectionChange"
        @handleSizeChange="handleTableDialogSizeChange"
        @handleCurrentChange="handleTableDialogCurrentChange"
        @handleConfirm="fetchTableConfirm"
        @handleEdit="handleEdit"
      >
      </table-dialog>
      <form-dialog
        ref="editDialog"
        v-bind="edit"
        @handleConfirm="handleConfirmEdit"
        @handleConfirmDelete="handleConfirmDelete"
        @handleConfirmRecovery="handleConfirmRecovery"
      >
      <template #detail="scope">
        <div class="cd-wrap">
          <div class="cd-header">
            <span class="cd-header__item"> <label >版本号：</label>{{scope.form.versionCode}}</span>
            <span class="cd-header__item"><label >操作人：</label>{{scope.form.createUser}}</span>
            <span class="cd-header__item"><label >保存时间：</label>{{$moment(scope.form.createTime)}}</span>
          </div>
          <div class="cd-cont" v-for="(item,index) in setArr(scope.form.jsonTxt)" :key="index">
            <p v-html="item"></p>
          </div>
        </div>
      </template>
    </form-dialog>
    <comparision-dialog ref='comparision' @onDelete="handleDelete"></comparision-dialog>
  </div>
</template>

<script>
import tableDialog from '@/components/mixins/tableDialog'
import formDialog from '@/components/mixins/formDialog'
import ComparisionDialog from './ComparisionDialog'

var theForm = {
  loading: false,
  title: '',
  form: {},
  formLoading: false,
  rules: {},
  buttons: [
    {
      text: '确定',
      type: 'Submit'
    }
  ],
  formItems: []
}
export default {
  name: 'edition',
  mixins: [tableDialog, formDialog],
  components: {
    ComparisionDialog
  },
  data () {
    return {
      edit: {},
      tablelist: {}
    }
  },
  methods: {
    setArr (obj) {
      let arr = []
      for (var item in obj) {
        arr.push(obj[item])
      }
      return arr
    },
    handleDelete () {
      this.fetchTableDialogApi()
    },
    // 备注
    setRemark (form) {
      var obj = {
        title: '备注',
        form: form,
        formItems: [
          {
            prop: 'remark',
            type: 'textarea',
            label: '备注',
            maxlength: 75,
            showWordLimit: true,
            autosize: { minRows: 3 }
          }
        ],
        buttons: [
          {
            text: '确定',
            type: 'Submit'
          }
        ]
      }
      this.edit = Object.assign(theForm, obj)
      this.$refs.editDialog.showDialog()
    },
    // 表格弹窗底部按钮
    fetchTableConfirm (data) {
      this.$refs.tableDialog.handleCancel()
    },
    handleEdit (row, col) {
      this.setRemark({ 'id': row.id, 'remark': row.remark, type: 'Edit' })
    },
    // 表格弹窗数据回调
    fetchTableDialogCallBack (res) {
      if (res.code === 200) {
        this.tablelist.data = res.data.content
        this.tablelist.totalCount = res.data.totalElements
      }
    },

    // 表单弹窗
    handleConfirmEdit (data, btn) {
      var params = {}
      switch (data.type) {
        case 'Save':
          // 新增
          params = data
          delete params.type
          this.$request.fetchContentVersionAdd(params).then(res => {
            this.$restBack(res, () => {
              this.fetchTableDialogApi()
            })
            this.$refs.editDialog.handleCancel()
          })
          break
        case 'Edit':
          // 修改
          params = data
          delete params.type
          this.$request.fetchContentVersionPut(params).then(res => {
            this.$restBack(res, () => {
              this.fetchTableDialogApi()
            })
            this.$refs.editDialog.handleCancel()
          })
          break
        case 'Delete':
          // 删除
          params = { ids: data.id }
          delete params.type
          this.$request.fetchContentVersionPut(params).then(res => {
            this.$restBack(res, () => {
              this.fetchTableDialogApi()
            })
            this.$refs.editDialog.handleCancel()
          })
          break
        case 'Recovery':
          // 恢复
          params = data
          delete params.type
          this.$request.fetchContentVersionPut(params).then(res => {
            this.$restBack(res, () => {
              this.fetchTableDialogApi()
            })
            this.$refs.editDialog.handleCancel()
          })
          break
      }
    },
    handleEvent () {},
    // 弹窗信息
    msgChange (message, fn) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        fn()
      }).catch(() => {})
    },
    // 外部调取
    showTheDialog (item) {
      var obj = {
        title: '版本',
        width: '900px',
        showIndex: false,
        api: 'fetchContentVersionPage',
        columns: [
          {
            label: '序号',
            prop: 'id'
          },
          {
            label: '版本号',
            prop: 'versionCode',
            scopeType: 'link',
            width: '200px'
          },
          {
            label: '操作人',
            prop: 'createUser'
          },
          {
            label: '备注',
            prop: 'remark',
            scopeType: 'edit'
          },
          {
            label: '保存时间',
            prop: 'createTime',
            scopeType: 'time'
          }
        ],
        searchHeader: {
          searchBtns: [
            {
              icon: 'baocundangqian',
              type: 'Save',
              name: '保存当前版本',
              disabled: !this._checkPermission('/contentVersion', 'POST')
            },
            {
              icon: 'ic_restore_page_px',
              type: 'Recovery',
              name: '恢复此版本',
              disabled: !this._checkPermission('/contentVersion/recovery', 'PUT')
            },
            {
              icon: 'banbenduibi',
              type: 'Contrast',
              name: '与当前版本对比',
              disabled: !this._checkPermission('/contentVersion/compare', 'POST')
            },
            {
              icon: 'banbenduibi',
              type: 'ContrastSel',
              name: '对比选中版本',
              disabled: !this._checkPermission('/contentVersion/compare', 'POST')
            },
            {
              icon: 'delete',
              type: 'Delete',
              name: '删除版本',
              disabled: !this._checkPermission('/contentVersion', 'DELETE')
            }
          ]
        },
        data: [],
        params: { 'contentId': this.$route.query.id }
      }
      this.tablelist = Object.assign(this.tablelist, obj)
      this.fetchTableDialogApi()
      this.$refs.tableDialog.showDialog()
    },
    // 表格弹窗内容点击
    handleRoutePush (row) {
      this.$request.fetchContentVersionGet({ id: row.id }).then(res => {
        if (res.code === 200) {
          this.showDetail(res.data)
        }
      })
    },
    showDetail (data) {
      var obj = {
        title: '查看版本',
        width: '780px',
        loading: false,
        form: data,
        formItems: [
          {
            prop: 'detail',
            type: 'slot',
            labelWidth: '0px'
          }
        ],
        buttons: [
          {
            text: '删除此版本',
            type: 'Delete'
          },
          {
            text: '恢复此版本',
            type: 'Recovery'
          }
        ]
      }

      this.edit = Object.assign(theForm, obj)
      this.$refs.editDialog.showDialog()
    },
    // 删除此版本
    handleConfirmDelete (data) {
      this.msgChange('确认删除此版本吗？', () => {
        this.$request.fetchContentVersionDelete({ ids: [data.id] }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableDialogApi()
          })
        })
      })
    },
    // 恢复此版本
    handleConfirmRecovery (data) {
      this.msgChange('确认恢复为此版本吗？', () => {
        this.$request.fetchContentVersionRecovery({ id: data.id }).then(res => {
          this.$restBack(res, () => {
            this.$emit('setEdition', true)
          })
          this.$refs.tableDialog.handleCancel()
        })
      })
    },
    // 表格弹窗头部按钮
    handleBtnAll (data) {
      var ids = this.tablelist.selectedKeys
      switch (data.type) {
        case 'Save':
          // 保存当前
          this.setRemark({ 'contentId': this.$route.query.id, 'remark': '', type: 'Save' })
          break
        case 'Recovery':
          // 恢复
          if (ids.length === 1) {
            this.msgChange('确认恢复为所选版本吗？', () => {
              this.$request.fetchContentVersionRecovery({ id: ids[0] }).then(res => {
                this.$restBack(res, () => {
                  this.$emit('setEdition', true)
                })
                this.$refs.tableDialog.handleCancel()
              })
            })
          } else {
            this.$message('请选择一个版本进行恢复')
          }
          break
        case 'Contrast':
          // 对比当前
          if (ids.length === 1) {
            this.$refs.comparision.showDialog(ids)
          } else {
            this.$message('请选择一个版本')
          }
          break
        case 'ContrastSel':
          // 对比选中
          if (ids.length === 2) {
            this.$refs.comparision.showDialog(ids)
          } else {
            this.$message('请选择两个版本进行对比')
          }
          break
        case 'Delete':
          // 删除
          if (ids.length > 0) {
            this.msgChange('确认删除所选版本吗？', () => {
              this.$request.fetchContentVersionDelete({ ids: ids }).then(res => {
                this.$restBack(res, () => {
                  this.fetchTableDialogApi()
                })
              })
            })
          } else {
            this.$message('请选择版本进行操作')
          }
          break
      }
    }
  }

}
</script>

<style lang="scss">
.edition-content-detail{
  .cd-wrap{
    width: 100%;
    border: 1px solid #E8E8E8;
    .cd-header{
      background-color: #F9F9F9;
      box-sizing: border-box;
      height: 42px;
      font-size: 14px;
      color: #666666;
      line-height: 1;
      padding: 13px 20px;
      border-bottom: 1px solid #E8E8E8;
      display: flex;
      justify-content: space-between;
    }
    .cd-cont{
      background-color: #fff;
      min-height: 450px;
      padding: 20px 30px;
      box-sizing: border-box;
      img{
        max-width: 100%;
      }
    }
  }
}
</style>
