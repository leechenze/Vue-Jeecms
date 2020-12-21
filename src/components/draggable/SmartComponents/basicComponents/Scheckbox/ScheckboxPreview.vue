<template>
  <section class="s-checkbox-preview s-draggable-preview">
    <el-form-item
      v-if="deviceTab === 2"
      :label="option.label"
      :prop="option.name"
      :rules="isValidator ? getMyRules : []"
      :required="option.isRequired"
      :class="{'sm-height': !option.isOtherOption}"
    >
      <el-checkbox-group class="s-checkbox-group value" v-model="form[option.name].value" >
        <el-checkbox v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value" :style="deviceTab === 2?{width: (100/option.radioBtns)+'%', marginRight: '0'}:{width: '50%', marginRight: '0'} ">
          {{opt.label}}
        </el-checkbox>
        <el-checkbox  :label="option.otherOption.value" v-if="option.isOtherOption" class="checkbox-item">
          {{option.otherOptionLabel}}
          <el-form-item label-width="0" class="t-inline">
            <el-input size="small"  class="line" :style="{width: '120px', marginLeft: '10px'}" v-model="form[option.name].otherValue" :maxlength="10"></el-input>
          </el-form-item>
        </el-checkbox>
      </el-checkbox-group>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
    <el-form-item
      v-else
      :label="option.label"
      :prop="option.name"
      :rules="isValidator ? getMyRules : []"
      :required="option.isRequired"
      :class="{'sm-height': !option.isOtherOption}"
    >
      <el-checkbox-group class="s-checkbox-group value phone-checkbox" v-model="form[option.name].value">
        <el-checkbox v-for="(opt, index) in getOptions || []" :key="index" :label="opt.value" style="width:100%; marginRight: 0;margin-bottom: 18px;">
          {{opt.label}}
        </el-checkbox>
        <el-checkbox  :label="option.otherOption.value" v-if="option.isOtherOption" class="checkbox-item">
          {{option.otherOptionLabel}}
          <el-form-item label-width="0" class="t-inline">
            <el-input size="small"  class="line" :style="{width: '120px', marginLeft: '10px'}" v-model="form[option.name].otherValue" :maxlength="10"></el-input>
          </el-form-item>
        </el-checkbox>
      </el-checkbox-group>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'ScheckboxPreview',
  mixins: [previewMixin],
  props: {
    value: {
      type: Object,
      default: () => ({
        value: [],
        otherValue: ''
      })
    },
    horizontal: {
      type: Boolean,
      default: true
    },
    cssConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style lang="scss">
.s-checkbox-preview{
  .el-form-item__label{
    line-height: 1;
  }
  .el-form-item__content{
    .el-form-item__error{
      display: none;
    }
  }
  .el-checkbox-group{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -18px !important;
    margin-left: -20px;
    .checkbox-item{
      .el-checkbox__label{
        display: flex;
      }
    }
    .el-checkbox{
      display: flex;
      padding-bottom: 0px !important;
      margin-bottom: 18px;
      .el-checkbox__input{
        margin-left: 20px;
        .el-checkbox__inner{
          margin-top: 3px;
        }
      }
      .el-checkbox__input{
        // padding-left: 20px;
      }
      .el-checkbox__label{
        white-space: normal;
        line-height: 20px !important;
        padding-left: 10px;
        color: #333;
      }
    }
  }

  .z-tip-form-item{
    padding-left: 23px !important;
    margin-top: 0px !important;
    padding-top: 7px !important;
  }
  .phone-checkbox{
    margin-bottom: -20px !important;
  }
}
</style>
