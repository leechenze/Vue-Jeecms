<template>
  <section class="resource-select-container">
    <div class="resource-list-wrap">
      <component :is="checkComp + '-group'"  v-loading="loading" v-model="currentResource" class="resource-list" @change="handleSelectImg">
        <template v-for="(item, index) in resources">
          <div class="resource-item-wrap" :key="index">
            <el-popover
              placement="bottom"
              :visible-arrow="false"
              trigger="hover">
              <ul class="img-popover">
                <li><label>文件类型：</label><span>{{item.suffix|suffixFilter}}{{item.resourceType|typeFilter}}</span></li>
                <li v-if="item.resourceType===1">
                  <label>分辨率：</label><span>{{item.dimensions}}</span></li>
                <li v-if="item.resourceType===2||item.resourceType===3">
                  <label>时长：</label><span>{{item.duration}}</span></li>
                <li><label >大小：</label><span>{{item.sizeUnit}}</span></li>
                <li><label >创建日期：</label><span>{{$moment(item.createTime)}}</span></li>
              </ul>
              <div
                slot="reference"
                class="img jee-hover-border-important"
                :class="{'jee-border': isCheckedItem(item)}"
                @click.stop="handleClickImg(item)"
              >
                <el-image
                  v-if="item.resourceType === 1"
                  style="width:100%;height:100%"
                  @dblclick.prevent.native="preview(item)"
                  :src="$getPath(item.url)"
                  fit="contain">
                    <div slot="error"
                      style="width:100%;height:100%;padding:20px;box-sizing:border-box">
                      <jee-icon
                        class="t-img"
                        v-if="item.icon"
                        :iconClass="item.icon"
                        :style="{fontSize:'80px',fill:item.fill}"
                      ></jee-icon>
                    </div>
                </el-image>
                <div v-else class="type-icon-wrap"
                 @dblclick.prevent="preview(item)"
                  style="width:100%;height:100%;padding:20px;box-sizing:border-box;"
                >
                  <jee-icon
                    class="t-img"
                    v-if="item.icon"
                    :iconClass="item.icon"
                    :style="{fontSize:'80px',fill:item.fill}"
                  ></jee-icon>
                </div>
              </div>
            </el-popover>
            <component :is='checkComp' :label="item" :disabled="item.disabled">{{item.alias + item.suffix}}</component>
          </div>
        </template>
      </component>
      <div v-if="!resources.length" class='empty-data'>暂无数据</div>
    </div>
    <base-pagination
      v-bind="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 放大 -->
    <el-dialog :visible.sync="dialogVisible"
    class="image-preview-dialog"
    :fullscreen='true'
      append-to-body custom-class="transparent">
      <img  class="t-img" :src="$getPath(perviewResource.url)" alt="">
    </el-dialog>
    <el-dialog :width="width"  :visible.sync="showFile" @close="closeDialog">
      <div v-if="resourceType === 2">
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
      <div v-else-if="resourceType === 3">
        <audio :src="$getPath(fileUrl)" controls></audio>
      </div>
      <div v-else-if="resourceType === 1">
        <el-image class="t-img" :src="$getPath(fileUrl)" fit="contain">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import BasePagination from '@/components/table/BasePagination'
import { mapGetters } from 'vuex'

