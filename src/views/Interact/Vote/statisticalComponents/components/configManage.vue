<template>
  <section class="config-manage-wrap">
    <div class="cm-wrap scrollbar">
      <div class="cm-ques scrollbar">
        <div class="cm-ques-item" @click="changeQues(item)"
          :class="{'ques-active':avtiveQuesId === item.subjectId}"
          v-for="(item,index) in leftList" :key="index">
          <div class="cm-ques-option">
            <div class="">{{item.title}}</div>
            <div class="jee-color cm-ques__info t-12">【{{typeFilters(item.type)+' — '+item.number+'票'}}】</div>
            <p class="cm-ques__info cm-ques__last t-12" v-for="(info,infoIndex) in item.options" :key="infoIndex">
              <span>{{info.title}}</span>（<span>{{info.number+'票'}}</span> <span>{{info.rate+'%'}}</span>）
            </p>
          </div>
          <span class="cm-ques-line t-bottom"></span>
        </div>
      </div>
      <div class="cm-chars" v-show="showPie">
        <div class="cm-chars-btn jee-hover-color" @click="showChars = !showChars">
         <i :class="showChars?'el-icon-arrow-left':'el-icon-arrow-right'"></i> {{showChars?' 收起图表':'展开图表'}}
        </div>
        <div class="cm-chars-cont" v-show="showChars">
            <div id="quesPie" ref="quesPie"></div>
        </div>
      </div>
      <div class="cm-table">

          <search-header
      class="search-header"
          v-bind="searchHeader"
          :params="list.params"
          @handleBtn="handleBtnAll"
          @handleSearch="handleSearchs"
        ></search-header>
        <base-table
          v-bind="list"
          @handleSelectionChange="handleSelectionChange"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @sortChange="sortChange"
        >
          <template #province="scope">
            <span>{{scope.scope.row.province}}{{scope.scope.row.city}}</span>
          </template>
          <template #answer="scope">
            <div class="answer-item">
              <div v-if="(scope.scope.row.answer instanceof Array)">
                    <el-image class="t-img t-cursor"
                      v-if="typeFilter(scope.scope.row.answer[0].name) === 'img'"
                      @click="openFile(scope.scope.row.answer[0])"
                      :src="$getPath(scope.scope.row.answer[0].url)" fit="contain">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                    <div v-else class="result-info t-cursor"
                      @click="openFile(scope.scope.row.answer[0])">{{scope.scope.row.answer[0].name}}</div>
                </div>
                <div v-else class="ques-answer" >
                  <div class="result-info">{{scope.scope.row.answer}}</div>
                </div>
            </div>
          </template>
        </base-table>
      </div>
      <el-dialog  :width="width" :visible.sync="showFile" @close="closeDialog">
        <div v-if="fileType === 'video'">
          <video
            class="video"
            preload="auto"
            autoplay
            controls
            width="760"
            height="550"
            webkit-playsinline="true"
            playsinline="true"
            ref="videoEle"
            id="android"
          >
            <source :src="$getPath(fileUrl)" type="video/mp4">
          </video>
        </div>
        <div v-else-if="fileType === 'audio'">
          <audio :src="$getPath(fileUrl)" controls="controls"></audio>
        </div>
        <div v-else-if="fileType === 'img'">
          <el-image class="t-img" :src="$getPath(fileUrl)" fit="contain">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
