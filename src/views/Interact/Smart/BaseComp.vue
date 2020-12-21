<template>
  <jee-aside-layout class="smart-container">
    <section slot="asideHeader">
      <el-button
        size="medium"
        type='primary'
        @click="handleHeaderCreate"
        class="new-grouping"
        :disabled="!this._checkPermission('/formType', 'POST')"
      ><jee-icon iconClass="xinjian"/>新建分组</el-button>
      <form-dialog
        ref="addGrouping"
        title="新建分组"
        :loading="addGroupingLoading"
        :form="addGroupingForm"
        :rules="addGroupingRules"
        :formItems="addGroupingFormItems"
        v-on:handleConfirm="handleConfirmGroupingCreate"
      ></form-dialog>
    </section>
    <section slot="asideMain" class="smart-grouping" v-loading='listLoading'>
      <div class="smart-grouping-row smart-grouping-row-hover" @click="chooseGroupingAll"
      :class="{'jee-click': groupingId === ''}" style="cursor: pointer;">全部表单 <span style="margin-left: 5px;"
      v-if='groupingAmount'>({{groupingAmount}})</span></div>
      <div>
        <div class="smart-grouping-row">
          <span class="grouping-label">ID</span>
          <span>分组名</span>
        </div>
        <div class="smart-grouping-row jee-hover-color3 smart-grouping-row-hover" :class="{'jee-click': groupingId === 0}" @click="chooseGroupingNo">
          <div class="grouping-name">
            <span class="grouping-label">0</span>
            <p class="grouping-name-text">
              <span>未分组</span>
              <span v-if='notGroupFormCount'>({{notGroupFormCount}})</span>
            </p>
          </div>
        </div>
        <div class="smart-grouping-row jee-hover-color3 smart-grouping-row-hover"
        v-for="(item,index) in groupingList" :key="index" @click="chooseGrouping(item)">
          <div class="grouping-name" v-if="!item.isName">
            <span class="grouping-label">{{item.id}}</span>
            <p class="grouping-name-text" :class="{'jee-click': groupingId === item.id}">
              <span v-if='item.name'>{{item.name}}</span>
              <span v-if='item.formCount'>({{item.formCount}})</span>
            </p>
          </div>
          <div class="grouping-icon" v-if="!item.isName">
            <jee-icon iconClass="bianji" class="jee-hover-fill" @click="item.isName=true"/>
            <jee-icon iconClass="delete" class="jee-hover-fill" @click="groupingDelete(item)"/>
          </div>
          <div v-if="item.isName" class="grouping-newname">
            <el-input size="small" v-model="item.newName" :maxlength="15">
              <template class="newname-append" slot="append"><el-button slot="trigger" size="small" class="jee-bg-light-important" @click="editGroup(item)">确定</el-button></template>
            </el-input>
          </div>
        </div>
      </div>
      <el-dialog
        title="提示"
        width="500px"
        @close="handleCancelGrouping"
        :visible.sync="msgDialog.visible"
        class="smart-delete-dialog"
      >
        <span class="dialog-content">
          <i class="el-icon-warning"/>{{msgDialog.content}}
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleCancelGrouping" type='empty'>取消</el-button>
          <el-button size="small" type="primary" @click="handleConfirmGrouping">删除</el-button>
          <el-button size="small" type="primary" @click="handleConfirmGroupingno">不删除</el-button>
        </span>
      </el-dialog>
    </section>
    <section slot="main">
      <base-header
        v-bind="smartHeaders"
        @handleNewFrom="handleHeaderNewFrom"
        @handleIssue="handleHeaderIssue"
        @handleStop="handleHeaderStop"
        @handleDelete="handleHeaderDelete"
      />

        <search-header
      class="search-header"
        v-bind="searchHeader"
        :params="list.params"
        @handleSearch="handleSearchs"
      ></search-header>
      <base-table
        v-bind="list"
        v-on:handleEdit="handleEdit"
        v-on:handleIssue="handleTableIssue"
        v-on:handleStop="handleTableStop"
        v-on:handlePreview="handlePreview"
        v-on:handleCopy="handleTableCopy"
        v-on:handleDerive="handleTableDerive"
        v-on:handleDelete="handleTableDelete"
        v-on:handleEmpty="handleTableEmpty"
        v-on:handleSelectionChange="handleSmartSelect"
        v-on:handleSizeChange="handleSizeChange"
        v-on:handleCurrentChange="handleCurrentChange"
      >
      <template #title="scope">
        <div class="jee-color title-box">
          <div @click="toLinkAddress(scope.scope.row)" v-if="scope.scope.row.viewStatus===1||scope.scope.row.viewStatus===2">
            <jee-icon iconClass="lianjiexingyinyong"></jee-icon>
          </div>
          <p class="smart-title" @click="editForm(scope.scope.row)">{{scope.scope.row.title}}</p>
        </div>
      </template>
      <template #formType="scope">
        <div class="jee-hover-color" style="cursor: pointer;" @click="alterGrouping(scope.scope.row)" v-if="scope.scope.row.formType&&scope.scope.row.formType.name">
         {{scope.scope.row.formType.name}}
         <i class="el-icon-caret-bottom"></i>
        </div>
        <div class="jee-hover-color" style="cursor: pointer;" @click="alterGrouping(scope.scope.row)" v-else>
         未分组
         <i class="el-icon-caret-bottom"></i>
        </div>
      </template>
      <template #viewStatus="scope">
        <div v-if="scope.scope.row.viewStatus===0" class="unpublished form-status">
          <p class="title">
            未发布
          </p>
          <p class="time" v-if="scope.scope.row.beginTime">开始时间：{{scope.scope.row.beginTime}}</p>
          <p class="time" v-if="scope.scope.row.endTime">结束时间：{{scope.scope.row.endTime}}</p>
        </div>
        <div v-if="scope.scope.row.viewStatus===1" class="underway form-status">
          <p class="title">
            进行中
          </p>

        </div>
        <div v-if="scope.scope.row.viewStatus===2" class="finished form-status">
          <p class="title">
            已结束
          </p>
          <p class="time" v-if="scope.scope.row.endTime">结束时间：{{scope.scope.row.endTime}}</p>
        </div>
      </template>
      <template #joinCount="scope">
        <p v-if="scope.scope.row.joinCount===0">0</p>
        <p v-if="scope.scope.row.joinCount>0" @click="gotoStatistics(scope.scope.row)" style="cursor: pointer;" class="jee-color">{{scope.scope.row.joinCount}}</p>
      </template>
      </base-table>
      <form-dialog
        ref="addForm"
        v-bind="formEdit"
        :rules="rules"
        v-on:handleConfirm="handleConfirmForm"
        class="smart-add-from"
      ></form-dialog>
      <form-dialog
        ref="copyForm"
        v-bind="formCopy"
        :rules="rules"
        v-on:handleConfirm="handleConfirmCopyForm"
      ></form-dialog>
      <form-dialog
        ref="alterGroupingForm"
        v-bind="alterGroupingForm"
        :rules="alterGroupingRules"
        v-on:handleConfirm="handleConfirmAlterGrouping"
      ></form-dialog>
    </section>
  </jee-aside-layout>
