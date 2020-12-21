<template>
  <section class="user-manage-wrap">

        <search-header
      class="search-header"
        v-bind="searchHeaders"
        :params="list.params"
        @handleBtn="handleBtnAll"
        @handleSearch="handleSearchs"
      ></search-header>
      <base-table
        v-bind="list"
        @handleSelectionChange="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        v-on:handleDelete="handleTableDelete"
        @sortChange="sortChange"
        @handleLink="handleTableLink"
      >
        <template #attrMap="scope">
          <div class="answer1-item">
            <template v-if="scope.scope.row.attrMap[scope.column.field]">
              <div class="col-wrap">
              <!-- 多图 -->
                <template v-if="['multiImageUpload', 'imageUpload'].includes(scope.column.dataType)">
                  <div v-for="item in (Array.isArray(scope.scope.row.attrMap[scope.column.field]) ? scope.scope.row.attrMap[scope.column.field] : [scope.scope.row.attrMap[scope.column.field]])" :key="item.id" class="img-wrap">
                    <el-image class="t-img t-cursor"
                              v-if="typeFilter(item.url) === 'img'"
                              @click="openFile(item)"
                              :src="$getPath(item.url)" fit="contain">
                      <!--                          :src="$getPath((scope.scope.row.attrMap[scope.column.field]).url)" fit="contain">-->
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                </template>
                <!-- 附件 -->
                <div v-else-if="['fileUpload'].includes(scope.column.dataType)" class="fileUpload-text">
                  <div v-for="(fileList,index) in scope.scope.row.attrMap[scope.column.field]" :key="index">
                    <div class="fileUpload-item" v-if="index === scope.scope.row.attrMap[scope.column.field].length-1" @click="openFile(fileList)">{{ fileList.resAlias }} </div>
                    <div v-else class="fileUpload-item" @click="openFile(fileList)">{{ fileList.resAlias  + '、'}}</div>

                  </div>
                </div>
                <!-- 单个音频、视频 -->
                <template v-else-if="['videoUpload', 'audioUpload',].includes(scope.column.dataType)">
                  <div class="result-info t-cursor"
                       @click="openFile(scope.scope.row.attrMap[scope.column.field])">{{scope.scope.row.attrMap[scope.column.field].resAlias}}</div>
                </template>
                <!-- 图片单选 -->
                <template v-else-if="scope.column.dataType === 'imageRadio'">
                  <div class="img-all">
                    <div class="radio-img"  @click="openFile(scope.scope.row.attrMap[scope.column.field])">
                      <!-- <img :src="$getPath(scope.scope.row.attrMap[scope.column.field].url)"/> -->
                      <el-image class="t-img" :src="$getPath(scope.scope.row.attrMap[scope.column.field].url)" fit="contain">
                        <div slot="error" class="image-slot"></div>
                      </el-image>
                      <p>{{scope.scope.row.attrMap[scope.column.field].label}}</p>
                    </div>
                  </div>
                </template>
                <!-- 图片多选 -->
                <template v-else-if="scope.column.dataType === 'imageCheckbox'">
                  <div class="img-all">
                    <div class="radio-img" v-for="(imgCheck,idx) in scope.scope.row.attrMap[scope.column.field]" :key="idx">
                      <!-- <img  @click="openFile(imgCheck)" :src="$getPath(imgCheck.url)"/> -->
                      <el-image class="t-img" @click="openFile(imgCheck)" :src="$getPath(imgCheck.url)" fit="contain">
                        <div slot="error" class="image-slot"></div>
                      </el-image>
                      <p>{{imgCheck.label}}</p>
                    </div>
                  </div>
                </template>
                <!-- 复选框 -->
                <template v-else-if="scope.column.dataType === 'checkbox'">
                  <div class="checkbox-all">
                    <div class="checkbox-item" v-for="(checkbox,idx) in scope.scope.row.attrMap[scope.column.field]" :key="idx">
                      <span v-if="idx === scope.scope.row.attrMap[scope.column.field].length-1"> {{checkbox}}</span>
                      <span v-else> {{checkbox+'、'}}</span>
                    </div>
                  </div>
                </template>
                <template v-else>{{scope.scope.row.attrMap[scope.column.field]}}</template>
              </div>
            </template>
            <template v-else>--</template>
          </div>
        </template>
      </base-table>
    <el-dialog  :width="width" :visible.sync="showFile"  @close="closeDialog">
      <div v-if="fileType === 'video'">
        <video
          class="video"
          preload="auto"
          autoplay
          controls
          width="760"
          height="550"
          webkit-playsinline
          playsinline
          ref="videoEle"
          id="android"
        >
          <source :src="$getPath(fileUrl)" type="video/mp4">
        </video>
      </div>
      <div v-else-if="fileType === 'audio'" class="audio-outline">
        <audio :src="$getPath(fileUrl)" controls="controls" id="auidoPlay"></audio>
      </div>
      <div v-else-if="fileType === 'img'">
        <el-image class="t-img" :src="$getPath(fileUrl)" fit="contain">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </el-dialog>
    <!-- 放大 -->
    <el-dialog :visible.sync="dialogVisible"
    class="image-preview-dialog" @close="closeDialog"
      append-to-body custom-class="transparent">
      <img class="t-img" :src="$getPath(fileUrl)" alt="">
    </el-dialog>
  </section>
