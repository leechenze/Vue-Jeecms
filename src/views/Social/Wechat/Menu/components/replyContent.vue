<template>
  <section class="reply-content-index">
    <div class="reply-cont__wrap" v-loading="loading">
      <div v-if="formData.type === 1">
        <div class="reply-cont__title t-bottom">回复内容</div>
        <material-select
          :key="formData.type"
          :data="formData.comment"
          :appId="$route.query.appId"
          :type="formData.type"
          @handleConfirm="materialSel"></material-select>
      </div>
      <div v-if="formData.type === 2">
        <div class="reply-cont__title t-bottom">回复内容</div>
        <material-select
          :key="formData.type"
          :data="formData.comment"
          :appId="$route.query.appId"
          :type="formData.type"
           @handleConfirm="materialSel"></material-select>
      </div>
      <div v-if="formData.type === 3">
        <div class="reply-cont__title title">触发该类型菜单，微信客户端会自动跳转到指定链接</div>
        <div class="reply-cont__cont">
          <base-form
            ref='form'
            v-bind="form"
            @changePropText="materialSel"
            >
          </base-form>
        </div>
      </div>
      <div v-if="formData.type === 4">
        <div class="reply-cont__title title">订阅者点击该子菜单会跳到以下小程序</div>
        <div class="reply-cont__cont">
          <base-form
            ref='form'
            v-bind="form2"
            @changePropText="materialSel"
            >
          </base-form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import baseForm from '@/components/mixins/baseForm'
import materialSelect from './materialSelect'
export default {
  name: 'replyContent',
  mixins: [baseForm],
  components: {
    materialSelect
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: Number,
      default: 1
    },
    rowKey: {
      type: String,
      default: 'mediaId'
    }
  },
  watch: {
    data (newVal, oldVal) {
      this.setFormData(newVal.choiceType, 'edit')
    },
    type (newVal, oldVal) {
      if (newVal !== this.formData.choiceType) {
        this.setFormData(newVal, 'add')
      }
    }
  },
  methods: {
    setFormData (type, btn) {
      this.loading = true
      if (btn === 'add') {
        this.formData = {
          'type': this.typeFilter(type),
          'choiceType': type,
          'childs': this.data.childs,
          'linkUrl': '',
          'menuKey': '',
          'menuName': this.data.menuName,
          'menuType': '',
          'msgType': '',
          'miniprogramAppid': '',
          'miniprogramPagepath': '',
          'mediaId': '',
          'comment': {}
        }
        this.form.form.linkUrl = ''
        this.form2.form.miniprogramAppid = ''
        this.form2.form.miniprogramPagepath = ''
        this.form2.form.linkUrl = ''
        // this.$emit('materialSel', this.formData)
      } else if (btn === 'edit') {
        this.formData = Object.assign({}, this.data)
        this.formData.type = this.typeFilter(type)
        this.formData.choiceType = type
        if (this.formData.comment && !this.formData.comment.msgType && this.data.comment.mediaId) {
          this.$set(this.formData.comment, 'msgType', this.data.comment ? this.data.comment.mediaType : '')
        }
        this.form.form.linkUrl = this.data.linkUrl || ''
        this.form2.form.miniprogramAppid = this.data.miniprogramAppid || ''
        this.form2.form.miniprogramPagepath = this.data.miniprogramPagepath || ''
        this.form2.form.linkUrl = (type === 9 && this.data.linkUrl) || ''
      }
      this.loading = false
    },
    typeFilter (val) {
      let arr = [0, 1, 3, 2, 2, 2, 2, 2, 2, 4]
      return arr[parseInt(val)] || 1
    },
    menuTypeFilter (val) {
      switch (val) {
        case 1:
          return 'media_id'
        case 2:
          return 'click'
        case 3:
          return 'view'
        case 4:
          return 'miniprogram'
      }
    },
    materialSel (evt) {
      this.formData.menuName = this.data.menuName
      switch (this.formData.type) {
        case 1:
          this.formData.mediaId = evt[this.rowKey]
          break
        case 2:
          this.formData.menuKey = evt.menuKey
          break
        case 3:
          this.formData.linkUrl = this.form.form.linkUrl
          break
        case 4:
          this.formData.miniprogramAppid = this.form2.form.miniprogramAppid
          this.formData.miniprogramPagepath = this.form2.form.miniprogramPagepath
          this.formData.linkUrl = this.form2.form.linkUrl
          break
      }
      this.$set(this.formData, 'comment', evt)
      // this.formData.comment = evt
      this.formData.menuType = this.menuTypeFilter(this.formData.type)
      this.$emit('materialSel', this.formData)
    }
  },
  data () {
    return {
      loading: false,
      form: {
        loading: false,
        labelWidth: 'auto',
        showSubmitButton: false,
        form: {
          linkUrl: ''
        },
        formItems: [
          {
            label: '页面地址：',
            prop: 'linkUrl',
            maxlength: 120,
            explain: '指定网页链接需要加上访问协议，如http:// 或https://'
          }
        ]
      },
      form2: {
        loading: false,
        showSubmitButton: false,
        form: {
          miniprogramAppid: '',
          miniprogramPagepath: '',
          linkUrl: ''
        },
        formItems: [
          {
            label: '小程序APPID：',
            prop: 'miniprogramAppid',
            explain: '指定网页链接需要加上访问协议，如http:// 或https://',
            maxlength: 50
          },
          {
            label: '小程序路径：',
            prop: 'miniprogramPagepath',
            maxlength: 120,
            explain: '填写跳转至小程序指定页面访问路径，<a target="_blank" href="https://weixiao.qq.com/notice/view?mid=0&cid=2&id=275">查看引导</a>'
          },
          {
            label: '备用网页：',
            prop: 'linkUrl',
            maxlength: 120,
            explain: '旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页'
          }
        ]
      },
      choiceType: 1,
      formData: {
        'type': 1,
        'choiceType': 1,
        'childs': [],
        'linkUrl': '',
        'menuKey': '',
        'menuName': '',
        'menuType': '',
        'miniprogramAppid': '',
        'miniprogramPagepath': '',
        'mediaId': ''
      }
    }
  },
  mounted () {
    this.setFormData(this.type, this.data.isAdd ? 'add' : 'edit')
  }
}
</script>

<style lang="scss">
  .reply-content-index{
    .reply-cont{
      &__wrap{
        background-color: #fff;
        width: 100%;
        min-height: 128px;
        padding: 10px 20px 5px;
        box-sizing: border-box;
      }
      &__title{
        padding: 5px 0;
        line-height: 28px;
        font-size: 14px;
        color: #666666;
      }
      .title{
        line-height: 1;
        padding: 0 0 20px;
      }
      &__comment{
        min-width: 148px;
        display: inline-block;
      }
      &__cont{
        .base-form-container{
          .gray{
            padding-bottom: 20px;
          }
        }
      }
    }
  }
</style>
