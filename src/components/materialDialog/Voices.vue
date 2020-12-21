<template>
  <el-dialog
    class="material-dialog-index"
    :title="edit.title"
    :visible.sync="innerVisible"
    width="778px"
    :close-on-click-modal="false"
    ref="voices"
     append-to-body
    :before-close="handleClose">
    <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="0px"
      >
      <el-form-item prop="mediaId">
        <div class="voice-wrap">
          <div class="voice-wrap__head t-bottom">
            <div class="voice-wrap__check"></div>
            <div class="voice-wrap__name">文件名</div>
            <div class="voice-wrap__time">创建日期</div>
          </div>
          <div class="voice-boxs">
            <el-radio-group v-model="form.mediaId" class="voice-box">
              <div
                v-for="(item,index) in groups"
                :key="index"
                class="voice-item t-bottom">
                <div class="voice-wrap__check">
                  <el-radio :label="item.mediaId"></el-radio>
                </div>
                <div class="voice-wrap__name" slot="label">
                  <div class="voice-wrap__img">
                    <jee-icon :iconClass="icon.icon" :style="icon.style"></jee-icon>
                  </div>
                  <div class="t-inline">{{item.name}}</div>
                </div>
                <div class="voice-wrap__time">{{item.wechatUpdateTimes}}</div>
              </div>
            </el-radio-group>
          </div>
        </div>
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
  name: 'voices',
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
      groups: [],
      icon: {
        icon: 'geshi_tongyongyinpin',
        style: {
          fill: '#DB3E1F',
          fontSize: '48px'
        }
      },
      edit: {
        title: '语音选择'
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.getDataList('', val)
    },
    handleCurrentChange (val) {
      this.getDataList(val)
    },
    showDialog () {
      this.innerVisible = true
      if (this.groups.length === 0 && this.appId) {
        this.getDataList()
      }
    },
    handleClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let obj = this.groups.find(v => v.mediaId === this.form.mediaId)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.innerVisible = false
          obj.msgType = this.edit.title === '语音选择' ? 'voice' : 'video'
          this.$emit('handleConfirm', obj)
        } else {
          return false
        }
      })
    },
    getDataList (page, size) {
      let params = {
        'appId': this.appId,
        'type': 'voice',
        'title': '',
        'page': page || 1,
        'size': size || 10
      }
      this.$request.fetchWechatMaterialPage(params).then(res => {
        if (res.code === 200) {
          this.groups = res.data.content.map(v => {
            return {
              id: v.id,
              mediaId: v.mediaId,
              msgType: v.mediaType,
              wechatUpdateTimes: v.wechatUpdateTimes,
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

<style lang="scss">
  .material-dialog-index{
    .voice-wrap{
      height: 520px;
      width: 100%;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      .el-radio-group{
        font-size: inherit;
      }
      &__head{
        background-color: #F9F9F9;
        height: 45px;
        width: 100%;
        line-height: 45px;
      }
      &__check{
        width: 65px;
        padding-left: 20px;
        box-sizing: border-box;
        display: inline-block;
        .el-radio__label{
          display: none;
        }
      }
      &__name{
        width: 450px;
        display: inline-block;
        vertical-align: middle;
      }
      &__time{
        flex: 1;
        display: inline-block;
      }
      &__img{
        width: 80px;
        height: 80px;
        padding: 10px 15px;
        box-sizing: border-box;
        margin-right: 20px;
        display: inline-block;
        vertical-align: middle;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        background-color: #fafafa;
      }
      .voice-boxs{
        height: 475px;
        overflow-y: overlay;
      }
      .voice-box{
        height: auto;
        width: 100%;
      }
      .voice-item{
        height: 120px;
        padding: 20px 0;
        box-sizing: border-box;
        display: flex;
        line-height: 80px;
      }
    }
  }
</style>
