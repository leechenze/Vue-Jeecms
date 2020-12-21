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
        class="menus-tree"
        :loading="loading"
        :data="menusData"
        :showCheckbox="true"
        :checkStrictly="true"
        @check-change="handleCheckedChange"
        @check="handleCheck"
      >
        <template v-slot:default="scope">
          <span :class="{'hidden-children': hasHiddenChildren(scope.data)}">{{ scope.data.name }}</span>
          <jee-popover
            v-if="scope.data.id === 0"
            popoverText="增量菜单指的是对后续新增菜单的权限做设置"
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
import { getTreeIds } from '@/utils'

export default {
  name: 'MenusPermission',
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
    menusData () {
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
      const data = [
        {
          id: '',
          name: '所有权限',
          canAssign: true,
          hasPerm: true,
          children: this.data
        }
      ]
      return loop(data)
    }
  },
  watch: {
    value (newData, oldData) {
      if (newData && newData !== oldData) {
        this.fetchMenusPermission()
      }
    }
  },
  methods: {
    // 父勾子勾，父不勾子不勾，子勾父爷勾，子全消父不变
    handleCheck (node, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) {
      const selected = checkedKeys.includes(node.id)
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.filter(d => !d.disabled).forEach(r => {
            if (selected) {
              if (!checkedKeys.includes(r.id)) checkedKeys.push(r.id)
            } else {
              checkedKeys = checkedKeys.filter(d => d !== r.id)
            }
            if (r.children) loop(r.children)
          })
        }
      }
      if (node.children) {
        loop(node.children)
      }
      if (selected) {
        const ids = getTreeIds(this.data, node.id)
        if (ids.length) {
          ids.forEach(id => {
            if (!checkedKeys.includes(id)) checkedKeys.push(id)
          })
        }
      }
      this.$refs.tree.setCheckedKeys(checkedKeys)
    },
    handleCheckedChange (node, checked, indeterminate) {
      node.hasPerm = checked || indeterminate
    },
    // 初始化设置选中项
    setCheckedKeys () {
      let checkedKeys = []
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(d => {
            if (d.hasPerm) {
              checkedKeys.push(d.id)
            }
            if (d.children instanceof Array && d.children.length) {
              loop(d.children)
            }
          })
        }
      }
      loop(this.data)
      this.$refs.tree.setCheckedKeys(checkedKeys)
    },
    // 请求数据并处理
    fetchMenusPermission () {
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
          this.data = res.data.menus
          this.setCheckedKeys()
          this.changeTreeNodeDisplay()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 保存接口
    handleSave () {
      this.loading = true
      let menusDatas = []
      const loop = function (data) {
        if (data instanceof Array && data.length) {
          data.forEach(d => {
            menusDatas.push({
              menuId: d.id,
              selected: d.hasPerm
            })
            if (d.hasPerm) {
              try {
                menusDatas.find(p => p.siteId === d.parentId).selected = true
              } catch (error) {}
            }
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
        menus: menusDatas
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
    },
    // 判断是否横向排列
    hasHiddenChildren (data) {
      let result = true
      if (data.children instanceof Array && data.children.length) {
        if (data.children.find(d => !d.hidden)) result = false
        if (result) {
          if (data.children.find(d => d.children instanceof Array && d.children.length)) {
            result = false
          }
        }
      }
      return result
    },
    // 改变3级节点的布局
    changeTreeNodeDisplay () {
      this.$nextTick(() => {
        const d = document.querySelectorAll('.menus-tree .hidden-children')
        if (d.length) {
          for (let index = 0; index < d.length; index++) {
            d[index].parentNode.parentNode.parentNode.lastChild.className += ' horizontal'
          }
        }
      })
    }
  },
  mounted () {
    if (this.name && this.value) this.fetchMenusPermission()
  }
}
</script>

<style lang="scss">
@import './permission.scss';
.site-permission-container .menus-tree{
  width: 100%;
  overflow: hidden;
  .el-tree-node {
    .horizontal{
      display: flex;
      flex-wrap: wrap;
      >.el-tree-node{
        min-width: auto;
        &:nth-of-type(n+2){
          >.el-tree-node__content{
            padding-left: 0!important;
            margin-left: -4px;
          }
        }
      }
      &:hover{
        background-color: #f3f3f3;
        // .custom-tree-node{
        //   color: #666666;
        // }
      }
    }
  }
  .box-items{
      padding: 0 9px;
    }
}
</style>