export default {
  name: 'ResourceSelect',
  components: {
    BasePagination
  },
  props: {
    resourceType: [String, Number],
    search: {
      type: String,
      default: ''
    },
    spaceId: {
      type: [String, Number],
      default: ''
    },
    api: {
      type: String,
      default: ''
    },
    uploadOption: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['siteExtendConfig']),
    getResourceType () {
      let type = ''
      switch (this.resourceType) {
        case 'insertvideo':
          type = 2
          break
        case 'music':
          type = 3
          break
        case 'attachment':
          type = 4
          break
        default:
          type = 1
      }
      return type
    },
    siteTypes () {
      let types = ''
      switch (this.resourceType) {
        case 'insertvideo':
          types = this.siteExtendConfig.uploadVideoSuffix
          break
        case 'music':
          types = this.siteExtendConfig.uploadAudioSuffix
          break
        case 'attachment':
          types = this.siteExtendConfig.uploadAttachmentSuffix
          break
        default:
          types = this.siteExtendConfig.uploadPicSuffix
      }
      return types
    }
  },
  filters: {
    typeFilter (val) {
      var arr = ['', '图片', '视频', '音频', '附件']
      return arr[parseInt(val)]
    },
    suffixFilter (val) {
      return val.replace(/\./ig, '')
    }
  },
  data () {
    return {
      loading: false,
      checkComp: 'el-radio',
      currentResource: {},
      perviewResource: {},
      resources: [],
      dialogVisible: false,
      pagination: {
        pageNo: 1,
        pageSize: 10,
        pageLayout: 'total, prev, pager, next, jumper',
        totalCount: 0
      },
      imageStyle: {},
      fileUrl: '',
      showFile: false,
      fileType: 0,
      width: '821px',
      height: 'auto',
      workflowId: ''
    }
  },
  watch: {
    resourceType (newData, oldData) {
      if (newData !== oldData) {
        this.setCheckComp()
      }
    },
    spaceId (newData, oldData) {
      if (newData !== oldData) {
        this.fetchResourceList()
      }
    }
  },
  methods: {
    // 判断是否选中
    isCheckedItem (item) {
      if (this.currentResource instanceof Array) {
        if (this.currentResource.find(d => d.id === item.id)) {
          return true
        } else {
          return false
        }
      }
      return item.id === this.currentResource.id
    },
    // 设置多选还是单选
    setCheckComp () {
      if (this.resourceType === 'insertimage' || this.resourceType === 'attachment') {
        this.checkComp = 'el-checkbox'
        this.currentResource = []
      } else {
        this.checkComp = 'el-radio'
        this.currentResource = {}
      }
    },
    // 获取图片宽高
    getImageStyle (item) {
      const url = item.url
      if (url) {
        const that = this
        var img = new Image()
        img.src = this.$getPath(url)
        img.onload = function () {
          that.imageStyle = {
            width: img.width + 'px',
            height: img.height + 'px'
          }
        }
      }
    },
    handleSelectImg (item) {
      this.$emit('handleSelectImage', item)
    },
    handleClickImg (item) {
      if (item.disabled) return
      if (this.currentResource instanceof Array) {
        if (this.currentResource.find(d => d.id === item.id)) {
          this.currentResource = this.currentResource.filter(d => d.id !== item.id)
        } else {
          this.currentResource.push(item)
        }
      } else {
        this.currentResource = item
      }
      this.$emit('handleSelectImage', this.currentResource)
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.fetchResourceList()
    },
    handleCurrentChange (val) {
      this.pagination.pageNo = val
      this.fetchResourceList()
    },

    preview (row) {
      // 1图片 2视频 3音频 4附件 5文档 6压缩包 fileUrl previewUrl
      this.fileType = row.resourceType
      if (row.resourceType === 5) {
        // this.loading = true
        // this.$previewDoc(row.id, () => {
        //   this.loading = false
        // })
      } else if (row.resourceType === 4 || row.resourceType === 6) {
        return false
      } else {
        this.showFile = true
        this.fileUrl = this.$getPath(row.fileUrl)
        if (this.fileType === 1) {
          this.width = row.width ? row.width + 'px' : '600px'
          this.height = row.height ? row.height + 'px' : 'auto'
        } else if (this.fileType === 3) {
          this.width = '400px'
          this.height = 'auto'
        } else {
          this.width = '821px'
          this.height = 'auto'
        }
      }
    },
    suffixFilter (val) {
      switch (parseInt(val)) {
        case 1:
          return this.$lookupIcon('image')
        case 2:
          return this.$lookupIcon('video')
        case 3:
          return this.$lookupIcon('audio')
        case 4:
          return this.$lookupIcon('file')
        default:
          return this.$lookupIcon('unknown')
      }
    },
    fetchResourceList () {
      let data = {
        alias: this.search,
        resourceType: this.getResourceType,
        id: this.spaceId,
        page: this.pagination.pageNo,
        size: this.pagination.pageSize
      }
      if (this.api) {
        this.loading = true
        this.$request[this.api](data).then(res => {
          if (res.code === 200) {
            const { type, size, unit, modeObj } = this.uploadOption
            this.resources = res.data.content.map(d => {
              // 根据类型禁选
              if (!modeObj || !modeObj.fieldName) {
                let types = type && type.length ? type : this.siteTypes
                let typeLimit = Number(this.siteExtendConfig.cfg.uploadAttachmentSuffixType)
                if (typeLimit === 3) {
                  types = []
                  let disableTypes = this.siteTypes
                  if (disableTypes instanceof Array && disableTypes.length && disableTypes.find(t => d.suffix === '.' + t)) {
                    d.disabled = true
                  }
                } else if (typeLimit === 2) {
                  if (types instanceof Array && types.length && !types.find(t => d.suffix === '.' + t)) {
                    d.disabled = true
                  }
                }
              } else {
                let types = type
                if (types instanceof Array && types.length && !types.find(t => d.suffix === '.' + t)) {
                  d.disabled = true
                }
              }

              // 根据大小禁选
              if (size) {
                let ls = unit === 'MB' ? size * 1024 : size
                if (d.size && ls && d.size > ls) {
                  d.disabled = true
                }
              }
              // 文件类型图标
              let item = this.$lookupIcon(d.suffix.slice(1))
              if (item) {
                d.icon = item.icon
                d.fill = item.fill
              } else {
                item = this.suffixFilter(d.resourceType)
                d.icon = item.icon
                d.fill = item.fill
              }
              return d
            })
            this.pagination.totalCount = res.data.totalElements
            this.setCheckComp()
            // this.currentResource = {}
            this.$emit('handleSelectImage', this.currentResource)
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  },
  mounted () {
    this.fetchResourceList()
    this.setCheckComp()
  }
}
</script>
<style lang="scss">
.resource-select-container{
  .resource-list-wrap{
    .resource-list{
      display: flex;
      flex-wrap: wrap;
      .resource-item-wrap{
        padding-right: 20px;
        padding-bottom: 28px;
        .img{
          width: 108px;
          height: 108px;
          background-color: #f0f0f0;
          border-radius: 4px;
          border: 1px solid #f0f0f0;
          &:focus{
            outline: none;
          }
        }
        .el-checkbox,
        .el-radio{
          width: 108px;
          white-space: pre-wrap;
          padding-top: 10px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          .el-checkbox__label,
          .el-radio__label{
            font-size: 14px;
            color: #666666;
          }
        }
        .el-checkbox{
          .el-checkbox__label{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }

      }
    }
    .empty-data{
      text-align: center;
      color: #666666;
    }
  }
}
</style>
