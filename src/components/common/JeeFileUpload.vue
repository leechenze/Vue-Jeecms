<template>
  <section class="jee-file-upload-container">
    <div class="desc" v-if="getImageDesc">{{getImageDesc}}</div>
    <!-- 上传区 -->
    <div class="upload-wrap">
      <el-upload
        ref="upload"
        class="z-video-uploader jee-hover-border"
        :class="{'document-uploader': docType === '2'}"
        drag
        multiple
        action=""
        :show-file-list="false"
        :before-upload="beforeImageUpload"
        :on-change="handleChange"
        :auto-upload="false"
      >
        <div class="text-wrap">
          <jee-icon :iconClass="iconClass"></jee-icon>
          <div class="text" v-show="docType === '1'">将文件拖拽至此，或<span>点击上传</span></div>
          <div class="text" v-show="docType === '2'">点击上传文档</div>
        </div>
        <div slot="tip">
          <!-- 说明文字 -->
          <div class="z-tip-form-item" v-if="tip">{{tip}}</div>
          <!-- 进度条 -->
          <el-progress :stroke-width='2' :percentage="percentage" v-if="percentage>0 && percentage <=100" style="maxWidth: 414px"></el-progress>
        </div>
      </el-upload>
      <draggable
        :list="fileList"
        v-bind="dragOptions"
        class='drag-wrap'
      >
        <template v-for="(item, index) in fileList">
          <div class="file-item-wrap" :key="index">
            <div class="file-name">
              <span>{{item.fileName}}</span>
              <jee-icon iconClass="guanbi" @click="handleRemove(index)"/>
            </div>
            <!-- <el-select
              popper-class="jee-border"
              v-model="item.secretId"
              placeholder="选择附件密级"
              @change="handleChangeSecret($event, index)"
              v-if="isSecret"
            >
              <el-option
                v-for="opt in accessorySecurityOptions"
                :key="opt.value"
                :label="$t(opt.label)"
                :value="opt.value">
              </el-option>
            </el-select> -->
          </div>
        </template>
      </draggable>
    </div>
  </section>
