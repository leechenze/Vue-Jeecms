<template>
  <section class='audit-node-container'>
     <base-form
      ref='form'
      label-width="auto"
      :form="form"
      :formItems="formItems"
      :rules="rules"
      :showSubmitButton='false'
      :popperAppendToBody='false'
    >
      <template #reason="scope">
        <div class='reason-wrap'>
          <el-checkbox v-model="scope.form.reason">输入意见</el-checkbox>
          <el-checkbox v-model="scope.form.reasonMust" v-if="scope.form.reason">是否必填</el-checkbox>
        </div>
      </template>
      <template #orgIds="scope">
        <div class=orgIds-wrap>
          <AddFormItem
            title='组织'
            component="OrgDialog"
            v-model="scope.form.orgIds"
            :options="scope.form.orgOptions"
            @change="handleOrgOptions"/>
        </div>
      </template>
      <template #roleIds="scope">
        <div class=roleIds-wrap>
          <AddFormItem
            title='角色'
            component="RoleDialog"
            v-model="scope.form.roleIds"
            :options="scope.form.roleOptions"
            @change="handleRoleOptions"/>
        </div>
      </template>
      <template #userIds="scope">
        <div class=userIds-wrap>
          <AddFormItem
            title='用户'
            component="UserDialog"
            v-model="scope.form.userIds"
            :options="scope.form.userOptions"
            @change="handleUserOptions"/>
        </div>
      </template>
      <template #actions="scope">
        <div class=actions-wrap>
          <ActionsDialog
            v-model="scope.form.actions"
          />
        </div>
      </template>
    </base-form>
  </section>
</template>
<script>
import BaseForm from '@/components/form/BaseForm'
import AddFormItem from './AddFormItem'
import ActionsDialog from './ActionsDialog'
export default {
  name: 'AuditSetting',
  components: {
    BaseForm,
    ActionsDialog,
    AddFormItem
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        jointlySign: false,
        jointlyType: 1,
        jointlyPassRatio: 50,
        orgIds: [],
        orgOptions: [],
        roleIds: [],
        roleOptions: [],
        userIds: [],
        userOptions: [],
        actions: []
      })
    }
  },
  data () {
    return {
      formItems: [
        {
          prop: 'name',
          label: '节点名称：',
          maxlength: 10
        },
        {
          prop: 'jointlySign',
          label: '会签：',
          type: 'switch',
          popoverText: '一票否决制：参与会签的用户中任何一个不通过，判定会签不通过；全部通过，则会签通过。一票通过制：参与会签的用户中任何一个通过，则会签通过；全部都不通过，才会判定会签不通过。按比例通过：参与会签的用户中，一旦通过率达到了某个比例，则判定会签通过。',
          popoverWidth: '160',
          disableText: '关闭'
        },
        {
          prop: 'jointlyType',
          label: '会签模式：',
          type: 'select',
          clearable: true,
          hiddenKey: 'jointlySign',
          hiddenValue: true,
          options: [
            {
              value: 1,
              label: '一票通过制'
            },
            {
              value: 2,
              label: '一票否决制'
            },
            {
              value: 3,
              label: '按比例通过'
            }
          ]
        },
        {
          prop: 'jointlyPassRatio',
          label: '会签比例：',
          type: 'number',
          min: 1,
          max: 100,
          hiddenKeys: ['jointlyType', 'jointlySign'],
          hiddenValues: [3, true]
        },
        {
          type: 'title',
          label: '审核权限',
          titleClass: 'audit-title-wrap'
        },
        {
          prop: 'orgIds',
          class: 'clear-left',
          type: 'slot'
        },
        {
          prop: 'roleIds',
          class: 'clear-left',
          type: 'slot'
        },
        {
          prop: 'userIds',
          class: 'clear-left',
          type: 'slot'
        },
        {
          prop: 'actions',
          class: 'clear-left',
          type: 'slot'
        }
      ],
      rules: {
        name: [
          this.$rules.required()
        ],
        jointlyPassRatio: [
          this.$rules.required(),
          this.$rules.number()
        ]
      }
    }
  },
  methods: {
    handleOrgOptions (data) {
      this.form.orgOptions = data
    },
    handleRoleOptions (data) {
      this.form.roleOptions = data
    },
    handleUserOptions (data) {
      this.form.userOptions = data
    }
  }
}
</script>

<style lang="scss">
.audit-node-container{
  .audit-title-wrap{
    padding-bottom: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e8e8e8;
  }
  .clear-left{
    >.el-form-item__content{
      margin-left: 0!important;
    }
  }
}
</style>
