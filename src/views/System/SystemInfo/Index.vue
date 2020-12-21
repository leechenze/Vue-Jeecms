<template>
  <section class="system-systemInfo-index-container">
    <!-- <base-header
      v-bind="headers"
    /> -->
    <div>
      <ul class="table-box">
        <li><span>软件名称：</span><span>{{data.productName}}</span></li>
        <li><span>版本号：</span><span>{{data.version}}</span></li>
        <li><span>用户单位：</span><span>{{data.siteName}}</span></li>
        <li><span>版权所有：</span><span>{{data.copyright}}<a v-if="data.systemUrl" :href='data.systemUrl' target="_blank" class="jee-color">{{data.systemUrl}}</a></span></li>
        <!-- <li><span>授权许可：</span><span :style="{color:textColor}">{{data.authorization}}
          <el-button type="empty" @click="upDialog" style="margin-left:20px;" size="mini"
          :disabled="!_checkPermission('/systeminfo/change', 'GET')"
          >{{btnText}}</el-button></span></li>
        <li><span>授权到期时间：</span><span>{{data.authExpiredDate}}</span></li>
        <li><span>售后服务到期时间：</span><span>{{data.afterSaleExpiredDate}}</span></li> -->
        <li><span>操作系统： </span><span>{{data.system}}</span></li>
        <li><span>JDK版本：</span><span>{{data.jdk}}</span></li>
        <li><span>数据库类型：</span><span>{{data.dbType}}</span></li>
        <li><span>数据库链接地址：</span><span>{{data.dbUrl}}</span></li>
        <li><span>数据库链接端口：</span><span>{{data.dbPort}}</span></li>
        <li><span>数据库名称：</span><span>{{data.dbName}}</span></li>
      </ul>
    </div>
    <form-dialog
      title="授权"
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      :buttons='buttons'
      v-on:handleConfirm="handleConfirmAdd"
    >
    <div class="power-sys__cont">
      <p class="power-sys__title">温馨提示：</p>
      <p class="power-sys__text"><span class="power-sys__spot">•</span>单个授权码只允许授权一个顶级域名，如需更换顶级域名，请重新<span @click="upLink" class="jee-color power-sys__link">购买授权</span></p>
      <p class="power-sys__text"><span class="power-sys__spot">•</span>授权码为验证系统许可证的唯一标识，妥善保管，请勿泄漏给他人</p>
      <p class="power-sys__text"><span class="power-sys__spot">•</span>未授权的软件仅限个人体验学习使用，严禁用于商业途径</p>
    </div>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import formDialog from '@/components/mixins/formDialog'

export default {
  name: 'systemInfo',
  mixins: [baseHeader, formDialog],
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      data: {},
      textColor: '',
      btnText: '',
      addFormLoading: false,
      addForm: {
        attrValue: ''
      },
      addRules: {
        attrValue: [this.$rules.required()]
      },
      addFormItems: [
        {
          prop: 'attrValue',
          label: '授权码',
          placeholder: '请输入授权码',
          maxlength: 1000,
          labelWidth: '80px'
        }
      ],
      buttons: [
        {
          text: '确定',
          type: 'Submit'
        }
      ]
    }
  },
  methods: {
    upDialog () {
      this.$refs.addDialog.showDialog()
    },
    upLink () {
      window.open('http://www.jeecms.com/goumai.htm')
    },
    handleConfirmAdd (data) {
      this.$confirm('是否确定授权码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchSysteminfoChange(data)
      })
    },
    fetchSysteminfoChange (data) {
      this.$request.fetchSysteminfoChange(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchSysteminfo()
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    },
    fetchSysteminfo () {
      this.$request.fetchSysteminfo().then(res => {
        if (res.code === 200) {
          this.data = res.data
          if (res.data.authState === 2) {
            this.textColor = '#FF0000'
            this.btnText = '去授权'
          } else if (res.data.authState === 3) {
            this.textColor = '#E96C21'
            this.btnText = '去授权'
          } else if (res.data.authState === 1) {
            this.textColor = '#02C33D'
            this.btnText = '重新授权'
          } else if (res.data.authState === 4) {
            this.textColor = '#CCCCCC'
            this.btnText = '重新授权'
          }
        }
      }).then(this.hideTableLoading).catch(this.hideTableLoading)
    }
  },
  mounted () {
    this.fetchSysteminfo()
  }
}
</script>

<style lang="scss" scoped>
  .system-systemInfo-index-container{
    .power-sys__link{
      cursor: pointer;
    }
    .power-sys__cont{
      margin-top: 10px;
    }
    .power-sys__text{
      font-size: 14px;
      color: #666;
      line-height: 24px;
      .power-sys__spot{
        padding-right: 5px;
      }
    }
    .power-sys__title{
      font-size:14px;
      color:rgba(51,51,51,1);
      line-height:30px;
    }
    .table-box{
      display:inline-block;
      li{
        display: flex;
        border: 1px solid rgba(232,232,232,1);
        border-bottom:none;
        height: 45px;
        line-height: 45px;
        span:first-child{
          width: 165px;
          background-color: #fafafa;
          color: #666666;
          font-size: 14px;
          text-align: right;
          border-right:1px solid rgba(232,232,232,1);
          padding-right: 10px;
        }
        span:last-child{
          color: #333333;
          font-size: 14px;
          width: 830px;
          padding-left: 15px;
          font-weight: 500;
        }
        a.jee-color{
          padding-left: 20px;
        }
      }
      li:last-child{
        border-bottom: 1px solid rgba(232,232,232,1);
      }
    }
  }
</style>