</template>
<script>
import qs from 'qs'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import { mapActions, mapGetters } from 'vuex'
import { deepClone } from '@/utils'

const columns = [
  {
    prop: 'createUser',
    label: '参与人',
    minWidth: '100px'
  },
  {
    prop: 'createTime',
    label: '参与时间',
    scopeType: 'time',
    sortable: 'custom',
    minWidth: '186px'
  },
  {
    prop: 'systemInfo',
    label: '网络设备',
    minWidth: '124px'
  },
  {
    prop: 'ip',
    label: '参与人IP地址',
    minWidth: '156px'
  },
  {
    prop: 'address',
    label: '地域',
    minWidth: '148px'
  }
]
export default {
  name: 'user-manage',
  mixins: [searchHeader, baseTable],
  props: {
    tabName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      columns,
      list: {
        columns: [],
        showIndex: true,
        isIndexFixed: true,
        SerialNumber: 1, // 保存数据
        showTag: {
          flag: true,
          tagWidth: '73',
          type: 'icon',
          flagKey: 'isRead',
          iconClassArr: ['zhanneixinyidu', 'zhanneixinweidu']
        },
        indexLabel: '序号',
        indexWidth: '80',
        api: 'fetchSmartFormDataList',
        params: {
          isRead: '',
          proviceCode: '',
          cityCode: '',
          isPc: '',
          username: '',
          ip: '',
          createTimeMin: '',
          createTimeMax: '',
          region: [''],
          times: [],
          formId: this.$route.query.id,
          replayType: 1,
          replayText: '',
          page_sort: 'createTime',
          page_sort_dir: 'desc'
        },
        filterParams: ['region', 'times'],
        fields: [],
        handleColumn: [
          {
            type: 'Link',
            name: '详情',
            params: '',
            icon: 'xiangguanneirong',
            href: '/interact/smart/view'
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete'
          }
        ],
        handleColumnProp: {
          label: '操作',
          align: 'right',
          width: '156px',
          fixed: 'right',
          buttonAlign: 'row'
        },
        tableProps: {
          maxHeight: 550
        }
      },
      searchHeaders: {
        searchItems: [
          {
            icon: 'zhanneixinweidu',
            type: 'henderBtn',
            title: '标记为未读',
            btnType: 'setUnread',
            class: 'hender-btn active'
          },
          {
            icon: 'zhanneixinyidu',
            type: 'henderBtn',
            title: '标记为已读',
            btnType: 'setRead',
            class: 'hender-btn'
          },
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
            icon: 'delete',
            type: 'henderBtn',
            title: '删除',
            btnType: 'delete',
            class: 'hender-btn'
          },
          {
            type: 'select',
            value: 'isRead',
            label: '标记：',
            style: {
              width: '98px'
            },
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '已读',
                value: true
              },
              {
                label: '未读',
                value: false
              }
            ]
          },
          {
            value: 'region',
            label: '地域：',
            type: 'cascader',
            props: {
              label: 'areaName',
              value: 'areaCode',
              // value: 'id',
              checkStrictly: true
            },
            style: {
              width: '114px'
            },
            options: []
          },
          {
            type: 'select',
            value: 'isPc',
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
                value: true
              },
              {
                label: '移动设备',
                value: false
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
              width: '300px'
            },
            options: [
              { label: '参与人', value: 1 },
              { label: 'IP', value: 2 }
            ]
          }
        ]
      },
      showFile: false,
      dialogVisible: false,
      fileType: '',
      fileUrl: '',
      width: '821px',
      height: 'auto'
    }
  },
  computed: {
    ...mapGetters(['interact', 'areaOptions'])
  },
  methods: {
    ...mapActions('system', ['FetchSystemAreaTree']),
    handleTableLink (row, i, item) {
      this.SerialNumber = i + 1
      let ids = []
      ids.push(row.id)
      localStorage.SerialNumber = this.SerialNumber
      this.fetchSmartFormReadleTableSet(ids, true)
    },
    // 为了防止和其他有冲突  新建一个函数 去掉了点击详情进入显示操作成功的弹出窗
    fetchSmartFormReadleTableSet (ids, flag) {
      this.$request.fetchSmartFormReadSet({ ids, read: flag }).then(res => {
        this.fetchTableApi()
      })
    },
    sortChange (column, prop, order) {
      this.list.params.page_sort = 'createTime'
      if (order) {
        if (order === 'descending') {
          this.list.params.page_sort_dir = 'desc'
        } else if (order === 'descending') {
          this.list.params.page_sort_dir = 'asc'
        }
      } else {
        this.list.params.page_sort_dir = ''
      }
      this.handleSearchs()
    },
    handleTableDelete (row, index) {
      this.$confirm('是否确定删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.fetchSmartFormListDelete([row.id])
      }).catch(() => {})
    },
    fetchSmartFormListDelete (ids) {
      this.$request.fetchSmartFormListDelete({ ids: ids }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    fetchSmartFormReadSet (ids, flag) {
      this.$request.fetchSmartFormReadSet({ ids, read: flag }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        })
      })
    },
    fetchSmartFormDataExport (data, type) {
      let formId = this.list.params.formId
      let token = localStorage.getItem('JEECMS-Auth-Token')
      if (type === 'list') {
        const { params } = this.list
        window.open(`${this.$path}${this.$prefix}/smartFormData/export?${qs.stringify(params)}&JEECMS-Auth-Token=${token}`)
      } else {
        window.open(`${this.$path}${this.$prefix}/smartFormData/export?formId=${formId}&JEECMS-Auth-Token=${token}`)
      }
    },
    handleSearchs () {
      this.list.params.formId = this.$route.query.id
      this.list.pageNo = 1
      var params = this.list.params
      if (params.times && params.times.length) {
        params.createTimeMin = params.times[0]
        params.createTimeMax = params.times[1]
      } else {
        params.createTimeMin = ''
        params.createTimeMax = ''
      }
      if (params.region && params.region.length) {
        // province city
        params.proviceCode = params.region[0]
        params.cityCode = params.region[1] || ''
      }
      if (params.replayType) {
        params.username = params.replayType === 1 ? params.replayText : ''
        params.ip = params.replayType === 2 ? params.replayText : ''
      }
      this.list.params = params
      this.fetchTableApi()
    },
    handleBtnAll (data) {
      var ids = this.list.selectedKeys
      var params = this.list.params
      delete params.region
      delete params.times
      var formData = new FormData()
      Object.keys(params).forEach(k => {
        formData.append(k, params[k])
      })
      switch (data.btnType) {
        case 'setRead':
          // 有效
          if (ids.length) {
            this.fetchSmartFormReadSet(ids, true)
          } else {
            this.$message('请至少选择一条数据进行操作')
          }
          break
        case 'setUnread':
          // 无效
          if (ids.length) {
            this.fetchSmartFormReadSet(ids, false)
          } else {
            this.$message('请至少选择一条数据进行操作')
          }
          break
        case 'exportList':
          // 导出列表
          this.fetchSmartFormDataExport(formData, 'list')
          break
        case 'exportAll':
          // 导出全部
          this.fetchSmartFormDataExport(formData, 'all')
          break
        case 'delete':
          // 删除
          if (ids.length) {
            this.$confirm('是否确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.fetchSmartFormListDelete(ids)
            }).catch(() => {})
          } else {
            this.$message('请至少选择一条数据进行操作')
          }
          break
      }
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          if (d.createUser === 'anonymousUser') {
            d.createUser = '匿名'
          }
          d.systemInfo = d.systemInfo ? (d.isPc ? '计算机（' + d.systemInfo + '）' : '移动设备（' + d.systemInfo + '）') : ''
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    async handleFields () {
      const res = await this.$request.fetchSmartFormDetail(this.$route.query)
      if (res.code === 200) {
        const fieldArr = res.data.inputItems
        let columnsData = deepClone(this.columns)
        for (let i = 0; i < fieldArr.length; i++) {
          columnsData.push({
            prop: `attrMap`,
            label: fieldArr[i]['itemLabel'],
            field: fieldArr[i]['field'],
            dataType: fieldArr[i]['dataType'],
            scopeType: 'slot',
            renderHeader: (h, { column, index }) => {
              let l = column.label.length * 2
              const f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
              column.width = f * l < 178 ? 178 : f * l / 2 // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
              // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
              return h('div', { class: 'table-head', style: { width: '100%' } }, [
                column.label
              ])
            }
          })
        }
        this.list.columns = columnsData
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
    // 关闭视频暂停播放
    closeDialog () {
      if (this.fileType === 'video') {
        this.videoSrc = this.$refs.videoEle
        var vide = document.getElementById('android')
        vide.pause()
      } else if (this.fileType === 'audio') {
        var audio = document.getElementById('auidoPlay')
        audio.pause()
      }
      this.showFile = false
      this.dialogVisible = false
    },
    openFile (item) {
      this.fileType = this.typeFilter(item.url)
      if (this.fileType === 'compress') {
        window.open(this.$getPath(item.url))
      } else if (this.fileType === 'file') {
        window.open(this.$getPath(item.pdfPath || item.url))
      } else if (this.fileType === 'img') {
        this.width = item.width + 'px' || '600px'
        this.height = item.height + 'px' || 'auto'
        this.fileUrl = this.$getPath(item.url)
        this.dialogVisible = true
      } else {
        this.showFile = true
        this.fileUrl = this.$getPath(item.url)
        if (this.fileType === 'audio') {
          this.width = '400px'
          this.height = 'auto'
        } else if (this.fileType === 'video') {
          this.showFile = true
          this.width = '821px'
          this.height = '100%'
          if (this.videoSrc) {
            this.videoSrc.src = this.$getPath(item.url)
          }
        } else {
          this.width = '821px'
          this.height = 'auto'
        }
      }
    }
  },
  watch: {
    areaOptions (newData) {
      this.searchHeaders.searchItems.find(d => d.value === 'region').options = [
        {
          areaName: '所有',
          areaCode: ''
        },
        ...newData
      ]
    }
  },
  activated () {
    this.handleSearchs()
    this.handleFields()
  },
  mounted () {
    this.$nextTick(() => {
      this.FetchSystemAreaTree()
      this.handleFields()
      this.list.columns = this.columns
      this.searchHeaders.searchItems.find(d => d.value === 'region').options = [
        {
          areaName: '所有',
          areaCode: ''
        },
        ...this.areaOptions
      ]
    })
  }
}
</script>