</template>

<script>
import formDialog from '@/components/mixins/formDialog'
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
const columns = [
  {
    prop: 'title',
    label: '标题',
    minWidth: '145px',
    fixed: 'left',
    scopeType: 'slot'
  },
  {
    prop: 'description',
    label: '描述',
    minWidth: '145px'
  },
  {
    prop: 'formType',
    label: '所属分组',
    minWidth: '130px',
    scopeType: 'slot'
  },
  {
    prop: 'createUser',
    label: '创建人',
    minWidth: '100px'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    minWidth: '180px'
  },
  {
    prop: 'viewStatus',
    label: '状态',
    minWidth: '220px',
    scopeType: 'slot'
  },
  {
    prop: 'joinCount',
    label: '参与人次',
    minWidth: '100px',
    scopeType: 'slot'
  }
]
export default {
  mixins: [formDialog, baseHeader, searchHeader, baseTable],
  name: 'interactSmartIndex',
  components: {},
  data () {
    return {
      listLoading: false,
      addGroupingLoading: false,
      addGroupingForm: {
        name: ''
      },
      addGroupingRules: {
        name: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  name: value
                }
                this.$request.fetchsmartFormTypeUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('分组名称不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      },
      addGroupingFormItems: [
        {
          prop: 'name',
          label: '分组名称',
          maxlength: 15
        }
      ],
      formEdit: {
        loading: false,
        title: '新建',
        form: {
          title: '',
          description: ''
        },
        formItems: [
          {
            prop: 'title',
            label: '表单名称',
            maxlength: 15
          },
          {
            prop: 'description',
            label: '表单描述',
            type: 'textarea',
            autosize: { minRows: 3 },
            maxlength: 150
          }
        ],
        buttons: [
          {
            text: '保存并编辑字段',
            type: 'Submit',
            href: '/system/organize/permission'
          },
          {
            text: '保存',
            type: 'Submit'
          }
        ]
      },
      formCopy: {
        loading: false,
        title: '复制表单',
        form: {
          title: '',
          id: ''
        },
        formItems: [
          {
            prop: 'title',
            label: '新表单标题',
            maxlength: 15
          }
        ],
        buttons: [
          {
            text: '确定',
            type: 'Submit'
          }
        ]
      },
      alterGroupingForm: {
        loading: false,
        title: '修改分组',
        form: {
          typeId: '',
          id: ''
        },
        formItems: [
          {
            type: 'select',
            prop: 'typeId',
            label: '分组',
            options: []
          }
        ],
        buttons: [
          {
            text: '确定',
            type: 'Submit'
          }
        ]
      },
      alterGroupingRules: {
        typeId: [this.$rules.required()]
      },
      groupingList: [],
      groupingAmount: '',
      notGroupFormCount: '',
      groupingId: '',
      msgDialog: {
        content: '是否删除分组内的表单',
        visible: false,
        params: {
          ids: [],
          cascadeDelForm: ''
        }
      },
      smartHeaders: {
        showAlertIcon: false,
        buttons: [
          {
            type: 'NewFrom',
            text: '新建表单',
            icon: 'xinjian',
            disabled: !this._checkPermission('/smartForm', 'POST')
          },
          {
            type: 'Issue',
            text: '发布',
            icon: 'fabu',
            disabled: !this._checkPermission('/smartForm/publish', 'PUT')
          },
          {
            type: 'Stop',
            text: '暂停',
            icon: 'ai06',
            disabled: !this._checkPermission('/smartForm/publish', 'PUT')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/smartForm', 'DELETE')
          }
        ]
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            label: '状态：',
            value: 'status',
            style: {
              width: '150px'
            },
            options: [
              {
                value: '',
                label: '全部'
              },
              {
                value: 0,
                label: '未发布'
              },
              {
                value: 1,
                label: '进行中'
              },
              {
                value: 2,
                label: '已结束'
              }
            ]
          },
          {
            type: 'searchInput',
            value: 'name',
            placeholder: '按标题搜索',
            style: {
              width: '330px'
            }
          }
        ]
      },
      list: {
        params: {
          typeId: '',
          status: '',
          name: ''
        },
        columns,
        api: 'fetchsmartFormPage',
        handleColumn: [
          {
            type: 'Edit',
            name: '编辑字段',
            icon: 'bianji',
            disabled: !this._checkPermission('/smartForm/updateFields', 'POST')
          },
          {
            type: 'Issue',
            name: '发布',
            icon: 'fabu',
            disabled: !this._checkPermission('/smartForm/publish', 'PUT')
          },
          {
            type: 'Stop',
            name: '暂停',
            icon: 'ai06',
            disabled: !this._checkPermission('/smartForm/publish', 'PUT')
          },
          {
            type: 'More',
            name: '更多',
            rightIcon: 'el-icon-caret-bottom',
            component: 'popover',
            popperClass: 'user-table-popover',
            buttons: [
              {
                type: 'Preview',
                name: '预览',
                icon: 'yulang',
                disabled: !this._checkPermission('/smartForm/updateFields', 'POST')
              },
              {
                type: 'Copy',
                name: '复制',
                icon: 'fuzhi',
                disabled: !this._checkPermission('/smartForm/copy', 'POST')
              },
              {
                type: 'Delete',
                name: '删除',
                icon: 'delete',
                disabled: !this._checkPermission('/smartForm', 'DELETE')
              },
              {
                type: 'Derive',
                name: '导出结果',
                icon: 'daochu-tianchong',
                disabled: !this._checkPermission('/smartFormData/export', 'GET')
              },
              {
                type: 'Empty',
                name: '清空结果',
                icon: 'delete',
                disabled: !this._checkPermission('/smartForm/clearData', 'DELETE')
              }
            ]
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '235',
          fixed: 'right'
        }

      },
      allOptions: [
        {
          label: '未分组',
          value: 0
        }
      ]
    }
  },
  computed: {
    rules () {
      return {
        title: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  title: value,
                  id: this.formEdit.form.id || ''
                }
                this.$request.fetchSmartFormUnique(params).then(res => {
                  if (res.code === 200) {
                    if (res.data) {
                      callback()
                    } else {
                      callback(new Error('表单名称不能重复'))
                    }
                  } else {
                    callback()
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 表格多选操作
    handleSmartSelect (data) {
      var ids = data.map(v => v[this.list.rowKey || 'id'])
      this.list.selectedKeys = ids
      var viewStatus = data.map(v => v.viewStatus)
      // 判断顶部操作发布按钮是否禁用
      if (ids.length > 0) {
        if (viewStatus.find(v => v === 1 || v === 2)) {
          this.smartHeaders.buttons.find(v => v.type === 'Issue').disabled = true
        } else {
          this.smartHeaders.buttons.find(v => v.type === 'Issue').disabled = !this._checkPermission('/smartForm/publish', 'PUT')
        }
      } else {
        this.smartHeaders.buttons.find(v => v.type === 'Issue').disabled = !this._checkPermission('/smartForm/publish', 'PUT')
      }
      // 判断顶部操作暂停按钮是否禁用
      if (ids.length > 0) {
        if (viewStatus.find(v => v === 0) >= 0) {
          this.smartHeaders.buttons.find(v => v.type === 'Stop').disabled = true
        } else {
          this.smartHeaders.buttons.find(v => v.type === 'Stop').disabled = !this._checkPermission('/smartForm/publish', 'PUT')
        }
      } else {
        this.smartHeaders.buttons.find(v => v.type === 'Stop').disabled = !this._checkPermission('/smartForm/publish', 'PUT')
      }
    },
    // 弹窗新建分组
    handleHeaderCreate () {
      this.$refs.addGrouping.showDialog()
    },
    // 分组列表信息
    fetchsmartFormTypeList () {
      this.listLoading = true
      this.$request.fetchsmartFormTypeList().then(res => {
        if (res.code === 200) {
          this.groupingList = res.data.forms.map(d => {
            d.newName = d.name
            d.isName = false
            return d
          })
          this.alterGroupingForm.formItems.find(d => d.prop === 'typeId').options = this.allOptions.concat([...res.data.forms].map(d => {
            d.label = d.name
            d.value = d.id
            return d
          }))
          this.groupingAmount = res.data.formTotalCount
          this.notGroupFormCount = res.data.notGroupFormCount
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 新建分组
    handleConfirmGroupingCreate (data) {
      this.addGroupingLoading = true
      this.$request.fetchsmartFormTypeAdd(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchsmartFormTypeList()
        }
        this.addGroupingLoading = false
      }).catch(() => {
        this.addGroupingLoading = false
      })
    },
    // 修改名字
    editGroup (data) {
      if (data.newName === data.name) {
        data.isName = false
      } else {
        if (!data.newName) {
          this.$message({
            message: '请输入分组名',
            type: 'warning'
          })
          return
        }
        var params = {
          name: data.newName,
          id: data.id
        }
        this.$request.fetchsmartFormTypeUnique(params).then(res => {
          if (res.code === 200) {
            this.$request.fetchsmartFormTypeAlter(params).then(res => {
              if (res.code === 200) {
                data.name = data.newName
                this.fetchTableApi()
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                data.isName = false
              }
            })
          } else {
            this.$message({
              message: '分组名重复不可用',
              type: 'warning'
            })
          }
        })
      }
    },
    // 选择分组
    chooseGrouping (data) {
      this.groupingId = data.id
      this.list.params.typeId = data.id
      this.fetchTableApi()
    },
    chooseGroupingAll () {
      this.groupingId = ''
      this.list.params.typeId = ''
      this.fetchTableApi()
    },
    chooseGroupingNo () {
      this.groupingId = 0
      this.list.params.typeId = 0
      this.fetchTableApi()
    },
    // 删除分组
    groupingDelete (data) {
      this.msgDialog.params.ids = [data.id]
      this.msgDialog.visible = true
    },
    // 删除分组弹窗
    handleCancelGrouping () {
      this.msgDialog.visible = false
    },
    // 删除分组弹窗
    handleConfirmGrouping () {
      this.msgDialog.params.cascadeDelForm = true
      this.$request.fetchsmartFormTypeDelete(this.msgDialog.params).then(res => {
        if (res.code === 200) {
          this.fetchsmartFormTypeList()
          this.groupingId = ''
          this.list.params.typeId = ''
          this.fetchTableApi()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.msgDialog.visible = false
        }
      })
    },
    // 删除分组弹窗
    handleConfirmGroupingno () {
      this.msgDialog.params.cascadeDelForm = false
      this.$request.fetchsmartFormTypeDelete(this.msgDialog.params).then(res => {
        if (res.code === 200) {
          this.fetchsmartFormTypeList()
          this.groupingId = ''
          this.list.params.typeId = ''
          this.fetchTableApi()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.msgDialog.visible = false
        }
      })
    },
    // 新建表单
    handleHeaderNewFrom () {
      this.formEdit.title = '新建'
      this.formEdit.form = {
        title: '',
        description: ''
      }
      this.$refs.addForm.showDialog()
    },
    // 确认新表单
    handleConfirmForm (data, btn) {
      console.log(data)
      this.formEdit.loading = true
      let typeId = ''
      if (this.groupingId === 0) {
        typeId = ''
      } else {
        typeId = this.groupingId
      }
      let params = {
        typeId: typeId,
        ...data
      }
      if (data.id) {
        console.log('这里')
        this.$request.fetchSmartGroupingPut(params).then(res => {
          if (res.code === 200) {
            if (btn.href) {
              this.fetchTableApi()
              this.fetchsmartFormTypeList()
              this.$routerLink('/interact/smart/detail', 'link', { id: res.data, state: 0 })
            } else {
              this.fetchsmartFormTypeList()
              this.fetchTableApi()
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          }
          this.formEdit.loading = false
        }).catch(() => {
          this.formEdit.loading = false
        })
      } else {
        console.log('再这里')
        this.$request.fetchSmartFormAdd(params).then(res => {
          console.log(res.data)
          if (res.code === 200) {
            if (btn.href) {
              this.fetchTableApi()
              this.fetchsmartFormTypeList()
              this.$routerLink('/interact/smart/detail', 'link', { id: res.data, state: 0 })
            } else {
              this.fetchTableApi()
              this.fetchsmartFormTypeList()
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          }
          this.formEdit.loading = false
        }).catch(() => {
          this.formEdit.loading = false
        })
      }
    },
    // 复制表单
    handleConfirmCopyForm (data, btn) {
      this.formCopy.loading = true
      this.$request.fetchSmartFormCopy(data).then(res => {
        if (res.code === 200) {
          this.fetchTableApi()
          this.fetchsmartFormTypeList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
        this.formCopy.loading = false
      }).catch(() => {
        this.formCopy.loading = false
      })
    },
    // 编辑表单
    editForm (data) {
      this.formEdit.title = '编辑'
      this.formEdit.form = Object.assign(this.formEdit.form, data)
      this.$refs.addForm.showDialog()
    },
    // 头部发布
    handleHeaderIssue () {
      if (this.list.selectedKeys.length > 0) {
        let data = {}
        data.ids = this.list.selectedKeys
        data.publish = true
        this.fetchSmartFormPublishPut(data)
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 头部暂停
    handleHeaderStop () {
      if (this.list.selectedKeys.length > 0) {
        let data = {}
        data.ids = this.list.selectedKeys
        data.publish = false
        this.fetchSmartFormPublishPut(data)
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 头部删除
    handleHeaderDelete () {
      if (this.list.selectedKeys.length > 0) {
        this.$confirm('删除表单连同表单中的数据一起删除，是否确定删除表单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.list.selectedKeys
          this.fetchSmartFormDelete(ids)
        })
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 列表搜索
    handleSearchs () {
      this.fetchTableApi()
    },
    // 表格数据
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map(d => {
          if (d.viewStatus === 0) {
            d.hiddenStop = true
          } else if (d.viewStatus === 1 || d.viewStatus === 2) {
            d.hiddenIssue = true
          }
          if (d.joinCount === 0) {
            d.disabledDerive = true
            d.disabledEmpty = true
          }

          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    // 图标链接跳转
    toLinkAddress (row) {
      this.$routerLink('/interact/smart/detail', 'Edit', { link: 'linkAddress', state: row.viewStatus, id: row.id })
    },
    // 标题跳转
    toEdit (row) {
      if (row.viewStatus === 1 || row.viewStatus === 2) {
        this.$confirm('此表单处于进行中状态，编辑表单时表单会暂停发布，将导致正在填写此表单的用户无法提交而必须重新填写，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {}
          data.ids = [row.id]
          data.publish = false
          this.fetchSmartFormPublishPut(data)
          this.$routerLink('/interact/smart/detail', 'link', { id: row.id, state: 0 })
        }).catch(() => {})
      } else {
        this.$routerLink('/interact/smart/detail', 'link', { id: row.id, state: row.viewStatus })
      }
    },
    // 表格跳统计
    gotoStatistics (row) {
      this.$routerLink('/interact/smart/detail', 'link', { link: 'statistical', id: row.id, state: row.viewStatus })
    },
    // 表格编辑
    handleEdit (data) {
      this.toEdit(data)
    },
    // 表格发布
    handleTableIssue (row) {
      let data = {}
      data.ids = [row.id]
      data.publish = true
      this.fetchSmartFormPublishPut(data)
    },
    // 表格暂停
    handleTableStop (row) {
      let data = {}
      data.ids = [row.id]
      data.publish = false
      this.fetchSmartFormPublishPut(data)
    },
    // 表格预览
    handlePreview (row) {
      window.open(row.previewUrl)
    },
    // 表格复制
    handleTableCopy (row) {
      this.formCopy.form.id = row.id
      this.$refs.copyForm.showDialog()
    },
    // 表格删除
    handleTableDelete (row) {
      this.$confirm('删除表单连同表单中的数据一起删除，是否确定删除表单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [row.id]
        this.fetchSmartFormDelete(ids)
      })
    },
    // 表格导出
    handleTableDerive (row) {
      let formId = row.id
      let token = localStorage.getItem('JEECMS-Auth-Token')
      window.open(`${this.$path}${this.$prefix}/smartFormData/export?formId=${formId}&JEECMS-Auth-Token=${token}`)
    },
    // 表格清空结果
    handleTableEmpty (row) {
      this.$request.fetchSmartFormClearData(row.id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      })
    },
    // 表单发布暂停
    fetchSmartFormPublishPut (data) {
      this.$request.fetchSmartFormPublishPut(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
        }
      })
    },
    // 表单删除
    fetchSmartFormDelete (ids) {
      this.$request.fetchSmartFormDelete({ ids }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchTableApi()
          this.fetchsmartFormTypeList()
        }
      })
    },
    // 修改分组
    alterGrouping (row) {
      console.log(row)
      this.alterGroupingForm.form.id = row.id
      if (row.formType && row.formType.id) {
        this.alterGroupingForm.form.typeId = row.formType.id
      } else {
        this.alterGroupingForm.form.typeId = 0
      }

      this.$refs.alterGroupingForm.showDialog()
    },
    // 修改分组确定
    handleConfirmAlterGrouping (data) {
      console.log(data)
      this.alterGroupingForm.loading = true
      this.$request.fetchSmartGroupingPut(data).then(res => {
        console.log(res.data)
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchsmartFormTypeList()
          this.fetchTableApi()
        }
        this.alterGroupingForm.loading = false
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchsmartFormTypeList()
    })
  },
  activated () {
    this.fetchTableApi()
  }
}
</script>

<style lang="scss">
.smart-container{
  .smart-delete-dialog .dialog-footer button:first-child:hover{
    color: #ffffff !important;
    border-color: #1EC6DF !important;
  }
  .base-header-container header .button-list-wrap .el-button{
    margin-bottom: 0;
  }
  .el-main.scrollbar::-webkit-scrollbar{
    display: none;
  }
  .base-header-container{
    padding-top: 11px;
  }
  .smart-grouping{
    font-size: 14px;
    color: #333333;
    .smart-grouping-row{
      padding: 13px 10px;
      display: flex;
      line-height: 1.5;
      .grouping-label{
          color: #333333;
          margin-right: 10px;
        }
      .grouping-name{
        display: flex;
        align-items: center;
        fill: #333333;
        cursor: pointer;
        flex: 6;
        .grouping-name-text{
          word-wrap: break-word;
          span{
            word-wrap: break-word;
          }
        }
      }
      .grouping-icon{
        display: flex;
        align-items: center;
        width: 44px;
        flex: 2;
        svg{
          color: #777;
          fill: #777;
          margin-left: 10px;
          cursor: pointer;
          font-size: 12px;
          display: none;
        }
      }
      .grouping-newname{
        margin-top: -5px;
        .el-input__inner{
          padding: 0 10px;
        }
      }
    }
    .smart-grouping-row:hover svg{
      display: block;
    }
    .smart-grouping-row-hover:hover{
      background-color: #F3F3F3;
    }
    .dialog-footer .el-button.el-button--empty:first-child{
      border-color: #E8E8E8;
      color: #333;
    }
  }
  .title-box{
    display: flex;
    cursor: pointer;
    svg{
      margin-right: 10px;
    }
  }
  .form-status{
    padding: 15px 0;
    .title{
      font-size: 14px;
    }
    .time{
      font-size: 12px;
      color: #999999;
    }
  }
  .unpublished{
    .title{
      color: #666;
    }
  }
  .underway{
    .title{
      color: #6AC043;
    }
  }
  .finished{
    .title{
      color: #FC0D1B;
    }
  }
  .smart-add-from{
    .el-textarea .el-textarea__inner{
      line-height: 1.5 !important;
    }
  }
  // 1440以下时表格间距
  @media screen and (max-width: 1440px) {
    .el-table .cell{
      padding-left: 15px;
      padding-right: 15px;
      &:first-of-type{
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .el-table tr td:last-child{
      .cell{
        padding-left: 10px;
        padding-right: 10px;
      }
      .el-table tr td:last-child{
        .cell{
          padding-left: 15px;
          padding-right: 5px;
        }
      }
      .el-table tr td:first-child{
        .cell{
          padding-left: 10px;
          padding-right: 0px;
        }
      }
    }

  }
  // 1440以上时表格间距
  @media screen and (min-width: 1440px) {
    .el-table .cell{
      padding-left: 25px;
      padding-right: 25px;
      &:first-of-type{
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .el-table tr td:last-child{
      .cell{
        padding-left: 10px;
        padding-right: 10px;
      }
      .el-table tr td:last-child{
        .cell{
          padding-left: 15px;
          padding-right: 5px;
        }
      }
      .el-table tr td:first-child{
        .cell{
          padding-left: 10px;
          padding-right: 0px;
        }
      }
    }

  }
}
</style>
