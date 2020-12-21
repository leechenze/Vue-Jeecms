<template>
  <section class="config-manage-wrap1">
    <div class="cm-wrap scrollbar">
      <div v-for="item in dataInfo" :key="item.field" class="p-wrap-graph">
        <div v-if="item.pip" class="graph-item">
          <div class="title">{{item.itemLabel}}:</div>
          <div class="graph" :id="item.field" :ref="item.field" style="width: 500px; height: 185px"></div>
        </div>
        <div v-else class="view-item">
          <div class="title">
            <div class="txt">{{item.itemLabel}}:</div>
            <el-button size="small" type="primary" @click="showTable(item)">查看内容</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog  width="837px" :visible.sync="showDialog" :title="currentItem.itemLabel" custom-class="table-item">
      <el-table :data="listData" style="width: 100%"  :header-cell-style="headClass">
        <el-table-column prop="createUser" label="用户" width="180">
          <template slot-userName="userName">
          </template>
        </el-table-column>
        <el-table-column label="填写内容">
          <template slot-scope="scope">
            <div v-if="scope.row.dataType === 'imageUpload'" @click="openFile(scope.row)" class="dialog-img">
              <div v-if="scope.row.val.url" class="img-bg-p" >
                <div class="bgShow"></div>
                <img class="t-img p-imgItem" v-if="scope.row.val.url" :src="$getPath(scope.row.val.url)"/>
              </div>
            </div>
            <div v-else-if="['videoUpload','audioUpload'].includes(scope.row.dataType)"  @click="openFile(scope.row)" class="dialog-dataType" >
               {{ scope.row.val.resAlias}}
            </div>
            <div v-else-if="scope.row.dataType === 'multiImageUpload'" class="dialog-img"  >
              <div v-for="(imgList,idx) in scope.row.val" :key="idx" >
                <div @click="openMultiImageUpload(imgList,scope.row)" v-if="imgList.url" class="img-bg-p" >
                  <div class="bgShow"></div>
                  <img class="t-img" :src="$getPath(imgList.url)"/>
                </div>

              </div>
            </div>
            <div v-else-if="scope.row.dataType === 'fileUpload'" class="fileUpload-text">
              <div @click="openFile(scope.row,fileList)"  v-for="(fileList,idx) in scope.row.val" :key="idx" >
                <div class="fileUpload-item">{{ fileList.resAlias }} </div>
              </div>
            </div>
            <div v-else class="dialog-text"  @click="openFile(scope.row)">{{ scope.row.val }}</div>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size= pageSize
          layout="total, sizes, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
          :total= total>
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog :width="width"  :visible.sync="showFile" :title="dialogTitle" @close="closeDialog">
      <div v-if="fileType === 'video'" class="video-layer">
        <video
          class="video"
          preload="auto"
          autoplay
          controls
          width="760"
          height="427"
          webkit-playsinline="true"
          playsinline="true"
          ref="videoEle"
          id="android"
        >
          <source :src="$getPath(fileUrl)"  type="video/mp4">
        </video>
      </div>
      <div v-else-if="fileType === 'audio'">
        <audio :src="$getPath(fileUrl)"  ref="audioFile" controls></audio>
      </div>
      <div v-else-if="fileType === 'img'">
        <img class="t-img" :src="$getPath(fileUrl)" />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible"
      custom-class="transparent"
      class="image-preview-dialog "
      @close="closeImgDialog"
      append-to-body >
      <img class="t-img" :src="$getPath(fileUrl)" alt="">
    </el-dialog>
  </section>