<style lang="scss">
  .user-manage-wrap{
    border-top: 1px solid #e8e8e8;
    padding: 20px 0px;
    border-radius:0px 4px 4px 4px;
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
    .el-cascader.jee-border .el-cascader-menu{
      min-width: 112px;
    }
    .table-head{
      line-height: 24px !important;
      display: block !important;
      padding-left: 0 !important;
    }
    .col-wrap {
      box-sizing: border-box;
      width: 100%;
      padding-right: 20px;
      .fileUpload-text{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .fileUpload-item{
            max-width: 100%;
            width: 100px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #3178EE;
            cursor: pointer;
        }
      }
      .img-all{
        display: flex;
        flex-wrap: wrap;
        color: #666;
        font-size: 14px;
        .radio-img{
          margin-right: 5px;
          >.el-image{
            width: 34px;
            height: 34px;
            border-radius: 4px;
            background-color: #f0f0f0;
          }
        }
      }
      .checkbox-all{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .checkbox-item{
          margin-right: 5px;
        }

      }
    }
    .answer1-item{
      .img-wrap {
        display: inline-block;
        margin-right: 8px;
        vertical-align: middle;
        &:last-child {
          margin-right: 0;
        }
      }
      .t-img{
        width: 34px;
        height: 34px;
        border-radius: 4px;
      }
      .t-cursor{
        color: #3178EE;
      }
    }
    .audio-outline:focus{
      outline: none;
    }
    .audio-outline{
      outline: none;
      audio{
        outline: none;
      }
      audio:focus{
        outline: none;
      }
    }
  }
</style>
