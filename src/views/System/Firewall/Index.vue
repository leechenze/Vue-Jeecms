<template>
  <el-container direction="vertical" v-loading="form.loading" class="system-fir-container">
    <!-- <base-header v-bind="headers"/> -->
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    >
    <template #inNetworkIpJsons="scope">
        <div class="innet-list-wrap">
            <el-select
              style="width:414px"
              popper-class="jee-border"
              @change="selIpJson"
              v-model="ipSelect" >
              <el-option
                v-for="(ip,index) in ipOptions" :key="index"
                :label="ip.label" :value="ip.value"></el-option>
            </el-select>
          <div v-if="ipSelect">
            <label>起始IP：</label>
            <span>
              <ip-input :data="start" theType="start"
                :startData="end" @errorMsg="hasErrorMsg"></ip-input>
            </span>
            <label class="margin-left">结尾IP：</label>
            <span>
              <ip-input :data="end" theType="end"
                :startData="start" @errorMsg="hasErrorMsg"></ip-input>
            </span>
            <el-button class="margin-left" type="primary" size="small" @click="addIpJson">添加</el-button>
          </div>
          <el-table
            class="ip-table"
            :data="ipJson.json" border
            :header-cell-style="{ color:'#333', backgroundColor: '#F9F9F9', height: '45px', padding: 0 }">
              <!-- 默认只显示文字 -->
              <el-table-column prop="startIp" label="起始IP" width="275px">
                <template slot-scope="scope">
                  <div v-if="scope.row.edit">
                    <ip-input :data="scope.row.start" theType="start"
                      :startData="scope.row.end" @hasErrorMsg="hasErrorMsg"></ip-input>
                  </div>
                  <div v-else>{{scope.row.startIp}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="endIp" label="结尾IP" width="275px">
                <template slot-scope="scope">
                  <div v-if="scope.row.edit">
                     <ip-input :data="scope.row.end" theType="end"
                      :startData="scope.row.start" @hasErrorMsg="hasErrorMsg"></ip-input>
                  </div>
                  <div v-else>{{scope.row.endIp}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="handle-column-wrap">
                      <el-link :underline="false" v-if="!scope.row.edit"
                        @click="handleTableEdit(scope.row, scope.$index)">
                        <jee-icon iconClass="bianji"></jee-icon> 编辑
                      </el-link>
                      <el-link :underline="false" v-if="!scope.row.edit"
                        @click="handleTableDelete(scope.row, scope.$index)">
                        <jee-icon iconClass="delete"></jee-icon> 删除
                      </el-link>

                      <el-link :underline="false" v-if="scope.row.edit"
                        @click="handleTableSave(scope.row, scope.$index)">
                        <jee-icon iconClass="baocun"></jee-icon> 保存
                      </el-link>
                  </div>
                </template>
              </el-table-column>
          </el-table>
        </div>
      </template>
    </base-form>
  </el-container>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import ipInput from './ipInput'
import { deepClone } from '../../../utils'

export default {
  name: 'firewall',
  mixins: [baseHeader, baseForm],
  components: {
    ipInput
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      form: {
        api: 'fetchIptablesGet',
        params: {},
        labelWidth: '236px',
        form: {
          isEnable: false,
          limitInNetworkModel: 1,
          inNetworkIpJsons: [],
          limitDomain: '',
          allowLoginHours: [],
          allowLoginWeek: []
        },
        formItems: [
          {
            prop: 'isEnable',
            label: '是否开启防火墙：',
            type: 'radio',
            options: [
              {
                value: true,
                label: '是'
              },
              {
                value: false,
                label: '否'
              }
            ]
          },
          {
            prop: 'limitInNetworkModel',
            label: '限制内网IP：',
            type: 'radio',
            hiddenKey: 'isEnable',
            hiddenValue: true,
            options: [
              {
                value: 1,
                label: '不限制'
              },
              {
                value: 2,
                label: '设置白名单'
              },
              {
                value: 3,
                label: '设置黑名单'
              }
            ]
          },
          {
            prop: 'inNetworkIpJsons',
            label: 'IP段白名单：',
            type: 'slot',
            hiddenKeys: ['limitInNetworkModel', 'isEnable'],
            hiddenValues: [2, true]
          },
          {
            prop: 'inNetworkIpJsons',
            label: 'IP段黑名单：',
            type: 'slot',
            hiddenKeys: ['limitInNetworkModel', 'isEnable'],
            hiddenValues: [3, true]
          },
          {
            prop: 'limitDomain',
            label: '限制访问域名：',
            type: 'textarea',
            height: '100px',
            hiddenKey: 'isEnable',
            hiddenValue: true,
            autosize: false,
            explain: '只有通过输入框中的域名才能正常登录系统后台，多个域名用回车键隔开，留空为不限制'
          },
          {
            prop: 'allowLoginHours',
            label: '允许登录后台的时间：',
            type: 'checkGroup',
            hiddenKey: 'isEnable',
            hiddenValue: true,
            optionsType: 'hour',
            explain: '0点表示 00:00:00 ~ 00:59:59 ，不选表示不限制'
          },
          {
            prop: 'allowLoginWeek',
            label: '允许登录后台的星期：',
            type: 'checkGroup',
            hiddenKey: 'isEnable',
            hiddenValue: true,
            optionsType: 'week',
            explain: '不选表示不限制'
          }
        ],
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/iptables', 'PUT')
        }]
      },
      id: '',
      ipJson: {
        start: ['', '', '', ''],
        end: [],
        json: []
      },
      start: ['', '', '', ''],
      end: [],
      ipSelect: '',
      ipOptions: [
        { label: '选择内网ip段', value: '' },
        { label: '192.168', value: '192.168' },
        { label: '172', value: '172' },
        { label: '10', value: '10' }
      ],
      hasErrorMsgs: false
    }
  },
  methods: {
    hasErrorMsg (status) {
      this.hasErrorMsgs = status
    },
    // 表格操作
    selIpJson (data, type, i) {
      if (type === 'edit') {
        var arr1 = data.startIp.split('.')
        var arr2 = data.endIp.split('.')
        this.ipJson.start.forEach((v, i) => {
          data.start.splice(i, 1, arr1[i] || '')
          data.end.splice(i, 1, arr2[i] || '')
        })
        this.ipJson.json[i] = data
      } else {
        var arr = data.split('.')
        var that = this
        this.ipJson.start.forEach((v, i) => {
          that.start.splice(i, 1, arr[i] || '')
          that.end.splice(i, 1, arr[i] || '')
        })
        // console.log(this.ipJson.start)
      }
    },
    addIpJson () {
      var rule = this.start.filter(v => { return v === '' }).concat(this.end.filter(v => { return v === '' }))
      if (rule.length > 0 || this.hasErrorMsgs) {
        this.$message('请填写正确ip地址')
      } else {
        this.ipSelect = ''
        var json = {
          startIp: this.start.join('.'),
          endIp: this.end.join('.'),
          start: [],
          end: []
        }
        this.ipJson.json.push(json)
        this.selIpJson(this.ipSelect)
      }
    },
    handleTableDelete (data, i) {
      this.ipJson.json.splice(i, 1)
    },
    handleTableEdit (data, i) {
      this.ipSelect = ''
      this.selIpJson(data, 'edit', i)
      setTimeout(() => {
        this.$set(this.ipJson.json[i], 'edit', true)
      }, 50)
    },
    handleTableSave (data, i) {
      this.$set(this.ipJson.json[i], 'edit', false)
      this.$set(this.ipJson.json[i], 'startIp', data.start.join('.'))
      this.$set(this.ipJson.json[i], 'endIp', data.end.join('.'))
    },
    // 保存按钮提交
    handleConfirm (data) {
      this.form.loading = true
      var arr = []
      this.ipJson.json.forEach(v => {
        var obj = {
          startIp: v.startIp,
          endIp: v.endIp
        }
        arr.push(obj)
      })
      var params = deepClone(data)
      params.allowLoginHours = data.allowLoginHours.join(',')
      params.allowLoginWeek = data.allowLoginWeek.join(',')
      params.inNetworkIpJsons = arr
      delete params.inNetworkIpJson

      params.limitDomain = this.$encode(data.limitDomain)
      this.$request.fetchIptablesUpdate(params).then(res => {
        if (res.code === 200) {
          this.hideFormLoading()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.fetchFormApi()
        }
      }).catch(this.hideFormLoading())
    },
    // 加载数据
    fetchFormCallBack (res) {
      if (res.code === 200) {
        this.id = res.data.id
        this.form.form = Object.assign({}, this.form.form, res.data)
        this.form.form.allowLoginWeek = []
        this.form.form.allowLoginHours = []
        setTimeout(() => {
          this.form.form.allowLoginWeek = res.data.allowLoginWeek.split(',')
          this.form.form.allowLoginHours = res.data.allowLoginHours.split(',')
          if (res.data.inNetworkIpJson === '[null]') {
            this.ipJson.json = []
          } else {
            this.ipJson.json = JSON.parse(res.data.inNetworkIpJson)
          }

          if (this.ipJson.json instanceof Array) {
            this.ipJson.json.map(v => {
              v.start = v.startIp.split('.')
              v.end = v.endIp.split('.')
            })
          }
        }, 10)
      }
    },
    fetchFormApi () {
      this.form.loading = true
      return this.$request[this.form.api]()
        .then(this.fetchFormCallBack)
        .then(this.hideFormLoading)
        .catch(this.hideFormLoading)
    }
  },
  watch: {
    'form.form.limitInNetworkModel': function (newVal, oldVal) {
      if (newVal !== oldVal && (newVal === 2 || newVal === 3)) {
        this.ipJson.json = []
      }
    }
  },
  mounted () {
    this.fetchFormApi()
    // 获取下拉列表数据
  }
}
</script>

<style lang="scss" scoped>
  .system-fir-container{
    font-size: 16px;
    header{
      padding-bottom: 20px;
      span{
        padding-right: 10px;
      }
    }
    .el-alert{
      margin-bottom: 20px;
    }
    .innet-list-wrap{
      .el-select{
        width: 175px;
      }
    }
    .margin-left{
      margin-left: 20px;
    }
    .ip-table{
      width: 785px;
      margin-top: 10px;
      td,th{
        border-right:none !important;
      }
    }
    .base-form-container .el-textarea .el-textarea__inner{
      line-height: 1.5 !important;
    }
    .handle-column-wrap{
        display: flex;
        font-size: 12px;
        .el-link:nth-of-type(n+2){
          margin-left: 24px;
        }
      }
  }

</style>
<style lang="scss">
  .ip-input.el-input{
      width: 40px;
      margin-right: 10px;
      .el-input__inner{
        border-top: none;
        border-left: none;
        border-right: none;
        padding: 0 5px !important;
        text-align: center;
        border-radius: 0;
      }
    }
</style>