</template>
<script>
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
var echarts = require('echarts')
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
      videoSrc: '', // 保存视频播放路径
      audioSrc: '', // 保存音频播放路径
      currentItem: {},
      showDialog: false,
      dialogVisible: false,
      fileUrl: '',
      showFile: false,
      dataInfo: [],
      tableData: [],
      listData: [], // 保存点击弹窗查看数据
      dialogTitle: '这是点击显示标题',
      currentPage4: 1, // 当前页
      fileType: '', // 这个是判断文件类型  如: png/jpg、video等
      width: '821px', // 点击单个图片或视频 默认显示的高
      height: 'auto', // 同上
      pageSize: 10, // 分页显示多少条
      total: 0, // 数据总数
      tableParams: {
        isRead: '',
        proviceCode: '',
        cityCode: '',
        isPc: '',
        username: '',
        ip: '',
        createTimeMin: '',
        createTimeMax: '',
        times: [],
        formId: this.$route.query.id,
        page: 1,
        size: 10,
        page_sort: 'createTime',
        page_sort_dir: 'desc'
      },
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
        color: ['#45A3FC', '#59D4D4', '#68D48C', '#FBDB5A', '#F47E92', '#A97BE9', '#7072D8', '#435188'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: '93%',
            center: ['68%', '50%'],
            hoverAnimation: false,
            label: {
              position: 'inside',
              color: '#333333',
              formatter: '{d}%'
            },
            data: []
          }
        ]
      }
    }
  },
  methods: {
    // 设置表格头部背景色
    headClass () {
      return 'background:#F9F9F9;'
    },
    async getData () {
      const res = await this.$request.fetchSmartFormGraph(this.$route.query)
      if (res.code === 200) {
        this.dataInfo = res.data
        for (let i in this.dataInfo) {
          if (this.dataInfo[i].itemLabel === '级联选择框') {
            this.dataInfo[i].itemLabel = '级联选择'
          }
        }
      }
    },
    initPie (ref, pieOption) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(ref))
      // 绘制图表
      myChart.setOption(pieOption)
    },
    showPie () {
      let pieOption = Object.assign({}, this.pieOption)
      let arr = []
      for (let i = 0; i < this.dataInfo.length; i++) {
        if (this.dataInfo[i].pip) {
          arr = this.dataInfo[i].data.map(t => {
            return {
              name: t.label,
              value: t.count
            }
          })
          pieOption.series[0].data = arr
          this.initPie(this.dataInfo[i].field, pieOption)
        }
      }
    },
    showTable (item) {
      this.currentItem = item
      this.fetchTableData()
      this.showDialog = true
    },
    async fetchTableData () {
      const res = await this.$request.fetchSmartFormDataList(this.tableParams)
      let tableData = []
      this.listData = []
      if (res.code === 200) {
        this.pageSize = res.data.size
        this.total = res.data.totalElements
        const obj = {}
        let arr = res.data.content
        for (let i in arr) {
          if (arr[i].createUser === 'anonymousUser') {
            arr[i].createUser = '匿名'
          }
          obj.createUser = arr[i].createUser

          for (let j in arr[i].datas) {
            if (arr[i].datas[j].field === this.currentItem.field) {
              arr[i].datas[j].createUser = arr[i].createUser
              tableData = arr[i].datas[j]
              if (arr[i].datas[j].dataType === 'fileUpload') {
                for (let p in tableData.val) {
                  if (p === tableData.val.length - 1) {
                    // tableData.val[p].resAlias = tableData.val[p].resAlias
                  } else {
                    tableData.val[p].resAlias = tableData.val[p].resAlias + '、'
                  }
                }
              }
              this.listData.push(tableData)
            }
          }
        }
      }
    },
    closeImgDialog () {
      this.dialogVisible = false
    },
    closeDialog () {
      if (this.fileType === 'video') {
        this.videoSrc = this.$refs.videoEle
        this.videoSrc.pause()
      } else if (this.fileType === 'audio') {
        this.audioSrc = this.$refs.audioFile
        this.audioSrc.pause()
      }
      this.showFile = false
    },
    openMultiImageUpload (item, datas) {
      this.dialogTitle = datas.label
      let imgUrls = item.url
      this.fileType = this.typeFilter(imgUrls)
      this.fileUrl = this.$getPath(imgUrls)
      this.dialogVisible = true
      if (this.fileType === 'img') {
        this.width = item.width + 'px' || '600px'
        this.height = item.height + 'px' || 'auto'
      } else if (this.fileType === 'audio') {
        this.width = '400px'
        this.height = 'auto'
      } else {
        this.width = '821px'
        this.height = '100%'
      }
    },
    openFile (item, res) {
      this.dialogTitle = item.label
      let imgUrls
      if (item.dataType === ('fileUpload' || '')) {
        imgUrls = res.pdfPath || res.url
      } else {
        imgUrls = item.val.url || res.imgUrl || res.url
      }
      this.fileType = this.typeFilter(imgUrls)
      if (this.fileType === 'compress') {
        window.open(this.$getPath(imgUrls))
      } else if (this.fileType === 'file') {
        window.open(this.$getPath(imgUrls))
      } else {
        this.fileUrl = this.$getPath(imgUrls)
        if (this.fileType === 'img') {
          this.dialogVisible = true
          this.width = item.width + 'px' || '600px'
          this.height = item.height + 'px' || 'auto'
        } else if (this.fileType === 'audio') {
          this.showFile = true
          this.width = '400px'
          this.height = 'auto'
          if (this.audioSrc) {
            this.audioSrc.src = this.$getPath(imgUrls)
          }
        } else if (this.fileType === 'video') {
          this.showFile = true
          this.width = '821px'
          this.height = '100%'
          if (this.videoSrc) {
            this.videoSrc.src = this.$getPath(imgUrls)
          }
        } else {
          this.showFile = true
          this.width = '821px'
          this.height = '100%'
        }
      }
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
    loadAudio (val) {
      if (!this.audio) {
        this.audio = this.$refs.audioFile
      }
      this.audio.load()
      this.playAudio = false
      this.audioWidth = '0%'
      this.getTimeWidth(this.audio, false)
    },
    titlePlay () {
      var _this = this
      _this.tiemsetInterval = setInterval(function () {
        // substring(0,i)取字符串的前i个字符
        var start = _this.file.fileName.substring(0, 1) // 取第1个字符
        var end = _this.file.fileName.substring(1)// 取1～msg.length-1的字符
        _this.file.fileName = end + start
      }, 200)
    },
    titleStop () { // 清楚定时器
      var _this = this
      clearInterval(_this.tiemsetInterval)
      _this.tiemsetInterval = null
      _this.file.fileName = _this.originalTitle
    },
    getTimeWidth (audio, status) {
      if (status) {
        this.timer = setInterval(() => {
          this.audioWidth = ((audio.currentTime || 0) / audio.duration) * 100 + '%'
        }, 3000)
      } else {
        clearInterval(this.timer)
      }
    },
    // 移除
    handleRemove () {
      this.loadAudio()
      this.file = {}
      this.$emit('input', '')
    },
    /**
     * 分页事件 start
     * */
    async handleSizeChange (val) {
      this.tableParams.page = this.currentPage4
      this.tableParams.size = val
      this.fetchTableData()
    },
    async handleCurrentChange (val) {
      this.currentPage4 = val
      this.tableParams.page = this.currentPage4
      this.tableParams.size = this.pageSize
      this.fetchTableData()
    }
    /**
     * 分页事件 end
     * */
  },
  activated () {
    this.tableParams.formId = this.$route.query.id
    this.getData()
    this.showPie()
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getData()
      this.showPie()
    })
  }
}
</script>

