
<template>
  <section class="files-drag-tree-container" :style="{width: width}">
    <div class="drag-tree-btn" v-if="topBtnShow">
      <el-button
        size="medium"
        type='primary'
        @click="importsBtn()"
        :disabled="!_checkPermission('/template/import', 'POST')"
      >
        <jee-icon iconClass="daoru-tianchong"></jee-icon>导入
      </el-button>
      <el-button
        size="medium"
        type='primary'
        @click="exportedBtn()"
        :disabled="!_checkPermission('/template/export', 'GET')"
      >
        <jee-icon iconClass="daochu-tianchong"></jee-icon>导出
      </el-button>
    </div>
    <div class="vertical scrollbar">
      <el-tree
        v-if="show"
        :data="data"
        node-key="id"
        icon-class='el-icon-remove-outline'
        default-expand-all
        highlight-current
        :expand-on-click-node="false"
        :indent="20"
        @node-click="handleClick"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">
        <span class="custom-tree-node"
          :class="{
            'jee-color': node.isCurrent
          }"
          slot-scope="{ node, data }">
          <jee-icon iconClass="dakaiwenjianjia-copy" v-if="node.expanded && node.childNodes.length && data.directory"
            @click="()=>handleCollect(node)"></jee-icon>
          <jee-icon iconClass="genmuluwenjian" style="fill:#999;font-size:13px" v-if="!data.directory"></jee-icon>
          <jee-icon iconClass="weidakaiwenjianjia-copy" v-if="!node.expanded && node.childNodes.length && data.directory"
            @click="()=>handleExpand(node)"></jee-icon>
          <jee-icon iconClass="weidakaiwenjianjia-copy" v-if="node.expanded && !node.childNodes.length && data.directory"></jee-icon>
          <span @click="upTree(data)" class="directory-text">{{ data.filename }}</span>
        </span>
      </el-tree>
    </div>
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
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    topBtnShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    handleClick (item, node, ev) {
      // console.log('click', item, node, ev)
      this.$emit('handleClick', item, node, ev)
    },
    handleExpand (node) {
      console.log(node)
      node.expanded = true
    },
    handleCollect (node) {
      console.log(node)
      node.expanded = false
    },

    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      // this.show = false
      // setTimeout(() => {
      //   this.show = true
      // }, 0)
      console.log('tree drop: ', draggingNode.label, dropNode.label, dropType)
      this.$emit('handleDrop', draggingNode, dropNode, dropType)
      // dropType: before after inner
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    },
    importsBtn (data) {
      // console.log('导入')
      this.$emit('importsBtn', data)
    },
    exportedBtn (data) {
      // console.log('导出')
      this.$emit('exportedBtn', data)
    },
    upTree (data) {
      this.$emit('upTree', data)
    }
  }
}
</script>

<style lang="scss">
// https://github.com/ElemeFE/element/issues/4944 横向滚动
.files-drag-tree-container{
  height: 100%;
  .drag-tree-btn{
    padding: 10px;
    border-radius: 4px 4px 0 0;
    border:1px solid rgba(232,232,232,1);
    border-bottom:none;
    .el-button.el-button--medium{
      padding: 0 12px;
    }
  }
  .vertical{
    overflow: overlay;
    height: calc(100% - 60px);
    border:1px solid rgba(232,232,232,1);
    border-radius: 0 0 4px 4px;
    .el-tree{
      // 支持横向滚动条
      min-width: 100%;
      display: inline-block;
    }
    .el-tree .el-tree-node{
      .el-tree-node__content{
        height: 45px;
        color: #666666;
        .el-tree-node__expand-icon{
          display: none;
        }
        .custom-tree-node{
          white-space: nowrap;
          position: relative;
          padding-left: 12px;
          line-height: 45px;
          i{
            font-size: 11px;
          }
        }
      }
    }
    .directory-text{
      margin-left: 5px
    }
  }
}
</style>
