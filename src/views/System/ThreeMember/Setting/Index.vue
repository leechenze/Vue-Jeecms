<template>
  <section class="three-member-setting-index">
    <base-header v-bind="headers"/>
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    >
      <template #safeUserIds="scope">
         <div class="admin-input jee-hover-border" @click="setAdmin(scope.form.safeAdmins,scope.form.safeUserIds,'safeAdmins')">
           <span v-if="scope.form.safeUserIds.length">{{names.safeAdmins}}</span>
           <span v-else class="t-label">请选择</span>
           <el-button type="primary" class="append">选择</el-button>
         </div>
      </template>
      <template #auditUserIds="scope">
        <div class="admin-input jee-hover-border" @click="setAdmin(scope.form.auditAdmins,scope.form.auditUserIds,'auditAdmins')">
           <span v-if="scope.form.auditUserIds.length">{{names.auditAdmins}}</span>
           <span v-else class="t-label">请选择</span>
           <el-button type="primary" class="append">选择</el-button>
         </div>
      </template>
      <template #operatings="scope">
        <div class="have-operatings">
          <label class="t-33 label">应用模块</label>
          <div v-for="(item,index) in checkGroups" :key="index" >
            <div class="left-have">
              <label class="t-label">{{item.name}}</label>
            </div>
            <div class="right-have">
              <el-checkbox-group
                v-model="item.checkIds">
                <el-checkbox  v-for="(info,infoIndex) in item.options" :key="infoIndex"
                  :label="info.value">{{info.label}} </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </template>
    </base-form>
    <set-admin ref="setAdmin" @handleConfirm="setAdminList"></set-admin>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import setAdmin from './setAdmin'
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
        content: '操作说明:   启用三员管理并勾选相应模块操作后，有权限人员在对该模块数据进行相应操作时将提交数据至安全管理员进行审核，审核通过后方生效；给用户赋予安全管理员时请先为其添加三员审核菜单权限，赋予审计管理员角色时请先为其添加三员操作日志菜单权限。'
      },
      form: {
        labelWidth: '135px',
        api: 'fetchSafeManageGet',
        request: true,
        params: {
        },
        form: {
          safeAdmins: [],
          safeUserIds: [],
          haveOperatings: [],
          auditAdmins: [],
          auditUserIds: [],
          enable: false
        },
        formItems: [
          {
            label: '是否开启三员管理：',
            prop: 'enable',
            type: 'switch',
            class: 'margin-bottom20',
            enableText: '是',
            disableText: '否'
          },
          {
            type: 'title',
            label: '三员管理角色配置',
            hiddenKey: 'enable',
            hiddenValue: true
          },
          {
            type: 'slot',
            prop: 'safeUserIds',
            label: '安全管理员：',
            hiddenKey: 'enable',
            hiddenValue: true
          },
          {
            type: 'slot',
            prop: 'auditUserIds',
            label: '审计管理员：',
            class: 'margin-bottom18',
            hiddenKey: 'enable',
            hiddenValue: true
          },
          {
            type: 'slot',
            prop: 'operatings',
            labelWidth: '0px',
            class: 'margin-bottom15',
            hiddenKey: 'enable',
            hiddenValue: true
          }
        ],
        rules: {
          safeUserIds: [this.$rules.required()],
          auditUserIds: [this.$rules.required()]
        }
      },
      checkGroups: this.$enums.checkGroups,
      names: {
        safeAdmins: '',
        auditAdmins: ''
      },
      referenceData: {}
    }
  },
  methods: {
    handleConfirm (data) {
      let arr = []
      this.checkGroups.forEach(t => {
        arr = arr.concat(t.checkIds)
      })
      if (!arr.length) {
        this.$message('请选择至少一项应用模块')
        return
      }
      this.$request.fetchSafeManageCheck({ operatings: arr }).then(res => {
        if (res.data) {
          this.$message({
            message: res.data,
            type: 'success'
          })
        } else {
          this.putFormData(data, arr)
        }
      })
    },
    putFormData (data, arr) {
      this.form.loading = true
      let params = {
        enable: data.enable,
        operatings: arr,
        safeUserIds: data.safeUserIds,
        auditUserIds: data.auditUserIds
      }
      let type = this.getUplateType(params, this.referenceData)
      this.$request.fetchSafeManagePut(params, type).then(res => {
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
    // 修改状态
    getUplateType (params, data) {
      let type = 0
      let a1 = JSON.stringify(params.operatings) !== JSON.stringify(data.haveOperatings)
      let a2 = JSON.stringify(params.safeUserIds) !== JSON.stringify(data.safeUserIds)
      let a3 = JSON.stringify(params.auditUserIds) !== JSON.stringify(data.auditUserIds)
      if (params.enable !== data.enable && a1 && (a2 || a3)) {
        type = 7
      } else if (params.enable !== data.enable && (a2 || a3)) {
        type = 4
      } else if (params.enable !== data.enable && a1) {
        type = 5
      } else if (params.enable !== data.enable) {
        type = 1
      } else if (a1 && (a2 || a3)) {
        type = 6
      } else if (a1) {
        type = 3
      } else if (a2 || a3) {
        type = 2
      } else {
        type = 8
      }
      return type
    },
    setAdminList (data) {
      console.log(data)
      if (data.name === 'safeAdmins') {
        this.form.form.safeUserIds = data.ids
      } else {
        this.form.form.auditUserIds = data.ids
      }
      this.form.form[data.name] = data.arr
      this.names[data.name] = data.names
    },
    // 设置管理员
    setAdmin (data, ids, type) {
      this.$refs.setAdmin.showTheDialog(data, ids, type)
    },
    fetchFormCallBack (res) {
      this.form.loading = true
      if (res.code === 200 && res.data) {
        this.names.safeAdmins = res.data.safeAdmins.map(t => {
          return t.username
        }).join(',')
        this.names.auditAdmins = res.data.auditAdmins.map(t => {
          return t.username
        }).join(',')
        this.checkGroups.forEach(v => {
          v.checkIds = []
        })
        if (res.data.haveOperatings && res.data.haveOperatings.length) {
          res.data.haveOperatings.forEach(t => {
            if (t < 6) {
              this.checkGroups[0].checkIds.push(t)
            } else if (t > 5 && t < 11) {
              this.checkGroups[1].checkIds.push(t)
            } else if (t > 10 && t < 16) {
              this.checkGroups[2].checkIds.push(t)
            } else if (t > 15 && t < 19) {
              this.checkGroups[3].checkIds.push(t)
            } else if (t > 18 && t < 25) {
              this.checkGroups[4].checkIds.push(t)
            } else if (t > 24 && t < 31) {
              this.checkGroups[5].checkIds.push(t)
            } else if (t > 30 && t < 34) {
              this.checkGroups[6].checkIds.push(t)
            }
          })
        }
        this.form.form = Object.assign(this.form.form, res.data)
        this.form.form.auditUserIds = res.data.auditAdminIds
        this.form.form.safeUserIds = res.data.safeAdminIds
        this.referenceData = Object.assign({}, this.form.form)
      }
      this.form.loading = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchFormApi()
    })
  }

}
</script>
<style lang="scss">
  .three-member-setting-index{
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
