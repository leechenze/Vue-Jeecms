<template>
  <base-form
    class="s-city-editor-container s-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :popperAppendToBody='false'
  >
    <template #isSetDefault="scope">
      <div class="option-wrap">
        <el-checkbox v-model="scope.form.isSetDefault"
        @change="handleChangeDefault"
        class="z-checkbox-single default">设置默认值</el-checkbox>
        <transition name="fade" mode="out-in">
          <div class="address-wrap" v-if="scope.form.isSetDefault">
            <el-select
              class="option-item"
              size="small"
              popper-class="jee-border"
              v-model="scope.form.defaultValue.provinceCode"
              :popper-append-to-body="false"
              placeholder="省"
              @change="handleChangeProvince"
            >
              <el-option
                v-for="option in getProvinces || []"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
            <el-select
              class="option-item"
              size="small"
              popper-class="jee-border"
              v-model="scope.form.defaultValue.cityCode"
              :popper-append-to-body="false"
              placeholder="市">
              <el-option
                v-for="option in getCitys(scope.form.defaultValue.provinceCode) || []"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </div>
        </transition>
      </div>
    </template>
  </base-form>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'SCityEditor',
  mixins: [editorMixin],
  data () {
    return {
      // labelWidth: 'auto',
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
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
          options: this.$enums.boolYes
        },
        {
          prop: 'isSetDefault',
          label: '默认值：',
          type: 'slot',
          class: 'sm-height'
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
        ],
        isSetDefault: [
          {
            validator: this.addressValidator,
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('system', ['getProvinces', 'getCitys'])
  },
  methods: {
    addressValidator (rule, value, callback) {
      if (value) {
        if (this.value.defaultValue.cityCode && this.value.defaultValue.provinceCode) {
          callback()
        } else {
          callback(new Error('请选择省市'))
        }
      } else {
        callback()
      }
    },
    handleChangeDefault (val) {
      if (!val) {
        this.value.defaultValue = {
          provinceCode: '',
          cityCode: ''
        }
      }
    },
    handleChangeProvince (val) {
      this.value.defaultValue.cityCode = ''
    }
  }
}
</script>

<style lang="scss">
.s-city-editor-container{
  .option-wrap{
    .z-checkbox-single{
      line-height: 1;
      padding-bottom: 10px;
    }
    .option-item{
      line-height: 1;
      padding-bottom: 0;
      &.el-select:first-of-type{
        padding-bottom: 10px;
      }
    }
  }
  .el-form.el-form--label-right .form-item-wrap:nth-child(4){
    .el-form-item{
      display: block;
      .el-form-item__content{
        margin-top: -4px;
      }
    }
  }
}
</style>
