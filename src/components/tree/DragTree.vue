<template>
  <section class="drag-tree-container scrollbar" :style="{width: width}">
    <el-tree
      v-if="show"
      v-loading="loading"
      :data="data"
      :props="defaultProps"
      :node-key="nodeKey"
      icon-class='el-icon-remove-outline'
      default-expand-all
      highlight-current
      :expand-on-click-node="false"
      :indent="40"
      @node-click="handleClick"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      v-on="$listeners"
      :draggable="draggable"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :default-checked-keys="[currentNodeKey]"
      :current-node-key="currentNodeKey"
    >
      <span class="custom-tree-node"
        :class="{
          'is-disabled':data.disabled,
          'is-top': node.level === 1
        }"
        slot-scope="{ node, data }">
        <span :class="{'jee-color': node.isCurrent || (node.level&&(node.level === 1&&showLevel))}">{{ data[defaultProps.label || 'label'] }}</span>
        <i class="el-icon-remove-outline jee-color"
          v-if="node.expanded && node.childNodes.length"
          @click="()=>handleCollect(node)"
        ></i>
        <i class="el-icon-circle-plus-outline jee-color"
          v-if="!node.expanded && node.childNodes.length"
          @click="()=>handleExpand(node)"
        ></i>
        <div class='sort-wrap'>
          <jee-icon iconClass="ziyuanldpi" class="jee-hover-fill" v-if="data.prevId" @click.stop="handleSort(data, 'up')"/>
          <jee-icon iconClass="ziyuanldpi1" class="jee-hover-fill" v-if="data.nextId" @click.stop="handleSort(data, 'down')"/>
        </div>
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
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    draggable: {
      type: Boolean,
      default: false
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
    showLevel: {
      type: Boolean,
      default: true
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
    handleSort (data, type) {
      this.$emit('handleSort', data, type)
    }
  }
}
</script>

<style lang="scss">
// https://github.com/ElemeFE/element/issues/4944 横向滚动
.drag-tree-container {
  height: 100%;
  overflow: overlay;
  .el-tree{
    // 支持横向滚动条
    min-width: 100%;
    // display: inline-block;
    .el-tree-node{
      .el-tree-node__content{
        height: 45px;
        .el-tree-node__expand-icon{
          display: none;
        }
        .custom-tree-node{
          white-space: nowrap;
          position: relative;
          padding-left: 12px;
          line-height: 45px;
          width: 100%;
          span.jee-color{
            font-size: 16px;
            font-weight: 600;
          }
          i{
            position: absolute;
            left: 25px;
            bottom: 0;
            font-size: 11px;
          }
          &:not(.is-top){
            &::after{
              content:' ';
              position:absolute;
              top:22px;
              left:-10px;
              width:12px;
              border:none;
              border-top:1px solid #CBCBCB;
            }
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
  .el-tree .el-tree-node__children>.el-tree-node:not(:last-child){
    position: relative;
    &>.el-tree-node__content>.custom-tree-node:before{
      content:' ';
      position:absolute;
      top:0;
      left:-10px;
      height:100%;
      border:none;
      border-left:1px solid #CBCBCB;
    }
    >.el-tree-node__children{
      position: relative;
      &::before{
        content:' ';
        position:absolute;
        top:0;
        left:30px;
        height:100%;
        border:none;
        border-left:1px solid #CBCBCB;
        z-index: 1;
      }
    }
  }
  .el-tree .el-tree-node__children>.el-tree-node:last-child{
    // >.el-tree-node__content>.custom-tree-node
    position: relative;
    &>.el-tree-node__content>.custom-tree-node:before{
      content:' ';
      position:absolute;
      top:0;
      left:-10px;
      height:22px;
      border:none;
      border-left:1px solid #CBCBCB;
    }
  }
  .el-tree>.el-tree-node>.el-tree-node__children>.el-tree-node:not(:last-child){
    >.el-tree-node__children{
      &::before{ left:30px; }
      >.el-tree-node>.el-tree-node__children{
        &::before{ left:70px; }
        >.el-tree-node>.el-tree-node__children{
          &::before{ left:110px; }
          >.el-tree-node>.el-tree-node__children{
            &::before{ left:150px; }
            >.el-tree-node>.el-tree-node__children{
              &::before{ left:190px; }
              >.el-tree-node>.el-tree-node__children{
                &::before{ left:230px; }
                >.el-tree-node>.el-tree-node__children{
                  &::before{ left:270px; }
                  >.el-tree-node>.el-tree-node__children{
                    &::before{ left:310px; }
                    >.el-tree-node>.el-tree-node__children{
                      &::before{ left:350px; }
                      >.el-tree-node>.el-tree-node__children{
                        &::before{ left:390px; }
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
  }
}
</style>
