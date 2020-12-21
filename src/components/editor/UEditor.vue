<template>
  <section class="editor-container">
    <vue-neditor-wrap ref="neditor" v-model="content" :init="init" :config="getConfigs" :destroy="false" @ready="ready"></vue-neditor-wrap>
    <upload
      v-for="(item, index) in buttons" :key="index"
      :ref="item.name"
      :resourceType="item.name"
      :isWechatUpload="isWechatUpload"
      @handleConfirm="handleConfirm"
    ></upload>
    <el-upload
      class="word-uploader"
      action=""
      :show-file-list="false"
      :auto-upload="false"
      :on-change="handleChange"
    >
    </el-upload>
  </section>
</template>
<script>
import VueNeditorWrap from '@/components/plugin/neditor'
import Upload from './Upload'

export default {
  name: 'UEditor',
  components: {
    Upload,
    VueNeditorWrap
  },
  props: ['value', 'isWechatUpload', 'options', 'blurEditor'],
  data () {
    const handler = function (editor, name) {
      try {
        editor.parent.$refs[name][0].showDialog()
      } catch (error) {}
    }
    return {
      config: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        serverUrl: '',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        // UEDITOR_HOME_URL: '/NEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 140,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 是否启用元素路径
        elementPathEnabled: false,
        // 是否开启字数统计
        wordCount: false,
        // 关闭自动保存
        enableAutoSave: false,
        // 打开右键菜单功能
        enableContextMenu: true,
        // 定义工具条
        toolbars: [
          [
            'source', // 源代码
            'undo', // 撤销
            'redo', // 重做
            '|',
            'insertcode', // 代码语言
            'fontfamily', // 字体
            'fontsize', // 字号
            'bold', // 加粗
            'italic', // 斜体
            'underline', // 下划线
            'forecolor', // 字体颜色
            'backcolor', // 背景色
            'removeformat', // 清除格式
            'autotypeset', // 自动排版
            'indent', // 首行缩进
            'pasteplain', // 纯文本粘贴模式
            'formatmatch', // 格式刷
            '|',
            'justifyleft', // 居左对齐
            'justifyright', // 居右对齐
            'justifycenter', // 居中对齐
            'justifyjustify', // 两端对齐
            'insertorderedlist', // 有序列表
            'insertunorderedlist', // 无序列表
            'rowspacingtop', // 段前距
            'rowspacingbottom', // 段后距
            'lineheight', // 行间距
            'link', // 超链接
            'unlink', // 取消链接
            'simpleupload', // 单图上传
            'insertimage', // 多图上传
            'insertvideo', // 视频
            'music', // 音乐
            'attachment', // 附件上传
            'wordimage', // 图片转存
            'pagebreak', // 分页
            'inserttable', // 插入表格
            'searchreplace', // 查询替换
            '|',
            'fullscreen' // 全屏
            // 'imagecenter'// 居中
            // 'anchor', // 锚点
            // 'snapscreen', // 截图
            // 'strikethrough', // 删除线
            // 'subscript', // 下标
            // 'fontborder', // 字符边框
            // 'superscript', // 上标
            // 'blockquote', // 引用
            // 'selectall', // 全选
            // 'print', // 打印
            // 'preview', // 预览
            // 'horizontal', // 分隔线
            // 'time', // 时间
            // 'date', // 日期
            // 'insertrow', // 前插入行
            // 'insertcol', // 前插入列
            // 'mergeright', // 右合并单元格
            // 'mergedown', // 下合并单元格
            // 'deleterow', // 删除行
            // 'deletecol', // 删除列
            // 'splittorows', // 拆分成行
            // 'splittocols', // 拆分成列
            // 'splittocells', // 完全拆分单元格
            // 'deletecaption', // 删除表格标题
            // 'inserttitle', // 插入标题
            // 'mergecells', // 合并多个单元格
            // 'deletetable', // 删除表格
            // 'cleardoc', // 清空文档
            // 'insertparagraphbeforetable', // "表格前插入行"
            // 'paragraph', // 段落格式
            // 'edittable', // 表格属性
            // 'edittd', // 单元格属性
            // 'emotion', // 表情
            // 'spechars', // 特殊字符
            // 'map', // Baidu地图
            // 'gmap', // Google地图
            // 'help', // 帮助
            // 'directionalityltr', // 从左向右输入
            // 'directionalityrtl', // 从右向左输入
            // 'insertframe', // 插入Iframe
            // 'imagenone', // 默认
            // 'imageleft', // 左浮动
            // 'imageright', // 右浮动
            // 'attachment', // 附件
            // 'edittip ', // 编辑提示
            // 'customstyle', // 自定义标题
            // 'webapp', // 百度应用
            // 'touppercase', // 字母大写
            // 'tolowercase', // 字母小写
            // 'background', // 背景
            // 'template', // 模板
            // 'scrawl', // 涂鸦
            // 'drafts', // 从草稿箱加载
            // 'charts' // 图表
          ]
        ]
      },
      ue: null,
      buttons: [
        {
          name: 'simpleupload',
          tip: '上传图片',
          handler
        },
        {
          name: 'insertimage',
          tip: '上传多图',
          handler
        },
        {
          name: 'insertvideo',
          tip: '上传视频',
          handler
        },
        {
          name: 'music',
          tip: '上传音频',
          handler
        },
        {
          name: 'attachment',
          tip: '上传文件',
          handler
        }
      ],
      wordBtn: {
        name: 'wordimage',
        tip: '文件导入',
        handler (editor, name) {
          document.querySelector('.word-uploader input').click()
        }
      },
      importCombox: {
        name: 'wordimage',
        tip: '导入Word',
        handler (editor, cmdName, value) {
          document.querySelector('.avatar-uploader input').click()
        },
        items: [
          {
            label: '带格式',
            value: 1,
            renderLabelHtml: function () {
              return '<div class="edui-label %%-label" style="line-height:2;font-size: 14px;">' + (this.label || '') + '</div>'
            }
          },
          {
            label: '纯文本',
            value: 2,
            renderLabelHtml: function () {
              return '<div class="edui-label %%-label" style="line-height:2;font-size: 14px;">' + (this.label || '') + '</div>'
            }
          }
        ]
      }
    }
  },
  computed: {
    content: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    getConfigs () {
      return {
        ...this.config,
        ...(this.options || {})
      }
    }
  },
  methods: {
    ready (editor) {
      this.ue = editor
      this.$refs.neditor.readyValue = this.value
    },
    handleConfirm (html) {
      // html = `<img src='http://pic37.nipic.com/20140113/8800276_184927469000_2.png'  style='max-width:750px'/>`
      this.ue.execCommand('insertHtml', html)
    },
    beforeUpload (file) {
      // 限制文件类型和大小
      if (file.raw.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.$message.error('只能上传word文件')
        return false
      }
      return true
    },
    handleChange (file, fileList) {
      const param = new FormData()
      param.append('type', 1)
      param.append('uploadFile', file.raw, file.name)
      this.$request.fetchDocImport(param).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.ue.execCommand('insertHtml', res.data)
        }
      })
    },
    init () {
      if (this.$refs.neditor) {
        this.buttons.forEach(this.$refs.neditor.registerButton)
        this.$refs.neditor.registerButton(this.wordBtn)
      }
    }
  }
}
</script>
<style lang="scss">

