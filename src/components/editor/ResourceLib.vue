<template>
  <section class="resource-lib-container">
    <el-tabs type="border-card" v-model="activeTab">
      <template v-for="(item, index) in tabs">
        <el-tab-pane :key="index" :label="item.label" :name="item.name">
          <div class="resource-container" :key="item.name">
            <component
              class="resource-tree-wrap"
              :is="item.tree"
              :ref="item.name"
              width="200px"
              v-bind="tree"
              v-model="spaceId[item.name]"
            />
            <component
              class="resource-select-wrap scrollbar"
              :is="item.component"
              :spaceId="spaceId[item.name]"
              :search="search[item.name]"
              :ref="item.name"
              :key="item.name"
              :resourceType="resourceType"
              :uploadOption="uploadOption"
              v-bind="item"
              @handleSelectImage="handleSelectImage"
            />
          </div>
        </el-tab-pane>
      </template>
    </el-tabs>
    <div class="search-wrap">
      <div class="cut-wrap jee-hover-color2" v-if="isShowCut" @click="handleCropper">
        <jee-icon iconClass="caijian1"/>
        <span>裁剪</span>
      </div>
      <el-input v-model="search[activeTab]"
        maxlength="50"
        @keyup.enter.native="handleSearch"
        size="small" placeholder="请输入文件名称"
        style="width:265px;"
      >
        <el-button slot="append"
          size="small" class="jee-bg-light-important search-btn"
          @click="handleSearch">
        <jee-icon iconClass="xiazai15" style="fill: #ffffff"></jee-icon>
        </el-button>
      </el-input>
    </div>
    <!-- 裁剪 -->
    <el-dialog title="图片裁剪" :visible.sync="dialogVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper-wrap">
          <vueCropper
            ref="cropper"
            :img="file[activeTab].imageUrl"
            :info="option.info"
            :full="option.full"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :centerBox="option.centerBox"
            :fixedBox="option.fixedBox"
            :fixed="option.fixed"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :high="option.high"
            @realTime="realTime"
          />
        </div>
        <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px'}">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size='small' @click="dialogVisible = false">取 消</el-button>
        <el-button size='small' type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import ResourceSelect from './ResourceSelect'
import SpaceResourceTree from './SpaceResourceTree'
import ResourceTree from './ResourceTree'
import { VueCropper } from 'vue-cropper'
import { getImgToBase64 } from '@/utils'

