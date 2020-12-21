<template>
  <section class="d-postcontent-preview z-draggable-preview">
    <el-form-item
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
      :required="option.isRequired"
    >
      <div class="content-wrap">
        <el-select
          v-model="form[option.name].issueOrg"
          popper-class="jee-border"
          placeholder='请选择'
          clearable
          :popperAppendToBody='false'
        >
          <el-option
            v-for="opt in issueOrgOptions || []"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value">
          </el-option>
        </el-select>
        <el-select
          v-model="form[option.name].issueYear"
          popper-class="jee-border"
          placeholder='请选择'
          clearable
          :popperAppendToBody='false'
        >
          <el-option
            v-for="opt in issueYearOptions || []"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value">
          </el-option>
        </el-select>
        <el-input
          class="index-input"
          v-model="form[option.name].issueNum"
          :placeholder="option.placeholder"
          :maxlength="30"
        ></el-input>
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
  name: 'DPostContentPreview',
  mixins: [previewMixin],
  computed: {
    ...mapGetters(['setting', 'issueOrgOptions', 'issueYearOptions']),
    getRules () {
      const { isRequired } = this.option
      let formItemRules = []
      if (isRequired) {
        formItemRules.push(this.$rules.requiredObject('issueOrg'))
        formItemRules.push(this.$rules.requiredObject('issueYear'))
        formItemRules.push(this.$rules.requiredObject('issueNum'))
      }
      return formItemRules
    }
  },
  methods: {
    ...mapActions('config', ['FetchIssueOrgOptions', 'FetchIssueYearOptions'])
  },
  mounted () {
    this.FetchIssueOrgOptions()
    this.FetchIssueYearOptions()
  }
}
</script>

<style lang="scss" scoped>
.d-postcontent-preview .el-form-item{
  padding: 20px;
  margin-bottom: 0!important;
  .content-wrap{
    display: flex;
    flex-wrap: wrap;
    .el-select{
      margin-right: 10px;
    }
  }
}
</style>
