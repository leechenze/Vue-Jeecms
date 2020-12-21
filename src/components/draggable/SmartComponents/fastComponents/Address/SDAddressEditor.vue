<template>
  <div class="s-address-editor-container s-draggable-editor">
    <base-form
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
          class="s-checkbox-single default">设置默认值</el-checkbox>
          <transition name="fade" mode="out-in">
      <div class="address-wrap" v-if="value.isSetDefault">
        <!-- <el-select
          class="option-item"
          size="small"
          popper-class="jee-border"
          v-model="value.defaultValue.provinceCode"
          :popper-append-to-body="false"
          placeholder="省"
          clearable
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
          v-model="value.defaultValue.cityCode"
          :popper-append-to-body="false"
          placeholder="市"
          clearable
          @change="handleChangeCity"
        >
          <el-option
            v-for="option in getCitys(value.defaultValue.provinceCode) || []"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
        <el-select
          class="option-item"
          size="small"
          clearable
          popper-class="jee-border"
          v-model="value.defaultValue.areaCode"
          :popper-append-to-body="false"
          placeholder="区"
        >
          <el-option
            v-for="option in getCountrys(value.defaultValue.provinceCode, value.defaultValue.cityCode) || []"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select> -->
        <el-form-item  class="address-item">
            <el-cascader
              v-model="value.defaultValue.areaArry"
              class="address-cascader"
              ref="cascader"
              popper-class="jee-border"
              placeholder="请选择省市区"
              clearable
              :props="getCascaderProps"
              :options="areaOptions"
              :appendToBody="false"
              @change="handleChange"
            />
          </el-form-item>
        <el-input v-model="value.defaultValue.address"
          placeholder="详细地址"
          size="small"
          class="option-item"
          :maxlength="50"
        ></el-input>
      </div>
    </transition>
        </div>
      </template>

    </base-form>

  </div>
</template>

<script>
import editorMixin from '@/components/draggable/Mixin/editorMixin'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'NewDAddressEditor',
  mixins: [editorMixin],
  data () {
    return {
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
          prop: 'isRequired',
          label: '是否必填：',
          type: 'radio',
          class: 'width',
          options: this.$enums.boolYes
        },
        {
          prop: 'isSetDefault',
          label: '默认值：',
          type: 'slot',
          class: 'sm-height margin-bottom10 width'
        }
      ],
      rules: {
        isSetDefault: [
          {
            validator: this.addressValidator,
            trigger: ['blur', 'change', 'focus']
          }
        ],
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
  },
  computed: {
    ...mapGetters('system', ['getProvinces', 'getCitys', 'getCountrys']),
    ...mapGetters(['areaOptions']),
    getCascaderProps () {
      return {
        checkStrictly: true,
        areaOptionss: []
      }
    }
  },
  methods: {
    ...mapActions('system', ['FetchSystemAreaTree']),
    addressValidator (rule, value, callback) {
      console.log(this.value.defaultValue)
      if (value) {
        if (this.value.defaultValue.areaArry.length >= 3 && this.value.defaultValue.address) {
          callback()
        } else {
          callback(new Error('请填写默认地址'))
        }
      } else {
        callback()
      }
    },
    handleChangeDefault (val) {
      if (!val) {
        this.value.defaultValue = {
          provinceCode: '',
          cityCode: '',
          areaCode: '',
          address: '',
          areaArry: []
        }
      }
    },
    handleChange (val, data) {
      this.value.defaultValue.areaArry = val
    }
  },
  mounted () {
    this.FetchSystemAreaTree()
    // this.$nextTick(() => {
    //   this.areaOptionss = this.areaOptionss
    // })
  }
}
</script>

<style lang="scss">
.s-address-editor-container{
  .address-wrap{
    width: 320px;
    .el-input__inner{
      width: 100%;
    }
    .option-item{
      line-height: 32px;
      width: 100%;
      padding-bottom: 0;
      &.el-select{
        padding-bottom: 10px;
      }
    }
  }
  .option-wrap{
    .s-checkbox-single{
      line-height: 14px;
      padding-bottom: 0px;
      .el-checkbox__inner {
          border-radius: 2px;
      }
    }
  }
  .form-item-wrap{
    .el-form-item__content{
      margin-left: 0 !important;
    }
    .el-form-item__label-wrap{
      // margin-bottom: 9px;
      margin-left: 0 !important;
    }
    .el-input{
      margin-top: 9px;
    }
  }
  .el-form-item.address-item{
    margin-bottom: 0 !important;
  }
  .el-form.el-form--label-right .form-item-wrap:nth-child(4){
    .el-form-item{
      display: block;
    }
  }
}
</style>
