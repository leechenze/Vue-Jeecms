<template>
  <section class="site-permission-container">
    <header>
      <div v-if="name && value && showAssign" class="editable" @click="assigned = true">
        <jee-icon :iconClass="assigned?'quanxianbianji-hover':'quanxianbianji01'"></jee-icon>
        <span class="jee-color">权限编辑</span>
      </div>
    </header>
    <div class="site-group-wrap">
      <base-tree
        ref="tree"
        :loading="loading"
        :data="siteGroupData"
        :showCheckbox="true"
        :checkStrictly="true"
        @check-change="handleCheckedChange"
      >
       <!-- @check="handleCheck" -->
        <template v-slot:default="scope">
          <span>{{ scope.data.name }}</span>
          <jee-popover
            v-if="scope.data.id === 0"
            popoverText="增量站点指的是对后续新增站点的权限做设置"
          ></jee-popover>
        </template>
      </base-tree>
    </div>
    <div class="btn-save" v-if="assigned">
      <el-button type="primary" size="small" @click="handleSave"
        :disabled="!_checkPermission('/dataPerm', 'PUT') || !managerAble"
      >保存</el-button>
    </div>
  </section>
</template>
<script>
import BaseTree from '@/components/tree/BaseTree'
// import { getTreeIds } from '@/utils'

export default {
  name: 'SiteGroupPermission',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    dataType: {
      type: Number,
      default: 2
    },
    dataPermStatus: {
      type: Number,
      default: 1
    }
  },
  components: {
    BaseTree
  },
  data () {
    return {
      loading: false,
      checkAll: false,
      isIndeterminate: false,
      assigned: false,
      showAssign: true,
      managerAble: false,
      data: []
    }
  },
  computed: {
    siteGroupData () {
      const that = this
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          return data.map(d => {
            d.disabled = !that.assigned || !d.canAssign
            if (d.children instanceof Array && d.children.length) {
              d.children = loop(d.children)
            }
            return d
          })
        }
      }
      return loop(this.data)
    }
  },
  watch: {
    value (newData, oldData) {
      if (newData && newData !== oldData) {
        this.fetchSiteGroupPermission()
      }
    }
  },
  methods: {
    // 全选框
    // handleCheckAllChange (val) {
    //   if (val) {
    //     this.$refs.tree.setCheckedKeys(this.data.filter(d => d.hasPerm).map(d => d.id))
    //   } else {
    //     this.$refs.tree.setCheckedKeys([])
    //   }
    //   this.isIndeterminate = false
    // },
    // 勾选框变化，每个框变化都触发一次
    // 父勾子勾，父不勾子不勾，子勾父爷勾，子全消父不变
    handleCheckedChange (node, checked, indeterminate) {
      // console.log('change', node, checked, indeterminate)
      node.hasPerm = checked || indeterminate
    },
    // 勾选框变化，每次动作只触发一次
    // handleCheck (node, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) {
    //   // console.log('check: ', node, checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys)
    //   const selected = checkedKeys.includes(node.id)
    //   const loop = function (data) {
    //     if (data instanceof Array && data.length) {
    //       data.filter(d => !d.disabled).forEach(r => {
    //         if (selected) {
    //           if (!checkedKeys.includes(r.id)) checkedKeys.push(r.id)
    //         } else {
    //           checkedKeys = checkedKeys.filter(d => d !== r.id)
    //         }
    //         if (r.children) loop(r.children)
    //       })
    //     }
    //   }
    //   if (node.children) {
    //     loop(node.children)
    //   }
    //   if (selected) {
    //     const ids = getTreeIds(this.data, node.id)
    //     if (ids.length) {
    //       ids.forEach(id => {
    //         if (!checkedKeys.includes(id)) checkedKeys.push(id)
    //       })
    //     }
    //   }
    //   this.$refs.tree.setCheckedKeys(checkedKeys)
    // },
    // 初始化设置选中项
    setCheckedKeys () {
      let checkedKeys = []
      // let checkAll = true
      // let isIndeterminate = false
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(d => {
            if (d.hasPerm) {
              checkedKeys.push(d.id)
              // isIndeterminate = true
            } else {
              // checkAll = false
            }
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.data)
      // this.checkAll = checkAll
      // this.isIndeterminate = !checkAll && isIndeterminate
      this.$refs.tree.setCheckedKeys(checkedKeys)
    },
    // 请求数据并处理
    fetchSiteGroupPermission () {
      this.loading = true
      const params = {
        [this.name]: this.value,
        dataType: this.dataType
      }
      this.$request.fetchSysUsersDataPerm(params).then(res => {
        if (res.code === 200) {
          this.assigned = res.data.assigned
          this.showAssign = !res.data.assigned
          this.managerAble = res.data.managerAble
          this.data = res.data.sites
          this.setCheckedKeys()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 保存接口
    handleSave () {
      this.loading = true
      let siteDatas = []
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(d => {
            siteDatas.push({
              siteId: d.id,
              selected: d.hasPerm
            })
            // 父级不需要选中
            // if (d.hasPerm) {
            //   try {
            //     siteDatas.find(p => p.siteId === d.parentId).selected = true
            //   } catch (error) {}
            // }
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.data)
      const data = {
        dataType: this.dataType,
        [this.name]: this.value,
        siteDatas
      }
      this.$request.fetchSysUsersDataPermUpdate(data, this.dataPermStatus).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    if (this.name && this.value) this.fetchSiteGroupPermission()
  }
}
</script>

<style lang="scss">
@import './permission.scss';
</style>
