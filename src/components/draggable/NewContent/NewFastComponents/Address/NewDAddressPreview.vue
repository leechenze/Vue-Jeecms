<template>
  <section class="d-address-preview z-draggable-preview new-content">
    <el-form-item
      :label="option.label"
      class="el-form-item__addr"
      :prop="option.name"
      :rules="getRules"
    >
      <!-- <div class="area-wrap">
        <el-form-item label-width="0"
          :prop="`${option.name}.provinceCode`"
          :rules="getRules"
        >
          <el-select
            v-model="form[option.name].provinceCode"
            popper-class="jee-border"
            placeholder='请选择'
            :clearable="true"
            @change="handleChangeProvince"
            :popperAppendToBody='false'
          >
            <el-option
              v-for="opt in getProvinces || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0"
          :prop="`${option.name}.cityCode`"
          :rules="getRules"
        >
          <el-select
            v-model="form[option.name].cityCode"
            popper-class="jee-border"
            placeholder='请选择'
            :clearable="true"
            @change="handleChangeCity"
            :popperAppendToBody='false'
          >
            <el-option
              v-for="opt in getCitys(form[option.name].provinceCode) || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0"
          :prop="`${option.name}.areaCode`"
          :rules="getRules"
        >
          <el-select
            v-model="form[option.name].areaCode"
            popper-class="jee-border"
            :clearable="true"
            placeholder='请选择'
            :popperAppendToBody='false'
          >
            <el-option
              v-for="opt in getCountrys(form[option.name].provinceCode, form[option.name].cityCode) || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>-->
      <div class="address-wrapper">
        <div class="address-wrap">
          <el-form-item :prop="`${option.name}.provinceCode`"
          :rules="getRules" class="address-item">
            <el-cascader
              v-model="val"
              class="address-cascader"
              ref="cascader"
              popper-class="jee-border"
              placeholder="请选择"
              clearable
              :props="getCascaderProps"
              :options="areaOptions"
              :appendToBody="false"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label-width="0" :prop="`${option.name}.address`" :rules="getRules">
            <el-input class="address-detail" v-model="form[option.name].address" placeholder="详细地址" :maxlength="50"></el-input>
          </el-form-item>
        </div>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NewDAddressPreview',
  mixins: [previewMixin],
  computed: {
    ...mapGetters(['areaOptions']),
    getCascaderProps () {
      return {
        checkStrictly: true,
        areaOptionss: []
      }
    },
    val: {
      get () {
        const value = []
        if (this.value.provinceCode) {
          value.push(parseInt(this.value.provinceCode))
          if (this.value.cityCode) {
            value.push(parseInt(this.value.cityCode))
            if (this.value.areaCode) {
              value.push(parseInt(this.value.areaCode))
            }
          }
        }
        return value
      },
      set (val) {
        const value = {
          provinceCode: '',
          cityCode: '',
          areaCode: '',
          address: this.value.address
        }
        if (Array.isArray(val) && val.length) {
          value.provinceCode = val[0]
          if (val.length > 1) {
            value.cityCode = val[1]
          }
          if (val.length > 2) {
            value.areaCode = val[2]
          }
        }
        this.$emit('input', value)
      }
    }
  },
  methods: {
    ...mapActions('system', ['FetchSystemAreaTree']),
    handleChange (val) {
      this.$refs.cascader.dropDownVisible = false
    }
  },
  watch: {
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
.d-address-preview.new-content .el-form-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-form-item__content{
    margin-left: 0 !important;
    width: 100%;
  }
  .el-form-item__label{
    flex-shrink: 0;
  }
  .address-wrapper {
    display: flex;
    flex-direction: column;
    // align-items: center;
    // flex-wrap: wrap;
  }
  .el-form-item {
    margin-bottom: 0 !important;
    padding: 0 !important;
    flex: 1;
    .el-form-item__content{
      width: 100%;
      line-height: 35px;
      // margin-left: 0 !important;
    }
  }
  .address-cascader {
    max-width: 414px;
    margin-bottom: 10px;
    line-height: 35px;
  }
  .address-detail {
    .el-input__inner {
      padding-right: 0 !important;
    }
  }
}
.model-left-label:not(.widgetBr) {
  .d-address-preview.new-content >.el-form-item {
    .address-wrap {
      display: flex;
      flex-wrap: wrap;
    }
    .address-cascader{
      margin-right: 10px;
      margin-bottom: 0px;
    }
    .el-form-item{
      margin-left: 30px;
      &:first-child{
        margin-left: 0;
      }
    }
    >.el-form-item{
      margin-left: 0px;
    }
  }
}
</style>
