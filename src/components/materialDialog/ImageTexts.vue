<template>
  <el-dialog
    class="material-dialog-index"
    title="图文选择"
    :visible.sync="innerVisible"
    width="728px"
    :close-on-click-modal="false"
    ref="imageTexts"
    append-to-body
    :before-close="handleClose">
    <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="0px"
      >
      <el-form-item prop="mediaId">
        <div class="image-text-list t-top">
          <div class="we-card__list we-card__list--dialog" >
            <template v-for="(content) in tableData">
              <div :key="content.id" class='we-card-wrap'>
                <div class="we-card__warpper"
                  @click="setCheckedItems(content)"
                >
                  <template v-for="(item,index) in content.requestArray">
                    <div class="we-card__item we-card__item--thumb" v-if="index==0" :key="index">
                      <div  class="we-card__link">
                        <img class="we-card__img" :src="$weChatUrl(item.thumbMediaUrl)" alt="">
                        <span class="we-card__title--thumb" v-if="item.title!=''">
                          {{item.title}}
                        </span>
                      </div>
                    </div>
                    <div class="we-card__item  we-card__item--sub" v-else :key="index">
                      <div  class="we-card__link">
                        <div class="we-card__sub--inner">
                          <div class="we-card__sub--img">
                            <img :src="$weChatUrl(item.thumbMediaUrl)" alt="">
                          </div>
                          <div class="we-card__sub--title">
                            {{item.title}}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="we-card__footer">
                    <span class="fl">
                      更新时间 {{$getDateDiff(content.wechatUpdateTime*1000)}}
                    </span>
                  </div>
                  <!-- 选中遮罩 -->
                  <div class="we-card-checked" v-if="content.mediaId === form.mediaId">
                    <!-- <i class="el-icon-check"></i> -->
                    <jee-icon class="el-icon-check" iconClass="dui" :style="{fontSize:'42px',fill:'#fff'}"></jee-icon>
                  </div>
                </div>
              </div>
            </template>
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
export default {
  name: 'imageTexts',
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
      tableData: []
    }
  },
  methods: {
    setCheckedItems (item) {
      this.form.mediaId = this.form.mediaId === item.mediaId ? '' : item.mediaId
    },
    showDialog () {
      this.innerVisible = true
      if (this.tableData.length === 0 && this.appId) {
        this.getImageList()
      }
    },
    handleClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let obj = this.tableData.find(v => v.mediaId === this.form.mediaId)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.innerVisible = false
          obj.msgType = 'news'
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
    // 获取数据
    getImageList (page, size) {
      let params = {
        'appId': this.appId,
        'type': 'news',
        'title': '',
        'page': page || 1,
        'size': size || 10
      }
      this.$request.fetchWechatMaterialPage(params).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.content.map(v => {
            v.msgType = v.mediaType
            return v
          })
          this.tableData = res.data.content
          this.totalCount = res.data.totalElements
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .material-dialog-index{
    .el-dialog__body{
      padding: 10px 20px;
    }
  }
</style>
