<template>
  <section class="dragable-tree-container scrollbar" :style="{width: width}">
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
      :expand-on-click-node="true"
      :indent="20"
      :draggable="draggable"
      :current-node-key="currentNodeKey"
      :check-strictly="checkStrictly"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      v-on="$listeners"
      v-bind="treeProps"
    >
      <span class="custom-tree-node"
        :class="[{'jee-color': node.isCurrent},{'is-hidden':node.hidden}]"
        slot-scope="{ node, data }">
        <slot :node="node" :data="data">
          <jee-icon :iconClass="data.expandedIcon" v-if="node.expanded && data.expandedIcon"/>
          <jee-icon :iconClass="data.collectIcon" v-if="!node.expanded && data.collectIcon"/>
          <span>{{ data[defaultProps.label || 'label'] }}</span>
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
    },
    draggable: {
      type: Boolean,
      default: true
    },
    allowDrop: {
      type: Function,
      default: () => true
    },
    allowDrag: {
      type: Function,
      default: () => true
    },
    treeProps: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss">
.dragable-tree-container{
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  .el-tree{
    .el-tree-node{
      .el-tree-node__content{
        height: 45px;
        cursor: move;
        .custom-tree-node{
          white-space: nowrap;
          position: relative;
          line-height: 45px;
          width: 100%;
          .jee-svg-icon{
            padding-right: 10px;
          }
        }
      }
    }
  }
}
</style>
