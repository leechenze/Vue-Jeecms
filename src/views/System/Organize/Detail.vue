<template>
  <section class="org-detail-container left-container">
    <el-container>
      <el-aside class="aside-tree">
        <div class="left-head">
          <base-header v-bind="asideHeaders"
            v-on:handleAdd="handleHeaderAdd"
          />
        </div>
          <div class="box-items">
            <drag-tree
              v-bind="tree"
              v-if="tree.currentNodeKey"
              @handleClick="handleClick"
              @handleSort="handleSort"
            ></drag-tree>
          </div>
      </el-aside>
      <el-main style="padding:10px">
        <base-header v-bind="headers"
          v-on:handleLink="handleHeaderLink"
          v-on:handleDelete="handleHeaderDelete"
        />
        <base-form
          v-bind="form"
          v-on:handleConfirm="handleConfirm"
        ></base-form>
        <msg-dialog
          v-bind="msgDialog"
          v-on:handleConfirm="handleConfirmMsg"
          v-on:handleCancel="hideMsgDialog"
        />
        <form-dialog
          ref="addDialog"
          :loading="addFormLoading"
          :form="addForm"
          :rules="addRules"
          :buttons="addButtons"
          :formItems="addFormItems"
          v-on:handleConfirm="handleConfirmAdd"
          v-on:handleConfirmRole="handleConfirmRole"
        ></form-dialog>
      </el-main>
    </el-container>
  </section>
