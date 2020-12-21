<template>
  <section class="jee-content-upload-container">
    <div class="desc" v-if="getImageDesc">{{getImageDesc}}</div>
    <!-- 上传区 -->
    <div class="resource-upload-wrap">
      <div class="z-video-uploader jee-hover-border"
        @click="showResourceDialog"
        v-if="!isBtn"
      >
        <div class="text-wrap">
          <jee-icon :iconClass="iconClass"></jee-icon>
          <div class="text">点击上传文件</div>
        </div>
      </div>
      <div class="jee-hover-border" v-else>
        <label v-if="showLabel"><span class="t-red" v-if="uploadOption.isRequired">*</span>{{uploadOption.label}}：</label>
        <el-button class="upload-btn" size="small" type="primary" @click="showResourceDialog">上传附件</el-button>
      </div>
      <div slot="tip">
        <!-- 说明文字 -->
        <div class="z-tip-form-item" v-if="tip&&tipShow">{{tip}}</div>
      </div>
      <draggable
        :list="fileList"
        @end="end"
        v-bind="dragOptions"
        class='drag-wrap'
      >
        <template v-for="(item, index) in fileList">
          <div class="file-item-wrap" :key="index">
            <div class="file-name">
              <span>{{item.fileName}}</span>
              <jee-icon class="icon" iconClass="gouxuan2" :style="{fontSize:'14px',fill:'#6CC050'}"/>
              <jee-icon class="t-12 delete" iconClass="tangchuangguanbi" :style="{fontSize:'9px',fill:'#666'}" @click="handleRemove(index)"/>
            </div>
            <div class="right">
                <jee-icon class="icon dragging" iconClass="tuozhuai" :style="{fontSize:'14px',fill:'#666666'}"/>
            </div>
            <el-select
              class="file-select"
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
            </el-select>
            <div class="left">
                <jee-icon class="icon dragging" iconClass="tuozhuai" :style="{fontSize:'14px',fill:'#666666'}"/>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <!-- 资源上传 -->
    <upload
      ref="resourceUpload"
      resourceType="attachment"
      :uploadOption="uploadOption"
      @handleConfirm="handleConfirm"
    ></upload>
  </section>
