<template>
  <el-dialog
    class="content-workflow-dialog-container"
    v-loading="loading"
    title="查看流程"
    :visible.sync="dialogVisible"
    :fullscreen='true'
  >
    <el-container>
      <el-main>
        <div class="flow-wrap scrollbar">
          <div id="mountNode"></div>
        </div>
      </el-main>
      <el-aside width="427px">
        <div class="record-container">
          <div class="header-title">流转记录</div>
          <div class="record-wrap scrollbar">
            <el-timeline>
              <template v-for="(item, index) in records">
                <el-timeline-item :key="index"
                  :timestamp="item.flowTime"
                  :hide-timestamp="true"
                  primary="primary"
                  class="jee-timeline-tail"
                >
                  <el-card>
                    <div class="node-title">
                      <div class="title">
                        <span>{{item.node.label}}</span>
                        <span :class="item.actionRecords[0]?item.actionRecords[0].actionCode:''">【{{item.actionName}}】</span>
                      </div>
                      <div class="handletime" v-if="item.node.jointlySign">
                        <span class="label">处理时间</span>
                        <span class="suffix">：</span>
                        <span>{{item.flowTime}}</span>
                      </div>
                    </div>
                    <!-- 单条记录 -->
                    <div class="record" v-if="item.actionRecords.length &&!item.node.jointlySign">
                      <ul>
                        <li>
                          <span class="label">操作人</span>
                          <span class="suffix">：</span>
                          <span>{{item.actionRecords[0].username}}({{item.actionRecords[0].userRealName}})</span>
                        </li>
                        <li>
                          <span class="label">处理时间</span>
                          <span class="suffix">：</span>
                          <span>{{item.actionRecords[0].actionTime}}</span>
                        </li>
                        <li v-if="item.actionRecords[0].reason">
                          <span class="label">意见</span>
                          <span class="suffix">：</span>
                          <span>{{item.actionRecords[0].reason}}</span>
                        </li>
                      </ul>
                    </div>
                    <!-- 会签记录列表 -->
                    <div class="record-list" v-if="item.actionRecords.length &&item.node.jointlySign">
                      <template v-for="(record, index) in item.actionRecords">
                        <ul :key="index">
                          <li>
                            <span class="label">操作人</span>
                            <span class="suffix">：</span>
                            <span>{{record.username}}({{record.userRealName}})</span>
                            <span :class="record.actionCode">【{{record.actionName}}】</span>

                          </li>
                          <li>
                            <span class="label">处理时间</span>
                            <span class="suffix">：</span>
                            <span>{{record.actionTime}}</span>
                          </li>
                          <li v-if="record.reason">
                            <span class="label">意见</span>
                            <span class="suffix">：</span>
                            <span>{{record.reason}}</span>
                          </li>
                        </ul>
                      </template>
                    </div>
                  </el-card>
                  <div class="dot-wrap jee-bg-light" slot="dot">
                    <div class="dot"></div>
                  </div>
                </el-timeline-item>
              </template>
            </el-timeline>
          </div>
        </div>
      </el-aside>
    </el-container>
  </el-dialog>
</template>
<script>
import g6 from '@/components/plugin/G6/g6.readonly.js'
export default {
  name: 'myWorkflow',
  mixins: [g6],
  data () {
    return {
      contentId: '',
      loading: false,
      dialogVisible: false,
      form: {},
      records: []
    }
  },
  methods: {
    handleCancel () {
      this.dialogVisible = false
    },
    showDialog (contentId) {
      this.contentId = contentId
      this.dialogVisible = true
      this.$nextTick(() => {
        if (!this.graph) {
          this.initGraph()
          this.registerNode()
          this.registerEdge()
        }
        this.fetchProcessDiagram()
        this.fetchTaskActions()
      })
    },
    // 请求流程图信息
    fetchProcessDiagram () {
      this.loading = true
      this.$request.fetchTaskProcessDiagram({ contentId: this.contentId }).then(res => {
        if (res.code === 200) {
          this.form = res.data.flow
          const data = {
            nodes: res.data.nodes.map(d => {
              d.id = d.idCode
              return d
            }),
            edges: res.data.edges.map(d => {
              d.id = d.idCode
              return d
            })
          }
          this.graph.changeData(data)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 请求审核记录
    fetchTaskActions () {
      this.loading = true
      this.$request.fetchTaskActions({ contentId: this.contentId }).then(res => {
        if (res.code === 200) {
          this.records = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.el-dialog__wrapper.content-workflow-dialog-container{
  .el-dialog.is-fullscreen{
    margin: 0;
    max-height: 100%;
    border-radius: 0;
    .el-dialog__body{
      height: 100%;
      .el-container{
        .el-main{
          border: 1px solid #e8e8e8;
          border-right: none;
          border-radius: 4px 0 0 4px;
          .flow-wrap{
            height: 100%;
            overflow: overlay;
            position: relative;
            #mountNode{
              z-index: 1;
            }
          }
        }
        .el-aside{
          width: 427px;
          margin-right: 0;
          max-width: none;
          border-radius: 0 4px 4px 0;
          padding: 20px 0;
          .record-container{
            height: 100%;
            .header-title{
              line-height: 36px;
              font-size: 16px;
              color: #333333;
              border-bottom: 1px solid #e8e8e8;
              margin: 0 22px;
            }
            .record-wrap{
              height: calc(100% - 60px);
              padding: 0 22px;
              overflow-x: hidden;
              overflow-y: overlay;
                padding-top: 46px;
                .el-timeline-item{
                  .el-timeline-item__tail{
                    border-width: 4px;
                    border-radius: 4px;
                    height: calc(100% - 18px);
                    top: 18px;
                    left: 7px;
                  }
                  .dot-wrap{
                    margin: 3px;
                    position: relative;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    .dot{
                      border-radius: 50%;
                      position: absolute;
                      width: 8px;
                      height: 8px;
                      top: 1px;
                      left: 1px;
                      border: 1px solid #ffffff;
                    }
                  }
                  .el-timeline-item__wrapper{
                    top: -16px;
                  }
                  .el-card{
                    overflow: visible;
                    border-color: #e8e8e8;
                    .el-card__body{
                      position: relative;
                      // 三角
                      &::before{
                        content: '';
                        position: absolute;
                        left: -20px;
                        top: 16px;
                        width: 0;
                        height: 0;
                        border-width: 8px;
                        border-style: solid;
                        border-color: transparent rgba(0,0,0,0.05) transparent transparent ;
                        filter: blur(4px);
                      }
                      &::after{
                        content: '';
                        position: absolute;
                        top: 16px;
                        left: -16px;
                        width: 0;
                        height: 0;
                        border-width: 8px;
                        border-style: solid;
                        border-color: transparent #fff transparent transparent ;
                        /*border-color的四个值代表上右下左，分别实现下左上右箭头 */
                      }
                      .node-title{
                        padding-bottom: 20px;
                        .handletime{
                          padding-top: 10px;
                        }
                      }
                      span{
                        color: #333333;
                      }
                      .label{
                        color: #666666;
                        width: 58px;
                        display: inline-block;
                        text-align: justify;
                        text-align-last: justify;
                      }
                      .submit{
                        color:#FF9300;
                      }
                      .agree{
                        color:#6AC043;
                      }
                      .disagree{
                        color:#FF0000;
                      }
                      li + li{
                        padding-top: 11px;
                      }
                      .record-list{
                        ul{
                          padding: 20px 0;
                          border-top: 1px dashed #e8e8e8;
                          &:last-of-type{
                            padding-bottom: 0;
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
}
</style>
