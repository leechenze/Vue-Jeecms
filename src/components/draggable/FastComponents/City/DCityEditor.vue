<template>
  <base-form
    class="d-city-editor-container z-draggable-editor"
    ref="baseForm"
    :showSubmitButton="false"
    :form="value"
    :formItems="getFormItems"
    :labelWidth="labelWidth"
    :rules="rules"
    :popperAppendToBody='false'
  >
    <template #default="scope">
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
  name: 'DCityEditor',
  mixins: [editorMixin],
  data () {
    return {
      labelWidth: 'auto',
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
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
          options: this.$enums.boolYes
        },
        {
          prop: 'default',
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
        ]
      }
    }
  },
  computed: {
    ...mapGetters('system', ['getProvinces', 'getCitys'])
  },
  methods: {
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
.d-city-editor-container{
  .option-wrap{
    .z-checkbox-single{
      line-height: 14px;
      padding-bottom: 20px;
    }
    .option-item{
      line-height: 32px;
      &.el-select:first-of-type{
        padding-bottom: 20px;
      }
    }
  }
}
</style>
