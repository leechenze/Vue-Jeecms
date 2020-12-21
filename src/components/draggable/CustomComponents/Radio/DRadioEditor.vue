<template>
  <base-form
    class="d-radio-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :popperAppendToBody='false'
  >
    <template #options="scope">
      <div class="option-wrap">
        <el-radio-group v-model="scope.form.defaultValue.value" v-on="$listeners">
          <draggable
            v-model="scope.form.options"
            v-bind="options"
            class="widget-form-list"
          >
            <template v-for="(option, index) in scope.form.options || []">
              <div class="option-item" :key="index" >
                <el-radio :label="option.value">
                  <div class="option-radio">
                    <el-input v-model="scope.form.options[index].label" size="small" :maxlength="50"></el-input>
                    <div>
                      <jee-icon iconClass="jianqu" class="jee-hover-fill" @click="()=>handleDelOption(index)"></jee-icon>
                      <jee-icon iconClass="tuozhuai" class="jee-hover-fill move"></jee-icon>
                    </div>
                  </div>
                </el-radio>
              </div>
            </template>
          </draggable>
          <el-button class="btn-add btn-default" type="empty" @click="handleAddOption">
            <jee-icon iconClass="jia1"></jee-icon>
            <span>添加选项</span>
          </el-button>
          <div class="other-option-wrap">
            <el-checkbox v-model="scope.form.isOtherOption" class="z-checkbox-single default">添加其他选项</el-checkbox>
            <transition name="fade">
              <div v-if="scope.form.isOtherOption" class="other-option">
                <el-input v-model="scope.form.otherOptionLabel" size="small" :maxlength="50"></el-input>
                <el-checkbox v-model="scope.form.isOtherOptionRequired" class="z-checkbox-single default">此项必填</el-checkbox>
              </div>
            </transition>
          </div>
        </el-radio-group>
      </div>
    </template>
  </base-form>
</template>

<script>
import dragOptionEditorMixin from '@/components/draggable/Mixin/dragOptionEditorMixin'

export default {
  name: 'DRadioEditor',
  mixins: [dragOptionEditorMixin],
  data () {
    return {
      labelWidth: '95px',
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
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50
        },
        {
          prop: 'options',
          label: '选项内容：',
          type: 'slot'
        },
        {
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
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
      }
    }
  }
}
</script>
