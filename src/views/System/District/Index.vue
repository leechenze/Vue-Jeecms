<template>
  <section class="district-content-index">
    <base-header v-bind="headers"
      @handleAdd="handleHeaderAdd"
    />
    <base-table
      class="district-table"
      ref='districtTable'
      v-bind="list"
      v-on:handleRedact="handleTableRedact"
      v-on:handleDelete="handleTableDelete"
      @load='load'
    >
    <template #sortNum="scope">
      <el-input type="number" v-model="scope.scope.row.sortNum" maxlength="11" size='mini' min="1" max="99"
        :disabled="!_checkPermission('/area/sort', 'PUT')"
        @blur='rowBlur(scope.scope.row)'></el-input>
    </template>
    </base-table>
    <form-dialog
      :title="dialogTitle"
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      :buttons='buttons'
      @handleConfirm="handleConfirmAdd"
    ></form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import {
  mapActions
} from 'vuex'

const columns = [
  {
    prop: 'areaName',
    label: '区域名称',
    minWidth: '180'
  },
  {
    prop: 'areaDictCode',
    label: '区域类型',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '省',
          value: '1'
        },
        {
          label: '市',
          value: '2'
        },
        {
          label: '区',
          value: '3'
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    },
    minWidth: '180'
  },
  {
    prop: 'sortNum',
    label: '排序',
    scopeType: 'slot',
    minWidth: '180'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    minWidth: '180'
  }
]
export default {
  name: 'district',
  mixins: [baseHeader, baseTable, formDialog],
  data () {
    var dirname = (rule, value, callback) => {
      if (value) {
        var params = {
          areaCode: value,
          id: this.id
        }
        this.$request.fetchSystemAreaCodeUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('区域编号有重复'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      maps: new Map(),
      list: {
        columns,
        isTree: true,
        showSelection: false,
        showPagination: false,
        lazy: true,
        api: 'fetchSystemAreaList',
        params: {
        },
        handleColumn: [
          {
            type: 'Redact',
            name: '编辑',
            icon: 'bianji',
            disabled: !this._checkPermission('/area', 'PUT')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/area', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          width: '200'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/area', 'POST')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      detail: {},
      addFormLoading: false,
      addForm: {
        nodeIds: [],
        areaDictCode: '1',
        areaCode: '',
        areaName: '',
        sortNum: '',
        remark: ''
      },
      addRules: {
        areaCode: [this.$rules.required(), { validator: dirname, trigger: 'blur' }],
        areaName: [this.$rules.required()],
        areaDictCode: [this.$rules.required()],
        sortNum: [this.$rules.required(), this.$rules.number()]
      },
      addFormItems: [
        {
          prop: 'nodeIds',
          label: '上级区域',
          type: 'cascader',
          props: {
            label: 'areaName',
            value: 'id',
            checkStrictly: true
          },
          options: []
        },
        {
          prop: 'areaCode',
          label: '区域编号',
          maxlength: 50
        },
        {
          prop: 'areaName',
          label: '区域名称',
          maxlength: 50
        },
        {
          type: 'radio',
          prop: 'areaDictCode',
          label: '区域类型',
          options: [
            {
              label: '省/直辖市',
              value: '1'
            },
            {
              label: '市级',
              value: '2'
            },
            {
              label: '区级',
              value: '3'
            }
          ]
        },
        {
          prop: 'sortNum',
          label: '排序',
          maxlength: 8
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'textarea',
          maxlength: 50,
          autosize: { minRows: 5 }
        }
      ],
      buttons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ],
      id: '',
      dialogTitle: '新建'
    }
  },
  methods: {
    ...mapActions('system', ['FetchSystemAreaTree']),
    load (tree, treeNode, resolve) {
      if (tree.hasChildren) {
        let parentId = tree.id
        const pid = tree.id
        this.maps.set(pid, { tree, treeNode, resolve })
        this.$request.fetchSystemAreaList({ parentId }).then(res => {
          if (res.code === 200) {
            const nodes = res.data.map(d => {
              d.hasChildren = !d.isChild
              return d
            })
            resolve(nodes)
          }
        })
      }
    },
    handleConfirmAdd (data) {
      if (data.nodeIds) {
        data.parentId = data.nodeIds[data.nodeIds.length - 1]
      }
      if (this.id) {
        this.fetchSystemAreaPut(data)
        return
      }
      this.$request.fetchSystemAreAdd(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('create')
          this.updateTreeNode(data)
        }
      })
    },
    // 新建
    handleHeaderAdd () {
      this.dialogTitle = '新建区域'
      this.id = ''
      this.addForm = {
        nodeIds: [],
        areaDictCode: '1',
        areaCode: '',
        areaName: '',
        sortNum: '',
        remark: ''
      }
      this.fetchSystemAreaTree()
      this.$refs.addDialog.showDialog()
    },
    // 删除
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [row.id]
        this.$request.fetchSystemAreaDelete({ ids }).then(res => {
          if (res.code === 200) {
            this._messageSuccess('delete')
            this.updateTreeNode(row, 'delete')
          }
        })
      })
    },
    // 编辑
    handleTableRedact (row) {
      this.dialogTitle = '编辑区域'
      this.id = row.id
      this.detail = row
      this.$request.fetchSystemAreaDetails(row).then(res => {
        if (res.code === 200) {
          this.addForm = res.data
          this.addForm.nodeIds.pop()
          this.$refs.addDialog.showDialog()
          this.fetchSystemAreaTree(row.id)
        }
      })
    },
    // 排序失焦
    rowBlur (data) {
      if (data.sortNum) {
        if (data.sortNum < 1 || data.sortNum > 99) {
          this.$message.error('请输入1~99之间的值')
          return
        }
        let sorts = []
        let obj = {}
        obj.id = data.id
        obj.sortNum = data.sortNum
        sorts.push(obj)
        this.$request.fetchSystemAreaSort({ sorts }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.FetchSystemAreaTree(true)
            this.updateTreeNode(data)
          }
        })
      }
    },
    // 提交修改
    fetchSystemAreaPut (data) {
      this.$request.fetchSystemAreaPut(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          const isDel = this.detail.parentId === data.parentId ? 'edit' : 'delete'
          this.updateTreeNode(this.detail, isDel)
          this.$nextTick(() => {
            this.updateTreeNode(data, 'edit')
          })
        }
      })
    },
    // 更新节点
    updateTreeNode (data, type) {
      const pid = data.parentId
      if (pid) {
        const { tree, treeNode, resolve } = this.maps.get(pid) || {}
        if (type === 'delete') {
          this.$set(this.$refs.districtTable.$refs.baseTable.store.states.lazyTreeNodeMap, pid, [])
        }
        if (tree) {
          this.load(tree, treeNode, resolve)
        } else {
          const ids = data.nodeIds
          if (ids instanceof Array) {
            if (ids.length === 1) {
              this.fetchTableApi()
            } else if (ids.length > 1) {
              const gfid = ids[ids.length - 2]
              const gf = this.maps.get(gfid) || {}
              if (gf.tree) {
                this.load(gf.tree, gf.treeNode, gf.resolve)
              }
            }
          }
        }
      } else {
        this.fetchTableApi()
      }
      this.FetchSystemAreaTree(true)
    },
    fetchSystemAreaTree (districtId) {
      this.$request.fetchSystemAreaTree().then(res => {
        if (res.code === 200) {
          const loop = function (data, districtId) {
            if (data instanceof Array && data.length) {
              return data.map(d => {
                if (d.id === districtId) {
                  d.disabled = true
                }
                if (d.children instanceof Array && d.children.length) {
                  loop(d.children, districtId)
                }
                return d
              })
            }
          }
          this.addFormItems.find(d => d.prop === 'nodeIds').options = loop(res.data, districtId)
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.map(d => {
          d.hasChildren = !d.isChild
          return d
        })
      }
    }
  },
  mounted () {
  }
}
</script>
