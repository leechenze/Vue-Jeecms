<template>
  <base-form
    class="s-cascade-editor-container s-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    label-position="top"
    :popperAppendToBody='false'
  >
    <template #radioBtn="scope" class="p-but-all">
      <div class="p-radioBtn jee-bg-light" @click="bandRadioBut(scope.form)">{{scope.item.item}}</div>
    </template>
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'
export default {
  name: 'ScascadeEditor',
  mixins: [editorMixin],
  data () {
    return {
      labelWidth: '95px',
      formItems: [
        {
          prop: 'label',
          label: '字段名称：',
          maxlength: 15
        },
        {
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50
        },
        {
          prop: 'radioBtn',
          label: '选项内容：',
          type: 'slot',
          class: 'width scascaeBut',
          item: '编辑'
        },
        {
          prop: 'width',
          label: '组件宽度(%)：',
          type: 'number',
          class: 'width',
          step: 10,
          max: 100,
          min: 10
        },
        {
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
          class: 'width',
          options: this.$enums.boolYes
        },
        {
          prop: 'isRegister',
          label: '应用到会员注册：',
          type: 'radio',
          options: this.$enums.boolYes
        }
      ],
      rules: {
        label: [
          this.$rules.required()
        ],
        name: [
          this.$rules.enNumLine(),
          this.$rules.required()
        ],
        isRequired: [
          this.$rules.required()
        ],
        isRegister: [
          this.$rules.required()
        ]
      },
      itemShowHide: false
    }
  },
  methods: {

    /**
     * 级联下拉选择中的编辑点击事件
     * 把只值发送到父组件 editQues.vue
     *
     */
    bandRadioBut (item) {
      this.$emit('func', item)
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss">
.s-cascade-editor-container{
  .scascaeBut{
    height: 100% !important;
    .el-form-item__label{
      margin-top: 8px;
      line-height: 32px;
    }
    .el-form-item__content{
      width: 77px !important;
      // float: left;
      .el-radio-group{
        width: 77px;
        height: 32px;
        .el-radio-button{
          width: 100%;
          height: 100%;
          .el-radio-button__inner{
            width: 100%;
            height: 100%;
            line-height: 0.6
          }
        }
      }
    }

  }
  .p-radioBtn{
    width: 77px;
    height: 32px;
    font-size: 14px;
    text-align: center;
    line-height: 32px;
    // background: #1EC6DF;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    float: left;
  }
}

</style>
