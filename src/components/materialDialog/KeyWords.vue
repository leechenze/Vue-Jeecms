<template>
  <el-dialog
    class="material-dialog-index"
    title="关键词选择"
    :visible.sync="innerVisible"
    width="778px"
    ref="keyWords"
    :close-on-click-modal="false"
     append-to-body
    :before-close="handleClose">
    <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="0px"
      >
      <el-form-item prop="menuKey">
        <ul class="key-word__wrap">
          <li class="t-border key-word__item"
            @click="getKeysWord(item)"
            :class="{'jee-border':item.id === form.menuKey}"
            v-for="(item,index) in groups" :key="index">
            <p class="key-word__span">
              <label class="key-word__label">规则名：</label>
              <span class="key-word__text">{{item.ruleName}}</span>
            </p>
            <p class="key-word__span">
              <label class="key-word__label">关键词：</label>
              <span class="key-word__text">{{item.words}}</span>
            </p>
            <p class="key-word__span">
              <label class="key-word__label">回复类型：</label>
              <span class="key-word__text">{{typeFilter(item.msgType)}}</span>
            </p>
          </li>
        </ul>
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
  name: 'key-words',
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
      innerVisible: false,
      groups: [],
      form: {
        menuKey: '',
        keyWord: '',
        msgType: ''
      },
      rules: {
        menuKey: [
          this.$rules.required('此项必填', '', 'blur')
        ]
      },
      totalCount: 0
    }
  },
  methods: {
    showDialog () {
      this.innerVisible = true
      if (this.groups.length === 0 && this.appId) {
        this.getKeyList()
      }
    },
    handleClose () {
      this.innerVisible = false
    },
    getKeysWord (item) {
      this.form = {
        'keyWord': item.words,
        'menuKey': item.id,
        'msgType': item.msgType,
        'ruleName': item.ruleName
      }
    },
    handleConfirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.innerVisible = false
          this.$emit('handleConfirm', this.form)
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
    getKeyList (page, size) {
      let params = {
        'appId': this.appId,
        'page': page || 1,
        'size': size || 10
      }
      this.$request.fetchWechatreplycontentPage(params).then(res => {
        if (res.code === 200) {
          if (res.data.content && res.data.content instanceof Array) {
            this.groups = res.data.content.map(v => {
              if (v.wechatReplyKeywordList.length) {
                let words = []
                v.wechatReplyKeywordList.forEach(t => {
                  if (t.wordkeyEq) {
                    words.push(t.wordkeyEq)
                  } else {
                    words.push(t.wordkeyLike)
                  }
                })
                v.words = words.join(',')
              }
              return v
            })
          }
          this.form.menuKey = res.data.content[0].id
          this.form.keyWord = res.data.content[0].words
          this.form.ruleName = res.data.content[0].ruleName
          this.form.msgType = res.data.content[0].msgType
          this.totalCount = res.data.totalElements
        }
      })
    },
    typeFilter (type) {
      let obj = {
        'voice': '语音',
        'news': '图文',
        'image': '图片',
        'video': '视频',
        'music': '音乐',
        'text': '文本'
      }
      return obj[type]
    }
  }
}
</script>
<style lang="scss">
  .key-word{
    &__wrap{
      width: 100%;
    }
    &__item{
      width: 335px;
      height: 120px;
      padding: 11px 20px;
      margin-bottom: 20px;
      box-sizing: border-box;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
    }
    &__span{
      line-height: 32px;
      font-size: 14px;
    }
    &__lable{
      min-width: 62px;
      color: #666666;
    }
    &__text{
      margin-left: 16px;
      color: #333333;
    }
  }
</style>
