<template>
  <section class="d-address-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <div class="area-wrap">
        <el-form-item label-width="0"
          :prop="`${option.name}.provinceCode`"
          :rules="getRules"
        >
          <!-- 省 -->
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
          <!-- 市 -->
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
          <!-- 县 -->
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
      </div>
      <el-form-item label-width="0"
        :prop="`${option.name}.address`"
        :rules="getRules"
      >
        <el-input v-model="form[option.name].address" placeholder="详细地址" :maxlength="50"></el-input>
      </el-form-item>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'DAddressPreview',
  mixins: [previewMixin],
  computed: {
    ...mapGetters('system', ['getProvinces', 'getCitys', 'getCountrys'])
  },
  watch: {
    val (newVal) {
      console.log(newVal)
      this.getNum(this.val)
      // parseInt
    }
  },
  methods: {
    ...mapActions('system', ['FetchSystemAreaTree']),
    handleChangeProvince (val) {
      this.$emit('input', {
        ...this.val,
        provinceCode: val,
        cityCode: '',
        areaCode: ''
      })
    },
    handleChangeCity (val) {
      this.$emit('input', {
        ...this.val,
        cityCode: val,
        areaCode: ''
      })
    },
    getNum (val) {
      let obj = {}
      for (let item in val) {
        if (item === 'address') {
          this.form[this.option.name][item] = val[item]
        } else {
          this.form[this.option.name][item] = val[item] ? parseInt(val[item]) : ''
        }
      }
      return obj
    }
  },
  mounted () {
    this.FetchSystemAreaTree()
    this.getNum(this.val)
  }
}
</script>

<style lang="scss">
.d-address-preview .el-form-item{
  .el-form-item{
    margin-bottom: 0!important;
  }
  .area-wrap{
    padding-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
      width: 130px;
      margin-right: 10px;
      padding-bottom: 10px;
    }
    .el-input{
      max-width: 414px;
    }
  }
}
</style>