var echarts = require('echarts')
const columns = [
  {
    prop: 'replayName',
    label: '参与人'
  },
  {
    prop: 'createTime',
    label: '参与时间',
    scopeType: 'time',
    minWidth: '160px',
    sortable: 'custom'
  },
  {
    prop: 'device',
    label: '网络设备',
    minWidth: '120px'
  },
  {
    prop: 'ip',
    label: '参与人IP地址',
    minWidth: '130px'
  },
  {
    prop: 'province',
    label: '地域',
    scopeType: 'slot'
  },
  {
    prop: 'answer',
    label: '填写内容',
    minWidth: '120px',
    scopeType: 'slot'
  }
]
export default {
  name: 'config-manage',
  mixins: [searchHeader, baseTable],
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showChars: true,
      avtiveQuesId: '',
      fileUrl: '',
      showFile: false,
      fileType: '',
      list: {
        columns,
        showSelection: false,
        showIndex: true,
        indexLabel: '序号',
        indexWidth: '120',
        api: '',
        params: {
          subjectId: '',
          'isEffective': '',
          'province': '',
          'city': '',
          'deviceType': '',
          'replayName': '',
          'ip': '',
          'beginTime': '',
          'endTime': '',
          region: [''],
          times: [],
          replayType: 1,
          replayText: '',
          options: '',
          orderBy: 1,
          'questionnaireId': Number(this.$route.query.id)
        },
        filterParams: ['region', 'times']
      },
      searchHeader: {
        searchItems: [
          {
            icon: 'daochuliebiao',
            type: 'henderBtn',
            title: '导出列表',
            btnType: 'exportList',
            class: 'hender-btn'
          },
          {
            icon: 'daochuquanbu',
            type: 'henderBtn',
            title: '导出全部',
            btnType: 'exportAll',
            class: 'hender-btn'
          },
          {
            value: 'region',
            label: '地域：',
            type: 'cascader',
            props: {
              label: 'areaName',
              value: 'id',
              checkStrictly: true
            },
            style: {
              width: '114px'
            },
            options: []
          },
          {
            type: 'select',
            value: 'deviceType',
            label: '网络设备：',
            style: {
              width: '99px'
            },
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '计算机',
                value: 1
              },
              {
                label: '移动设备',
                value: 2
              }
            ]
          },
          {
            type: 'timePicker',
            value: 'times',
            style: {
              width: '318px'
            }
          },
          {
            type: 'searchInput',
            value: 'replayText',
            isSelect: true,
            selectProp: 'replayType',
            style: {
              width: '250px'
            },
            options: [
              { label: '用户名', value: 1 },
              { label: 'IP', value: 2 }
            ]
          }
        ]
      },
      leftList: [],
      quesPie: [],
      pieOption: {
        legend: {
          show: true,
          orient: 'vertical',
          left: 0
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        color: ['#5DB1FF', '#59D4D4', '#68D48C', '#FBDB5A', '#F47E92', '#A97BE9', '#7072D8', '#435188'],
        series: [
          {
            name: '选项1',
            type: 'pie',
            radius: '100%',
            center: [85, 285],
            hoverAnimation: false,
            label: {
              position: 'inside',
              color: '#333333',
              formatter: '{d}%'
            },
            data: []
          }
        ]
      },
      showPie: true, // 是否显示图标控制按钮
      width: '821px',
      height: 'auto'
    }
  },
  methods: {
    sortChange (column, prop, order) {
      this.list.params.orderBy = order === 'descending' ? 1 : 2
      this.handleSearchs()
    },
    initPie () {
      let that = this
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs['quesPie'])
      // 绘制图表
      myChart.setOption(this.pieOption)
      myChart.on('legendselectchanged', function (params) {
        var arr = []
        for (let i in params.selected) {
          if (!params.selected[i]) {
            arr.push(i) // 属性
          }
        }
        var ids = arr.map(v => {
          let obj = that.quesPie.find(t => t.item === v)
          if (obj && obj.optionId) {
            return obj.optionId
          } else if (obj) {
            return obj.item
          }
        })
        that.list.params.options = ids.join(',')
        that.fetchTableApi()
      })
    },
    closeDialog () {
      this.showFile = false
    },
    typeFilter (url) {
      let suffix = url.slice(url.lastIndexOf('.') + 1)
      let image = this.$enums.imageType.filter(t => t.value === suffix)
      let video = this.$enums.videoType.filter(t => t.value === suffix)
      let audio = this.$enums.audioType.filter(t => t.value === suffix)
      let file = this.$enums.fileType.filter(t => t.value === suffix)
      let compress = this.$enums.compressType.filter(t => t.value)
      if (image.length > 0) {
        return 'img'
      } else if (audio.length > 0) {
        return 'audio'
      } else if (video.length > 0) {
        return 'video'
      } else if (file.length > 0) {
        return 'file'
      } else if (compress.length > 0) {
        return 'compress'
      }
    },
    changeQues (data) {
      this.avtiveQuesId = data.subjectId
      this.getList(data.subjectId, data.type)
    },
    fetchQuestionnaireAnswerSubjectExport (data) {
      var obj = this.leftList.find(t => t.subjectId === this.avtiveQuesId)
      let suffix = '.xlsx'
      if (obj && obj.type === 6) {
        suffix = '.zip'
      }
      this.$request.fetchQuestionnaireAnswerSubjectExport(data).then(res => {
        this.$exportClick(res, this.tabName + suffix)
        // file
      })
    },
    handleSearchs () {
      this.list.pageNo = 1
      var params = this.list.params
      if (params.times && params.times.length) {
        params.beginTime = params.times[0]
        params.endTime = params.times[1]
      } else {
        params.beginTime = ''
        params.endTime = ''
      }
      if (params.region && params.region.length) {
        // province city
        params.province = params.region[0]
        params.city = params.region[1] || ''
      }
      if (params.replayType) {
        params.replayName = params.replayType === 1 ? params.replayText : ''
        params.ip = params.replayType === 2 ? params.replayText : ''
      }
      this.list.params = params
      this.fetchTableApi()
    },
    handleBtnAll (data) {
      var params = this.list.params
      delete params.region
      delete params.times
      var formData = new FormData()
      Object.keys(params).forEach(k => {
        formData.append(k, params[k])
      })
      switch (data.btnType) {
        case 'exportList':
          // 导出列表
          formData.append('size', this.list.pageSize)
          formData.append('page', this.list.pageNo)
          this.fetchQuestionnaireAnswerSubjectExport(formData)
          break
        case 'exportAll':
          // 导出全部
          formData.delete('size')
          formData.delete('page')
          this.fetchQuestionnaireAnswerSubjectExport(formData)
          break
      }
    },
    getData () {
      let { id } = this.$route.query
      console.log(id)
      if (id) {
        this.$request.fetchQuestionnaireAnswerSubjectList({ questionnaireId: id }).then(res => {
          this.leftList = res.data
          if (res.code === 200 && res.data.length) {
            this.avtiveQuesId = res.data[0].subjectId
            this.getList(res.data[0].subjectId, res.data[0].type)
          } else {
            this.showPie = false
            this.list.data = []
          }
        })
        this.$request.fetchSystemAreaList({ parentId: '' }).then(res => {
          if (res.code === 200) {
            const nodes = res.data.map(d => {
              d.hasChildren = !d.isChild
              return d
            })
            let arr = [{ areaName: '全部', id: '' }]
            this.searchHeader.searchItems.find(t => t.value === 'region').options = arr.concat(nodes)
          }
        })
      }
    },
    getList (id, type) {
      this.list.api = 'fetchQuestionnaireAnswerSubjectPage'
      this.list.params.subjectId = id
      this.list.params.questionnaireId = parseInt(this.$route.query.id)
      this.fetchTableApi()
      if (type !== 3 && type !== 6) {
        this.showPie = true
        this.getPieData(id)
      } else {
        this.showPie = false
      }
    },
    getPieData (id) {
      let params = {
        questionnaireId: parseInt(this.$route.query.id),
        subjectId: id
      }
      this.$request.fetchQuestionnaireFindSubjectPieChart(params).then(res => {
        if (res.code === 200) {
          // optionId
          let arr = res.data.map(t => {
            return {
              name: t.item,
              value: t.count
            }
          })
          this.quesPie = res.data
          this.pieOption.series[0].data = arr
          var myChart = echarts.init(this.$refs['quesPie'])
          myChart.setOption(this.pieOption)
        }
      })
    },
    typeFilters (type) {
      let arr = ['', '单选题', '多选题', '问答题', '下拉题', '级联题', '附件题']
      return arr[parseInt(type)]
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          if (d.answer.indexOf('{') > -1) {
            d.answer = JSON.parse(d.answer)
          }
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    openFile (item) {
      this.fileType = this.typeFilter(item.name)
      if (this.fileType === 'compress') {
        window.open(this.$getPath(item.url))
      } else if (this.fileType === 'file') {
        window.open(this.$getPath(item.pdfUrl || item.url))
      } else {
        this.showFile = true
        this.fileUrl = this.$getPath(item.url)
        if (this.fileType === 'img') {
          this.width = item.width + 'px' || '600px'
          this.height = item.height + 'px' || 'auto'
        } else if (this.fileType === 'audio') {
          this.width = '400px'
          this.height = 'auto'
        } else {
          this.width = '821px'
          this.height = 'auto'
        }
      }
    }
  },
  activated () {
    this.getData()
  },
  mounted () {
    this.$nextTick(() => {
      this.getData()
      this.initPie()
    })
  }
}
</script>

