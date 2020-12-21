<template>
  <section class='emoji-container'>
    <!-- <el-input
      ref='textarea'
      type="textarea"
      :autosize="autosize"
      :maxlength="maxlength"
      v-model="value"
      @blur='onblur'
    ></el-input> -->
    <div contentEditable="true" id="edit" class="content"
      :style="{height:height}"
      @click="onclickedit" @keyup="onclickedit"></div>
    <div class="face" @click="onshow">
      <i class='emoji emoji1f603'/>
    </div>
    <div class="emoji-panel" :class="{show: show}">
      <div class="emoji-wrap">
        <span v-for="(item, index) in emojiList" :key="index"
          contenteditable="false"
          :class="'emoji emoji' + item"
          @click="onclick"
        ></span>
      </div>
    </div>
  </section>
</template>
<script>
import { emojiItems } from '@/utils/emoji'
export default {
  name: 'emoji',
  props: {
    value: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: 100
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data () {
    return {
      show: false,
      lastEditRange: ''
    }
  },
  computed: {
    emojiList () {
      return emojiItems()
    }
  },
  methods: {
    onblur (e) {
      console.log(e)
    },
    onclickedit () {
      var selection = getSelection()
      this.lastEditRange = selection.getRangeAt(0)
    },
    onshow () {
      this.show = !this.show
    },
    onclick (event) {
      var str = event.target.outerHTML
      var selection = window.getSelection ? window.getSelection() : document.selection
      document.getElementById('edit').focus()
      if (this.lastEditRange) {
        // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
        selection.removeAllRanges()
        selection.addRange(this.lastEditRange)
      }
      var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0)
      if (!window.getSelection) {
        selection = window.getSelection ? window.getSelection() : document.selection
        range = selection.createRange ? selection.createRange() : selection.getRangeAt(0)
        range.pasteHTML(str)
        range.collapse(false)
        range.select()
      } else {
        var hasR = range.createContextualFragment(str)
        var hasRLastChild = hasR.lastChild
        while (hasRLastChild && hasRLastChild.nodeName.toLowerCase() === 'br' && hasRLastChild.previousSibling && hasRLastChild.previousSibling.nodeName.toLowerCase() === 'br') {
          var e = hasRLastChild
          hasRLastChild = hasRLastChild.previousSibling
          hasR.removeChild(e)
        }
        range.insertNode(hasR)
        if (hasRLastChild) {
          range.setEndAfter(hasRLastChild)
          range.setStartAfter(hasRLastChild)
        }
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      // 无论如何都要记录最后光标对象
      this.lastEditRange = selection.getRangeAt(0)
      // this.$emit('input', val)
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
.emoji-container{
  position: relative;
  .content {
    min-height: 100px;
    padding: 5px;
    margin: 20px 10px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: overlay;
    &:focus {
      outline: -webkit-focus-ring-color auto 0;
    }
  }
  .el-textarea{
    .el-textarea__inner{
      padding-bottom: 25px;
    }
  }
  .face{
    cursor: pointer;
    position: absolute;
    left: 15px;
    bottom: 5px;
  }
  .emoji-panel{
    position: absolute;
    left: 10px;
    bottom: 25px;
    padding: 0px;
    .emoji-wrap{
      display: flex;
      flex-wrap: wrap;
      overflow-x: hidden;
      overflow-y: overlay;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      box-sizing: border-box;
      background: #fff;
      height: 0;
      border-width: 0;
      transition: height 200ms;
      span{
        padding-left: 5px;
        cursor: pointer;
        padding-bottom: 5px;
      }
    }
    &.show{
      padding: 5px 5px 0 0;
      .emoji-wrap{
        border-width: 1px;
        height: 100px;
      }
    }
  }
}
</style>
