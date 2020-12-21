<template>
  <section class="content-table-container" v-loading="loading">
      <div
        class="head-checkall"
        v-if="showCheckAll === 'head'">
        <el-checkbox style="margin-right:20px"
          @change="handleCheckAll"
          v-model="checkAll"
          :disabled="data.length === 0"
          :indeterminate="isIndeterminate" >全选</el-checkbox>
          <base-header
            @handleAll="handleAll"
            v-bind="header"/>
          <div v-if="showDropdown">
          <el-dropdown trigger="click"
            @command="handleCommand"
            :disabled="drop.disabled"
            :class="dropdownClass[drop.key]"
            @visible-change="val => visibleChange(val, drop)"
            placement='bottom-start'
            v-for="(drop,dropIndex) in drops" :key="dropIndex">
            <div class="el-dropdown-link">
              {{drop.label}}<i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown" :class='"content-table-dropdown-menu " + drop.menuClass'>
              <el-dropdown-item
                :command="drop.key+'-'+(drop.optionValue?dropMenu[drop.optionValue]:dropMenu.value)+'&'+dropMenu.type"
                v-for="(dropMenu,menuIndex) in drop.options" :key="menuIndex"
                v-show="!dropMenu.showBtn"
                :disabled="dropMenu.disabled"
              >
                <span>{{ drop.optionLabel?dropMenu[drop.optionLabel]:dropMenu.label}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="medium" @click="handleAll(button)"
            v-for="(button, buttonIndex) in buttons" :key="buttonIndex"
            :disabled="button.disabled" :type="button.type">
            <jee-icon
                :iconClass="button.icon"
                style="fill: #ffffff;font-size:16px;padding-right: 1px;"
                v-if="button.icon"></jee-icon>
            {{button.label}}</el-button>
        </div>
      </div>
      <ul class="ct-wrap">
        <el-checkbox-group v-model="keys" @change="changeKey">
          <li class="ct-box" v-for="(item,index) in data" :key="index">
            <el-checkbox
              class="ct-box__cont"
              :label="getPropText(item,rowKey)" >
              <div
                v-for="(col,colIndex) in columns" :key="colIndex"
                class="ct-box__item"
                :title="getPropText(item,col.prop)"
                v-bind="col.props"
                :style="col.style||''"
                >
                <label v-show="col.label">{{col.label}}</label>
                <span v-if="col.scopeType === 'model'"
                  :title="item.quote?item.quoteChannelName:(item.cmsContent?item.cmsContent.channelName:getPropText(item,col.prop))">
                  [{{item.quote?item.quoteChannelName:(item.cmsContent?item.cmsContent.channelName:getPropText(item,col.prop))}}]</span>
                <span v-else-if="col.scopeType === 'time'" >{{$moment(getPropText(item,col.prop))}}</span>
                <span v-else-if="col.scopeType === 'status'" >{{filterStatus(col,getPropText(item,col.prop))}}</span>
                <span
                  @click="getDetailPush(col,item)"
                  v-else-if="col.scopeType === 'link'"
                  class="jee-hover-color">{{getPropText(item,col.prop)}}</span>
                <span v-else-if="!col.scopeType">{{getPropText(item,col.prop)}}</span>
              </div>
            </el-checkbox>
            <el-row class="ct-box__bottom">
              <el-col :span="8">
                  <el-popover
                    v-if="getPropText(item,status) === 3"
                    popper-class="ct-pover"
                    placement="right"
                    trigger="hover"
                    >
                    <!-- <el-tag slot="reference" size="small" class="ct-box__tag ct-box__only">
                      {{getPropText(item,status)|statusFilter}}
                    </el-tag> -->
                    <el-tag slot="reference" size="small" class="ct-box__tag ct-box__only">
                      {{getPropText(item,status) ===1?'草稿':getPropText(item,status) ===2?'初稿':getPropText(item,status) ===3?'流转中':getPropText(item,status) ===4?'已审核':getPropText(item,status) ===5?'已发布':getPropText(item,status) ===6?'退回':getPropText(item,status) ===7?'下线':getPropText(item,status) ===9?'暂存':getPropText(item,status) ===10?'智能审核中':getPropText(item,status) ===11?'违禁内容':getPropText(item,status) ===12?'审核失败':'归档'}}
                    </el-tag>
                    <div class="workflow-detail-btn">
                      <span class='label'>当前节点：<span>{{item.currentNodeName}}</span></span>
                      <el-button type='primary' size='small' @click="handleClickWorkflow(item.cmsContent)">查看流程</el-button>
                    </div>
                  </el-popover>
                <!--列表底部左侧状态-->
                  <el-tag v-else-if="item.cmsContent" size="small" class="ct-box__tag ct-box__only"
                    :class="{'ct-box__green': item.cmsContent && item.cmsContent.status === 10, 'ct-box__red': item.cmsContent && item.cmsContent.status === 11, 'ct-box__yello': item.cmsContent && item.cmsContent.status === 12 }">
                    {{getPropText(item,status) ===1?'草稿':getPropText(item,status) ===2?'初稿':getPropText(item,status) ===3?'流转中':getPropText(item,status) ===4?'已审核':getPropText(item,status) ===5?'已发布':getPropText(item,status) ===6?'退回':getPropText(item,status) ===7?'下线':getPropText(item,status) ===9?'暂存':getPropText(item,status) ===10?'智能审核中':getPropText(item,status) ===11?'违禁内容':getPropText(item,status) ===12?'审核失败':'归档'}}
                  </el-tag>
                    <span
                      v-show="iconIndex<4"
                      v-for="(icon,iconIndex) in item.identIcons" :key="iconIndex">
                      <el-tooltip
                        class="ct-box__item"
                        :content="icon.label"
                        placement="bottom"
                        effect="light">
                        <jee-icon
                          v-if="icon.icon"
                          class="ct-box__tag"
                          :iconClass="icon.icon"></jee-icon>
                          <el-image
                            v-else-if="icon.img"
                            class="ct-box__tag"
                            :src="icon.img"
                            fit="contain">
                            <div slot="error" class="image-slot">
                              <i class="el-icon-picture-outline"></i>
                            </div>
                            </el-image>
                          <span v-else class="ct-box__tag">{{icon.label}}</span>
                        </el-tooltip>
                    </span>
                  <el-popover
                    v-if="item.identIcons.length>4"
                    popper-class="ct-pover"
                    placement="bottom"
                    trigger="hover"
                  >
                    <span
                    v-for="(icon,iconIndex) in item.identIcons.slice(4)" :key="iconIndex">
                      <jee-icon
                        v-if="icon.icon"
                        class="ct-pover__item"
                        :iconClass="icon.icon"></jee-icon>
                        <el-image
                          v-else-if="icon.img"
                          class="ct-pover__item"
                          :src="icon.img"
                          fit="contain">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                          </el-image>
                        <span v-else class="ct-pover__item">{{icon.label}}</span>
                    </span>
                    <i slot="reference" class="el-icon-more"></i>
                  </el-popover>
                  &nbsp;
              </el-col>
              <el-col :span="16">
                <div class="ct-box__btns">
                  <el-link
                    class="ct-box__btn"
                    v-for="(link,linkIndex) in linkData"
                    :key="linkIndex"
                    :disabled="item.operations&&link.power?(item.operations[link.power]?false:true):false"
                    :underline="false"
                    @click="handleEvent(link.type,link,item)"
                  >
                  <jee-icon
                    :iconClass="link.icon"
                    class="jee-hover-fill"
                    v-if="link.icon"></jee-icon>
                  {{link.name}}
                </el-link>
                <span class="ct-box__btn" v-if="popverBtns.length > 0">
                  <el-popover
                    popper-class="ct-pover"
                    placement="bottom"
                    trigger="hover"
                    @show="popoverClick(item)"
                   >
                   <div class="ct-pover__box">
                       <el-link
                          class="ct-pover__item jee-hover-color"
                          v-for="(info,infoIndex) in popverBtns"  :key="infoIndex"
                          :underline="false"
                          :disabled="(item.operations&&info.power?(item.operations[info.power]?false:true):false)||info.disabled"
                          @click="handleEvent(info.type,info,item)"
                        >
                        <jee-icon
                          :iconClass="info.icon"
                          class="jee-hover-fill"
                          :style="{fontSize:'12px'}"
                          v-if="info.icon"></jee-icon>
                        <el-image
                          v-if="info.img"
                          style="width:14px;height:14px;"
                          :src="info.img"
                          fit="contain">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                          </el-image>
                        {{info.name}}
                      </el-link>
                   </div>
                   <i slot="reference" class="el-icon-more"></i>
                  </el-popover>
                </span>
                </div>
              </el-col>
            </el-row>
          </li>
        </el-checkbox-group>
        <div
          style="min-height:60px"
          class="gray t-text-center"
          v-show="data.length === 0">暂无数据</div>
      </ul>
      <div class="ct-footer" >
        <el-pagination
          v-if="showPagination"
          class="ct-pagination"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :layout="pageLayout"
          :total="totalCount"
          :next-text="$t(nextText)"
          :prev-text="$t(prevText)"
          :pager-count="5"
          :hide-on-single-page="false"
          popper-class="jee-border jee-page"
        >
        </el-pagination>
      </div>

  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
export default {
  name: 'contentTable',
  mixins: [baseHeader],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    showDropdown: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    showCheckAll: {
      type: String,
      default: ''
    },
    header: {
      type: Object,
      default: () => {
        return { 'showAlertIcon': false }
      }
    },
    drops: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100, 200]
    },
    pageNo: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    totalCount: {
      type: Number,
      default: 0
    },
    pageLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    prevText: {
      type: String,
      default: 'global.prevPage'
    },
    nextText: {
      type: String,
      default: 'global.nextPage'
    },
    status: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    ids: {
      type: Array,
      default: () => {
        return []
      }
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    // 标识图标
    identIcons: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作按钮
    linkData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 下拉操作按钮
    popverBtns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      value: '',
      keys: [],
      checkAll: false,
      isIndeterminate: false,
      dropdownClass: {}
    }
  },
  watch: {
    ids (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.keys = this.ids
        if (this.keys.length !== 0) {
          this.isIndeterminate = false
        }
      }
    },
    data (newVal, oldVal) {}
  },
  filters: {
    // 循环数组字段
    arrFilter (val) {
    },
    statusFilter (val) {
      // console.log(val)
      var arr = ['', '草稿', '初稿', '流转中', '已审核', '已发布', '退回', '下线', '已归档', '', '智能审核中', '违禁内容', '审核失败']
      return arr[parseInt(val)]
    }
  },
  methods: {
    visibleChange (val, item) {
      const cls = val ? 'jee-dropdown' : ''
      this.$set(this.dropdownClass, item.key, cls)
    },
    // 页面跳转
    getDetailPush (col, item) {
      if (col.href) {
        var params = {
          id: this.getPropText(item, this.rowKey),
          ...this.setParams(col.params, item)
        }
        this.$routerLink(col.href, col.scopeType, params)
      }
    },
    // 参数整理
    setParams (data, item) {
      var obj = {}
      if (data instanceof Array) {
        data.forEach(v => {
          this.$set(obj, v.key, this.getPropText(item, v.value))
        })
      }
      return obj
    },
    // 状态过滤
    filterStatus (col, status) {
      var opt = col.filters.find(v => v.value === status)
      return opt ? opt.label : ''
    },
    // 底部菜单点击
    handleCommand (command) {
      this.$emit('handleCommand', command)
    },
    // 批量操作
    handleAll (btn) {
      this.$emit(`handleBatchAll`, this.keys, btn)
    },
    // 右侧弹出层
    popoverClick (item) {
      this.$emit('popoverClick', item)
    },
    // 多选框逻辑
    changeKey (val) {
      let checkedCount = val.length
      this.checkAll = checkedCount === this.data.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length
      this.$emit('handleCheckAll', val)
    },
    handleCheckAll (val) {
      var value = val ? this.data.map(v => { return this.getPropText(v, this.rowKey) }) : []
      this.keys = value
      this.isIndeterminate = false
      this.$emit('handleCheckAll', this.keys)
    },
    //
    handleEvent (type, btn, item) {
      // this.$emit(`handleEvent${type}`, item, btn)
      this.$emit(`handleEventAll`, item, btn)
    },
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    // 获取多层字段
    getPropText (item, prop, formatProp) {
      // console.log(item)
      var i = prop.indexOf('.')
      if (i > -1) {
        var data = prop.split('.')
        var obj = item
        const loop = function (data) {
          if (data instanceof Array) {
            data.forEach(v => {
              if (obj[v] || obj[v] === 0) {
                obj = obj[v]
              } else {
                obj = ''
              }
            })
          }
        }
        loop(data)
        if (obj instanceof Array) {
          obj = obj.join(',')
        }
        return obj
      } else {
        if (item[prop] instanceof Array) {
          item[prop] = item[prop].join(',')
        }
        return item[prop]
      }
    },
    // 点击查看流程
    handleClickWorkflow (item) {
      if (item && item.id) {
        this.$emit('handleClickWorkflow', item.id)
      }
    }
  }
}
</script>

