<template>
  <section class="hierarchical-setting-index">
    <base-header v-bind="headers"/>
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    >
      <template #safeUserIds="scope">
         <div class="admin-input jee-hover-border" @click="setAdmin(scope.form.safetyAdmins,'safetyAdmins')">
           <span v-if="scope.form.safeUserIds.length">{{names.safetyAdmins}}</span>
           <span v-else class="t-label">请选择</span>
           <el-button type="primary" class="append">选择</el-button>
         </div>
      </template>
      <template #auditUserIds="scope">
        <div class="admin-input jee-hover-border" @click="setAdmin(scope.form.auditAdmins,'auditAdmins')">
           <span v-if="scope.form.auditUserIds.length">{{names.auditAdmins}}</span>
           <span v-else class="t-label">请选择</span>
           <el-button type="primary" class="append">选择</el-button>
         </div>
      </template>
    </base-form>
    <set-admin ref="setAdmin" @handleConfirm="setAdminList"></set-admin>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import setAdmin from '../../ThreeMember/Setting/setAdmin'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: '',
  mixins: [baseHeader, baseForm],
  components: {
    setAdmin
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        paddingBottom: '17px',
        content: '操作说明:   开启分级保护时会同步开启密级和账号安全设置，并将网站设置为需登录才能浏览。开启后可在相应的模块中对初始设置值进行调整。给用户赋予安全员角色时请先为其添加用户密级设置及用户日志菜单权限，赋予审计员角色时请先为其添加用户日志菜单权限。'
      },
      form: {
        // labelPosition: 'left',
        labelWidth: '180px',
        api: 'fetchReinsuranceGet',
        request: true,
        params: {
        },
        form: {
          safetyAdmins: [],
          safeUserIds: [],
          auditAdmins: [],
          auditUserIds: [],
          enable: false,
          automaticEnable: false,
          userSecretId: ''
        },
        formItems: [
          {
            label: '是否开启分级保护：',
            prop: 'enable',
            type: 'switch',
            class: 'margin-bottom20',
            enableText: '是',
            disableText: '否'
          },
          {
            type: 'select',
            label: '系统密级标记：',
            hiddenKey: 'enable',
            prop: 'userSecretId',
            hiddenValue: true,
            optionLabel: 'name',
            optionValue: 'id',
            options: [],
            popoverText: '设为系统标记后，在系统登录页以及系统顶部LOGO旁会显示密级标记。'
          },
          {
            type: 'switch',
            label: '用户设置密级后自动启用：',
            prop: 'automaticEnable',
            hiddenKey: 'enable',
            hiddenValue: true,
            class: 'margin-bottom20',
            enableText: '是',
            disableText: '否',
            popoverText: '设为开启，在安全员给用户设置好密级后该用户将自动变为启用状态 '
          },
          {
            type: 'title',
            label: '分保角色配置',
            hiddenKey: 'enable',
            hiddenValue: true
          },
          {
            type: 'slot',
            prop: 'safeUserIds',
            label: '安全员：',
            hiddenKey: 'enable',
            hiddenValue: true
          },
          {
            type: 'slot',
            prop: 'auditUserIds',
            label: '审计员：',
            class: 'margin-bottom18',
            hiddenKey: 'enable',
            hiddenValue: true
          }
        ],
        rules: {
          safeUserIds: [this.$rules.required()],
          auditUserIds: [this.$rules.required()],
          userSecretId: [this.$rules.required()]
        }
      },
      names: {
        safetyAdmins: '',
        auditAdmins: ''
      }
    }
  },
  watch: {
    userSecurityOptions (newVal) {
      this.form.formItems.find(t => t.prop === 'userSecretId').options = newVal
    }
  },
  computed: {
    ...mapGetters(['system']),
    userSecurityOptions () {
      return this.system.userSecurityOptions
    }
  },
  methods: {
    ...mapActions('system', ['FetchUserSecurityOptions']),
    handleConfirm (data) {
      this.putFormData(data)
    },
    putFormData (data, arr) {
      this.form.loading = true
      let params = {
        enable: data.enable,
        safetyAdminIds: data.safeUserIds,
        auditAdminIds: data.auditUserIds,
        automaticEnable: data.automaticEnable,
        userSecretId: data.userSecretId
      }
      this.$request.fetchReinsurancePut(params).then(res => {
        if (res.code === 812) {
          this.fetchFormApi()
        } else if (res.code === 200) {
          this.fetchFormApi()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
        this.hideFormLoading()
      }).catch(this.hideFormLoading)
    },
    setAdminList (data) {
      if (data.name === 'safetyAdmins') {
        this.form.form.safeUserIds = data.ids
      } else {
        this.form.form.auditUserIds = data.ids
      }
      this.form.form[data.name] = data.arr
      this.names[data.name] = data.names
    },
    // 设置管理员
    setAdmin (data, type) {
      let ids = data.map(t => {
        return t.id
      })
      this.$refs.setAdmin.showTheDialog(data, ids, type)
    },
    fetchFormCallBack (res) {
      this.form.loading = true
      if (res.code === 200 && res.data) {
        this.names.safetyAdmins = res.data.safetyAdmins.map(t => {
          return t.username
        }).join(',')
        this.names.auditAdmins = res.data.auditAdmins.map(t => {
          return t.username
        }).join(',')
        this.form.form = Object.assign(this.form.form, res.data)
        this.form.form.auditUserIds = res.data.auditAdmins.map(t => { return t.id })
        this.form.form.safeUserIds = res.data.safetyAdmins.map(t => { return t.id })
      }
      this.form.loading = false
    }
  },
  activated () {
    this.fetchFormApi()
    this.FetchUserSecurityOptions()
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchFormApi()
      this.FetchUserSecurityOptions()
      this.form.formItems.find(t => t.prop === 'userSecretId').options = this.userSecurityOptions
    })
  }

}
</script>
<style lang="scss">
  .hierarchical-setting-index{
    .el-form-item{
      &__label{
        letter-spacing: -0.5px;
      }
    }
    /*选择管理员选择框*/
    .admin-input{
      padding-left: 20px;
      line-height: 38px;
      box-sizing: border-box;
      width: 414px;
      height: 40px;
      position: relative;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      cursor: pointer;
      .append{
        position: absolute;
        right: -1px;
        top: -1px;
        border-radius:0px 4px 4px 0px;
      }
    }
    /*应用模块*/
    .have-operatings{
      min-width:974px;
      .left-have{
        width: 132px;
        text-align: right;
        display: inline-block;
      }
      .right-have{
        text-align: left;
        display: inline-block;
        vertical-align: top;
        max-width: 86%;
        .el-checkbox-group{
          .el-checkbox{
            padding: 13px 0;
            width:138px;
            margin-right:0;
          }
        }
      }
      .label{
        display: block;
        padding-left: 54px;
        font-weight: bolder;
      }
      .t-label{
        color: #666666;
        display: block;
        padding-right: 12px;
      }
    }
  }
</style>
