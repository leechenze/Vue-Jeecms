<template>
  <script :id="id" :name="name" type="text/plain"></script>
</template>

<script>
// 一个简单的事件订阅发布的实现,取代原始Event对象,提升IE下的兼容性
class LoadEvent {
  constructor () {
    this.listeners = {}
  }
  on (eventName, callback) {
    console.log(eventName)
    // eslint-disable-next-line no-unused-expressions
    this.listeners[eventName] === undefined ? (this.listeners[eventName] = []) : ''
    this.listeners[eventName].push(callback)
  }
  emit (eventName) {
    this.listeners[eventName] &&
      this.listeners[eventName].forEach(callback => callback())
  }
}
export default {
  name: 'VueNeditorWrap',
  data () {
    return {
      id:
        'editor' +
        Math.random()
          .toString()
          .slice(-10),
      editor: null,
      isReady: false,
      readyValue: '',
      defaultConfig: {
        UEDITOR_HOME_URL: './NEditor/',
        enableAutoSave: false
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    init: {
      type: Function,
      default: function () {
        return () => {}
      }
    },
    destroy: Boolean,
    name: String
  },
  computed: {
    mixedConfig () {
      return Object.assign({}, this.defaultConfig, this.config)
    }
  },
  methods: {
    // 添加自定义按钮
    registerButton ({ name, icon, tip, handler, UE = window.UE }) {
      if (UE && UE.registerUI) {
        UE.registerUI(name, function (editor, name) {
          editor.registerCommand(name, {
            execCommand () {
              handler(editor, name)
            }
          })
          const btn = new UE.ui.Button({
            name,
            title: tip,
            cssRules: icon ? `background-image: url(${icon}) !important;background-size: cover;` : 'background-position: -500px 0;',
            onclick () {
              editor.execCommand(name)
            }
          })
          editor.addListener('selectionchange', () => {
            const state = editor.queryCommandState(name)
            if (state === -1) {
              btn.setDisabled(true)
              btn.setChecked(false)
            } else {
              btn.setDisabled(false)
              btn.setChecked(state)
            }
          })
          return btn
        })
      }
    },
    // 添加自定义下拉
    registerCombox: ({ name, icon, tip, handler, items, UE = window.UE }) => {
      if (UE && UE.registerUI) {
        UE.registerUI(name, (editor, name) => {
          editor.registerCommand(name, {
            execCommand: (cmdName, value) => {
              // 这里借用fontsize的命令
              // this.execCommand('fontsize',value + 'px')
              handler(editor, cmdName, value)
            // },
            // queryCommandValue: () => {
            //   // 这里借用fontsize的查询命令
            //   return this.queryCommandValue('fontsize')
            }
          })

          // 创建下拉菜单中的键值对，这里我用字体大小作为例子
          // var items = [
          //   {
          //     label: '字体:' + 10 + 'px',
          //     value: 10,
          //     renderLabelHtml: function () {
          //       return '<div class="edui-label %%-label" style="line-height:2;font-size:' +
          //                 this.value + 'px;">' + (this.label || '') + '</div>'
          //     }
          //   }
          // ]
          // 创建下来框
          var combox = new UE.ui.Combox({
            // 需要指定当前的编辑器实例
            editor,
            // 添加条目
            items,
            // 当选中时要做的事情
            onselect: (t, index) => {
              // 拿到选中条目的值
              editor.execCommand(name, items[index].value)
            },
            // 提示
            title: name,
            // 当编辑器没有焦点时，combox默认显示的内容
            initValue: name
          })

          editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
            if (!uiReady) {
              var state = editor.queryCommandState(name)
              if (state === -1) {
                combox.setDisabled(true)
              } else {
                combox.setDisabled(false)
                var value = editor.queryCommandValue(name)
                if (!value) {
                  combox.setValue(name)
                  return
                }
                // ie下从源码模式切换回来时，字体会带单引号，而且会有逗号
                value && (value = value.replace(/['"]/g, '').split(',')[0])
                combox.setValue(value)
              }
            }
          })
          return combox
        })
      }
    },
    // 实例化编辑器之前-JS依赖检测
    _beforeInitEditor (value) {
      // 准确判断ueditor.config.js和ueditor.all.js是否均已加载 仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象也存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象也存在,但为空对象
      !!window.UE &&
      !!window.UEDITOR_CONFIG &&
      Object.keys(window.UEDITOR_CONFIG).length !== 0 &&
      !!window.UE.getEditor
        ? this._initEditor(value)
        : this._loadScripts().then(() => this._initEditor(value))
    },
    // 设置后台服务地址
    _setServerApi () {
      const self = this
      window.UE.Editor.prototype._bkGetActionUrl =
        window.UE.Editor.prototype.getActionUrl
      window.UE.Editor.prototype.getActionUrl = function (action) {
        console.log(action)
        /* system-cms-prefix start */
        var prefix = '/cmsmanager'
        /* system-cms-prefix change var prefix = '/cmsadmin' system-cms-prefix change */
        /* system-cms-prefix end */
        if (
          action === 'uploadimage' ||
          action === 'uploadvideo'
        ) {
          return self.$path + prefix + '/upload/o_upload'
        }
        if (action === 'catchimage' || action === 'uploadFile') { // 抓取
          return self.$path + prefix + '/upload/o_upload'
        }
        if (action === 'uploadscrawl') {
          return self.$path + '/ueditor/scrawlImage?Type=Image'
        }
        if (action === 'listimage' || action === 'listfile') {
          return self.$path + '/ueditor/imageManager?picNum=50&insite=false'
        }
        if (action === 'config') {
          return './static/UEditor/config.json'
        }
      }
    },
    // 实例化编辑器
    _initEditor (value) {
      this.$nextTick(() => {
        this.init()
        this.editor = window.UE.getEditor(this.id, this.mixedConfig)
        this.editor.parent = this.$parent
        this.readyValue = value
        this.editor.addListener('ready', () => {
          this.isReady = true
          this.$emit('ready', this.editor)
          this.editor.setContent(this.readyValue)
          this.editor.addListener('contentChange', () => {
            this.$emit('input', this.editor.getContent())
          })
        })
      })
    },
    // 动态添加JS依赖
    _loadScripts () {
      // 确保多个实例同时渲染时不会重复创建SCRIPT标签
      if (window.loadEnv) {
        return new Promise((resolve, reject) => {
          window.loadEnv.on('scriptsLoaded', function () {
            resolve()
          })
        })
      } else {
        window.loadEnv = new LoadEvent()
        return new Promise((resolve, reject) => {
          // 如果在其他地方只引用ueditor.all.min.js，在加载ueditor.config.js之后仍需要重新加载ueditor.all.min.js，所以必须确保ueditor.config.js已加载
          // this._loadService().then(() => this._loadConfig()).then(() => this._loadCore()).then(() => {
          //   window.loadEnv.emit("scriptsLoaded");
          //   resolve();
          // });
          const that = this
          that._loadParse().then(() => that._loadConfig()).then(() => that._loadCore()).then(() => that._loadService()).then(() => {
            window.loadEnv.emit('scriptsLoaded')
            resolve()
          }).catch(err => {
            console.error(err)
          })
        })
      }
    },
    _loadConfig () {
      return new Promise((resolve, reject) => {
        if (
          !!window.UE &&
          !!window.UEDITOR_CONFIG &&
          Object.keys(window.UEDITOR_CONFIG).length !== 0
        ) {
          resolve()
          return
        }
        let configScript = document.createElement('script')
        configScript.type = 'text/javascript'
        configScript.src =
          this.mixedConfig.UEDITOR_HOME_URL + 'neditor.config.js'
        document.getElementsByTagName('head')[0].appendChild(configScript)
        configScript.onload = function () {
          if (
            !!window.UE &&
            !!window.UEDITOR_CONFIG &&
            Object.keys(window.UEDITOR_CONFIG).length !== 0
          ) {
            resolve()
          } else {
            console &&
              console.error(
                '加载ueditor.config.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!'
              )
          }
        }
      })
    },
    _loadService () {
      return new Promise((resolve, reject) => {
        let coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'neditor.service.js'
        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = function () {
          resolve()
        }
      })
    },
    _loadParse () {
      return new Promise((resolve, reject) => {
        let coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src =
          this.mixedConfig.UEDITOR_HOME_URL + 'neditor.parse.min.js'
        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = function () {
          resolve()
        }
      })
    },
    _loadCore () {
      return new Promise((resolve, reject) => {
        if (!!window.UE && !!window.UE.getEditor) {
          resolve()
          return
        }
        let coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'neditor.all.js'
        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = function () {
          resolve()
          // if (!!window.UE && !!window.UE.getEditor) {
          //   resolve();
          // } else {
          //   console &&
          //     console.error(
          //       "加载ueditor.all.min.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!"
          //     );
          // }
        }
      })
    },
    // 设置内容
    _setContent (value) {
      if (this.isReady) {
        value === this.editor.getContent() || this.editor.setContent(value)
      } else {
        this.readyValue = value
      }
    }
  },
  beforeDestroy () {
    // if (this.editor.queryCommandState('source') !== 0) {
    //   this.editor.execCommand('source')
    //   console.log(this.value)
    //   this.editor ? this._setContent(this.value) : this._beforeInitEditor(this.value)
    // }
    if (this.destroy && this.editor && this.editor.destroy) {
      this.editor.destroy()
    }
  },
  // v-model语法糖实现
  watch: {
    value: {
      handler (value) {
        this.editor ? this._setContent(value) : this._beforeInitEditor(value)
      },
      immediate: true
    }
  },
  deactivated () {
    this.readyValue = this.value
  }
}
</script>