.editor-container{
  .edui-notadd .edui-editor{
    border: 0 !important;
    z-index: 2 !important;
    >div:not([id]){
      height: 0!important;
    }
    &[style~="absolute;"]{
      width: 775px!important;
      left: 50%!important;
      transform: translateX(-50%);
      padding: 0 3000px;
      box-sizing: content-box;
      background: #F0EFF2;
      .edui-editor-iframeholder{
        background-color: #fff;
      }
    }
  }
  .edui-editor-toolbarbox.edui-notadd{
    position: relative!important;
    .edui-editor-toolbarboxouter{
      background-color: #ffffff;
      padding: 8px 15px 6px;
      .edui-state-hover{
        > .edui-notadd{
          background-color: #F3F3F3;
        }
      }
      .edui-state-checked,
      .edui-state-active{
        > .edui-notadd{
          background-color: #E5E5E5;
        }
      }
      .edui-icon,
      .edui-state-checked .edui-icon {
        color: #777777;
      }
      .edui-icon{
        font-size: 18px;
      }
      .edui-state-checked,
      .edui-state-hover{
        .edui-icon::before{
          display: none;
        }
        .edui-icon .edui-iconfont{
          display: block;
        }
      }
    }
    .edui-for-forecolor,
    .edui-for-backcolor,
    .edui-for-autotypeset,
    .edui-for-insertorderedlist,
    .edui-for-insertunorderedlist,
    .edui-for-rowspacingtop,
    .edui-for-rowspacingbottom,
    .edui-for-lineheight{
      .edui-box.edui-arrow.edui-notadd{
        margin-right: -4px;
      }
    }
  }
  .edui-notadd.edui-editor-bottomContainer{
    border: 0;
  }
  .word-uploader{
    height: 0px;
  }
}
</style>
