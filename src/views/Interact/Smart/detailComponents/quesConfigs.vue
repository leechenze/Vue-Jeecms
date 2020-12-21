<template>
  <section class="ques-config-wrap">
    <base-form
        ref="form"
        v-bind="form"
        v-on:handleConfirmClose="handleConfirmClose"
        v-on:handleConfirm="handleConfirm"
      >
      <template #title="scope">
        <el-input v-model="tempTitle" @input="testChange" ref="agin"
          placeholder="请输入题目内容" @focus="setFocus($event)" maxlength="50" class="jee-text-select"></el-input>
      </template>
      <template #prompt="scope">
        <div class="detail-config t-flex">
          <el-select v-model="scope.form.type" class="detail-select" popper-class="jee-border">
            <el-option
              v-for="opt in quesTypes"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
          <el-checkbox class="detail-check" v-model="scope.form.isAnswer" label="必答"></el-checkbox>
          <el-input maxlength="50" class="flex-1" v-model="scope.form.prompt" placeholder="答案提示"></el-input>
        </div>
      </template>
      <template #option="scope">
        <option-set v-model="scope.form.optionAll[scope.form.type]" :setType="scope.form.type"></option-set>
      </template>
    </base-form>
  </section>
</template>
<script>
import baseForm from '@/components/mixins/baseForm'
import optionSet from './optionSet'
import { deepClone } from '@/utils'

export default {
  name: 'ques-configs',
  mixins: [baseForm],
  components: {
    optionSet
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number,
      default: -1
    }
  },
  computed: {
    option: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    'form.form': {
      deep: true,
      handler (newVal, oldVal) {
        this.getDataList(newVal)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setDataList(this.value)
    })
  },
  data () {
    return {
      quesTypes: [
        {
          label: '单选题',
          value: 1
        },
        {
          label: '多选题',
          value: 2
        },
        {
          label: '问答题',
          value: 3
        },
        {
          label: '下拉题',
          value: 4
        },
        {
          label: '级联题',
          value: 5
        },
        {
          label: '附件题',
          value: 6
        }
      ],
      form: {
        labelWidth: '0px',
        form: {
          optionAll: [{}],
          type: 0
        },
        rules: {
          title: [
            this.$rules.required('此项必填', '', 'blur')
          ]
        },
        submitBtns: [
          { text: this.$t('global.cancel'), subType: 'Close', type: 'default', class: 't-text-right' },
          { text: this.$t('global.save'), subType: 'submit' }],
        formItems: [
          {
            prop: 'title',
            placeholder: '请输入题目内容',
            maxlength: 50,
            type: 'slot'
          },
          {
            prop: 'prompt',
            type: 'slot'
          },
          {
            prop: 'option',
            type: 'slot'
          }
        ]
      },
      isEmit: true,
      optConfig: {
        column: 1, // 每行列数
        inputLimit: false, // 是否限制输入类型
        inputNumLimit: false, // 是否限制输入字数
        inputType: '', // 输入限制
        inputNum: 150, // 限制字数
        inputWidth: '100', // 输入框宽度
        inputHeight: 36, // 输入框高度
        isRadio: 1, // 是否单选-下拉题
        fileSizeLimit: false, // 附件大小限制
        fileNumLimit: true, // 附件数量限制
        fileTypeLimit: false, // 附件类型限制
        fileSize: '', // 附件大小
        fileUnit: 'KB',
        fileNum: 1, // 附件数量
        fileTypeSet: 0, // 附件类型
        fileTypes: '', // 附件类型
        options: []
      },
      tempForm: {}, // 临时保存form数据，用于在点击取消按钮的时候重新赋值
      tempTitle: ''
    }
  },
  methods: {
    setFocus (e) {
      this.$refs.agin.select()// 自动选中
    },
    testChange (e) {
      this.option.title = e
      this.option.value.label = e
      this.form.form.title = e
      this.form.form.value.label = e
    },
    handleConfirmClose () {
      // 如果取消，则把原始数据重新赋值
      this.getDataList(this.tempForm)
      this.$emit('close', true, this.index)
    },
    handleConfirm (data) {
      // 如果是保存，更新原始数据
      this.tempForm = deepClone(this.form.form)
      this.$emit('close', true, this.index)
    },
    getGroupType (type) {
      let arr = ['Radio', 'Check', 'Question', 'Select', 'Cascade', 'File']
      let obj = {}
      obj.editor = 'V' + arr[type - 1] + 'Editor'
      obj.preview = 'V' + arr[type - 1] + 'Preview'
      return obj
    },
    setDataList (data) {
      let obj = data
      obj.title = data.title || data.value.label
      obj.type = data.groupIndex
      obj.prompt = data.prompt || ''
      obj.option = Object.assign(this.optConfig, data.option)
      let loop = function (data) {
        if (data instanceof Array) {
          return data.map((v, i) => {
            if (v.children && v.children.length) {
              v.children = loop(v.children)
            }
            return {
              name: v.name, // 单个选项
              pic: v.pic || '', // 图片id
              picUrl: v.picUrl || '',
              isDefault: v.isDefault, // 是否默认
              isRequired: v.isRequired, // 是否必填
              isEemty: v.isEemty,
              children: v.children || [],
              sortNum: v.sortNum, // 排序
              id: v.id || ''
            }
          })
        } else {
          return []
        }
      }
      obj.option.options = obj.option.options || obj.value.options ? (obj.option.options
        ? loop(obj.option.options) : obj.value.options.map((t, i) => {
          return {
            name: t.label, // 单个选项
            pic: t.pic || '', // 图片id
            picUrl: t.picUrl || '',
            isDefault: t.isDefault || false, // 是否默认
            isRequired: t.isRequired || false, // 是否必填
            isEemty: t.isEemty || false,
            sortNum: i + 1, // 排序
            id: t.id || ''
          }
        })) : [
        {
          name: '选项1', // 单个选项
          pic: '', // 图片id
          isDefault: false, // 是否默认
          isRequired: false, // 是否必填
          isEemty: false,
          sortNum: 1 // 排序
        }
      ]
      obj.optionAll = [{}, obj.option, obj.option, obj.option, obj.option, obj.option, obj.option]
      this.form.form = obj
      // 保存一份原始数据
      this.tempForm = deepClone(obj)
      // 临时标题
      this.tempTitle = this.form.form.title
    },
    getDataList (data) {
      let obj = deepClone(data)
      obj.value.label = data.title
      obj.groupIndex = data.type
      obj.value.defaultValue = obj.groupIndex === 3 ? '' : ((obj.groupIndex === 5 || obj.groupIndex === 6) ? (obj.groupIndex === 6 ? [] : ['']) : { value: '' })
      obj.editor = this.getGroupType(data.type).editor
      obj.preview = this.getGroupType(data.type).preview
      obj.option = Object.assign(this.optConfig, data.optionAll[data.type])
      obj.value.options = data.optionAll[data.type].options ? data.optionAll[data.type].options.map((t, i) => {
        return {
          label: t.name,
          value: t.sortNum,
          ...t
        }
      }) : []
      this.option = obj
    }
  }
}
</script>
<style lang="scss">
  .ques-config-wrap{
    .el-form{
      &-item{
        margin-bottom: 10px !important;
        &:last-of-type{
          // margin-top: 20px;
        }
      }
    }
    .el-input{
        max-width: 100%;
    }
    .detail-config{
      .detail-select{
        width: 115px;
      }
      .detail-check{
        margin: 0 20px;
      }
    }
  }
</style>
