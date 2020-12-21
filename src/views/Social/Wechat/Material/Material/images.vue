<template>
  <section class="image-wrap-index">
    <base-header
      v-bind="headers"
      @handleDelete="handleHeaderDelete"
      @handleSync="handleHeaderSync"
      @handleUpload="handleHeaderUpload"
      >
        <template slot>
          <div class="input-right">
            <el-input
              v-model="params.title"
              maxlength="50"
              @keyup.enter.native="handleSearch($event)"
              size="medium" placeholder="搜索图片"
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
    <el-checkbox
      class="check-list-all t-check t-16"
      label="全选"
      v-model="checkAll"
      @change="handleCheckedChange">
    </el-checkbox>
    <el-checkbox-group
      v-model="ids"
      @change="changeCheckbox"
      class="checkbox-group-index">
        <template v-for="(item, index) in groups">
            <div class="checkbox-group-box" :key="index">
              <div>
                <el-image
                  :class="{'jee-border':ids.indexOf(item[rowKey]) > -1}"
                  class="checkbox-group-img"
                  @click="preview(item,groups,$event)"
                  :src="$weChatUrl(item.request.url)"
                  fit="contain">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
              </div>
              <el-checkbox
                class="checkbox-group-check t-check"
                :label="item[rowKey]">
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  :content="item.request.name">
                    <span class='image-name' slot="reference">{{item.request.name}}</span>
                </el-popover>
              </el-checkbox>
            </div>
          </template>
    </el-checkbox-group>
    <jee-pagination
      :total="totalCount"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"></jee-pagination>
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      v-on:handleConfirm="handleConfirmAdd"
    >
    </form-dialog>
    <el-dialog width="500px"
      :close-on-click-modal="false"
      :visible.sync="imgDialog.show">
        <el-image
          style="width:100%"
          :src="$weChatUrl(imgDialog.url)"
          fit="contain">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
    </el-dialog>

  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import checkList from '@/components/mixins/checkList'
import formDialog from '@/components/mixins/formDialog'
export default {
  name: 'images',
  mixins: [checkList, baseHeader, formDialog],
  props: {
    rowKey: {
      type: String,
      default: 'id'
    },
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      groups: [],
      checkAll: false,
      isIndeterminate: false,
      ids: [],
      params: {
        'appId': '',
        'type': 'image',
        'title': '',
        'page': 1,
        'size': 10
      },
      imgDialog: {
        show: false,
        url: ''
      },
      totalCount: 0,
      headers: {
        buttons: [
          {
            type: 'Upload',
            text: '上传图片素材',
            icon: 'shangchuan'
          },
          {
            type: 'Sync',
            text: '同步图片素材',
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
      edit: {
        width: '620px',
        title: '上传图片素材',
        formLoading: false,
        form: {
          type: 'image',
          uploadFile: '',
          appId: this.id
        },
        rules: {
          uploadFile: [
            this.$rules.required()
          ]
        },
        buttons: [
          {
            text: '确认',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            prop: 'uploadFile',
            label: '选择文件',
            type: 'imageUpload',
            option: {
              autoUpload: false,
              size: '2', // 大小
              unit: 'MB', // 大小单位
              desc: '只能上传 .jpg、.jpeg、.gif、.png 文件, 文件不能大于 2M',
              type: ['jpg', 'jpeg', 'gif', 'png', 'bmp']
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.id && this.name === 'image') {
        this.params.appId = this.id
        this.getListData()
      }
    })
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal) {
        this.ids = newVal
      }
    },
    id (newVal) {
      if (this.id && this.name === 'image') {
        this.params.appId = this.id
        this.getListData()
      }
    },
    name (newVal, oldVal) {
      if (this.id && this.name === 'image') {
        this.params.appId = this.id
        this.getListData()
      }
    }
  },
  methods: {
    // 图片预览
    preview (item, data, e) {
      this.imgDialog.show = true
      this.imgDialog.url = item.request.url
    },
    handleConfirmAdd (form) {
      // let file = form.uploadFile.get('uploadFile')
      let { uploadFile } = form
      uploadFile.append('appId', this.id)
      uploadFile.append('type', form.type)
      this.$request.fetchWechatMaterialMaterialAdd(uploadFile).then(res => {
        this.$restBack(res, () => {
          this.getListData()
        }, '新增成功')
      })
    },
    // 搜索
    handleSearch (e) {
      this.getListData()
    },
    // 上传
    handleHeaderUpload (btn) {
      this.$refs.editDialog.showDialog()
    },
    // 批量删除
    handleHeaderDelete (btn) {
      let ids = this.ids
      let self = this
      if (ids.length > 0) {
        this.$confirm('是否确认删除素材?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          ids.forEach(v => {
            if (self.groups.find(d => d.id === v)) {
              let obj = {
                'mediaId': self.groups.find(d => d.id === v).mediaId,
                'id': self.groups.find(d => d.id === v).id
              }
              arr.push(obj)
            }
          })
          self.$request.fetchWechatMaterialDelete({ requests: arr }).then(res => {
            self.$restBack(res, () => {
              self.getListData()
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
        this.$request.fetchWechatMaterialSynchMaterial({ appId: this.id, type: 'image' }).then(res => {
          this.$restBack(res, () => {
            this.getListData()
          }, '同步成功')
        })
      }
    },
    changeCheckbox (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.groups.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.groups.length
      // this.$emit('input', value)
    },
    handleCheckedChange (val) {
      var value = val ? this.groups.map(v => { return v[this.rowKey] }) : []
      this.ids = value
      this.isIndeterminate = false
      // this.$emit('input', this.ids)
    },
    // 获取数据
    getListData () {
      if (this.params.appId) {
        this.$request.fetchWechatMaterialPage(this.params).then(res => {
          if (res.code === 200) {
            this.groups = res.data.content
            this.totalCount = res.data.totalElements
          }
        })
      }
    },
    handleSizeChange (val) {
      this.params.size = val
      this.ids = []
      this.getListData()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.ids = []
      this.getListData()
    }
  }
}
</script>

<style lang="scss">
.image-wrap-index{
  .input-right{
    position: absolute;
    right: 0px;
  }
  .checkbox-group-index{
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      height: inherit !important;
      .checkbox-group-box{
        margin-right: 20px;
        background-color: #fff;
      }
      .checkbox-group-img{
        width: 180px;
        height: 180px;
        box-sizing: border-box;
        border: 1px solid transparent;
        background-color: #f8f8f8;
        border-radius: 4px;
      }
      .checkbox-group-check{
        line-height: 1;
        margin: 20px 0 30px;
      }
      .image-name{
        overflow: hidden;
        flex-wrap: nowrap;
        text-overflow:ellipsis;
        max-width: 160px;
        display: block;
      }
    }
}

</style>