<style lang="scss">
  .config-manage-wrap1{
    border-top: 1px solid hsl(0, 0%, 91%);
    height: 555px;
    .p-wrap-graph{
      margin: 0px -1px -1px 0px
    }
    .table-item{
      padding-bottom: 60px;

    }
    .el-dialog{
      .el-table__header-wrapper{
        thead{
          color: #666;
          background: #f9f9f9;
        }
      }
    }
    .graph-item {
      // padding: 20px 0;
      padding: 20px 0px 15px 0;
      border-bottom: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
      .title {
        margin-bottom: 16px;
        color: #333;
        font-size: 16px;
        display: flex;
        align-items: center;
      }
    }

    .view-item {
      margin: 20px 0;
      .title {
        display: flex;
        align-items: center;
        color: #333;
        >.txt {
          width: 85px;
          margin-right: 10px;
          text-align: left;
        }
        >button{
          padding: 8px 20px;
        }
      }
    }
    .dialog-title {
      margin-bottom: 26px;
      color: #333;
      font-size: 18px;
    }
    .page-block{
      // margin-top: 30px;
      text-align: right;
      position: absolute;
      bottom: 0;
      right: 20px;
    }
    thead{
      height: 43px;
      line-height: 43px;
      tr{
        th{
            padding: 0;
          }
      }
    }
    .el-table__row{
      height: 43px;
      line-height: 43px;
      td{
        padding: 0;
        .cell{
          >.dialog-dataType{
            cursor: pointer;
            color: #3178EE;
          }
          >.dialog-img{
              display: flex;
              // justify-content: center;
            .img-bg-p{
              position: relative;
              width: 32px;
              height: 32px;
              margin-right: 10px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              background: #F0F0F0;
              cursor: pointer;
              overflow: hidden;
              >img{
                  // width: 100%;
                  object-fit: contain;
                  height: auto !important;
              }
            }
            .bgShow{
              width: 32px;
              height: 32px;
              position: absolute;
              z-index: 33;
              cursor: pointer;
              &:hover{
                background: rgba(0,0,0,0.5);
                border-radius: 4px;

              }
            }
            .t-img{
              width: 36px;
              height: 36px;
              cursor: pointer;
              .image-slot{
                width: 100%;
                height: 100%;
                .el-icon-picture-outline{
                  font-size: 36px;
                }
              }
            }
          }
          .fileUpload-text{
            display: flex;
            flex-wrap: wrap;
            .fileUpload-item{
              max-width: 100%;
              width: 100px;
              white-space:nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #3178EE;
              cursor: pointer;
            }
          }
          .dialog-text{
              // cursor: pointer;
              white-space:nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              // color: #3178EE;
          }
        }

      }
    }
  }
</style>
