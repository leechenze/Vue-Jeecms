<template>
  <section class="s-code-preview s-draggable-preview">
    <div v-if="deviceTab === 2">
      <el-form-item
        :label="option.label"
        :prop="option.name"
        :rules="getRules"
      >
        <div class="t-flex" :style="{width:option.width+'%'}">
          <el-input
            autocomplete='new-password'
            v-model="val"
            :label="option.label"
            :placeholder="option.placeholder"
            :maxlength="option.isLengthLimit ? option.max : 120"
            :disabled="option.disabled"
            :type="inputType"
          ></el-input>
          <div class="input-code">
            <img class="t-img" src="../../../../../assets/img/code.png" />
          </div>
        </div>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </el-form-item>
    </div>
    <div v-else class="smart-mobile-box">
      <el-form-item
        :label="option.label"
        :prop="option.name"
        :rules="getRules"
      >
        <div class="t-flex">
          <el-input
            autocomplete='new-password'
            v-model="val"
            :label="option.label"
            :placeholder="option.placeholder"
            :maxlength="option.isLengthLimit ? option.max : 120"
            :disabled="option.disabled"
            :type="inputType"
          ></el-input>
          <div class="input-code">
            <img class="t-img" src="../../../../../assets/img/code.png" />
          </div>
        </div>
        <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
      </el-form-item>
    </div>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'

export default {
  name: 'SCodePreview',
  mixins: [previewMixin],
  data () {
    return {
      inputType: 'text'
    }
  }
}
</script>
<style lang="scss">
  .s-code-preview{
    .input-code{
      width: 124px;
      height: 38px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      text-align: center;
      margin-left: 5px;
      background-color: #ffffff;
      overflow: hidden;
      .t-img{
        height: 100%;
      }
    }
  }
</style>
