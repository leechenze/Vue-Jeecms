import G6 from '@antv/g6'
import './edge.polyline.js'
import { randomWord } from '@/utils'
// 设置全局样式
// defaultNode.style: 默认节点样式
// defaultNode.size: 默认节点大小
// defaultNode.color：默认节点线条色
// nodeLabel.offset: 默认节点上文字偏移量
G6.Global.defaultNode.style = {
  x: -89,
  y: -33,
  width: 178,
  height: 66,
  radius: 30,
  lineWidth: 3,
  stroke: '#4F9336',
  cursor: 'pointer'
}
// nodeStateStyle[state]: 节点在state状态下的样式
// G6.Global.nodeStateStyle.selected = {
//   stroke: '#000000'
// }
// G6.Global.nodeStateStyle.active = {
//   stroke: '#e8e8e8'
// }
G6.Global.defaultNode.color = '#4F9336'
G6.Global.defaultNode.size = [178, 66]
// nodeLabel.style: 默认节点上文字样式
G6.Global.nodeLabel.style = {
  fontFamily: 'PingFang SC',
  fontSize: 18,
  // fontWeight: 600,
  textAlign: 'center',
  textBaseline: 'middle',
  fill: 'white',
  cursor: 'pointer'
}
// defaultEdge.style: 默认边样式
G6.Global.defaultEdge.style = {
  endArrow: {
    path: 'M -8,-8 A 12,12,0,0,1,-8,8 L 8,0 Z',
    d: 8
  },
  cursor: 'pointer',
  lineWidth: 2
}
// defaultEdge.size: 默认边线条宽度
G6.Global.defaultEdge.size = 2
// defaultEdge.color: 默认边颜色
G6.Global.defaultEdge.color = '#000000'
// edgeStateStyle[state]: 边在state状态下的样式
// G6.Global.edgeStateStyle.selected = {
//   stroke: '#000000'
// }
// G6.Global.edgeStateStyle.active = {
//   stroke: '#000000'
// }
// edgeLabel.style：默认边上文字样式
G6.Global.edgeLabel.style = {
  fontSize: 16,
  // fontWeight: 800,
  textAlign: 'center',
  textBaseline: 'bottom',
  stroke: 'black',
  fill: 'black',
  cursor: 'pointer'
}
export default {
  data () {
    return {
      data: {}, // 初始数据
      graph: null,
      currentNode: {}, // 当前节点或线的数据
      edge: null,
      addingEdge: false,
      movingEdge: false,
      selectItemId: {},
      mode: 'default',
      nodeTypes: ['begin', 'audit', 'end', 'line', 'beginline']
    }
  },
  watch: {
    // 变更模式
    mode (val) {
      console.log(val)
      this.graph.setMode(val)
    }
  },
  methods: {
    getDefaultForm () { return {} },
    // 注册节点
    registerNode () {
      const that = this
      const anchorAttrs = {
        x: 0,
        y: 0,
        r: 6,
        stroke: '#ffffff',
        fill: '#1580F8',
        fillOpacity: 0,
        strokeOpacity: 0,
        lineWidth: 2,
        cursor: 'crosshair',
        type: 'anchor',
        anchorType: 'in',
        anchorIndex: 0,
        shadowBlur: 4,
        shadowColor: '#999999'
      }
      const anchors = [
        {
          x: -92,
          y: 0,
          anchorIndex: 0
        },
        {
          x: 92,
          y: 0,
          anchorIndex: 1
        },
        {
          x: 0,
          y: -33,
          anchorIndex: 2
        },
        {
          x: 0,
          y: 33,
          anchorIndex: 3
        }
      ]
      const errorShapeAttrs = {
        x: -100,
        y: -45,
        width: 200,
        height: 90,
        radius: 4,
        stroke: 'red',
        lineWidth: 2
      }
      // 注册自定义节点
      G6.registerNode('beginNode', {
        drawShape (cfg, group) {
          const style = this.getShapeStyle(cfg)
          const rect = group.addShape('rect', {
            attrs: {
              ...style,
              stroke: '#4F9336',
              fill: 'l(0) 0:#81DB61 1:#6EBC52'
            }
          })
          // 锚点
          anchors.forEach(a => {
            group.addShape('circle', {
              attrs: {
                ...anchorAttrs,
                ...a
              },
              className: 'anchor'
            })
          })
          if (cfg.error) {
            group.addShape('rect', {
              attrs: errorShapeAttrs
            })
          }
          return rect
        },
        getAnchorPoints (cfg) {
          return [
            [0, 0.5],
            [1, 0.5],
            [0.5, 0],
            [0.5, 1]
          ]
        },
        setState: (name, value, item) => {
          // var shape = item.get('keyShape')
          const group = item.getContainer()
          const childrens = group.get('children')
          that.graph.setAutoPaint(false)
          const id = item.getModel().id
          const { source, target } = that.currentNode
          const isRelease = source === id || target === id
          if ((name === 'hover' || name === 'selected') && (!isRelease || that.movingEdge)) {
            if (value) {
              // 显示节点上的锚点
              childrens.forEach(shape => {
                if (shape.get('className') === 'anchor') {
                  shape.attr('fillOpacity', 1)
                  shape.attr('strokeOpacity', 1)
                  shape.attr('cursor', 'crosshair')
                }
              })
            } else {
              // 隐藏节点上的锚点
              childrens.forEach(shape => {
                if (shape.get('className') === 'anchor') {
                  shape.attr('fillOpacity', 0)
                  shape.attr('strokeOpacity', 0)
                  shape.attr('cursor', 'default')
                }
              })
            }
          }
          that.graph.setAutoPaint(true)
        },
        update: null
      }, 'rect')
      // 注册自定义节点
      G6.registerNode('auditNode', {
        drawShape (cfg, group) {
          const style = this.getShapeStyle(cfg)
          const rect = group.addShape('rect', {
            attrs: {
              ...style,
              radius: 4,
              stroke: '#E9862C',
              fill: 'l(0) 0:#F2D031 1:#FF8400'
            }
          })
          anchors.forEach(a => {
            group.addShape('circle', {
              attrs: {
                ...anchorAttrs,
                ...a
              },
              className: 'anchor'
            })
          })
          if (cfg.error) {
            group.addShape('rect', {
              attrs: errorShapeAttrs
            })
          }
          return rect
        }
      }, 'beginNode')
      // 注册自定义节点
      G6.registerNode('endNode', {
        drawShape (cfg, group) {
          const style = this.getShapeStyle(cfg)
          const rect = group.addShape('rect', {
            attrs: {
              ...style,
              stroke: '#AF2125',
              fill: 'l(0) 0:#FF3B3F 1:#DA181D'
            }
          })
          anchors.forEach(a => {
            group.addShape('circle', {
              attrs: {
                ...anchorAttrs,
                ...a
              },
              className: 'anchor'
            })
          })
          if (cfg.error) {
            group.addShape('rect', {
              attrs: errorShapeAttrs
            })
          }
          return rect
        }
      }, 'beginNode')
    },
    // 注册边
    registerEdge () {
      const that = this
      const setState = function (name, value, item) {
        const model = item.getModel()
        const sourceChildren = item.getSource().getContainer ? item.getSource().getContainer().get('children') : []
        const targetChildren = item.getTarget().getContainer ? item.getTarget().getContainer().get('children') : []
        that.graph.setAutoPaint(false)
        if (name === 'selected') {
          const showShape = function (shape) {
            shape.attr('fillOpacity', 1)
            shape.attr('strokeOpacity', 1)
            shape.attr('cursor', 'pointer')
          }
          const hideShape = function (shape) {
            shape.attr('fillOpacity', 0)
            shape.attr('strokeOpacity', 0)
            shape.attr('cursor', 'default')
          }
          if (value) {
            sourceChildren.forEach(shape => {
              if (shape.get('className') === 'anchor') {
                shape.get('attrs').anchorIndex === model.startPoint.index ? showShape(shape) : hideShape(shape)
              }
            })
            targetChildren.forEach(shape => {
              if (shape.get('className') === 'anchor') {
                shape.get('attrs').anchorIndex === model.endPoint.index ? showShape(shape) : hideShape(shape)
              }
            })
          } else {
            sourceChildren.forEach(shape => {
              if (shape.get('className') === 'anchor') hideShape(shape)
            })
            targetChildren.forEach(shape => {
              if (shape.get('className') === 'anchor') hideShape(shape)
            })
          }
        }
        if (name === 'moving') {
          const keyShape = item.getKeyShape()
          if (value) {
            keyShape.attr('stroke', '#1580F8')
            keyShape.attr('lineDash', [6, 2])
          } else {
            keyShape.attr('stroke', 'black')
            keyShape.attr('lineDash', [])
          }
        }
        that.graph.setAutoPaint(true)
      }
      // 注册自定义边
      G6.registerEdge('edge', {
        draw (cfg, group) {
          const startPoint = cfg.startPoint
          const endPoint = cfg.endPoint
          const shape = group.addShape('path', {
            attrs: {
              stroke: cfg.error ? 'red' : 'black',
              lineWidth: 2,
              path: [
                ['M', startPoint.x, startPoint.y],
                ['L', endPoint.x, endPoint.y]
              ],
              endArrow: {
                // https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
                path: 'M -8,-8 A 12,12,0,0,1,-8,8 L 8,0 Z',
                d: 8
              },
              cursor: 'pointer'
            }
          })
          const text = group.addShape('text', {
            attrs: {
              x: 0,
              y: 0,
              text: cfg.label,
              fontSize: 16,
              // fontWeight: 800,
              textAlign: 'center',
              textBaseline: 'middle',
              stroke: 'black',
              fill: 'black',
              cursor: 'pointer'
            }
          })
          /* 连接线的中间点 */
          const centerPoint = {
            x: startPoint.x + (endPoint.x - startPoint.x) / 2,
            y: startPoint.y + (endPoint.y - startPoint.y) / 2
          }
          const textBBox = text.getBBox()
          text.attr({
            x: centerPoint.x - 10 - textBBox.width / 2,
            y: centerPoint.y - 20
          })
          return shape
        },
        setState,
        update: null
      }, 'line')
      // 注册自定义边
      G6.registerEdge('polyEdge', {
        offset: 20,
        draw (cfg, group) {
          const { startPoint, endPoint, sourceNode, targetNode } = cfg
          const path = this.getPathByPoints([startPoint, endPoint], sourceNode, targetNode)
          const shape = group.addShape('path', {
            attrs: {
              stroke: cfg.error ? 'red' : 'black',
              lineWidth: 2,
              // path,
              path: path,
              endArrow: {
                path: 'M -8,-8 A 12,12,0,0,1,-8,8 L 8,0 Z',
                d: 8
              },
              cursor: 'pointer'
            }
          })
          const text = group.addShape('text', {
            attrs: {
              x: 0,
              y: 0,
              text: cfg.label,
              fontSize: 16,
              // fontWeight: 800,
              textAlign: 'center',
              textBaseline: 'middle',
              stroke: 'black',
              fill: 'black',
              cursor: 'pointer'
            }
          })
          /* 连接线的中间点 */
          const centerPoint = {
            x: startPoint.x + (endPoint.x - startPoint.x) / 2,
            y: startPoint.y + (endPoint.y - startPoint.y) / 2
          }
          const textBBox = text.getBBox()
          text.attr({
            x: centerPoint.x - 10 - textBBox.width / 2,
            y: centerPoint.y - 20
          })
          return shape
        },
        // 设置状态
        setState,
        update: null
      }, 'polyline')
    },
    // 注册行为
    registerBehavior () {
      const that = this
      // 注册拖拽锚点的交互
      G6.registerBehavior('drag-add-line', {
        getEvents () {
          return {
            // 'node:click': 'onClick',
            'node:mousedown': 'onMousedown',
            'mouseup': 'onMouseup',
            'mousemove': 'onMousemove'
          }
        },
        onMousemove (ev) {
          const point = { x: ev.x, y: ev.y }
          if (that.addingEdge && that.edge) {
            that.graph.updateItem(that.edge, {
              target: point
            })
          }
        },
        onMousedown (ev) {
          if (!that.movingEdge && that.addingEdge && that.edge) return
          const shape = ev.target
          const id = ev.item.getModel().id
          const { source, target } = that.currentNode
          const isRelease = source === id || target === id
          if (shape && shape.get('attrs').type === 'anchor' && !isRelease) {
            const shapeArrts = shape.get('attrs')
            const node = ev.item
            const point = { x: ev.x, y: ev.y }
            const model = node.getModel()
            // 添加线
            const id = randomWord(false, 4)
            const nodeType = model.nodeType === 'begin' ? 'beginline' : 'line'
            // 检查
            if (!that.checkFlowEdgeOut(node)) return
            let form = that.getDefaultForm(nodeType)
            form.id = id
            form.name = '动作'
            const actions = model.form.actions
            if (nodeType === 'line' && actions instanceof Array && actions.length) {
              form.actionOptions = actions.map(d => {
                return {
                  value: d.code,
                  label: d.name
                }
              })
            }
            let source = {
              id,
              source: model.id,
              sourceAnchor: shapeArrts.anchorIndex,
              target: point,
              shape: 'edge',
              label: '动作',
              nodeType,
              form
            }
            that.edge = that.graph.addItem('edge', source)
            that.$nextTick(() => {
              that.graph.setItemState(that.edge, 'moving', true)
            })
            that.addingEdge = true
          }
        },
        onMouseup (ev) {
          if (!that.movingEdge && that.addingEdge && that.edge) {
            const node = ev.item
            if (node && node.get('type') === 'node') {
              const shapeArrts = ev.target.get('attrs')
              const model = node.getModel()
              // 检查
              if (!that.checkFlowEdgeIn(node)) {
                that.graph.removeItem(that.edge)
              } else {
                // 更新线的目标点
                let target = {
                  target: model.id
                }
                if (shapeArrts.type === 'anchor') {
                  target.targetAnchor = shapeArrts.anchorIndex
                }
                that.graph.updateItem(that.edge, target)
                that.graph.setItemState(that.edge, 'moving', false)
              }
            } else {
              that.graph.removeItem(that.edge)
            }
            that.edge = null
            that.addingEdge = false
            that.mode = 'default'
          }
        },
        onClick (ev) {
          if (!['line', 'beginline'].includes(that.currentNode.nodeType)) return
          if (that.addingEdge && !that.movingEdge) return
          const shape = ev.target
          const node = ev.item
          const model = node.getModel()
          const shapeArrts = shape.get('attrs') || {}
          const point = { x: ev.x, y: ev.y }
          let target = {}
          // 点击控制点开始拖线
          if (shapeArrts.type === 'anchor' && !that.addingEdge && !that.edge) {
            that.edge = that.graph.findById(that.currentNode.id)
            that.addingEdge = true
            that.movingEdge = model.id === that.currentNode.source ? 'source' : 'target'
            // 调换头尾
            if (that.movingEdge === 'source') {
              const targetModel = that.edge.getModel()
              target.source = targetModel.target
              if ('targetAnchor' in targetModel) {
                target.sourceAnchor = targetModel.targetAnchor
              }
              target.startArrow = {
                path: 'M -8,-8 A 12,12,0,0,1,-8,8 L 8,0 Z',
                d: 8
              }
              target.endArrow = false
              target.style = {
                endArrow: false,
                startArrow: {
                  path: 'M -8,-8 A 12,12,0,0,1,-8,8 L 8,0 Z',
                  d: 8
                },
                stroke: '#1580F8'
              }
            } else {
              target.style = {
                stroke: '#1580F8'
              }
            }
            target.target = point
            that.graph.updateItem(that.edge, target)
          } else if (that.addingEdge) {
            // 点击目标更新线的目标点
            if (that.movingEdge === 'target' && !that.checkFlowEdgeIn(node)) {
              that.graph.removeItem(that.edge)
            } if (that.movingEdge === 'source' && !that.checkFlowEdgeOut(node)) {
              that.graph.removeItem(that.edge)
            } else {
              if (that.movingEdge === 'target') {
                target.target = model.id
                if (shapeArrts.type === 'anchor') {
                  target.targetAnchor = shapeArrts.anchorIndex
                }
              } else {
                const { source, sourceAnchor } = that.edge.getModel()
                target.target = source
                if (sourceAnchor instanceof Number) {
                  target.targetAnchor = sourceAnchor
                }
                target.source = model.id
                if (shapeArrts.type === 'anchor') {
                  target.sourceAnchor = shapeArrts.anchorIndex
                } else {
                  target.sourceAnchor = ''
                }
              }
              that.graph.updateItem(that.edge, target)
            }
            // 点击节点改线完成
            that.edge = null
            that.addingEdge = false
            that.movingEdge = false
            that.mode = 'default'
          }
        }
      })
      // 注册点击添加直线的交互
      G6.registerBehavior('click-add-line', {
        getEvents () {
          return {
            'node:click': 'onClick',
            'mousemove': 'onMousemove',
            'edge:click': 'onEdgeClick' // 点击空白处，取消边
          }
        },
        onClick (ev) {
          const shapeArrts = ev.target.get('attrs')
          const node = ev.item
          const point = { x: ev.x, y: ev.y }
          const model = node.getModel()
          if (that.addingEdge && that.edge) {
            // 检查
            if (!that.checkFlowEdgeIn(node)) {
              that.graph.removeItem(that.edge)
            } else {
              // 更新线的目标点
              let target = {
                target: model.id
              }
              if (shapeArrts.type === 'anchor') {
                target.targetAnchor = shapeArrts.anchorIndex
              }
              that.graph.updateItem(that.edge, target)
              that.graph.setItemState(that.edge, 'moving', false)
            }
            that.edge = null
            that.addingEdge = false
            that.mode = 'default'
          } else {
            // 添加线
            const id = randomWord(false, 4)
            const nodeType = model.nodeType === 'begin' ? 'beginline' : 'line'
            // 检查
            if (!that.checkFlowEdgeOut(node)) return
            let form = that.getDefaultForm(nodeType)
            form.id = id
            form.name = '动作'
            const actions = model.form.actions
            if (nodeType === 'line' && actions instanceof Array && actions.length) {
              form.actionOptions = actions.map(d => {
                return {
                  value: d.code,
                  label: d.name
                }
              })
            }
            let source = {
              id,
              source: model.id,
              target: point,
              shape: that.mode === 'line' ? 'edge' : 'polyEdge',
              label: '动作',
              nodeType,
              form
            }
            if (shapeArrts.type === 'anchor') {
              source.sourceAnchor = shapeArrts.anchorIndex
            }
            that.edge = that.graph.addItem('edge', source)
            that.$nextTick(() => {
              that.graph.setItemState(that.edge, 'moving', true)
            })
            that.addingEdge = true
          }
        },
        onMousemove (ev) {
          const point = { x: ev.x, y: ev.y }
          if (that.addingEdge && that.edge) {
            that.graph.updateItem(that.edge, {
              target: point
            })
          }
        },
        onEdgeClick (ev) {
          const currentEdge = ev.item
          // 拖拽过程中，点击会点击到新增的边上
          if (that.addingEdge && that.edge === currentEdge) {
            that.graph.removeItem(that.edge)
            that.currentNode = {}
            that.edge = null
            that.addingEdge = false
            that.mode = 'default'
          }
        }
      })
    },
    // 创建画布
    initGraph () {
      // 创建图形画布
      const Grid = require('@antv/g6/build/grid')
      const grid = new Grid()
      const width = document.querySelector('.flow-wrap').clientWidth
      const height = document.querySelector('.flow-wrap').clientHeight
      this.graph = new G6.Graph({
        container: 'mountNode',
        plugins: [ grid ],
        width: width * 2,
        height: height * 2,
        modes: {
          readonly: ['drag-canvas'],
          default: [{
            type: 'click-select',
            multiple: false
          }, 'drag-node', 'drag-canvas', {
            type: 'tooltip',
            formatText (model) {
              const cfg = model.errors
              const text = []
              if (cfg instanceof Array && cfg.length) {
                cfg.forEach(row => {
                  text.push(row + '<br>')
                })
              }
              return text.join('\n')
            },
            shouldBegin (e) {
              const item = e.item
              const err = item.getModel().errors
              if (!(err instanceof Array && err.length)) return false
              return true
            },
            shouldUpdate (e) {
              // 如果移动到节点文本上显示，不是文本上不显示
              if (e.target.type !== 'text') {
                return false
              }
              return true
            }
          }, {
            type: 'edge-tooltip',
            formatText (model) {
              const cfg = model.errors
              const text = []
              if (cfg instanceof Array && cfg.length) {
                cfg.forEach(row => {
                  text.push(row + '<br>')
                })
              }
              return text.join('\n')
            },
            shouldBegin (e) {
              const item = e.item
              const err = item.getModel().errors
              if (!(err instanceof Array && err.length)) return false
              return true
            },
            shouldUpdate: e => {
              // 如果移动到节点文本上显示，不是文本上不显示
              if (e.target.type !== 'text') {
                return false
              }
              return true
            }
          }],
          edit: ['drag-add-line'],
          line: ['click-add-line'],
          polyline: ['click-add-line']
        },
        defaultEdge: {
          // labelCfg: {
          //   // autoRotate: true,
          //   position: 'center', // 位置，start, end, center
          //   refY: 20,
          //   refX: -20
          // }
        }
      })
      // 加载数据
      this.graph.data(this.data)
      // 渲染画布
      this.graph.render()
    },
    // 选择节点或边的状态
    onSelectItem (item) {
      const nodes = this.graph.findAllByState('node', 'selected')
      if (nodes instanceof Array && nodes.length) {
        nodes.forEach(node => {
          this.graph.clearItemStates(node)
        })
      }
      const edges = this.graph.findAllByState('edge', 'selected')
      if (edges instanceof Array && edges.length) {
        edges.forEach(edge => {
          this.graph.clearItemStates(edge)
        })
      }
      if (item) {
        this.graph.setItemState(item, 'selected', true)
      }
    },
    // 监听事件
    listening () {
      const that = this
      // 监听画布点击事件
      this.graph.on('canvas:click', ev => {
        if (!that.checkSettingForm()) return
        that.currentNode = {}
        that.onSelectItem()
      })
      // 监听节点点击事件
      this.graph.on('node:click', ev => {
        if (that.mode !== 'default') return
        if (!that.checkSettingForm()) return
        const node = ev.item
        node.toFront()
        const model = node.getModel()
        if (model.id === that.currentNode.id) {
          // that.currentNode = {}
          // that.onSelectItem()
        } else {
          that.currentNode = model
          that.onSelectItem(node)
        }
      })
      // 监听边点击事件
      this.graph.on('edge:click', ev => {
        if (that.mode !== 'default') return
        if (!that.checkSettingForm()) return
        const edge = ev.item
        // graph.setItemState(edge, 'selected', !edge.hasState('selected')) // 切换选中
        // this.currentNode = edge.hasState('selected') ? edge.getModel() : {}
        const model = edge.getModel()
        if (model.id === that.currentNode.id) {
          // that.currentNode = {}
          // that.onSelectItem()
        } else {
          that.currentNode = model
          that.checkFlowEdgeConfig(edge)
          that.onSelectItem(edge)
        }
      })
      // 节点右键
      const menu = document.getElementById('contextMenu')
      this.graph.on('node:contextmenu', evt => {
        that.selectItemId = evt.item.getModel()
        menu.style.left = evt.clientX + 'px'
        menu.style.top = evt.clientY + 'px'
      })
      // 边右键
      this.graph.on('edge:contextmenu', evt => {
        that.selectItemId = evt.item.getModel()
        menu.style.left = evt.clientX + 'px'
        menu.style.top = evt.clientY + 'px'
      })
      // 边鼠标移开时隐藏右键
      this.graph.on('edge:mouseleave', evt => {
        menu.style.left = '-100px'
      })
      // 拖拽锚点画线
      this.graph.on('dragstart', function (ev) {
        that.addingEdge = true
      })
      this.graph.on('dragend', function (ev) {
        that.addingEdge = false
      })
      // 进入节点的锚点切换到编辑模式
      this.graph.on('mouseenter', ev => {
        const shape = ev.target
        if (that.mode === 'default' && shape && shape.get('attrs').type === 'anchor' && !that.addingEdge) {
          that.mode = 'edit'
        }
        if (that.mode === 'default' && shape && shape.get('attrs').type === 'control' && !that.addingEdge) {
          that.mode = 'transform'
        }
      })
      // 离开节点的锚点切换到默认模式
      this.graph.on('mouseleave', ev => {
        const shape = ev.target
        if (that.mode === 'edit' && shape && shape.get('attrs').type === 'anchor' && !that.addingEdge) {
          that.mode = 'default'
        }
        if (that.mode === 'transform' && shape && shape.get('attrs').type === 'control' && !that.addingEdge) {
          that.mode = 'default'
        }
      })
      // 进入节点显示锚点
      this.graph.on('node:mouseenter', function (ev) {
        var node = ev.item
        that.graph.setItemState(node, 'hover', true)
      })
      // 离开节点隐藏锚点
      this.graph.on('node:mouseleave', function (ev) {
        var node = ev.item
        const id = node.getModel().id
        if (id !== that.currentNode.id) {
          that.graph.setItemState(node, 'hover', false)
        }
        menu.style.left = '-100px'
      })
    }
  }
}
