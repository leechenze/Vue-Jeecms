
<template>
  <section class='jee-emoji-container'>
    <div :contentEditable="contentEditable" ref="edit" class="content"
      :style="{height:height}"
      @click="onclickedit"
      @keyup="onkeyup"
      @keydown="onkeydown"
      @input="oninput"
      @paste="onpaste"
    ></div>
    <div class="face" @click="onshow">
      <i class='emoji emoji1f603'/>
    </div>
    <div class="limit" v-if="maxlength - valueLength >= 0">
      当前已输入{{valueLength}}个字符, 您还可以输入<span>{{maxlength - valueLength}}</span>个字符
    </div>
    <div class="limit" v-else>
      您输入的字符已超出<span>{{valueLength - maxlength}}</span>个字符
    </div>
    <div class="emoji-panel" v-if="show">
      <el-carousel height="226px" :autoplay="false" arrow='never'>
        <el-carousel-item v-for="(emojiList, idx) in emojiLists" :key="idx">
          <ul class="emoji-wrap">
            <i v-for="(item,index) in emojiList" :key="index" @click="onclick"
            contentEditable="false" :class="'emoji emoji'+item.v" :data-value='item.k'/>
          </ul>
        </el-carousel-item>
      </el-carousel>
    </div>
  </section>
</template>
<script>
// https://blog.csdn.net/lqyygyss/article/details/81773516
import { emojiItems } from '@/utils/emoji'
export default {
  name: 'JeeEmoji',
  props: {
    value: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: 50
    },
    height: {
      type: String,
      default: '110px'
    }
  },
  data () {
    return {
      show: false,
      lastEditRange: '',
      valueLength: 0,
      defaultVal: this.value,
      contentEditable: true
    }
  },
  computed: {
    emojiLists () {
      let arr = []
      let emojis = emojiItems()
      let emojiList = Object.keys(emojiItems()).map(d => {
        return {
          k: d,
          v: emojis[d]
        }
      })
      let arrLength = emojiList.length
      let num = 48
      let index = 0
      for (let i = 0; i < arrLength; i++) {
        if (i % num === 0 && i !== 0) {
          arr.push(emojiList.slice(index, i))
          index = i
        };
        if ((i + 1) === arrLength) {
          arr.push(emojiList.slice(index, (i + 1)))
        }
      };
      return arr
    }
  },
  methods: {
    // 显示表情选择面板
    onshow () {
      this.show = !this.show
    },
    // 点击输入框
    onclickedit (event) {
      var selection = getSelection()
      this.lastEditRange = selection.getRangeAt(0)
    },
    // 选择表情
    onclick (event) {
      if (this.valueLength >= this.maxlength) {
        this.show = false
        return
      }
      var str = event.target.outerHTML
      var selection = window.getSelection ? window.getSelection() : document.selection
      this.$refs.edit.focus()
      // document.getElementById('edit').focus()
      if (this.lastEditRange) {
        selection.removeAllRanges()
        selection.addRange(this.lastEditRange)
      }
      var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0)
      if (!window.getSelection) { // ie11,10,9 ff saf
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
      this.lastEditRange = selection.getRangeAt(0)
      this.show = false
      this.onsubmit()
    },
    oninput (event) {
      this.onsubmit()
    },
    onkeyup (event) {
      var selection = getSelection()
      this.lastEditRange = selection.getRangeAt(0)
    },
    onkeydown (event) {
      const code = event.keyCode
      if (this.valueLength >= this.maxlength && code !== 8) {
        event.returnValue = false
      }
    },
    onpaste (event) {
      event.returnValue = false
    },
    // 提交数据到上层
    onsubmit () {
      // const el = document.getElementById('edit')
      const el = this.$refs.edit
      const html = el.innerHTML
      const text = el.innerText
      this.valueLength = text.length + this.emojiNums(html)
      this.$emit('input', this.replaceEmoji(html))
      this.$emit('change', this.replaceEmoji(html))
    },
    emojiNums (html) {
      const reg = /<i/gi
      const arr = html.match(reg)
      return arr ? arr.length : 0
    },
    replaceEmoji (str) {
      // emoji占位符
      // eslint-disable-next-line no-template-curly-in-string
      var placeholder = '${emoji}'
      var placeholderLen = placeholder.length
      // 定义匹配img 标签属性正则表达式
      var imgReg = /<i.*?(?:>|\/>)/gi
      // 匹配获取所有img标签属性，返回数组
      var arr = str.match(imgReg)
      if (arr === null) {
        return str.replace(/<\/?.+?>/g, '')
      }
      // 替换img标签为指定占位符
      str = str.replace(/<i\/?.+?>/g, placeholder)
      // 替换所有html标签
      str = str.replace(/<\/?.+?>/g, '')
      // 定义匹配data-valu属性正则表达式
      var srcReg = /data-value=['"]?([^'"]*)['"]?/i
      // 循环替换所有占位符为对应data-value属性值
      for (var i = 0; i < arr.length; i++) {
        const dataValue = arr[i].match(srcReg)
        let emojistr = ''
        if (dataValue != null) {
          emojistr = dataValue[1]
        }
        var firstIndex = str.indexOf(placeholder)
        str = this.replacePos(str, firstIndex, placeholderLen, emojistr)
      }
      return str
    },
    replacePos (str, pos, len, replacetext) {
      str = str.substr(0, pos) + replacetext + str.substring(pos + len, str.length)
      return str
    }
  },
  mounted () {
    if (this.value) {
      const el = this.$refs.edit
      // const el = document.getElementById('edit')
      el.innerHTML += this.value
    }
  }
}
</script>
<style lang="scss">
.jee-emoji-container{
  position: relative;
  .content {
    line-height: 1.5;
    min-height: 100px;
    box-sizing: border-box;
    padding: 20px 20px 26px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: overlay;
    color: #333333;
    background: #ffffff;
    &:focus {
      outline: -webkit-focus-ring-color auto 0;
    }
  }
  .face{
    cursor: pointer;
    position: absolute;
    left: 20px;
    bottom: 10px;
  }
  .limit{
    color:#999999;
    font-size: 12px;
    position: absolute;
    right: 20px;
    bottom: 10px;

    span{
      color: red;
    }
  }
  .emoji-panel{
    position: absolute;
    left: 16px;
    bottom: 34px;
    width: 340px;
    background-color:#fff;
    border: 1px solid #E6E6E6;
    box-shadow:0px 10px 38px 0px rgba(45,45,45,0.08);
    border-radius: 4px;
    .el-carousel__indicators{
      width: 240px;
      bottom: 4px;
      .el-carousel__indicator{
        padding: 0 5px;
        .el-carousel__button{
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #e5e5e5;
        }
        &.is-active .el-carousel__button{
          background-color: #999999;
        }
      }
    }
    .emoji-wrap{
      display: flex;
      flex-wrap: wrap;
      padding: 15px 10px 5px;
      i{
        cursor: pointer;
        margin: 5px 10px;
        &:hover{
          transform: scale(1.2);
        }
      }
    }
  }
}
</style>