<style lang="scss">
  .config-manage-wrap{
    border: 1px solid hsl(0, 0%, 91%);
    height: 555px;
    max-height: 700px;
    border-radius:0px 4px 4px 4px;
    .cm-wrap{
      height: 100%;
      display: flex;
      .cm-ques{
        min-width:270px;
        max-width: 270px;
        min-height: 100%;
        overflow-x: hidden;
        border-right: 1px solid #e8e8e8;
        box-sizing: border-box;
        &-item{
          padding: 20px;
          font-size: 14px;
          box-sizing: border-box;
          position: relative;
          cursor: pointer;
          &:hover{
            background-color: #F3F3F3;
          }
          &.ques-active{
            background-color: #F3F3F3;
          }
        }
        &-line{
          height: 1px;
          width: calc(100% - 40px);
          display: inline-block;
          position: absolute;
          bottom: 0;
          left: 20px;
        }
        &__info{
          margin-top:18px;
        }
        &__last{
          &:last-of-type{
            margin-bottom:0px;
          }
        }
        position: relative;
        &.scrollbar:hover::-webkit-scrollbar{
            width: 8px;
        }
      }
      .cm-chars{
        height: 100%;
        position: relative;
        &-cont{
          width: 210px;
          height: 100%;
          padding-top: 20px;
          box-sizing: border-box;
          border-right: 1px solid #e8e8e8;
          #quesPie{
            width: 170px;
            height: 370px;
            margin: 0 auto;
          }
        }
        &-btn{
          position: absolute;
          left: -1px;
          top: -36px;
          width: 112px;
          height: 36px;
          border: 1px solid #e8e8e8;
          border-bottom: none;
          box-sizing: border-box;
          border-radius: 4px 4px 0 0;
          text-align: center;
          line-height: 36px;
          cursor: pointer;
          font-size: 14px;
          color: #333333;
        }
      }
      .cm-table{
        padding: 20px;
        flex: 1;
        overflow-x: auto;
        .hender-btn{
          margin-left: 0 !important;
          &.active{
            .jee-svg-icon{
              fill:#FF9300;
              &:hover{
                fill:#FF9300;
              }
            }
          }
          &.el-link{
            margin-left: 20px !important;
          }
          .jee-svg-icon{
            margin: 0 !important;
          }
        }
      }
    }
    .answer-item{
      .t-img{
        width: 34px;
        height: 34px;
        border-radius: 4px;
      }
      .t-cursor{
        color: #3178EE;
      }
    }
  }
</style>
