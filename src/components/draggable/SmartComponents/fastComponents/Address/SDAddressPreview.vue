<template>
  <section class="s-address-preview s-draggable-preview">
    <el-form-item
      :label="option.label"
      class="el-form-item__addr"
      :prop="option.name"
      :rules="getRules"
      v-if="deviceTab === 2"
    >
      <div class="address-wrapper">
        <div class="address-wrap">
          <el-form-item :prop="`${option.name}.provinceCode`"
          :rules="getRules" class="address-item">
            <el-cascader
              v-model="val"
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

          <el-form-item label-width="0" :prop="`${option.name}.address`" :rules="getRules">
            <el-input class="address-detail" v-model="form[option.name].address" placeholder="详细地址" :maxlength="50"></el-input>
          </el-form-item>
        </div>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </div>
    </el-form-item>
    <el-form-item
      :label="option.label"
      class="el-form-item__addr smart-mobile-site"
      :prop="option.name"
      :rules="getRules"
      v-else
    >
      <div class="address-wrapper">
        <div class="address-wrap">
          <el-form-item :prop="`${option.name}.provinceCode`"
          :rules="getRules" class="address-item">
            <el-cascader
              v-model="val"
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
          <el-form-item label-width="0" :prop="`${option.name}.address`">
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
        const value = this.value.areaArry
        // console.log('地址：' + this.value)
        // if (this.value.provinceCode) {
        //   value.push(parseInt(this.value.provinceCode))
        //   if (this.value.cityCode) {
        //     value.push(parseInt(this.value.cityCode))
        //     if (this.value.areaCode) {
        //       value.push(parseInt(this.value.areaCode))
        //     }
        //   }
        // }
        return value
      },
      set (val) {
        const value = {
          provinceCode: '',
          cityCode: '',
          areaCode: '',
          areaArry: [],
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
.s-address-preview{
  .el-form-item{
    .address-wrapper {
      display: flex;
      flex-direction: column;
      .address-wrap {
        display: flex;
        .el-form-item{
          width: calc(100% - 210px);
        }
        .address-item{
          width: 200px;
          margin-right: 10px;
          .el-form-item__content{
            width: 100%;
            .address-cascader.el-cascader{
              width: 100%;
              .el-input{
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
  .el-form-item.smart-mobile-site{
    .address-wrapper {
      display: flex;
      flex-direction: column;
      .address-wrap {
        display: flex;
        flex-wrap: wrap;
        .el-form-item{
          width: 100%;
        }
        .address-cascader.el-cascader{
            width: 100%;
          }
        .address-item{
          max-width: 100%;
          margin-right: 0;
          margin-bottom: 10px;

        }
      }
    }
  }
}
</style>
