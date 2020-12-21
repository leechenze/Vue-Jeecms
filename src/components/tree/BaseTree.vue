<template>
  <section class="base-tree-container scrollbar" :style="{width: width}">
    <el-tree
      ref="tree"
      v-loading="loading"
      :data="data"
      :props="defaultProps"
      :node-key="nodeKey"
      :show-checkbox="showCheckbox"
      icon-class='el-icon-remove-outline'
      default-expand-all
      highlight-current
      :expand-on-click-node="expandOnClickNode"
      :indent="20"
      v-on="$listeners"
      @node-click="handleClick"
      :current-node-key="currentNodeKey"
      :check-strictly="checkStrictly"
    >
      <span class="custom-tree-node"
        :class="[{'jee-color':currentNodeKey === data.id},{'is-hidden':node.hidden}]"
        slot-scope="{ node, data }">
        <slot :node="node" :data="data">
          <jee-icon :iconClass="data.expandedIcon" v-if="node.expanded && data.expandedIcon"/>
          <jee-icon :iconClass="data.collectIcon" v-if="!node.expanded && data.collectIcon"/>
          <span>{{ data[defaultProps.label || 'label'] }}</span>
          <div class='sort-wrap'>
            <jee-icon iconClass="ziyuanldpi" class="jee-hover-fill" v-if="data.prevId" @click.stop="handleSort(data, 'up')"/>
            <jee-icon iconClass="ziyuanldpi1" class="jee-hover-fill" v-if="data.nextId" @click.stop="handleSort(data, 'down')"/>
          </div>
        </slot>
      </span>
    </el-tree>
  </section>
</template>

<script>
// node: {
//   parent,
//   isLeaf,
//   level,
//   expanded,
//   isCurrent,
//   data,
//   childNodes
// }
export default {
  props: {
    width: {
      type: String,
      default: 'auto'
    },
    loading: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    expandOnClickNode: {
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
    },
    currentNodeKey: {
      type: [Number, String]
    },
    checkStrictly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      treeData: []
    }
  },
  watch: {
    currentNodeKey (newVal) {
      if (newVal) this.$refs.tree.setCurrentKey(newVal)
    }
  },
  methods: {
    handleClick (item, node, ev) {
      this.$emit('handleClick', item, node, ev)
    },
    setCheckedKeys (list) {
      if (list instanceof Array) {
        this.$refs.tree.setCheckedKeys(list)
      }
    },
    handleExpand (node) {
      node.expanded = true
    },
    handleCollect (node) {
      node.expanded = false
    },
    handleSort (data, type) {
      this.$emit('handleSort', data, type)
    }
  }
}
</script>

<style lang="scss">
.base-tree-container{
  height: 100%;
  overflow: overlay;
  .el-tree{
    // 支持横向滚动条
    min-width: 100%;
    display: inline-block;
    .el-tree-node{
      .el-tree-node__content{
        height: 45px;
        .el-tree-node__expand-icon:not(.is-leaf){
          color: #999999;
          padding: 4px;
          font-size: 14px;
          margin-bottom: 2px;
        }
        .custom-tree-node{
          white-space: nowrap;
          position: relative;
          line-height: 45px;
          width: 100%;
          .jee-svg-icon{
            padding-right: 10px;
          }
          .sort-wrap{
            position: absolute;
            right: 10px;
            top: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            padding: 8px 0;
            box-sizing: border-box;
            .jee-svg-icon{
              font-size: 12px;
              fill: #999999;
              opacity: 0;
            }
          }
        }
        &:hover{
          .custom-tree-node .sort-wrap .jee-svg-icon{
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