</template>
<script>
import draggable from 'vuedraggable'
import Upload from '@/components/editor/Upload'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'JeeFileContentUpload',
  props: {
    value: {
      type: [Array, String],
      default: () => []
    },
    uploadOption: {
      type: Object,
      default: () => ({})
    },
    isDescShow: {
      type: Boolean,
      default: true
    },
    isBtn: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    desc: {
      type: String,
      default: ''
    },
    tipShow: {
      type: Boolean,
      default: true
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
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  components: {
    draggable,
    Upload
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
    getImageDesc () {
      let desc = ''
      if (this.typeLimit === 1) {
        desc = '不限制格式'
      } else if (this.typeLimit === 2) {
        desc = this.enableType ? `支持 ${this.enableType} 格式` : ''
      } else if (this.typeLimit === 3) {
        desc = this.disableType ? `不支持 ${this.disableType} 格式` : ''
      }
      if (Number(this.size) && this.unit) desc = desc + ` (文件大小不超过${this.size}${this.unit})`
      return this.isDescShow ? desc : ''
    },
    getValue () {
      return this.fileList.map(d => {
        let value = this.autoUpload ? {
          resId: d.id
        } : d
        if (this.isSecret) {
          value.secretId = d.secretId || ''
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
    showResourceDialog () {
      this.$refs.resourceUpload.showDialog()
    },
    // 排序
    end: function (evt) {
      // evt.item //可以知道拖动的本身
      // evt.to    // 可以知道拖动的目标列表
      // evt.from  // 可以知道之前的列表
      // evt.oldIndex  // 可以知道拖动前的位置
      // evt.newIndex  // 可以知道拖动后的位置
      let b
      for (let i in this.fileList) {
        if (i === evt.oldIndex) {
          let x = this.fileList[i]
          this.fileList.splice(i, 1)
          this.fileList.splice(evt.newIndex, 0, x)
          let a = this.fileList
          for (let j in a) {
            delete a[j].name
            b = a
          }
          this.fileList = b
        }
      }
      this.$emit('input', this.getValue)
    },
    // 移除
    handleRemove (index) {
      this.fileList.splice(index, 1)
      this.$emit('input', this.getValue)
    },
    handleChangeSecret (val, index) {
      const newFile = Object.assign({}, this.fileList[index], { secretId: val })
      this.fileList.splice(index, 1, newFile)
      this.$emit('input', this.getValue)
    },
    initData () {
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
    },
    // 资源上传提交
    handleConfirm (url, data, file) {
      // 判断是否超过数量限制
      if (this.isNumLimit()) return
      // data: { url, id, fileName }
      // 上传file: {uploadFile, mark, addToRes, spaceId}
      // 资源库file：{uploadFile，typeStr, addToRes, spaceId}
      file.id = data.id
      file.fileName = data.fileName
      this.fileList.push(file)
      this.$emit('input', this.getValue)
    },
    isNumLimit () {
      const lmt = this.limit && this.fileList.length >= this.limit
      if (lmt) {
        this.$message.error(`附件数量不能超过 ${this.limit} 个!`)
      }
      return lmt
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
.jee-content-upload-container{
  margin-right: 2px;
  .desc{
    color: #B3B3B3;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 11px;
    padding-bottom: 17px;
  }
  .resource-upload-wrap{
    color: #666;
    .z-video-uploader{
      cursor: pointer;
      border: 1px dashed #E2E2E2;
      border-radius: 4px;
      max-width: 414px;
      width: 100%;
      height: 91px;
    }
    .upload-btn{
      &.el-button--small{
        padding: 8px 15px;
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
  .file-item-wrap{
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0 0;
    max-width: 100%;
    .file-name{
      max-width: 260px !important;
      min-width:114px;
      height: 38px;
      padding: 0 10px 0 20px;
      line-height: 38px;
      color: #666666;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      max-width: 300px;
      margin-right: 10px;
      >span{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding-right: 8px;
      }
      .delete{
          display: none;
      }
      .jee-svg-icon{
        fill: #B3B3B3;
        cursor: pointer;
        min-width: 12px;
        &:hover{
          fill: #3178EE;
        }
      }
      &:hover{
        .delete{
          display: block;
        }
        .icon{
          display: none;
        }
      }
    }
    .file-select{
      width: 144px !important;
      border-radius: 4px;
      .el-input__inner{
        border-width:1px !important;
        border-color: #e8e8e8;
        line-height: 38px !important;
        padding: 0 20px !important;
      }
      .el-input__suffix{
        right: 10px !important;
      }
    }
    .dragging{
        margin-left: 10px;
        margin-top: 15px;
    }
    .right{
      display: none;
    }
    .left{
      display: block;
    }
    &:last-of-type{
      .file-name{
        margin-bottom: 0px;
      }
    }
    &:first-of-type{
      padding-top: 20px;
    }
  }
}
.content-block-right .jee-content-upload-container {
  .file-item-wrap{
    .file-name{
      margin-right: 0px;
      min-width: auto;
    }
    .file-select{
      width: 284px !important;
    }
    .right{
      display: block;
    }
    .left{
      display: none;
    }
    &:last-of-type{
      .file-name{
        margin-bottom: 10px;
      }
    }
    &:first-of-type{
      padding-top: 30px;
    }
  }
}
.model-left-label.widgetBr{
  .jee-content-upload-container {
    .file-item-wrap{
      .file-name{
        margin-right: 0px;
        min-width: auto;
      }
      .file-select{
        width: 270px !important;
      }
      .right{
        display: block;
      }
      .left{
        display: none;
      }
      &:last-of-type{
        .file-name{
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
