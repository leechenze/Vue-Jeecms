<template>
  <section class="applet-edition-index">
    <!-- 开发版本 -->
    <base-form
      class="t-bottom"
      v-bind="form"
      v-if="showForm1"
      @handleConfirmUpload="handleConfirmUpload"
      @handleConfirmExamine="handleConfirmExamine"
    >
    </base-form>
    <!-- 审核版本 -->
    <base-form
      v-bind="form2"
      v-if="showForm2"
      style="margin-top:20px"
      class="t-bottom slot-title"
      @handleConfirmRelease="handleConfirmRelease"
      @handleConfirmWithdraw="handleConfirmWithdraw"
      @handleConfirmRest="handleConfirmRest"
    >
      <template #title="scope">
        <div class="form-item-title">
          <div class="jee-bg-light"></div>
          <h1>审核版本 &nbsp;&nbsp;
            <el-tag class="t-font-w400"
              :type="scope.form.status === 1?'':(scope.form.status === 2?'success':'danger')"
              size="mini" effect="plain">{{scope.form.status === 1?'审核中':(scope.form.status === 2?'审核成功':'审核失败')}}</el-tag>
            <el-link
              class="code-link"
              :underline="false"
              @click="codeExperience"
            >
              <jee-icon iconClass="erweima"></jee-icon>二维码体验
            </el-link>
          </h1>
        </div>
      </template>
      <template #text="scope">
        <div>{{text}}</div>
      </template>
      <template #failReason="scope">
        <div v-if="scope.form.failReason" v-html="scope.form.failReason"></div>
      </template>
    </base-form>
    <!-- 线上版本 -->
     <base-form
      v-bind="form3"
      v-if="showForm3"
      style="margin-top:20px"
      class="t-bottom slot-title"
      @handleConfirmHidden="handleConfirmHidden"
      @handleConfirmShow="handleConfirmShow"
    >
      <template #title="scope">
        <div class="form-item-title">
          <div class="jee-bg-light"></div>
          <h1>线上版本 &nbsp;&nbsp;
            <el-tag class="t-font-w400" v-if="scope.form.action === 'open'" type="success" size="mini" effect="plain">可见</el-tag>
            <el-tag v-else type="error" size="mini">不可见</el-tag>
          </h1>
        </div>
      </template>
      <template #text="scope">
        <div>{{text2}}</div>
      </template>
    </base-form>
    <!-- 权限勾选弹窗 -->
    <el-dialog
      title="提示"
      width="623px"
      :visible.sync="dialogVisible">
      <div class="power-sys">
        <span class="dialog-content">
          <i class="el-icon-warning"/>确定要提交审核?
        </span>
        <div class="power-sys__cont">
          <p class="power-sys__text">提交给微信团队审核前，请确保：</p>
          <p class="power-sys__text">
            <span class="power-sys__spot">•</span>
            提交的小程序功能完整，可正常打开和运行，而不是测试版或 Demo 小程序的调试和预览可在开发者工具进行。 多次提交测试内容或 Demo，将受到相应处罚。</p>
          <p class="power-sys__text">
            <span class="power-sys__spot">•</span>
            请慎重进行提交审核操作，在审核反馈前（1-7日）不能重复提交审核</p>
          <p class="power-sys__text">
            <span class="power-sys__spot">•</span>
            已仔细阅读 <a class="jee-color power-sys__link" target="_blank"
              href="https://developers.weixin.qq.com/miniprogram/product/">《微信小程序平台运营规范》
              </a> 和 <a class="jee-color power-sys__link" target="_blank"
              href="https://developers.weixin.qq.com/miniprogram/product/reject.html">《微信小程序平台审核常见被拒绝情形》</a></p>
          <div class="t-text-center">
            <el-checkbox class="t-check" v-model="check">已阅读并了解平台审核规则</el-checkbox>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button
          :disabled="!check"
          type="primary" size="small"
          @click="selectExamine">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 二维码展示 -->
    <form-dialog
      ref="editDialog"
      v-bind="edit"
    >
      <template #code="scope">
        <div class="t-text-center">
          <div class="code-box">
            <div class="code-box-img">
              <el-image
                class="t-img"
                :src="popCodeUrl"
                fit="contain">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
              </el-image>
            </div>
          </div>
          <p style="margin-top:10px"> <jee-icon iconClass="qiyong" :style="{fill:'#1CC04E',fontSize:'14px'}"></jee-icon> 体验版已生效 </p>
          <p class="t-line1"> 未添加体验者, <span
            class="jee-color add-experiencer " @click="addExperiencer" >点击添加</span> </p>
        </div>
      </template>
    </form-dialog>
    <form-dialog
      ref="subDialog"
      v-bind="subData"
      @handleConfirm="handleConfirm"
    >
      <template #versionDto="scope">
          <div style="padding-left:10px;">
            <p style="padding-left:10px;">配置功能页面
              <span class="t-label t-12">(至少填写一组，填写正确的信息有利于用户快速搜索出你的小程序)</span></p>
            <div style="padding-left:10px;"
              v-for="(item,index) in scope.form.versionDto" :key="index">
              <div style="height:32px">
                <span class="fl" style="color:#333">功能页面{{index+1}}</span>
                <span class="fr">
                  <el-link :key="index"
                    class="jee-color"
                    @click="handleAdd($event,index)"
                    :underline="false" >
                    <jee-icon :iconClass="index>0?'delete':'tianjia'"></jee-icon>
                      {{index>0?'删除':'添加'}}
                  </el-link>
                </span>
              </div>
              <base-form
                ref="baseForm"
                class='version-dto-from'
                :showSubmitButton="false"
                :form="item"
                :rules="rules"
                :formItems="baseFormItems"
                labelWidth="155px"
              ></base-form>
            </div>
          </div>
      </template>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import formDialog from '@/components/mixins/formDialog'
