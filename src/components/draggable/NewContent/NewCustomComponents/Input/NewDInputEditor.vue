<template>
  <base-form
    class="d-input-editor-container z-draggable-editor"
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
        <div class="rule-item" :class="{'is-length-limit': scope.form.isLengthLimit}">
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
  name: 'NewDInputEditor',
  mixins: [editorMixin],
  data () {
    return {
      formItems: [
        {
          prop: 'label',
          label: '字段名称：',
          maxlength: 50
        },
        {
          prop: 'name',
          label: '标签名称：',
          maxlength: 50
        },
        {
          prop: 'placeholder',
          label: '默认提示文字：',
          maxlength: 50
        },
        {
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50
        },
        {
          prop: 'rules',
          label: '填写限制：',
          type: 'slot',
          class: 'margin-bottom20',
          options: this.$enums.rulesMap
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
        max: [
          this.$rules.number(),
          this.$rules.rangeNum(1, 120)
        ],
        isRegister: [
          this.$rules.required()
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

<style lang="scss">
.z-draggable-editor{
  .rule-item + .rule-item.is-length-limit{
    margin-left: 0;
    padding-top: 25px;
  }
  .el-input__inner{
    width: 330px;
    height: 35px;
  }
  .rule-item{
    display: flex;
    flex-direction: column;
    align-items: flex-start !important;
    .el-checkbox__inner{
      width: 14px;
      height: 14px;
      border-radius: 2px;
    }
  }
  .rule-item-input{
    .el-select{
      margin-bottom: 10px;
    }
    .el-input__inner{
      width: 330px;
      height: 35px;
    }
  }
  .rule-item-length{
    height: 40px;
    width: 345px;
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
        top: 14px !important;
        left: 190px !important;
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
