<template>
  <section class="voca-content-index">
    <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
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
      ref="font-y"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      @handleEdit="handleTableEdit"
      :onDropEnd="handleDragEnd"
    >
    </base-table>
    <form-dialog
      :title="editTitle"
      ref="editDialog"
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :buttons="editButtons"
      :formItems="editFormItems"
      v-on:handleConfirm="handleConfirmAdd"
    >
    <div v-if="editForm.type === 'add'">
     <el-form
        ref="editYear"
        label-width="130px"
        class="edit-year-form"
        :model="editForm"
        :rules="editRules">
        <el-tabs v-model="activeYearTab" @tab-click="tabClick">
        <template v-for="(item, index) in yearTabs">
          <el-tab-pane :label="item.label" :name="item.name" :key="index">
            <div  v-for="(info,infoIndex) in item.formItems" :key="infoIndex">
              <!-- 输入框 -->
              <el-form-item
                style="margin-bottom: 0px;"
                v-if="!info.type"
                :label="info.label" :prop="info.prop"  >
                <el-input
                  :maxlength="50"
                  v-model="editForm[info.prop]"
                  size="small" v-bind="info"
                  :placeholder="info.placeholder"
                >
                </el-input>
              </el-form-item>
              <!-- 年份区间 -->
              <el-form-item
                v-else-if="info.type === 'year'"
                :label="info.label" :prop="info.prop"  >
                <el-date-picker
                  size="small"
                  style="width:160px"
                  v-model="startYear"
                  type="year"
                  value-format="yyyy"
                  @change="changeYear('start')"
                  placeholder="选择起始年份">
                </el-date-picker>
                <span style="margin:0 15px;">至</span>
                <el-date-picker
                  size="small"
                  style="width:160px"
                  v-model="endYear"
                  value-format="yyyy"
                  @change="changeYear('end')"
                  type="year"
                  placeholder="选择截止年份">
                </el-date-picker>
              </el-form-item>
              <el-form-item
                style="margin-bottom: 0px;"
                v-else-if="info.type === 'select'"
                :label="info.label" :prop="info.prop"  >
                  <el-select
                  size="small"
                  popper-class="jee-border" multiple
                  v-model="disYear"
                  :placeholder="info.placeholder">
                   <el-option
                    v-for="option in disYearItems||[]"
                    :key="option[info.optionValue || 'value']"
                    :label="$t(option[info.optionLabel || 'label'])"
                    :value="option[info.optionValue || 'value']">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
     </el-form>
    </div>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import {
  mapActions
} from 'vuex'
const columns = [
  {
    prop: 'markName',
    label: '年号',
    scopeType: 'handle',
    type: 'Edit',
    minWidth: '120px'
  },
  {
    prop: 'createUser',
    label: '创建人',
    minWidth: '120px'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    scopeType: 'time',
    minWidth: '120px'
  }
]
export default {
  name: 'FontYear',
  mixins: [baseHeader, baseTable, searchHeader, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '' || this.editForm.type === 'add') {
        callback()
      } else {
        var params = {
          markName: value,
          id: this.editForm.id
        }
        this.$request.fetchContentMarksYearUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('年号已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      list: {
        columns,
        draggable: true,
        dragIndex: 1,
        api: 'fetchContentMarksYearPage',
        params: {
          'markName': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: 'global.delete',
            icon: 'delete',
            disabled: !this._checkPermission('/contentMarks/year', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '75px',
          align: 'left'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/contentMarks/year', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/contentMarks/year', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'markName',
            placeholder: '搜索年号'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'markName': '',
        'type': 'add'
      },
      editRules: {
        markName: [
          this.$rules.required('此项必填'),
          { validator: nameUnique, trigger: 'blur' }

        ]
      },
      editFormItems: [
        {
          prop: 'markName',
          label: '年号',
          maxlength: 50,
          hiddenKey: 'type',
          hiddenValue: 'edit',
          placeholder: ''
        },
        {
          prop: 'createUser',
          label: '创建人',
          type: 'text',
          hiddenKey: 'type',
          hiddenValue: 'edit'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'time',
          hiddenKey: 'type',
          hiddenValue: 'edit'
        }
      ],
      editButtons: [],
      editTitle: '新建年号',
      activeYearTab: '1',
      yearTabs: [
        {
          name: '1',
          label: '录入',
          formItems: [
            {
              label: '年号：',
              prop: 'markName',
              placeholder: '多个年号用逗号隔开'
            }
          ]
        },
        {
          name: '2',
          label: '快速录入',
          formItems: [
            {
              label: '选择区间：',
              type: 'year',
              prop: 'markName'
            },
            {
              label: '排除',
              type: 'select'
            }
          ]
        }
      ],
      startYear: '',
      endYear: '',
      disYear: [], // 选择排除年份
      years: [],
      disYearItems: [] // 年份下拉数据
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    name (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchTableApi()
      }
    }
  },
  methods: {
    ...mapActions('config', ['FetchIssueYearOptions']),
    handleDragEnd (startIndex, endIndex) {
      this.list.loading = true
      const params = {
        toId: this.list.data[startIndex].id,
        fromId: this.list.data[endIndex].id
      }
      this.$request.fetchContentMarksYearSort(params).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
        this.list.loading = false
      }).catch(() => {
        this.list.loading = false
      })
    },
    tabClick () {
      this.editForm.markName = ''
      this.$refs.editYear.clearValidate()
      this.$refs.editYear.resetFields()
    },
    // 选择区间
    changeYear (type) {
      this.disYear = []
      this.disYearItems = []
      var min = parseInt(this.startYear > this.endYear ? this.endYear : this.startYear)
      var max = parseInt(this.startYear > this.endYear ? this.startYear : this.endYear)
      if (min && max) {
        var num = max - min
        var arr = []
        var arr2 = []
        for (let i = 0; i <= num; i++) {
          arr.push({
            label: min + i,
            value: min + i
          })
          arr2.push(min + i)
        }
        this.years = arr2
        this.disYearItems = arr
        this.editForm.markName = this.years.join(',')
      } else {
        this.editForm.markName = ''
      }
    },
    // 搜索头部
    handleHeaderAdd () {
      this.editForm.markName = ''
      this.editTitle = '新建年号'
      this.editFormItems[0].placeholder = '多个年号用逗号隔开'
      this.editForm.type = 'add'
      this.editButtons = [
        {
          text: '保存并继续新建',
          keepAlive: true,
          type: 'Submit'
        },
        {
          text: '保存',
          keepAlive: true,
          type: 'Submit',
          btnType: 'add'
        }
      ]
      this.restData()
      this.$refs.editDialog.showDialog()
    },
    handleTableEdit (data, btn) {
      this.editTitle = '编辑年号'
      this.editFormItems[0].placeholder = ''
      this.editForm = Object.assign(this.editForm, data)
      this.editForm.type = 'edit'
      this.editButtons = [
        {
          text: '保存',
          keepAlive: true,
          type: 'Submit',
          btnType: 'add'
        }
      ]
      this.restData()
      this.$refs.editDialog.showDialog()
    },
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该年号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSysYearDelete([row.id])
      }).catch(() => {})
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this.$confirm('是否确定删除该年号？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchSysYearDelete(this.list.selectedKeys)
        }).catch(() => {})
      } else {
        this.$message('至少选择一项进行操作')
      }
    },
    fetchSysYearDelete (ids) {
      this.list.loading = true
      var params = {
        'ids': ids
      }
      this.$request.fetchContentMarksYearDelete(params).then(res => {
        this.$restBack(res, () => {
          this.FetchIssueYearOptions(true)
          this.fetchTableApi()
        })
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    handleConfirmAdd (data, btn) { // 新增用户
      this.addFormLoading = true
      var params = {}
      if (this.disYear.length > 0) {
        var arr = this.years.filter(v => this.disYear.indexOf(v) < 0)
        params.markName = arr.join(',')
      } else {
        params.markName = data.markName
      }
      if (!params.markName) {
        this.$message('年号不能为空！')
        return
      }
      if (data.type === 'edit') {
        params = { 'id': data.id, 'markName': params.markName }
        this.$request.fetchContentMarksYearPut(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.FetchIssueYearOptions(true)
            this.fetchTableApi()
          }
          if (btn.btnType === 'add') {
            this.$refs.editDialog.handleCancel()
          }
          this.addFormLoading = false
        }).catch(() => {
          this.addFormLoading = false
        })
      } else {
        this.$refs['editYear'].validate(valid => {
          if (valid) {
            params = {
              'markName': params.markName
            }
            this.$request.fetchContentMarksYearAdd(params).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.$refs.editYear.resetFields()
                this.FetchIssueYearOptions(true)
                this.fetchTableApi()
              }
              if (btn.btnType === 'add') {
                this.$refs.editDialog.handleCancel()
              }
              this.addFormLoading = false
            }).catch(() => {
              this.addFormLoading = false
            })
          }
        })
      }
    },
    restData () {
      this.disYear = []
      this.disYearItems = []
      this.startYear = ''
      this.endYear = ''
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>

<style lang="scss" >
.voca-content-index{
  .el-tabs .el-tabs__header .el-tabs__nav-wrap{
    &:after{
      height: 2px !important;
    }
  }
}

</style>
