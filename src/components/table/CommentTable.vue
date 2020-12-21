<template>
  <section class="comment-table-container">
    <div
      class="head-checkall"
      v-if="showCheckAll === 'head'">
      <el-checkbox
        @change="handleCheckAll"
        v-model="checkAll"
        :disabled="data.length === 0"
        :indeterminate="isIndeterminate" >全选</el-checkbox>
        <base-header
          @handleAll="handleAll"
          v-bind="header"/>
    </div>
      <ul class="ct-wrap">
        <el-checkbox-group v-model="keys" @change="changeKey">
          <li class="ct-box" v-for="(item,index) in data" :key="index">
            <div  class="ct-box__cont">
              <el-checkbox :label="getPropText(item,rowKey)" class="ct-box__checkbox"></el-checkbox>
              <div style="display:flex">
                <div v-for="(col,colIndex) in columns" :key="colIndex"  class="ct-box__item">
                  <jee-icon :style="{'margin-left':col.iconLeft||'5px'}" class="ct-box__tag"
                    :class="{time: col.scopeType === 'time'}"
                    v-if="col.icon" :iconClass="col.icon"></jee-icon>
                  <label v-if="col.label">{{col.label}}</label>
                  <span v-if="col.scopeType === 'user'" @click="handleUesr(item,index)" class="jee-color">{{getPropText(item,col.prop)||'匿名用户'}}</span>
                  <span v-else-if="col.scopeType === 'ip'" @click="handleIP(item,index)">[ IP:<span class="jee-color">{{getPropText(item,col.prop)}}</span> ]</span>
                  <span v-else-if="col.scopeType === 'time'" >{{$moment(getPropText(item,col.prop))}}</span>
                  <span v-else :style="{color:col.texColor || '#666666','margin-left':col.textLeft || '5px'}">{{getPropText(item,col.prop)}}</span>
                </div>
              </div>
              <div style="margin-left:30px;display:flex;margin-right:auto;">
                <div v-for="(sta,staIndex) in statusList" :key="staIndex"  class="ct-box__status" v-show='item[sta.showColunms]||item[sta.showColunms]===0 || false'>
                  <jee-icon :style="{'margin-left':sta.iconLeft||'5px'}" class="ct-box__tag" v-if="sta.icon" :iconClass="sta.icon"></jee-icon>
                  <label v-if="sta.label">{{sta.label}}</label>
                  <span v-if="sta.scopeType === 'status'"
                    :style="{color:getTextColor(sta,getPropText(item,sta.prop)) || '#666666'}" >{{getFormatter(sta,getPropText(item,sta.prop))}}</span>
                  <span v-else :style="{color:sta.texColor || '#666666'}">{{getPropText(item,sta.prop)}}</span>
                </div>
              </div>
              <div style="display:flex;font-size:14px;padding-right: 21px;position: relative;" v-if='showReports'>
                <template>
                  <slot :name="reports" :scope="item"></slot>
                </template>
              </div>
            </div>
            <div class="nr-box">
              <div v-for="(com,comIndex) in comments" :key="comIndex"  class="nr-detail">
                <div v-if="item[com.showComment]">
                  <label v-if="com.label" class="nr-label">{{com.label}}</label><span class="nr-text">{{getPropText(item,com.prop)}}</span><span v-if="com.reply" class="nr-reply">(<span>{{getPropText(item,com.replyUesr)}}-</span><span>{{$moment(getPropText(item,com.replyTime))}}</span>)</span>
                </div>
              </div>
            </div>
            <div class="foot-box">
              <div class="foot-title" v-if='showTitle'>
                [<span>{{getPropText(item,title)}}</span>]<span @click="handleOpenNews(item,index)" class="jee-color">{{getPropText(item,titleText)}}</span>
              </div>
              <div class="foot-comment" v-if='showComment'>
                <jee-icon iconClass='huifu1'></jee-icon>
                <span class="jee-color" @click="handleOpencomment(item,index)">查看全部评论</span>
                <span
                  :title="comNum.label"
                  v-for="(comNum,comNumIndex) in commentsNum" :key="comNumIndex" class="foot-comNum">
                  <span v-if="comNumIndex === 0">[ </span>
                  <span>{{comNum.label}}</span>
                  <span>{{comNum.text === 'allNum' ? ':' : ' '}}</span>
                  <span>{{getPropText(item, comNum.text)}}</span>
                  <span v-if="comNumIndex < commentsNum.length - 1" style='padding-left: 8px'>|</span>
                  <span v-if="comNumIndex === commentsNum.length - 1"> ]</span>
                </span>
              </div>
              <div class="foot-buttons">
                <template
                  v-for="(btn, index) in footButtons"
                >
                  <el-tooltip
                    :key='index'
                    :content="btn.text"
                    placement="bottom"
                    effect="light">
                    <el-button
                      class="buttons"
                      type='empty'
                      size='small'
                      @click="handleEvent(btn.type,item)"
                      v-show="hiddenFn(btn,item)">
                      <jee-icon :iconClass="btn.icon"></jee-icon>
                    </el-button>
                  </el-tooltip>
                </template>
              </div>
            </div>
          </li>
        </el-checkbox-group>
      </ul>
      <div v-if="data.length === 0" style="line-height: 155px;text-align: center;font-size: 20px;color: #666;">
        暂无数据
      </div>
      <div class="ct-footer">
        <div v-if="showCheckAll === 'foot'">
          <el-checkbox
          @change="handleCheckAll"
          v-model="checkAll"
          :disabled="data.length === 0"
          :indeterminate="isIndeterminate" >全选</el-checkbox>
          <!-- <el-select v-model="value" size="small">
            <el-option :label="option.name" :value="option.id" v-for="(option,index) in linkData" :key="index"></el-option>
          </el-select> -->
        </div>
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
  name: 'commentTable',
  mixins: [baseHeader],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    showComment: {
      type: Boolean,
      default: true
    },
    showReports: {
      type: Boolean,
      default: false
    },
    showCheckAll: {
      type: String,
      default: ''
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
    title: {
      type: String,
      default: ''
    },
    titleText: {
      type: String,
      default: ''
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
    reports: {
      type: String,
      default: ''
    },
    statusList: {
      type: Array,
      default: () => {
        return []
      }
    },
    commentsNum: {
      type: Array,
      default: () => {
        return []
      }
    },
    footButtons: {
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
    // 评论内容
    comments: {
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
    },
    header: {
      type: Object,
      default: () => {
        return { 'showAlertIcon': false }
      }
    }
  },
  data () {
    return {
      value: '',
      keys: [],
      checkAll: false,
      isIndeterminate: false
    }
  },
  filters: {
    // 循环数组字段
    arrFilter (val) {
      console.log(val)
    }
  },
  methods: {
    popoverClick (item) {
      this.$emit('popoverClick', item)
    },
    // 批量操作
    handleAll (btn) {
      this.$emit(`handleBatchAll`, this.keys, btn)
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
    handleUesr (item, index) {
      if (item.user) {
        this.$emit(`handleUesr`, item, index)
      }
    },
    handleIP (item, index) {
      this.$emit(`handleIP`, item, index)
    },
    handleOpencomment (item, index) {
      this.$emit(`handleOpencomment`, item, index)
    },
    handleOpenNews (item, index) {
      this.$emit(`handleOpenNews`, item, index)
    },
    //
    handleEvent (type, item) {
      this.$emit(`handle${type}`, item)
    },
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    // 获取多层字段
    getPropText (item, prop, formatProp) {
      var i = prop.indexOf('.')
      if (i > -1) {
        var data = prop.split('.')
        var obj = item
        const loop = function (data) {
          if (data instanceof Array) {
            data.forEach(v => {
              if (obj[v]) {
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
    // 获取动态字段
    getFormatter (data, cellValue) {
      if (cellValue || cellValue === 0) {
        const opt = data.options.find(d => d.value === cellValue)
        return opt ? opt.label : '待审核'
      }
    },
    // 获取字体颜色
    getTextColor (data, cellValue) {
      const opt = data.options.find(d => d.value === cellValue)
      return opt ? opt.color : ''
    },
    // 隐藏按钮
    hiddenFn (btns, item) {
      var status = true
      if (btns.hiddenKey) {
        if (item[btns.hiddenKey] === btns.hiddenValue) {
          status = true
        } else {
          status = false
        }
      } else if (btns.hiddenFunc instanceof Function) {
        status = btns.hiddenFunc(item)
      }
      return status
    }
  }
}
</script>

<style lang="scss">
  .comment-table-container{
    .head-checkall{
      height: 36px;
      line-height: 36px;
      margin: 18px 20px 30px;
      display: flex;
      .el-checkbox{
        padding-right: 20px;
        .el-checkbox__label{
          color: #333333;
        }
      }
    }
    .ct-wrap{
      width: 100%;
      .el-checkbox-group{
        height: inherit;
         .el-checkbox{
            &__label{
              display: none;
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
        margin-bottom: 30px;
        overflow: hidden;
        &__cont{
          display: flex;
          width: 100%;
          height: 41px;
          box-sizing: border-box;
          color: #666666;
          align-items: center;
          border-bottom:1px solid #E8E8E8;
        }
        &__checkbox.el-checkbox{
          width: 14px;
          height: 14px;
          margin: 0 21px;
          padding-bottom: 0;
        }
        &__item{
          line-height: 16px;
          color: #666666;
          display: flex;
          font-size: 14px;
          margin-right: 5px;
          .jee-color{
            cursor: pointer;
          }
        }
        &__reports{
          display: flex;
          font-size: 14px;
        }
        &__tag{
          color: #777777;
          fill: #777777;
          font-size: 14px;
          margin-right: 10px;
          &.time{
            fill: #999999;
          }
        }
        &__status{
          font-size: 14px;
          margin-right: 5px;
        }
        &:last-of-type{
          margin-bottom: 0;
        }
      }
      .nr-box{
        width: 100%;
        // min-height: 150px;
        box-sizing: border-box;
        padding: 40px 20px 25px;
        font-size: 14px;
        color: #333333;
        .nr-detail{
          margin-bottom: 15px;
          .nr-label{
            color: #999999;
            margin-right: 10px;
          }
          .nr-text{
            // font-weight: 600;
            margin-right: 10px;
          }
          .nr-reply{
            // font-weight: 600;
          }
        }
      }
      .foot-box{
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        background-color: #F9F9F9;
        // border-top:1px solid #E8E8E8;
        font-size: 14px;
        line-height: 40px;
        padding: 0 20px;
        .foot-title{
          display: flex;
          float: left;
          cursor: pointer;
          color: #666666;
          .jee-color{
            margin-left: 10px;
            width: 100px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
          }
        }
        .foot-comment{
          float: left;
          display: flex;
          margin-left: 19px;
          line-height: 40px;
          .jee-svg-icon{
            margin-top: 11px;
            margin-right: 5px;
            cursor: pointer;
          }
          .jee-color{
            cursor: pointer;
          }
          .foot-comNum{
            margin-left: 10px;
            color: #666666;
          }
        }
        .foot-buttons{
          float: right;
          display: flex;
          padding-top: 4px;
          .buttons{
            padding: 0;
            width: 40px;
            height: 32px;
            margin-left: 10px;
            .jee-svg-icon{
              padding-right: 0;
            }
            &:not(:hover){
              background-color: transparent;
            }
          }
        }
      }
    }
    .ct-footer{
      padding-top: 10px;
    }
  }

</style>
