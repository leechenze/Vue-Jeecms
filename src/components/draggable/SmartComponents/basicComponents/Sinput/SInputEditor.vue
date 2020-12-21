<template>
  <base-form
    class="s-input-editor-container s-draggable-editor"
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
    <template #rules="scope">
      <div class="rules-wrap">
        <div class="rule-item">
          <el-checkbox v-model="scope.form.isLengthLimit" class="z-checkbox-single default">限制字数</el-checkbox>
          <div class="rule-item-length"
            v-if="scope.form.isLengthLimit"
          >
            <el-form-item
              prop='max'
              style="marginBottom: 0"
            >
              <el-input-number
                v-model.number="scope.form.max"
                size="small"
                :min="1"
                :max="120"
              ></el-input-number>
              <span class="z-append-text" style="top: 7px;left: 190px;margin-top:0">请输入1-120间的整数</span>
            </el-form-item>
          </div>
        </div>
        <div class="rule-item">
          <!-- @change="handleChangeInputLimit" 由于报错，没有发现有使用到这个事件，暂时删除-->
          <el-checkbox @change="handleChangeInputLimit" v-model="scope.form.isInputLimit" class="z-checkbox-single default">输入限制</el-checkbox>
          <div class="rule-item-input">
            <el-select
              v-if="scope.form.isInputLimit"
              v-model="scope.form.inputLimit"
              size="small"
              :popper-append-to-body="false"
              placeholder="请选择">
              <el-option
                v-for="item in scope.item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'

export default {
  name: 'SInputEditor',
  mixins: [editorMixin],
  data () {
    return {
      formItems: [
        {
          prop: 'label',
          label: '字段名称：',
          maxlength: 15,
          placeholder: '请输入内容'
        },
        {
          prop: 'placeholder',
          label: '默认提示文字：',
          maxlength: 50,
          placeholder: '请输入内容'
        },
        {
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50,
          placeholder: '请输入内容'
        },
        {
          prop: 'rules',
          label: '填写限制：',
          type: 'slot',
          class: 'margin-bottom20',
          options: this.$enums.rulesMap
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
        max: [
          this.$rules.number(),
          this.$rules.rangeNum(1, 120)
        ]
      }
    }
  },
  methods: {
    // 判断是否有限制输入
    handleChangeInputLimit () {
      // 如没有，则情况限制条件
      if (!this.value.isInputLimit) {
        this.value.rules = []
        this.$emit('input', this.value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

  .rule-item-length{
    margin-top: 10px !important;
  }

</style>
<style lang="scss">
.s-draggable-editor{
  .rule-item + .rule-item.is-length-limit{
    margin-left: 0;
    padding-top: 25px;
  }
  .el-form-item:not(.line){
    .el-form-item__content{
      >.el-input,>.el-cascader,>.el-select{
        line-height: 35px;
        box-sizing: border-box;
        height: auto;
        .el-input__inner{
          line-height: 33px;
          height: auto;
        }
        .el-input__icon{
          line-height: 35px;
        }
      }
      .el-input__inner{
        width: 330px;
      }
    }
  }

  .rule-item{
    display: flex;
    flex-direction: column;
    align-items: flex-start !important;
    .el-checkbox{
      padding: 0;
      // padding-bottom: 4px;
    }
    .el-checkbox__inner{
      width: 14px;
      height: 14px;
      border-radius: 2px;
    }
  }
  .rule-item-input{
      margin-top: 10px !important;
    .el-select{
      // margin-bottom: 10px;
    }
    .el-input__inner{
      width: 330px;
    }
  }
  .rule-item-length{
    height: 40px;
    width: 345px;
    margin-bottom: 10px;
    .el-input-number{
      width: 180px;
    }
    .el-form-item{
      .el-input-number--small{
        width: 180px !important;
      }
    }
    .el-form-item__content{
      width: 345px;
      span.z-append-text{
        display: inline;
        margin-left: 5px;
      }
    }
    .el-input__inner{
      height: 40px;
      width: 180px !important;
      line-height: 40px;
      box-sizing: border-box;
    }
    .el-input-number__decrease,.el-input-number__increase{
      width: 40px;
      height: 37px;
      margin-top: 1px;
      line-height: 38px;
    }
  }
}
</style>