export default {
  name: 'ResourceLib',
  components: {
    ResourceSelect,
    ResourceTree,
    SpaceResourceTree,
    VueCropper
  },
  inject: ['uploadOption'],
  props: {
    resourceType: {
      type: String,
      default: ''
    },
    isMultiSelect: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      search: {
        MyResource: '',
        ShareResource: ''
      },
      spaceId: {
        MyResource: '',
        ShareResource: ''
      },
      tree: {
        loading: false,
        currentNodeKey: '',
        createChildren: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      },
      file: {
        MyResource: {},
        ShareResource: {}
      },
      activeTab: 'MyResource',
      tabs: [
        {
          label: '我的资源',
          name: 'MyResource',
          component: 'ResourceSelect',
          tree: 'ResourceTree',
          api: 'resourceUserPage'
        },
        {
          label: '共享资源',
          name: 'ShareResource',
          component: 'ResourceSelect',
          tree: 'SpaceResourceTree',
          api: 'resourceSharePage'
        }
      ],
      dialogVisible: false,
      option: {
        autoCropWidth: 100,
        autoCropHeight: 100,
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 输出图片格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        full: false, // 是否输出原图比例的截图
        canMove: true, // 能否拖动图片
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        high: true // 是否根据dpr生成适合屏幕的高清图片
      },
      previews: {},
      percentage: 0
    }
  },
  computed: {
    isShowCut () {
      return (this.activeTab === 'MyResource' && (this.resourceType === 'insertimage' || this.resourceType === 'simpleupload'))
      //  && this.file[this.activeTab] && this.file[this.activeTab].imageUrl
    }
  },
  methods: {
    getHtml (url, name) {
      let html = ''
      switch (this.resourceType) {
        case 'insertvideo':
          html = `<p><video controls src='${url}' style='max-width:750px'>no video</video></p>`
          break
        case 'music':
          html = `<p><audio class="voice" controls src='${url}'>no audio</audio></p>`
          break
        case 'attachment':
          html = `<a href='${url}' download='${url}'>${name}</a>`
          break
        default:
          html = `<p style="text-align: center"><img src='${url}' style='max-width:750px'/></p>`
      }
      return html
    },
    handleSearch () {
      this.$refs[this.activeTab][1].fetchResourceList()
    },
    // 点击裁剪
    handleCropper () {
      this.dialogVisible = true
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    // 获取截图数据
    handleSubmit () {
      this.$refs.cropper.getCropBlob((data) => {
        let files = new File([data], this.file[this.activeTab].name, { type: 'image/png', lastModified: Date.now() })
        this.file[this.activeTab].file = { raw: files }
        this.file[this.activeTab].imageUrl = URL.createObjectURL(data)
        this.dialogVisible = false
      })
    },
    // 选择图片
    handleSelectImage (item) {
      const that = this
      // 多选上传
      if (item instanceof Array) {
        this.file[this.activeTab] = item.map(d => {
          d.name = d.alias + d.suffix
          d.resourceId = d.id
          const getDefaultFile = function (dataUrl) {
            d.imageUrl = dataUrl
          }
          if (that.activeTab === 'MyResource') {
            getImgToBase64(that.$getPath(d.url), getDefaultFile)
          }
          return d
        })
      } else if (item.url) {
        // 单选上传
        this.file[this.activeTab].name = item.alias + item.suffix
        this.file[this.activeTab].url = item.url
        this.file[this.activeTab].resourceId = item.id
        this.file[this.activeTab].videoCover = item.videoCover
        const getDefaultFile = function (dataUrl) {
          that.$set(that.file[that.activeTab], 'imageUrl', dataUrl)
        }
        if (this.activeTab === 'MyResource') {
          getImgToBase64(this.$getPath(item.url), getDefaultFile)
        }
      } else {
        this.file[this.activeTab] = {}
      }
    },
    // 提交图片
    handleConfirm () {
      const file = this.file[this.activeTab]
      if (file instanceof Array) {
        const that = this
        file.forEach(item => {
          that.handleConfirmItem(item)
        })
      } else {
        this.handleConfirmItem(file)
      }
    },
    handleConfirmItem (item) {
      if (!item.url) {
        this.$message('请先选择文件')
        return
      }
      let url = ''
      let resourceId = ''
      let videoCover = null
      let fileData = {}
      const fileName = item.name
      // 我的资源裁剪后的图片
      if (this.activeTab === 'MyResource' && item.file) {
        this.$emit('handleLoading', true)
        const param = new FormData() // 创建form对象
        param.append('uploadFile', item.file.raw, fileName) // 通过append向form对象添加数据
        param.append('spaceId', this.spaceId[this.activeTab])
        param.append('typeStr', item.fileType)
        param.append('addToRes', true)
        if (this.uploadOption && this.uploadOption.modeObj) {
          param.append('modelId', this.uploadOption.modeObj.modelId || '')
          param.append('fieldName', this.uploadOption.modeObj.fieldName)
        }
        fileData = param
        this.$request.fetchUpload(param).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            url = res.data.fileUrl
            resourceId = res.data.resourceId
            videoCover = res.data.videoCover
          }
          this.$emit('handleLoading', false)
        }).catch(() => {
          this.$emit('handleLoading', false)
        })
      } else {
        url = item.url
        resourceId = item.resourceId
        videoCover = item.videoCover
      }
      if (url) {
        const fileUrl = this.$getPath(url)
        this.$emit('handleInsertHtml', this.getHtml(fileUrl, fileName), {
          url: fileUrl,
          id: resourceId,
          videoCover: videoCover,
          fileName
        }, fileData)
      }
    }
  }
}
</script>
<style lang="scss">
.resource-lib-container{
  position: relative;
  .el-tabs.el-tabs--border-card{
    border-color: #e8e8e8;
    border-radius: 4px;
    >.el-tabs__header{
      background-color: #f0f0f0;
      .el-tabs__item{
        font-size: 14px;
        padding: 0 15px;
        border: 0;
        vertical-align: top;
        height: 41px;
        line-height: 40px;
        &:not(.is-active) {
          color: #666666;
          background: #f0f0f0;
        }
      }
    }
    >.el-tabs__content{
      padding: 20px 0;
      overflow-x: hidden;
      overflow-y: overlay;
      height: calc(80vh - 310px);
      .el-tab-pane,
      .resource-container{
        height: 100%;
      }
      .resource-container{
        display: flex;
        .resource-select-wrap{
          overflow-y: overlay;
          overflow-x: hidden;
          flex: 1;
          padding-left: 20px;
          border-left: 1px solid #e8e8e8;
        }
        .resource-list-wrap{
          min-height: calc(100% - 58px);
        }
      }
      // &:hover{
      //   &::-webkit-scrollbar {
      //     width: 10px;
      //     height: 10px;
      //   }
      // }
    }
  }
  // 搜索
  .search-wrap{
    position: absolute;
    right: 4px;
    top: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .cut-wrap{
      width: 80px;
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .jee-svg-icon{
        font-size: 14px;
        padding-right: 10px;
        fill: #666666;
      }
    }
  }
  .search-wrap,
  .base-pagination-container {
    .el-input input.el-input__inner{
      border-color: #e8e8e8;
    }
  }
}
</style>
