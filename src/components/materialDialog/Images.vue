<template>
  <el-dialog
    class="material-dialog-index"
    title="图片选择"
    :visible.sync="innerVisible"
    width="778px"
    ref="images"
     append-to-body
    :before-close="handleClose">
    <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="0px"
      >
      <el-form-item prop="mediaId">
        <radio-group v-bind="radioItem" v-model="form.mediaId"></radio-group>
        <jee-pagination
          :total="totalCount"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"></jee-pagination>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="innerVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
import radioGroup from '@/components/mixins/radioGroup'
export default {
  name: 'images',
  mixins: [radioGroup],
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    appId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      totalCount: 0,
      innerVisible: false,
      form: {
        mediaId: ''
      },
      rules: {
        mediaId: [
          this.$rules.required('此项必填', '', 'blur')
        ]
      },
      radioItem: {
        rowKey: 'mediaId',
        groups: [],
        props: {
          url: 'url',
          label: 'name',
          wechat: true
        },
        imgStyle: {
          width: '120px',
          height: '120px'
        },
        boxStyle: {
          margin: '0 0 0 20px'
        }
      }
    }
  },
  methods: {
    showDialog () {
      this.innerVisible = true
      if (this.radioItem.groups.length === 0 && this.appId) {
        this.getImageList()
      }
    },
    handleClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let obj = Object.assign({}, this.radioItem.groups.find(v => v.mediaId === this.form.mediaId))
      this.$refs.form.validate(valid => {
        if (valid) {
          this.innerVisible = false
          obj.msgType = 'image'

          this.$emit('handleConfirm', obj)
        } else {
          return false
        }
      })
    },
    handleSizeChange (val) {
      this.getImageList('', val)
    },
    handleCurrentChange (val) {
      this.getImageList(val)
    },
    getImageList (page, size) {
      let params = {
        'appId': this.appId,
        'type': 'image',
        'title': '',
        'page': page || 1,
        'size': size || 10
      }
      this.$request.fetchWechatMaterialPage(params).then(res => {
        if (res.code === 200) {
          this.radioItem.groups = res.data.content.map(v => {
            return {
              id: v.id,
              mediaId: v.mediaId,
              msgType: v.mediaType,
              ...v.request
            }
          })
          this.totalCount = res.data.totalElements
        }
      })
    }
  }
}
</script>
