<template>
  <section class="s-city-preview s-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      v-if="deviceTab === 2"
    >

      <div class="area-wrap">
        <el-form-item :prop="`${option.name}.provinceCode`"
          :rules="getRules" class="address-item">
          <el-cascader
            v-model="val"
            class="address-cascader"
            ref="cascader"
            popper-class="jee-border"
            placeholder="请选择省市"
            clearable
            :props="getCascaderProps"
            :options="areaOptions"
            :appendToBody="false"
            @change="handleChange"
          />
        </el-form-item>
      </div>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      v-else
      class="s-city-preview-mobile"
    >

      <div class="area-wrap">
        <el-form-item :prop="`${option.name}.provinceCode`"
          :rules="getRules" class="address-item">
          <el-cascader
            v-model="val"
            class="address-cascader"
            ref="cascader"
            popper-class="jee-border"
            placeholder="请选择省市"
            clearable
            :props="getCascaderProps"
            :options="areaOptions"
            :appendToBody="false"
            @change="handleChange"
            style="width: 100%;"
          />
        </el-form-item>
      </div>
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
  name: 'SCityPreview',
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
          value.push(this.value.provinceCode)
          if (this.value.cityCode) {
            value.push(this.value.cityCode)
            if (this.value.areaCode) {
              value.push(this.value.areaCode)
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
  watch: {
    val (newVal) {
      // this.getNum(this.val)
      // parseInt
    }
  },
  methods: {
    ...mapActions('system', ['FetchSystemAreaTree']),
    handleChange (val) {
      this.$refs.cascader.dropDownVisible = false
    },
    handleChangeProvince (val) {
      this.$emit('input', {
        ...this.val,
        provinceCode: val,
        cityCode: ''
      })
    },
    getNum (val) {
      // console.log(val)
      let obj = {}
      for (let item in val) {
        this.form[this.option.name][item] = val[item] ? parseInt(val[item]) : ''
      }
      return obj
    }
  },
  mounted () {
    this.FetchSystemAreaTree()
    // this.getNum(this.val)
  }
}
</script>

<style lang="scss" scoped>
.s-city-preview.s-draggable-preview{
  >.el-form-item{
    /*padding-bottom: 5px;*/
  }
  .s-city-preview-mobile{
    .address-cascader{
      width: 100%;
    }
    .el-form-item.address-item{
      width: 100%;
      margin-right: 0;
    }
  }
}
.s-city-preview .el-form-item{
  .area-wrap{
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}

</style>