</template>
<script>
import organize from './organize'
import { deepClone } from '@/utils'
export default {
  name: 'organizeDetail',
  mixins: [organize],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          'orgname': value,
          id: this.form.form.id
        }
        this.$request.fetchOrganizeNameUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('组织名已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    return {
      backUrl: '/system/organize/index',
      headers: {
        buttons: [
          {
            type: 'Link',
            text: '权限分配',
            icon: 'kaiqiquanxian',
            href: '/system/organize/permission',
            prim: true,
            disabled: false
          },
          {
            type: 'Link',
            text: '成员管理',
            icon: 'chengyuanguanli',
            href: '/system/organize/member',
            disabled: false
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/orgs', 'DELETE')
          }
        ],
        showAlertIcon: false
      },
      form: {
        api: 'fetchOrganizeGet',
        params: {
          id: ''
        },
        form: {
          id: '',
          orgids: [],
          orgid: '',
          name: ''
        },
        formItems: [
          {
            type: 'cascader',
            prop: 'orgids',
            props: {
              label: 'name',
              value: 'id',
              checkStrictly: true
            },
            label: '上级组织：',
            placeholder: '请选择',
            options: [{
              name: '无',
              id: 'parent'
            }]
          },
          {
            prop: 'name',
            label: '组织名称：',
            maxlength: 50,
            placeholder: '请输入新的组织名称'
          },
          {
            prop: 'orgNum',
            label: '组织编号：',
            maxlength: 50,
            placeholder: '请输入组织编号'
          },
          {
            prop: 'orgLeader',
            label: '负责人：',
            maxlength: 50,
            placeholder: '请输入负责人姓名'
          },
          {
            prop: 'phone',
            label: '电话：',
            maxlength: 20,
            placeholder: '请输入电话号码'
          },
          {
            prop: 'orgFax',
            label: '传真：',
            maxlength: 20,
            placeholder: '请输入传真'
          },
          {
            prop: 'orgRemark',
            label: '组织描述：',
            maxlength: 50,
            type: 'textarea'
          },
          {
            prop: 'isVirtual',
            label: '虚拟组织：',
            type: 'radio',
            options: [{
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }]
          },
          {
            type: 'text',
            prop: 'createUser',
            label: '创建人：'
          },
          {
            type: 'time',
            prop: 'createTime',
            label: '创建时间：'
          }
        ],
        rules: {
          name: [
            this.$rules.required(),
            { validator: nameUnique, trigger: ['change', 'blur'] }
          ],
          phone: [
            this.$rules.phoneAll()
          ],
          orgFax: [
            this.$rules.phone('请输入正确的传真号码')
          ]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/orgs', 'PUT')
        }]
      },
      tree: {
        data: [],
        currentNodeKey: '',
        draggable: false,
        showLevel: false
      }
    }
  },
  methods: {
    // 顶部操作按钮
    handleClick (item, node) {
      this.$router.push({ query: { id: item.id } })
      this.setCurrentNodeKey(item.id)
    },
    handleHeaderAdd () {
      this.$refs.addDialog.showDialog()
    },
    // 弹出框操作按钮
    handleConfirmMsg (type) {
      this.fetchOrganizeDelete(this.msgDialog.data)
    },
    // 顶部操作按钮
    handleHeaderDelete () {
      this.msgDialog.type = 'Delete'
      this.msgDialog.content = '删除组织时会删除下级所有组织，以及组织内的角色及用户，是否确定删除？'
      this.msgDialog.data = [this.form.form.id]
      this.showMsgDialog()
    },
    fetchOrganizeDelete (ids, type) {
      this.list.loading = true
      var params = {
        ids: ids,
        type: this.type
      }
      this.$request.fetchOrganizeDelete(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.type = 1
          this.FetchOrganizeOptions(true)
          setTimeout(() => {
            this.$routerLink(this.backUrl, 'list')
          }, 500)
        }
        if (res.code === 14023) {
          this.type = 2
        }
        this.hideMsgDialog()
      })
    },
    handleConfirm (data) {
      var params = data
      delete params.parent
      if (params.orgids.length > 0 && params.orgids[params.orgids.length - 1] !== 'parent') {
        params.parentId = params.orgids[params.orgids.length - 1]
      } else {
        params.parentId = ''
      }
      if (params.parentId === this.form.params.id) {
        this.$message('上级组织不能选择当前组织')
        return
      }
      this.form.loading = true
      this.$request.fetchOrganizeUpdate(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.fetchFormApi()
          this.FetchOrganizeOptions(true)
          setTimeout(() => {
            this.$routerLink(this.backUrl, 'list')
          }, 500)
        }
        this.hideFormLoading()
      }).catch(this.hideFormLoading)
    },
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.form.form = Object.assign({}, this.form.form, res.data)
        var arr = res.data.nodeIds
        if (arr instanceof Array && arr.length > 0) {
          this.form.form.orgids = arr.slice(0, arr.length - 1)
        }
        this.form.formItems.find(d => d.prop === 'orgids').disabled = !res.data.parentAble
        this.headers.buttons.find(d => d.type === 'Delete').disabled = !res.data.deleteAble
        this.form.submitBtns.find(d => d.subType === 'submit').disabled = !res.data.managerAble
        this.getTreeList()
        // managerAble 是否可管理
      }
    },
    getTreeList () {
      if (this.organizeOptions instanceof Array) {
        this.addFormItems.find(d => d.prop === 'orgids').options = this.organizeOptions
        if (!this.form.form.parentId) {
          var options = [{
            name: '无',
            id: 'parent'
          }]
          this.form.formItems.find(d => d.prop === 'orgids').options = options
          this.form.form.orgids = ['parent']
        } else {
          const that = this
          const loopopt = function (list) {
            if (list instanceof Array && list.length) {
              return list.map(d => {
                if (d.id === that.tree.currentNodeKey) {
                  d.disabled = true
                }
                if (d.children) {
                  d.children = loopopt(d.children)
                }
                return d
              })
            }
            return []
          }
          this.form.formItems.find(d => d.prop === 'orgids').options = loopopt(deepClone(this.organizeOptions))
        }
        this.tree.loading = true
        this.$request.fetchOrganizeList({ 'isVirtual': '', 'key': '', 'parentId': '' }).then(res => {
          if (res.code === 200) {
            const loop = function (list) {
              if (list instanceof Array && list.length) {
                return list.map((d, i, arr) => {
                  if (d.managerAble) {
                    if (i > 0) d.prevId = arr[i - 1].id
                    if (arr.length > i + 1) d.nextId = arr[i + 1].id
                  }
                  if (d.children) {
                    d.children = loop(d.children)
                  }
                  return d
                })
              }
              return []
            }
            this.tree.data = loop(res.data)
          }
        }).then(() => {
          this.tree.loading = false
        }).catch(() => {
          this.tree.loading = false
        })
      }
    },
    // 排序
    handleSort (data, type) {
      this.tree.loading = true
      let params = {
        orgId: data.id
      }
      if (type === 'up') {
        params.orderOrgId = data.prevId
        params.up = true
      } else {
        params.orderOrgId = data.nextId
        params.up = false
      }
      this.$request.fetchOrganizeSort(params).then(res => {
        if (res.code === 200) {
          this._messageSuccess('sort')
          this.fetchFormApi()
          this.FetchOrganizeOptions(true)
        }
        this.tree.loading = false
      }).catch(() => {
        this.tree.loading = false
      })
    },
    getFormData () {
      if (this.organizeOptions.length < 1) {
        this.FetchOrganizeOptions(true)
      }
      const { id } = this.$route.query
      if (id && id !== this.form.params.id) {
        this.form.params.id = id
        this.setCurrentNodeKey(id)
        this.fetchFormApi()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getFormData()
    })
  },
  activated () {
    this.getFormData()
  },
  updated () {
    this.updateFormApi()
  },
  watch: {
    organizeOptions (newVal, oldVal) {
      if (newVal) {
        this.getTreeList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .box-items{
    padding: 0;
  }
</style>
