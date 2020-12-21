<template>
  <section class="voices-wrap-index">
    <base-header
      v-bind="headers"
      @handleSync="handleHeaderSync"
      @handleDelete="handleHeaderDelete"
      @handleUpload="handleHeaderUpload"
      >
        <template slot>
          <div class="input-right">
            <el-input
              v-model="list.params.title"
              maxlength="50"
              @keyup.enter.native="handleSearch($event)"
              size="medium" :placeholder="placeholder"
              style="width:223px"
            >
              <el-button slot="append"
                style="height:36px;"
                size="small" class="jee-bg-light-important"
                @click="handleSearch($event)">
                <jee-icon iconClass="xiazai15" style="fill: #ffffff"></jee-icon>
              </el-button>
            </el-input>
          </div>
        </template>
    </base-header>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
    >
      <template #request="scope">
        <div class="resource-wrap">
          <div class="resource-img">
            <jee-icon :iconClass="icon.icon" :style="icon.style"></jee-icon>
          </div>
          <div class="resource-name">
            <div
              :title="scope.scope.row.request.name"
              >{{scope.scope.row.request.name}}</div>
          </div>
        </div>
      </template>
    </base-table>
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      v-on:handleConfirm="handleConfirmAdd"
    >
      <template #uploadFile="scope">
        <jee-video-upload
          v-bind="uploadData.option"
          v-model="edit.form.uploadFile"
          :iconClass='uploadData.icon'
          :compType="uploadData.type"
        ></jee-video-upload>
      </template>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import previewMixin from '@/components/draggable/Mixin/previewMixin'
var columns = [
  {
    prop: 'request',
    label: '文件名',
    minWidth: '300px',
    scopeType: 'slot'
  },
  {
    prop: 'wechatUpdateTimes',
    label: '创建日期',
    minWidth: '165px'
  }
]
export default {
  name: 'voices',
  mixins: [baseHeader, baseTable, previewMixin, formDialog],
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  watch: {
    id (newVal) {
      this.getList()
    },
    name (newVal, oldVal) {
      this.getList()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getList()
    })
  },
  data () {
    return {
      placeholder: '搜索语音',
      headers: {
        buttons: [
          {
            type: 'Upload',
            text: '上传音频素材',
            icon: 'shangchuan'
          },
          {
            type: 'Sync',
            text: '同步音频素材',
            icon: 'tongbu'
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete'
          }
        ],
        showAlertIcon: false
      },
      list: {
        columns,
        api: '',
        params: {
          'appId': '',
          'type': 'voice',
          'title': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'tangchuangguanbi'
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '125px',
          align: 'left'
        }
      },
      icon: {
        icon: 'geshi_tongyongyinpin',
        style: {
          fill: '#DB3E1F',
          fontSize: '48px'
        }
      },
      edit: {
        width: '620px',
        title: '上传音频',
        formLoading: false,
        form: {
          uploadFile: '',
          type: 'voice',
          appId: this.id
        },
        rules: {
          uploadFile: [this.$rules.required()]
        },
        buttons: [
          {
            text: '确认',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            type: 'slot',
            label: '选择音频',
            prop: 'uploadFile'
          }
        ]
      },
      uploadData: {
        icon: 'yinpin',
        type: 'audio',
        option: {
          autoUpload: false,
          size: '2', // 大小
          unit: 'MB', // 大小单位
          desc: '只能上传 .mp3、.wav、.wma、.amr 文件，播放长度不超过60s',
          type: ['mp3', 'wma', 'wav', 'amr']
        }
      }
    }
  },
  methods: {
    getList () {
      if (this.id && this.name === 'voice') {
        this.list.api = 'fetchWechatMaterialPage'
        this.list.params.type = 'voice'
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    },
    handleConfirmAdd (form) {
      let { uploadFile } = form
      uploadFile.append('appId', this.id)
      uploadFile.append('type', form.type)
      this.$request.fetchWechatMaterialMaterialAdd(uploadFile).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, '新增成功')
      })
    },
    // 搜索
    handleSearch (e) {
      this.fetchTableApi()
    },
    // 上传
    handleHeaderUpload (btn) {
      this.$refs.editDialog.showDialog()
    },
    // 批量删除
    handleHeaderDelete (btn) {
      let ids = this.list.selectedKeys
      if (ids.length > 0) {
        this.$confirm('是否确认删除素材?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          ids.forEach(v => {
            if (this.list.data.find(d => d.id === v)) {
              let obj = {
                'mediaId': this.list.data.find(d => d.id === v).mediaId,
                'id': this.list.data.find(d => d.id === v).id
              }
              arr.push(obj)
            }
          })
          this.$request.fetchWechatMaterialDelete({ requests: arr }).then(res => {
            this.$restBack(res, () => {
              this.fetchTableApi()
            })
          })
        }).catch(() => {})
      } else {
        this.$message('请至少选择一个素材')
      }
    },
    //  同步
    handleHeaderSync (btn) {
      if (this.id) {
        this.$request.fetchWechatMaterialSynchMaterial({ appId: this.id, type: 'voice' }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          }, '同步成功')
        })
      }
    },
    // 删除
    handleTableDelete (data, btn) {
      this.$confirm('是否确认删除素材?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = { requests: [{ 'mediaId': data.mediaId, 'id': data.id }] }
        this.$request.fetchWechatMaterialDelete(params).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      }).catch(() => {})
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>

<style lang="scss">
.voices-wrap-index{
  .input-right{
    position: absolute;
    right: 0px;
  }
  .resource-wrap{
      padding: 20px 0;
    }
    .resource-img{
      width: 80px ;
      padding: 15px;
      height: 80px ;
      box-sizing: border-box;
      margin-right: 20px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      background-color: #FAFAFA;
      display: inline-block;
      vertical-align: middle;
      .el-image__inner{
        max-width: 100%;
        max-height: 100%;
      }
    }
    .resource-name{
      display: inline-block;
      overflow: hidden;
      vertical-align: middle;
      cursor: pointer;
      font-size: 14px;
      min-width: 90px;
      line-height: 24px;
    }
}
</style>