<style lang="scss">
  .content-table-container{
    .head-checkall{
      height: 36px;
      line-height: 36px;
      margin: 6px 20px 20px;
      display: flex;
      .el-dropdown{
        border: 1px solid #E8E8E8;
        padding: 10px;
        color: #666666;
        border-radius: 4px;
        box-sizing: border-box;
        position: relative;
        font-size: 12px;
        line-height: 1;
        min-width: 145px;
        margin-right: 15px;
        margin-bottom: 10px;
        cursor: pointer;
        .el-icon-arrow-down{
          position: absolute;
          right:10px;
          top: 7px;
          color: #999999;
          font-size: 16px;
          &::before{
            content: "\e790";
          }
        }
      }
    }
    .ct-wrap{
      width: 100%;
      .el-checkbox-group{
        height: inherit;
         .el-checkbox{
            &__label{
              width: 100%;
              line-height: 15px;
              display: flex;
              flex-wrap: wrap;
              // flex-direction: row-reverse;
            }
         }
      }
      .ct-box{
        width: 100%;
        background-color: #fff;
        min-height: 112px;
        box-sizing: border-box;
        border: 1px solid #E8E8E8;
        border-radius:4px;
        margin-bottom: 20px;
        overflow: hidden;
        &__cont.el-checkbox{
          width: 100%;
          padding: 30px 60px 30px 20px;
          min-height: 75px;
          box-sizing: border-box;
          color: #999999;
          font-weight: 400;
          align-items: center;
          position: relative;
          display: flex;
        }
        &__bottom{
          width: 100%;
          min-height: 36px;
          line-height: 36px;
          background-color: #F9F9F9;
          padding: 0 50px;
          font-size: 12px;
          color: #777777;
          box-sizing: border-box;
        }
        &__btns{
         text-align: right;
        }
        &__item{
          min-width: 30px;
          line-height: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow:ellipsis;
          line-height: 16px;
          color: #999999;
          margin: 0 5px;
          display: inline-block;
        }
        &__tag{
          display: inline-block;
          vertical-align: middle;
          position: relative;
          margin-right: 15px;
          font-size: 14px;
          fill: #666;
          color: #666;
          border: none;
          cursor: pointer;
          &.el-image{
            width: 14px;
          }
        }
        &__only{
          text-align: center;
          /*width: 57px;*/
          height: 26px;
          font-size: 12px;
          line-height: 25px;
          fill: #1EC6DF;
          color: #1EC6DF;
          background-color: #E6F3F5;
        }
        &__green{
          background-color: #E0F2D6;
          color: #6AC043;
        }
        &__red{
          background-color: #FFC5C5;
          color: #FF0000;
        }
        &__yello{
          background-color: #ffe8c3;
          color: #FF9300;
        }
        &__btn{
          position: relative;
          margin: 0 12px;
          font-size: 12px;
          cursor: pointer;
          .jee-svg-icon{
            font-size: 12px;
            fill: #777777;
            margin-right: 5px;
          }
          &.is-disabled{
            .jee-svg-icon{
              fill: #ccc;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .ct-footer{
      padding-top: 20px;
      .ct-pagination{
        padding: 0 !important;
        display: block;
        float: right;
      }
    }

  }
  .ct-pover{
    padding: 0 !important;
    min-width: 135px !important;
    &__box{
      padding:8px 0;
    }
    &__item{
      padding: 0 12px !important;
      line-height: 28px;
      color: #666666 ;
      display: block !important;
      font-size: 12px;
      .jee-svg-icon{
          font-size: 12px;
          fill: #666;
          margin-right: 8px;
        }
      &:hover{
        background-color: #F3F3F3;
      }
    }
    .workflow-detail-btn{
      padding: 12px 20px 10px;
      .label{
        color: #666666;
        padding-right: 20px;
        span{
          color: #333333;
        }
      }
    }
  }
  .content-table-dropdown-menu{
    min-width: 145px;
  }
</style>
