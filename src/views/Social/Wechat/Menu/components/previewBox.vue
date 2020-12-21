<template>
  <section class="preview-box-index">
    <!-- 菜单 -->
    <div class="prev-box">
      <!-- 标题 -->
      <div class="prev-box__flex t-bottom">
        <p class="prev-box__title">{{form.form.menuName}}</p>
        <p @click="deleteMenu"
          class="prev-box__delete jee-color"
        >{{deleteText}}</p>
      </div>
      <!-- 类型 -->
      <base-form
        ref='form'
        class="prev-box__form"
        v-bind="form"
        @changePropText="changePropText"
        >
          <template #comment="scope">
            <!-- 回复 -->
              <reply-content ref="replyContent"
                :data="scope.form"
                rowKey="id"
                @materialSel="materialSel"
                :type="scope.form.choiceType">
              </reply-content>
          </template>
      </base-form>

    </div>
  </section>
</template>

<script>
import baseForm from '@/components/mixins/baseForm'
import replyContent from './replyContent'
var options = [
  { label: '发送消息', value: 1 },
  { label: '跳转网页', value: 2 },
  { label: '扫码', value: 3 },
  { label: '扫码(等待消息)', value: 4 },
  { label: '立即拍照', value: 5 },
  { label: '拍照/相册', value: 6 },
  { label: '相册', value: 7 },
  { label: '地址位置', value: 8 },
  { label: '关联小程序', value: 9 }
]
export default {
  name: 'previewBox',
  mixins: [baseForm],
  components: {
    replyContent
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      form: {
        showSubmitButton: false,
        labelWidth: '116px',
        form: {
          'menuName': '',
          'choiceType': 1,
          'childs': [],
          'comment': ''
        },
        formItems: [
          {
            prop: 'menuName',
            label: '子菜单名称：',
            explain: '字数不超过4个汉字或8个字母，超出或过长系统将自动省略处理'
          },
          {
            prop: 'choiceType',
            label: '菜单类型：',
            options: options,
            type: 'radio',
            hidden: (data) => {
              return data.childs.length < 1
            }
          },
          {
            prop: 'comment',
            type: 'slot',
            hidden: (data) => {
              return data.childs.length < 1
            }
          }
        ],
        rules: {
          menuName: [
            this.$rules.required(), { validator: (rule, value, callback) => {
              if (value === '') {
                callback()
              } else {
                if (this.getMenuNameLen(value) <= 8) {
                  callback()
                } else {
                  callback(new Error('字数超过上限'))
                }
              }
            },
            trigger: ['blur'] }]
        }
      },
      deleteText: '删除菜单'
    }
  },
  methods: {
    // 获取菜单名称长度
    getMenuNameLen: function (val) {
      var len = 0
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i)
        // eslint-disable-next-line no-control-regex
        a.match(/[^\x00-\xff]/gi) != null ? (len += 2) : (len += 1)
      }
      return len
    },
    deleteMenu () {
      this.$emit('deleteMenu')
    },
    getFormData (data) {
      this.$set(this.form, 'form', data)
      if (data.childs.length === 0) {
        this.form.form.choiceType = data.choiceType || 1
      } else {
        this.form.form.choiceType = 0
      }
      if (data.level === 1) {
        this.deleteText = '删除菜单'
        this.form.formItems.find(v => v.prop === 'menuName').label = '菜单名称：'
      } else {
        this.deleteText = '删除子菜单'
        this.form.formItems.find(v => v.prop === 'menuName').label = '子菜单名称：'
      }
    },
    materialSel (data) {
      this.form.form = Object.assign({}, data)
      this.$emit('changeMenuData', this.form.form)
    },
    changePropText (text) {
      this.$emit('changeMenuData', this.form.form)
    }
  },
  watch: {
    data (newVal) {
      this.getFormData(newVal)
    },
    'data.comment': function (val) {
      this.getFormData(this.data)
    }
    // data: {
    //   deep: true,
    //   handler: function (newVal, oldVal) {
    //     this.getFormData(newVal)
    //   }
    // }
  },
  mounted () {
    this.getFormData(this.data)
  }
}
</script>

<style lang="scss">
.preview-box-index{
  flex: 1;
  .prev-box{
    max-width: 1100px;
    min-width: 615px;
    padding: 0 20px;
    background-color: #F5F7FA;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    min-height: 582px;
    margin-left: 30px;
    box-sizing: border-box;
    &__form{
      padding-top: 20px;
      .el-form-item__error{
        position: relative;
      }
    }
    &__flex{
      display: flex;
    }
    &__title{
      flex: 1;
    }
    &__delete{
      flex: 1;
      text-align: right;
      cursor: pointer;
    }
    .el-form-item{
      margin-bottom: 10px !important;
      .el-radio{
        line-height: 2 !important;
      }
    }
  }
}
</style>
