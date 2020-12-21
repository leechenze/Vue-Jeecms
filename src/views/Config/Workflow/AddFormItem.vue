<template>
  <section class='add-org-dialog-container'>
    <div class="title-wrap">
      <span class="title-text">{{title}}</span>
      <el-link type="primary" :underline="false" @click="handleEdit">编辑</el-link>
    </div>
    <div class="org-list-wrap" v-if="orgList.length">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(option, index) in orgList"
          :key="index"
          :label="option.value"
        >{{option.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <component :is="component" ref="addDialog" v-model="orgList" :ids="value"/>
  </section>
</template>
<script>
import OrgDialog from '@/components/dialog/OrgDialog'
import RoleDialog from '@/components/dialog/RoleDialog'
import UserDialog from '@/components/dialog/UserDialog'
export default {
  name: 'AddOrgDialog',
  components: {
    OrgDialog,
    RoleDialog,
    UserDialog
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    component: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      orgList: this.options
    }
  },
  computed: {
    checkList: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    orgList (newData) {
      if (newData instanceof Array) {
        const ids = newData.map(d => d.value)
        this.$emit('input', ids)
        this.$emit('change', newData)
      }
    }
  },
  methods: {
    handleEdit () {
      this.$refs.addDialog.showDialog()
    }
  }
}
</script>
<style lang="scss" scoped>
.add-org-dialog-container{
  .title-wrap{
    line-height: 14px;
    display: flex;
    justify-content: space-between;
    .title-text{
      color: #666666;
    }
  }
  .org-list-wrap{
    margin-top: 20px;
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    min-height: 33px;
    .el-checkbox-group{
      height: auto;
    }
    .el-checkbox{
      padding: 0 20px 20px;
      margin-right: 0;
    }
  }
}
</style>
