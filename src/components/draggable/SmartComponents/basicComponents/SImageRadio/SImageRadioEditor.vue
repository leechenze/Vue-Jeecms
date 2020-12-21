<template>
  <base-form
    class="s-image-radio-editor-container s-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
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
                  <div class="option-radio option-radio-gender option-radio-gender-img">
                    <el-input v-model="scope.form.options[index].label" size="small" :maxlength="50"></el-input>
                  </div>
                </el-radio>
                <div class="option-radio-icon icon flex">
                  <jee-icon iconClass="jia1" class="jee-hover-fill option-radio-icons"  @click.stop="handleAddOption(index)"></jee-icon>
                  <jee-icon iconClass="jianqu" class="jee-hover-fill option-radio-icons" @click.stop="()=>handleDelOption(index)"></jee-icon>
                  <jee-icon iconClass="tuozhuai" class="jee-hover-fill move option-radio-icons"></jee-icon>
                  <!-- <image-upload class="option-radio-image" v-model="scope.form.options[index]"></image-upload>  -->
                  <div class="img-up-wrap">
                    <image-upload class="svg-show" v-model="scope.form.options[index]"></image-upload>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
          <!-- <div class="other-option-wrap">
            <el-checkbox v-model="scope.form.isOtherOption" class="s-checkbox-single default">添加其他选项</el-checkbox>
            <transition name="fade">
              <div v-if="scope.form.isOtherOption" class="other-option">
                <el-input v-model="scope.form.otherOptionLabel" size="small" :maxlength="50"></el-input>
                <el-checkbox v-model="scope.form.isOtherOptionRequired" class="s-checkbox-single default">此项必填</el-checkbox>
              </div>
            </transition>
          </div> -->
        </el-radio-group>
      </div>
    </template>
  </base-form>
</template>

<script>
import dragOptionEditorMixin from '@/components/draggable/Mixin/dragOptionEditorMixin'
import imageUpload from './imageUpload'
export default {
  name: 'NewDRadioEditor',
  components: {
    imageUpload
  },
  mixins: [dragOptionEditorMixin],
  data () {
    return {
      labelWidth: '95px',
      formItems: [
        {
          prop: 'label',
          label: '标题：',
          maxlength: 15
        },
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
          prop: 'column',
          label: '选项列数：',
          type: 'radioBtn',
          class: 'smart-image-radio-bottom',
          size: 'medium',
          options: [
            {
              label: '一列',
              value: 1
            },
            {
              label: '二列',
              value: 2
            },
            {
              label: '三列',
              value: 3
            },
            {
              label: '四列',
              value: 4
            }
          ]
        },
        {
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
          class: 'width imgRadioRequired',
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
        ]
      }
    }
  }
}
</script>
<style lang="scss">
  .s-image-radio-editor-container.s-draggable-editor{
    .el-form-item.radio-btn{
      height: auto;
    }
    .smart-image-radio-bottom{
      .el-form-item__label{
        display: block;
        width: 100%;
      }
      .el-form-item__content{
        .el-radio-group{
          display: block;
          text-align: center;
        }
      }
    }
    .el-radio{
      margin-right: 0px;
    }
    .option-wrap{
      .ghost{
        border: none;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 20px;
        padding: 0 10px ;
        background-color: rgba(255,255,255,0.7);
        border-radius: 4px;
      }
      .option-item.new-cont-option.flex{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 0;
        padding-top: 5px !important;
        padding-bottom: 5px !important;
        label {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .option-radio-icon.flex{
          margin-left: 0px;
          display:flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0px;
          & >svg {
            margin: 0px;
            padding-left: 10px;
            fill: #787878;
            cursor: pointer;
          }
          .img-up-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px dashed #E2E2E2;
            width: 38px;
            height: 38px;
            border-radius: 4px;
            margin-left: 10px;
            cursor: pointer;
            &:hover{
              border: 1px dashed #1EC6DF;
            }
            & > .svg-show {
              margin-left: 0;
              .upload-img{
                background: #f0f0f0;
              }
              .upload-btn{
                padding-top: 0;
                border: none;
                width: 24px;
                height: 24px;
                svg {
                  font-size: 24px;
                  fill: #B2B2B2;
                  margin: auto;
                  &:hover{
                    color: #B2B2B2;
                    fill: #B2B2B2 !important;
                  }
                }
              }
            }
          }
        }
        .option-radio-input{
          width: 177px;
          .el-input__inner{
            height: 35px;
            line-height: 35px;
          }
        }
      }
      .sortable-drag{
        display: none !important;
      }
    }
  }
</style>
