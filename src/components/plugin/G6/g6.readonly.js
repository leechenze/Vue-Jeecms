import G6 from '@antv/g6'
import './edge.polyline.js'
// nodeLabel.offset: 默认节点上文字偏移量
G6.Global.defaultNode.style = {
  x: -89,
  y: -33,
  width: 178,
  height: 66,
  radius: 30,
  lineWidth: 3,
  stroke: '#a9a9a9',
  fill: 'l(0) 0:#D9D9D9 1:#BDBDBD',
  cursor: 'pointer'
}
G6.Global.defaultNode.color = '#a9a9a9'
G6.Global.defaultNode.size = [178, 66]
// nodeLabel.style: 默认节点上文字样式
G6.Global.nodeLabel.style = {
  fontFamily: 'PingFang SC',
  fontSize: 18,
  // fontWeight: 800,
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
  lineWidth: 3
}
// defaultEdge.size: 默认边线条宽度
G6.Global.defaultEdge.size = 3
// defaultEdge.color: 默认边颜色
G6.Global.defaultEdge.color = '#999999'
// edgeLabel.style：默认边上文字样式
G6.Global.edgeLabel.style = {
  fontSize: 18,
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
      graph: null,
      mode: 'readonly'
    }
  },
  methods: {
    // 注册节点
    registerNode () {
      // 注册自定义节点
      G6.registerNode('beginNode', {
        drawShape (cfg, group) {
          const rect = group.addShape('rect', {
            attrs: this.getShapeStyle(cfg)
          })
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
              stroke: cfg.activity ? '#E9862C' : '#A9A9A9',
              fill: cfg.activity ? 'l(0) 0:#F2D031 1:#FF8400' : 'l(0) 0:#D9D9D9 1:#BDBDBD'
            }
          })
          return rect
        }
      }, 'beginNode')
      // 注册自定义节点
      G6.registerNode('endNode', {}, 'beginNode')
    },
    // 注册边
    registerEdge () {
      // 注册自定义边
      G6.registerEdge('edge', {
        draw (cfg, group) {
          const startPoint = cfg.startPoint
          const endPoint = cfg.endPoint
          const shape = group.addShape('path', {
            attrs: {
              stroke: '#A9A9A9',
              lineWidth: 3,
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
              fontSize: 18,
              fontWeight: 800,
              textAlign: 'center',
              textBaseline: 'middle',
              stroke: '#999999',
              fill: '#999999',
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
            x: centerPoint.x - textBBox.width / 2,
            y: centerPoint.y - 20
          })
          return shape
        },
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
              stroke: '#A9A9A9',
              lineWidth: 3,
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
              fontSize: 18,
              fontWeight: 800,
              textAlign: 'center',
              textBaseline: 'middle',
              stroke: '#999999',
              fill: '#999999',
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
            x: centerPoint.x - textBBox.width / 2,
            y: centerPoint.y - 20
          })
          return shape
        },
        update: null
      }, 'polyline')
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
          readonly: ['drag-node', 'drag-canvas']
        }
      })
    }
  }
}
