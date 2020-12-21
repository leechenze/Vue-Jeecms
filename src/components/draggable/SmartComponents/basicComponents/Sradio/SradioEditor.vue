<template>
  <base-form
    class="s-radio-editor-container s-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :rules="rules"
    label-position="top"
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
              <div class="option-item new-cont-option flex" :key="index" >
                <el-radio :label="option.value">
                  <div class="option-radio option-radio-gender">
                    <el-input v-model="scope.form.options[index].label" size="small" :maxlength="50"></el-input>
                  </div>
                </el-radio>
                <div class="icon flex">
                  <jee-icon iconClass="jia1" class="jee-hover-fill"  @click="handleAddOption(index)"></jee-icon>
                  <jee-icon iconClass="jianqu" class="jee-hover-fill" @click="()=>handleDelOption(index)"></jee-icon>
                  <jee-icon iconClass="tuozhuai" class="jee-hover-fill move"></jee-icon>
                </div>
              </div>
            </template>
          </draggable>
          <el-button v-show="!scope.form.options.length" class="btn-add btn-default" type="empty" @click="handleAddOption">
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
    <template #radioBtns="scopes">
      <div class="option-wrap">
        <template v-for="(option, index) in scopes.form.radioBtns || []">
          <div class="option-item new-cont-option" :key="index" >
            <el-row :label="option.value" >
              <el-button>{{option.label}}</el-button>
            </el-row>
          </div>
        </template>
      </div>
    </template>
  </base-form>
</template>

<script>
import dragOptionEditorMixin from '@/components/draggable/Mixin/dragOptionEditorMixin'

export default {
  name: 'SradioEditor',
  mixins: [dragOptionEditorMixin],
  data () {
    return {
      labelWidth: '95px',
      formItems: [
        {
          prop: 'label',
          label: '字段名称：',
          maxlength: 15
        },
        // {
        //   prop: 'name',
        //   label: '标签名称：',
        //   maxlength: 50
        // },
        {
          prop: 'tip',
          label: '帮助信息：',
          maxlength: 50
        },
        {
          prop: 'options',
          label: '选项内容：',
          class: 'margin-bottom25',
          type: 'slot'
        },
        {
          prop: 'radioBtns',
          label: '选择列数：',
          type: 'radioBtn',
          options: [
            {
              value: 1,
              label: '一列',
              width: 100
            },
            {
              value: 2,
              label: '二列',
              width: 50
            },
            {
              value: 3,
              label: '三列',
              width: 33.3
            },
            {
              value: 4,
              label: '四列',
              width: 25
            }
          ]
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
        // isRequired: [
        //   this.$rules.required()
        // ],
        isRegister: [
          this.$rules.required()
        ]
      }
    }
  }
}
</script>
<style lang="scss">
.s-radio-editor-container.s-draggable-editor{
  .option-item.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 10px !important;
    .el-radio {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0;
    }
    .el-radio__label {
      padding-left: 10px !important;
    }
  }
  .option-wrap {
    .btn-add {
      margin-bottom: 10px;
    }
  }
  .other-option {
    .el-input {
      margin-bottom: 10px;
    }
  }
  .icon.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    // margin-left: 10px;
    svg {
      fill: #787878;
      margin-left: 10px;
      cursor: pointer;
    }
  }
    .option-wrap{
      .btn-add{
        margin-bottom: 10px;
      }
      .option-item.new-cont-option{
        &:last-of-type{
          padding-bottom: 6px;
        }
      }
    }
    .radio-btn{
      height: 100% !important;
    }
    .form-item-wrap{
      .radio-btn{
        .el-form-item__content{
          .el-radio-button{
            height: 35px;
            line-height: 35px;
            .el-radio-button__inner{
              height: 100%;
              line-height: 35px;
              padding: 0 20px;
            }
          }
        }
      }
    }
  }
</style>
