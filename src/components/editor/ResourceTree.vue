<template>
  <section class="resource-tree-container scrollbar" :style="{width: width}">
    <el-tree
      ref="tree"
      v-loading="loading"
      :data="getOptions"
      :props="defaultProps"
      :node-key="nodeKey"
      icon-class='el-icon-remove-outline'
      default-expand-all
      highlight-current
      :expand-on-click-node="false"
      :indent="20"
      v-on="$listeners"
      @node-click="handleClick"
    >
      <span class="custom-tree-node"
        :class="{'jee-color': node.isCurrent}"
        slot-scope="{ node, data }">
        <slot :node="node" :data="data">
          <div v-if="!data.editing" class="node-item append">
            <span>{{ data[defaultProps.label || 'label'] }}</span>
            <span
              v-if="createChildren"
              class="append-text jee-hover-color" @click.stop="append(data)">新建子分类</span>
            <jee-icon iconClass="tangchuangguanbi" v-if="data.append" @click.stop="handleDelete(node, data)"/>
          </div>
          <div v-else class="node-item editing">
            <el-input autofocus size="small" v-model="data.label" placeholder="请输入文件夹名"/>
            <div class="node-btn jee-border" @click.stop="handleAppendNode(data)"><jee-icon iconClass="gouxuan"/></div>
            <div class="node-btn jee-border" @click.stop="remove(node, data)"><jee-icon iconClass="tangchuangguanbi"/></div>
          </div>
        </slot>
      </span>
    </el-tree>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
let id = 10000

export default {
  name: 'ResourceTree',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    width: {
      type: String,
      default: 'auto'
    },
    loading: {
      type: Boolean,
      default: false
    },
    createChildren: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label'
      })
    },
    nodeKey: {
      type: String,
      default: 'id'
    }
  },
  data () {
    return {
      editing: false
    }
  },
  watch: {
    value (newData) {
      if (!newData) {
        this.$refs.tree.setCurrentKey(null)
      }
    }
  },
  computed: {
    ...mapGetters(['resourceOptions']),
    getOptions () {
      return [{
        id: '',
        name: '所有资源',
        value: '',
        label: '所有资源',
        children: this.resourceOptions
      }]
    }
  },
  methods: {
    ...mapActions('system', ['FetchResourceOptions']),
    handleClick (data, node, ev) {
      // console.log('click', data, node, ev)
      this.$emit('input', data[this.nodeKey])
    },
    handleAppendNode (data) {
      if (!data.label) {
        this.$message('请输入文件夹名')
        return
      }
      let params = {
        name: data.label
      }
      if (data.parentId) params.parentId = data.parentId
      this.$request.resourceSpaceSave(params).then(res => {
        if (res.code === 200) {
          data.id = res.data.id
          data.editing = false
          this.editing = false
          this.FetchResourceOptions(true)
        }
      })
    },
    append (data) {
      if (this.editing) {
        this.$message('请先保存正在编辑的资源')
        return
      }
      this.editing = true
      const newChild = {
        id: id++,
        parentId: data.id,
        label: '',
        append: true,
        editing: true,
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove (node, data) {
      this.editing = false
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    handleDelete (node, data) {
      const params = {
        ids: [data.id]
      }
      this.$request.resourceSpaceDelete(params).then(res => {
        if (res.code === 200) {
          this.remove(node, data)
        }
      })
    }
  },
  mounted () {
    this.FetchResourceOptions()
  }
}
</script>

<style lang="scss">
.resource-tree-container{
  height: 100%;
  overflow-x: auto;
  overflow-y: overlay;
  .el-tree{
    .el-tree-node{
      .el-tree-node__content{
        height: 32px;
        &:hover{
          .custom-tree-node{
            .node-item.append {
              .append-text,
              .jee-svg-icon{
                opacity: 1;
              }
            }
          }
        }
        .custom-tree-node{
          white-space: nowrap;
          position: relative;
          line-height: 32px;
          width: 100%;
          .node-item {
            display: flex;
            align-items: center;
            &.append{
              .append-text{
                font-size: 12px;
                opacity: 0;
                cursor: pointer;
                margin-left: 50px;
              }
              .jee-svg-icon{
                width: 8px;
                fill: #999999;
                opacity: 0;
                margin-left: 30px;
                &:hover{
                  fill: #777777;
                }
              }
            }
            &.editing{
              .el-input{
                width: 180px;
                margin-right: 5px;
              }
              .node-btn{
                width: 32px;
                height: 32px;
                border: 1px solid;
                box-sizing: border-box;
                margin-left: 5px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                .jee-svg-icon{
                  width: 10px;
                }
                &:first-child{
                  .jee-svg-icon{
                    width: 16px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
