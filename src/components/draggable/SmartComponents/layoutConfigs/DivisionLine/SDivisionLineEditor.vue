<template>
  <base-form
    class="s-division-editor-container s-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :lineShow="true"
    label-position="top"
    :popperAppendToBody='false'
  >
  <template #borderStyle="scope">
    <div style="width:360px">
      <el-radio-group v-model="scope.form.borderStyle">
        <el-radio-button v-for="(item,index) in scope.item.options" :key="index"
          :label="item.label">{{item.text}}</el-radio-button>
      </el-radio-group>
    </div>
  </template>
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'
var options = [
  { label: '左对齐 ', value: 1 },
  { label: '居中对齐 ', value: 2 },
  { label: '右对齐 ', value: 3 }
]
export default {
  name: 'SDivisionLineEditor',
  mixins: [editorMixin],
  data () {
    return {
      options,
      formItems: [
        {
          prop: 'label',
          label: '标题：',
          maxlength: 15,
          placeholder: '请输入内容'
        },
        {
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50,
          placeholder: '请输入内容'
        },
        {
          prop: 'borderStyle',
          label: '线条样式：',
          type: 'slot',
          options: [
            { text: '——————————', label: 'solid' },
            { text: ' - - - - - - - - - - - - - - - - ', label: 'dashed' }
          ]
        },
        {
          prop: 'lineColor',
          label: '线条颜色：',
          type: 'color',
          class: 'width line',
          disInput: true,
          showAlpha: true
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
          prop: 'lineAilgn',
          label: '线条对齐方式：',
          type: 'radio',
          class: 'label-20',
          options: options
        },
        {
          prop: 'titleAilgn',
          label: '标题对齐方式：',
          type: 'radio',
          class: 'label-20',
          options: options
        },
        {
          prop: 'tipAilgn',
          label: '帮助信息对齐方式：',
          type: 'radio',
          class: 'label-20',
          options: options
        }
      ],
      rules: {
      }
    }
  }
}
</script>

<style lang="scss">
  .s-division-editor-container{
    .label-20{
      .el-form-item__label{
        padding-bottom: 15px !important;
      }
    }
  }
</style>
