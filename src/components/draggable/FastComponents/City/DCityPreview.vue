<template>
  <section class="d-city-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <div class="area-wrap">
        <el-form-item label-width="0px"
          :prop="`${option.name}.provinceCode`"
          :rules="getRules"
        >
          <!-- 省 -->
          <el-select
            v-model="form[option.name].provinceCode"
            popper-class="jee-border"
            placeholder='请选择'
            clearable
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
          ><!-- 市 -->
          <el-select
            v-model="form[option.name].cityCode"
            popper-class="jee-border"
            placeholder='请选择'
            clearable
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
  name: 'DCityPreview',
  mixins: [previewMixin],
  computed: {
    ...mapGetters('system', ['getProvinces', 'getCitys'])
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
        cityCode: ''
      })
    },
    getNum (val) {
      let obj = {}
      for (let item in val) {
        this.form[this.option.name][item] = val[item] ? parseInt(val[item]) : ''
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

<style lang="scss" scoped>
.d-city-preview.z-draggable-preview{
  >.el-form-item{
    padding-bottom: 5px;
  }
}
.d-city-preview .el-form-item{
  .area-wrap{
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
      width: 130px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