export default {
  name: 'appletEdition',
  mixins: [baseHeader, baseForm, formDialog],
  data () {
    return {
      text: '微信审核中，请耐心等待。一般审核周期为1-7个工作日，审核成功后即可操作小程序',
      form: {
        api: 'miniprogramversionRecord',
        labelWidth: '100px',
        showSubmitButton: true,
        submitBtns: [
          {
            text: '上传代码',
            plain: true,
            type: 'empty',
            subType: 'Upload',
            hidden: (data) => {
              return this.showButton[1]
            },
            disabled: !this._checkPermission('/miniprogramversion/submit', 'POST')
          },
          {
            text: '提交审核',
            plain: true,
            type: 'empty',
            subType: 'Examine',
            hidden: (data) => {
              return this.showButton[3]
            },
            disabled: !this._checkPermission('/miniprogramversion/audit', 'POST')
          }
        ],
        params: { appId: this.$route.query.appId, id: this.$route.query.id },
        formItems: [
          {
            type: 'title',
            label: '开发版本',
            popoverText: '推荐使用模板库中的最新版本'
          },
          {
            type: 'text',
            label: '版本号：',
            prop: 'codeVersion'
          },
          {
            label: '提交时间：',
            type: 'text',
            prop: 'createTime'
          }
        ]
      },
      form2: {
        labelWidth: '100px',
        showSubmitButton: true,
        form: {
          ids: []
        },
        submitBtns: [
          {
            text: '提交发布',
            plain: true,
            type: 'empty',
            subType: 'Release',
            hidden: (data) => {
              return this.showButton[2]
            },
            disabled: !this._checkPermission('/miniprogramversion/release', 'POST')
          },
          {
            text: '撤回审核',
            plain: true,
            type: 'empty',
            subType: 'Withdraw',
            hidden: (data) => {
              return this.showButton[4]
            },
            disabled: !this._checkPermission('/miniprogramversion/audit', 'DELETE')
          },
          {
            text: '重新审核',
            plain: true,
            type: 'empty',
            subType: 'Rest',
            hidden: (data) => {
              return this.showButton[5]
            },
            disabled: !this._checkPermission('/miniprogramversion/audit', 'POST')
          }
        ],
        formItems: [
          {
            type: 'slot',
            prop: 'title',
            labelWidth: '0px'
          },
          {
            type: 'text',
            label: '版本号：',
            prop: 'codeVersion'
          },
          {
            label: '提审时间：',
            type: 'text',
            prop: 'createTime'
          },
          {
            label: '审核时间：',
            type: 'text',
            prop: 'auditTime'
          },
          {
            label: '说明：',
            type: 'slot',
            class: 'sm-height',
            prop: 'text'
          },
          {
            label: '失败原因：',
            type: 'slot',
            hiddenKey: 'status',
            hiddenValue: 3,
            prop: 'failReason'
          }
        ]
      },
      text2: '隐藏的线上版本，微信用户无法搜索或访问，可见的线上版本可正常使用',
      form3: {
        labelWidth: '100px',
        showSubmitButton: true,
        form: {},
        submitBtns: [
          {
            text: '设置隐藏',
            plain: true,
            type: 'empty',
            subType: 'Hidden',
            hidden: (data) => {
              return data.action === 'open'
            },
            disabled: !this._checkPermission('/miniprogramversion/release/status', 'PUT')
          },
          {
            text: '设为可见',
            plain: true,
            type: 'empty',
            subType: 'Show',
            hidden: (data) => {
              return data.action === 'close'
            },
            disabled: !this._checkPermission('/miniprogramversion/release/status', 'PUT')
          }
        ],
        formItems: [
          {
            type: 'slot',
            prop: 'title',
            labelWidth: '0px'
          },
          {
            type: 'text',
            label: '版本号：',
            prop: 'codeVersion'
          },
          {
            label: '上线时间：',
            type: 'text',
            prop: 'createTime'
          },
          {
            label: '说明：',
            type: 'slot',
            class: 'sm-height',
            prop: 'text'
          }
        ]
      },
      showButton: {},
      dialogVisible: false,
      check: false,
      edit: {
        loading: false,
        title: '二维码体验',
        form: {},
        formLoading: false,
        showFoot: false,
        rules: {},
        buttons: [],
        formItems: [
          {
            type: 'slot',
            prop: 'code',
            labelWidth: '0px'
          }
        ]
      },
      subData: {
        width: '623px',
        title: '提交审核',
        form: {
          'versionDto': [
            {
              'address': '',
              'tag': '',
              'title': '',
              'categoryDtoId': ''
            }
          ],
          'appId': ''
        },
        formLoading: false,
        buttons: [
          {
            text: '确定',
            keepAlive: true,
            type: 'Submit'
          }
        ],
        formItems: [
          {
            type: 'slot',
            prop: 'versionDto',
            labelWidth: '0px'
          }
        ]
      },
      rules: {
        address: [
          this.$rules.required()
        ],
        title: [
          this.$rules.required()
        ],
        categoryDtoId: [
          this.$rules.required()
        ],
        tag: [
          this.$rules.required()
        ]
      },
      showForm1: false,
      showForm2: false,
      showForm3: false,
      popCodeUrl: '',
      baseFormItems: [
        {
          type: 'select',
          label: '功能页面：',
          prop: 'address',
          placeholder: '请选择',
          style: {
            width: '300px'
          },
          options: []
        },
        {
          label: '标题：',
          prop: 'title',
          maxlength: 150,
          style: {
            width: '300px'
          },
          placeholder: '请输入小程序内页面标题'
        },
        {
          type: 'select',
          label: '所在服务类目：',
          prop: 'categoryDtoId',
          placeholder: '请选择',
          optionLabel: 'categoryName',
          optionValue: 'id',
          style: {
            width: '300px'
          },
          explain: '功能页面和服务类目必须一一对应，且功能页面提供的内容必须符合该类目范围',
          options: []
        },
        {
          label: '标签：',
          prop: 'tag',
          maxlength: 150,
          style: {
            width: '300px'
          },
          explain: '搜索标签，标签填写与页面功能相关，更容易被搜索',
          placeholder: '请输入内容'
        }
      ],
      optionsLeaf: [],
      optionsCategory: []
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
      if (newVal === 'edition') {
        this.fetchFormApi()
        this.getFormItem()
      }
    }
  },
  methods: {
    handleConfirm (data) {
      this.confirmExamine(data)
    },
    handleAdd (e, i) {
      if (i > 0) {
        this.subData.form.versionDto.splice(i, 1)
      } else {
        this.subData.form.versionDto.push({
          'address': '',
          'tag': '',
          'title': '',
          'categoryDtoId': ''
        })
      }
    },
    selectExamine () {
      this.dialogVisible = false
      this.$refs.subDialog.showDialog()
    },
    addExperiencer () {
      // 添加体验者
      this.$refs.editDialog.handleCancel()
      this.$emit('addExperiencer')
    },
    codeExperience () {
      var params = { appId: this.$route.query.appId }
      this.$request.miniprogramversionQrcode(params).then(res => {
        if (res.code === 200) {
          this.popCodeUrl = 'data:image/jpeg;base64,' + res.data
          this.$refs.editDialog.showDialog()
        }
      })
    },
    // 上传代码
    handleConfirmUpload (data, btn) {
      this.$confirm('确定要上传代码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = { appId: this.$route.query.appId }
        this.$request.miniprogramversionSubmit(params).then(res => {
          if (res.code === 200) {
            this.$restBack(res, () => {
              this.fetchFormApi()
              this.getFormItem()
            }, '上传成功')
          }
        })
      }).catch(() => {})
    },
    confirmExamine (data, btn) {
      let list = []
      data.versionDto.forEach((v, i) => {
        this.$refs.baseForm[i].$refs.form.validate(valid => {
          if (valid) {
            let obj = {
              'address': v.address,
              'tag': v.tag,
              'title': v.title,
              'categoryDto': this.optionsCategory.find(t => t.id === v.categoryDtoId)
            }
            list.push(obj)
          }
        })
      })
      if (list.length > 0) {
        this.subFormData(list)
      }
    },
    restData () {
      let obj = {
        'address': '',
        'tag': '',
        'title': '',
        'categoryDtoId': ''
      }
      this.subData.form = {
        'versionDto': [obj]
      }
    },
    subFormData (list) {
      var params = {
        'versionDto': list,
        'appId': this.$route.query.appId
      }
      this.$request.miniprogramversionRecordSubmit(params).then(res => {
        if (res.code === 200) {
          this.$restBack(res, () => {
            this.fetchFormApi()
            this.getFormItem()
            this.restData()
            this.$refs.subDialog.handleCancel()
          }, '提交成功')
        }
      })
    },
    // 提交审核
    handleConfirmExamine (data, btn) {
      this.dialogVisible = true
    },
    // 撤销审核
    handleConfirmWithdraw (data, btn) {
      this.$confirm('确定要撤销审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // var params = { appId: this.$route.query.appId }
        let params = { ids: [data.id] }
        this.$request.miniprogramversionRecordDelete(params).then(res => {
          this.$restBack(res, () => {
            this.fetchFormApi()
            this.showForm2 = false
            this.getFormItem()
          })
        })
      }).catch(() => {})
    },
    // 重新审核
    handleConfirmRest (data, btn) {
      // console.log(data)
      // let arr = []
      // let obj = {
      //   'address': '',
      //   'tag': '',
      //   'title': '',
      //   'categoryDtoId': ''
      // }
      // arr.push(obj)
      // this.subData.form = {
      //   'versionDto': arr
      // }
      this.handleConfirmExamine()
    },
    // 是否隐藏
    handleConfirmHidden (data, btn) {
      this.$confirm('确定要隐藏版本?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          id: data.id,
          action: 'close'
        }
        this.$request.miniprogramversionReleaseStatus(params).then(res => {
          if (res.code === 200) {
            this.$restBack(res, () => {
              this.fetchFormApi()
              this.getFormItem()
            }, '设置成功')
          }
        })
      }).catch(() => {})
    },
    // 设置可见
    handleConfirmShow (data, btn) {
      this.$confirm('确定要设置版本为可见?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          id: data.id,
          action: 'open'
        }
        this.$request.miniprogramversionReleaseStatus(params).then(res => {
          if (res.code === 200) {
            this.$restBack(res, () => {
              this.fetchFormApi()
              this.getFormItem()
            }, '设置成功')
          }
        })
      }).catch(() => {})
    },
    // 提交发布
    handleConfirmRelease (data, btn) {
      var params = {
        id: data.id
      }
      this.$request.miniprogramversionReleaseSubmit(params).then(res => {
        if (res.code === 200) {
          this.$restBack(res, () => {
            this.fetchFormApi()
            this.getFormItem()
          }, '发布成功')
        }
      })
      // console.log(data)
      // miniprogramversionReleaseSubmit
    },
    // 获取版本信息
    getFormItem () {
      var params = { appId: this.$route.query.appId }
      this.$request.miniprogramversionAudit(params).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.showForm2 = true
            this.form2.form = res.data || { ids: [] }
          }
        }
      })
      this.$request.miniprogramversionRelease(params).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.showForm3 = true
            this.form3.form = res.data || {}
          }
        }
      })
      this.$request.miniprogramversionButton(params).then(res => {
        if (res.code === 200) {
          this.showButton = res.data.button
        }
      })
      // 类目
      this.$request.miniprogramversionCategory(params).then(res => {
        if (res.code === 200) {
          this.baseFormItems.find(v => v.prop === 'categoryDtoId').options = res.data
          this.optionsCategory = res.data || []
        }
      })
      // 配置
      this.$request.miniprogramversionLeaf(params).then(res => {
        if (res.code === 200) {
          let arr = res.data.map(t => {
            let obj = {
              label: t,
              value: t
            }
            return obj
          })
          this.baseFormItems.find(v => v.prop === 'address').options = arr
          this.optionsLeaf = res.data || []
        }
      })
    },
    // 回调
    fetchFormCallBack (res) {
      if (res.code === 200) {
        if (res.data) {
          this.showForm1 = true
          this.form.form = res.data || {}
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'edition') {
        this.fetchFormApi()
        this.getFormItem()
      }
    })
  }
}
</script>

 <style lang="scss">
 .applet-edition-index{
   .power-sys{
     font-size: 14px;
     color: #666666;
     &__cont{
       padding-top: 20px;
       padding-left: 45px;
       line-height: 20px;
     }
     &__text{
       margin-bottom: 20px;
       position: relative;
       font-weight: 400;
       letter-spacing: -0.5px;
     }
     &__spot{
       position: absolute;
       left: -15px;
     }
     &__link{
       cursor: pointer;
     }
   }
   .slot-title{
     .form-item-title{
        padding: 0;
      }
      .code-link{
        margin-left: 30px;
        .jee-svg-icon{
          fill: #666666;
          margin-right: 10px;
        }
      }
   }
   .code-box{
     width: 240px;
     height: 240px;
     display: block;
     padding: 20px;
     box-sizing: border-box;
     background-color: #EFF1F3;
     margin: 0 auto;
     &-img{
       width: 200px;
       height: 200px;
       background-color: #fff;
     }
   }
   .add-experiencer{
      cursor: pointer;
    }
  .version-dto-from .el-form-item {
    margin-bottom: 20px!important;
  }
 }
 </style>
