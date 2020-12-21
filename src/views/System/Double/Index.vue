<template>
  <section class="double-index">
    <base-form
      v-bind="form"
      v-on:handleConfirm="handleConfirm"
    >
      <template #codeValidity="scope">
        <el-input-number @change="bandInputNumberData" v-model="scope.form.codeValidity"  :max="999999999" :step="1" :min="1"  step-strictly></el-input-number>
        <span> 分</span>
      </template>
    </base-form>
  </section>
</template>
<script>
import baseForm from '@/components/mixins/baseForm'
export default {
  name: '',
  mixins: [baseForm],
  components: {
  },
  data () {
    return {
      form: {
        labelWidth: '160px',
        api: 'fetchDoubleElement',
        request: true,
        form: {
          enable: false,
          radioBtns: 2,
          selectValue: '1',
          codeValidity: '30'
        },
        formItems: [
          {
            label: '是否开启双因子：',
            prop: 'enable',
            type: 'switch',
            class: 'margin-bottom20',
            enableText: '是',
            disableText: '否'
          },
          {
            type: 'radioBtn',
            prop: 'radioBtns',
            label: '短信验证码长度：',
            class: 'margin-bottom16',
            hiddenKey: 'enable',
            hiddenValue: true,
            options: [
              {
                value: 1,
                label: '4位'
              },
              {
                value: 2,
                label: '6位',
                width: 50
              },
              {
                value: 3,
                label: '8位'
              }
            ]
          },
          {
            type: 'slot',
            prop: 'codeValidity',
            label: '短信验证码有效期：',
            hiddenKey: 'enable',
            hiddenValue: true
          }
        ],
        rules: {
          codeValidity: [this.$rules.required()],
          radioBtns: [this.$rules.required()]
        },
        submitBtns: [{
          text: '保存',
          subType: 'submit',
          disabled: !this._checkPermission('/config/element', 'POST')
        }]
      }
    }
  },
  methods: {
    bandInputNumberData (data) {
    },
    // 提交保存
    handleConfirm (data) {
      let parms = {}
      parms.openElement = data.enable
      parms.length = data.radioBtns
      parms.valid = data.codeValidity
      parms.unit = data.selectValue
      this.$request.fetchDoubleElementPost(parms).then(res => {
        if (res.code === 200) {
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    fetchFormCallBack (res) {
      if (res.code === 200 && res.data) {
        console.log(res.data)
        this.form.form.enable = res.data.elementOpen
        this.form.form.radioBtns = Number(res.data.elementLength || 2)
        this.form.form.selectValue = res.data.elementUnit
        this.form.form.codeValidity = res.data.elementValid
      }
    },
    bandSelectData (data) {
      console.log(data)
      if (data === '1') {
        if (this.form.form.codeValidity < '30') {
          this.form.form.codeValidity = '30'
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      delete this.form.params.id
      this.fetchFormApi()
    })
  }

}
</script>
<style lang="scss">
  .double-index{
    .form-item-wrap{
      margin-bottom: 30px;
      .radio-btn{
        height: 40px !important;

      }
    }
  }

</style>
<style lang="scss" scope>
  .double-index{
    .minSelect{
        width: 118px;
        margin-left: 10px;
    }
  }
</style>