</template>
<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'JeeFileUpload',
  props: {
    value: {
      type: [Array, String, Object],
      default: () => []
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    isDescShow: {
      type: Boolean,
      default: true
    },
    desc: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '点击上传图片'
    },
    iconClass: {
      type: String,
      default: 'fujianshangchuan02'
    },
    typeLimit: {
      type: Number,
      default: 1
    },
    enableType: {
      type: String,
      default: ''
    },
    disableType: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    isLengthLimit: {
      type: Boolean,
      default: false
    },
    isImageDesc: {
      type: Boolean,
      default: true
    },
    max: {
      type: [String, Number],
      default: ''
    },
    min: {
      type: [String, Number],
      default: ''
    },
    limit: {
      type: [String, Number],
      default: ''
    },
    isSecret: {
      type: Boolean,
      default: true
    },
    type: {
      type: [Array, String],
      default: () => []
    },
    docType: {
      type: String,
      default: '1'
    }
  },
  components: {
    draggable
  },
  data () {
    return {
      loading: false,
      val: [],
      fileList: [],
      percentage: 0,
      dragOptions: {
        group: 'filelist',
        sort: true,
        forceFallback: true,
        ghostClass: 'ghost',
        chosenClass: 'chosen',
        dragClass: 'dragging',
        swapThreshold: 0.5,
        animation: 100
      }
    }
  },
  computed: {
    ...mapGetters(['accessorySecurityOptions']),
    enableTypes () {
      return this.type instanceof Array ? this.type.join(',') : ''
    },
    getImageDesc () {
      let desc = ''
      if (this.typeLimit === 1) {
        desc = '不限制格式'
      } else if (this.typeLimit === 2) {
        desc = (this.enableType || this.enableTypes) ? `支持 ${this.enableType || this.enableTypes} 格式` : ''
      } else if (this.typeLimit === 3) {
        desc = this.disableType ? `不支持 ${this.disableType} 格式` : ''
      }
      if (Number(this.size) && this.unit) desc = desc + ` (文件大小不超过${this.size}${this.unit})`
      return desc
    },
    getValue () {
      return this.fileList.map(d => {
        let value = this.autoUpload ? {
          resId: d.id
        } : d
        if (this.isSecret) {
          value.secretId = d.secretId || ''
        }
        if (d.uploadFile) {
          value.uploadFile = d.uploadFile
        }
        return value
      })
    },
    getAccept () {
      if (this.typeLimit === 2) {
        const allowTypes = this.enableType instanceof Array ? this.enableType : (this.enableType ? this.enableType.split(',') : [])
        return allowTypes.length ? allowTypes.map(t => `.${t}`) : '*'
      }
      return '*'
    }
  },
  watch: {
    value (newVal) {
      if (newVal && newVal.length && newVal !== this.getValue) {
        this.initData()
      } else if (!newVal || !newVal.length) {
        this.fileList = []
      }
    }
  },
  methods: {
    ...mapActions('system', ['FetchAccessorySecurityOptions']),
    // 上传-文件类型
    uploadType (file) {
      var type = file.raw.type
      var i = type.indexOf('/')
      var suffix = type.slice(0, i).toLowerCase()
      var fileType = ''
      // File文件 Flash Flash Image图片 Media视频 Audio音频 为空则默认Image
      switch (suffix) {
        case 'image':
          fileType = ''
          break
        case 'text':
          fileType = 'File'
          break
        case 'application':
          fileType = 'File'
          break
        case 'video':
          fileType = 'Media'
          break
        case 'audio':
          fileType = 'Audio'
          break
        default:
          fileType = ''
          break
      }
      return fileType
    },
    // 上传-选择文件
    handleChange (file, fileList) {
      if (!this.beforeImageUpload(file)) return
      let fileObj = {
        file: file,
        fileName: file.name,
        fileType: this.uploadType(file),
        id: ''
      }
      if (this.isSecret) {
        fileObj.secretId = ''
      }
      this.handleUpload(fileObj)
    },
    // 上传到服务器
    handleUpload (fileObj, index) {
      const param = new FormData() // 创建form对象
      param.append('uploadFile', fileObj.file.raw, fileObj.fileName) // 通过append向form对象添加数据
      if (this.autoUpload) {
        // param.append('spaceId', this.id)
        param.append('typeStr', fileObj.fileType)
        param.append('addToRes', true)
        if (this.modeObj) {
          param.append('modelId', this.modeObj.modelId || '')
          param.append('fieldName', this.modeObj.fieldName)
        }
        const that = this
        const onUploadProgress = function (e) {
          // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          // 如果lengthComputable为false，就获取不到e.total和e.loaded
          if (e.lengthComputable) {
            var rate = e.loaded / e.total // 已上传的比例
            if (rate < 1) {
              that.percentage = Number((rate * 100).toFixed(0))
            // 这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
            // 因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
            } else {
              that.percentage = 100
            }
          }
        }
        this.$request.fetchUpload(param, onUploadProgress).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            fileObj.id = res.data.resourceId
            this.fileList.push(fileObj)
            this.$emit('input', this.getValue)
          }
          this.percentage = 0
        })
      } else {
        fileObj.uploadFile = param
        this.fileList.push(fileObj)
        this.$emit('input', this.getValue)
      }
    },
    // 移除
    handleRemove (index) {
      this.fileList.splice(index, 1)
      this.$emit('input', this.getValue)
    },
    // 上传到页面前进行检查
    beforeImageUpload (file) {
      // 判断文件格式
      let isJPG = true
      var i = file.name.lastIndexOf('.')
      var suffix = file.name.substring(i + 1).toLowerCase()
      if (this.typeLimit === 3) {
        const disableType = this.disableType && this.disableType instanceof Array ? this.disableType : (this.disableType ? this.disableType.split(',') : [])
        if (disableType.length) {
          isJPG = !disableType.includes(suffix)
        }
      } else if (this.typeLimit === 2) {
        const allowTypes = this.enableType instanceof Array ? this.enableType
          : ((this.enableType || this.enableTypes) ? (this.enableType || this.enableTypes).split(',') : [])

        if (allowTypes.length) {
          isJPG = allowTypes.includes(suffix)
        }
      }
      // 判断文件大小
      let isLt2M = true
      if (Number(this.size)) {
        const allowSize = this.unit === 'MB' ? (1024 * 1024) : 1024
        isLt2M = file.size / allowSize < Number(this.size)
      }
      // 判断上传数量
      if (this.limit && this.fileList.length >= this.limit) {
        this.$message.error(`上传文件数量不能超过 ${this.limit} 张!`)
        return
      }
      // 提示错误信息
      if (!isJPG) {
        if (this.typeLimit === 3) {
          this.$message.error(`上传文件不能是 ${this.disableType} 格式!`)
        } else if (this.typeLimit === 2) {
          this.$message.error(`上传文件只能是 ${this.enableType || this.enableTypes} 格式!`)
        }
      }
      if (!isLt2M) {
        this.$message.error(`上传文件大小不能超过 ${this.size}${this.unit || 'KB'}!`)
      }
      return isJPG && isLt2M
    },
    handleChangeSecret (val, index) {
      const newFile = Object.assign({}, this.fileList[index], { secretId: val })
      this.fileList.splice(index, 1, newFile)
      this.$emit('input', this.getValue)
    },
    initData () {
      // 判断如果是对象，则终止
      // 因为有组件传入object对象
      if (this.value instanceof Array || this.value instanceof String) {
        this.fileList = (this.value || []).map(d => {
          if (d.resourcesSpaceData) {
            d.id = d.resourcesSpaceData.id
            d.fileName = d.resourcesSpaceData.alias
            if (d.resourcesSpaceData.suffix) {
              d.fileName += d.resourcesSpaceData.suffix
            }
          }
          if (this.isSecret) {
            d.secretId = d.secret ? (d.secret.id || '') : ''
          }
          return d
        })
        this.$emit('input', this.getValue)
      }
    }
  },
  mounted () {
    this.initData()
  },
  created () {
    this.FetchAccessorySecurityOptions()
  }
}
</script>
<style lang="scss">
.jee-file-upload-container{
  margin-right: 2px;
  .desc{
    color: #B3B3B3;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 11px;
    padding-bottom: 17px;
  }
  .file-item-wrap{
    display: flex;
    padding: 10px 0 0;
    max-width: 414px;
    .file-name{
      padding: 0 10px 0 20px;
      line-height: 38px;
      color: #3178EE;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      .jee-svg-icon{
        fill: #B3B3B3;
        cursor: pointer;
        &:hover{
          fill: #3178EE;
        }
      }
    }
    .el-select{
      margin-left: 10px;
      width: 144px!important;
    }
  }
  .document-uploader{
    .el-upload{
      border: none;
      margin: 0 auto;
    }
  }
}
</style>
