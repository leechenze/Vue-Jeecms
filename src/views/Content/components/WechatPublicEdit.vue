<template>
    <section class="content-wrap-view content-public-container">
      <el-form
        label-width="auto"
        label-suffix="："
        ref="form"
        v-loading="loading"
        :model="form"
      >
        <div class="content-form-item-wrap">
          <!-- 标题正文区 -->
          <div class="content-wrap-cont">
            <div class="content-head">
              <span>预览</span>
              <div class="content-head__btns">
                <span class="content-head__info">你今天还能群发{{sengNumber}}次</span>
                <el-button size="small" type="primary" @click="sendGroup(1)">群发</el-button>
                <el-button size="small" type="primary" @click="sendGroup(2)">定时群发</el-button>
                <el-button type="primary" size="mini" @click="handleClickScreenFull">
                  <jee-icon :iconClass="isFullscreen?'huanyuanhuabu':'quanping'"></jee-icon>
                  {{$t(isFullscreen? 'global.cancelScreenFull':'global.screenFull')}}
                </el-button>
              </div>
            </div>
            <div class='content-wrap__head'>
              <el-form-item label="群发对象">
                  <el-select v-model="tagShow"
                    popper-class="jee-border"
                  >
                    <el-option label="全部" :value="false"></el-option>
                    <el-option label="按标签选择" :value="true"></el-option>
                  </el-select>&nbsp;&nbsp;&nbsp;
                  <el-select v-model="form.tagId" v-if="tagShow"
                    popper-class="jee-border"
                  >
                    <el-option
                      v-for="(tag,index) in tags" :key="index"
                      :label="tag.tagName"
                      :value="tag.id"
                      ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="留言设置">
                  <el-radio-group v-model="form.message">
                    <el-radio :label="1">所有人都可以留言</el-radio>
                    <el-radio :label="2">仅关注后留言</el-radio>
                    <el-radio :label="3">不允许留言</el-radio>
                  </el-radio-group>
              </el-form-item>
            </div>
            <el-form-item
              label-width="0">
              <div class="wechat-imgtxt__box">
                <div class="wechat-imgtxt__left">
                  <label class="content-wrap__label">图文列表</label>
                  <image-text-list
                    :list="getData"
                    ref="imgTextList"
                    @listChange="listChange"
                    :index="activeIndex"></image-text-list>
                </div>
                <div class="wechat-imgtxt__right">
                  <image-text-info
                    ref="imgTextInfo"
                    @infoChange="infoChange"
                    :article="getData[activeIndex]"
                    :index="activeIndex"></image-text-info>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
       <form-dialog
          ref="editDialog"
          v-bind="edit"
          v-on:handleConfirm="handleConfirm"
        >
          <template #hours="scope">
             <el-time-select
              size="small" style="width:300px"
              v-model="edit.form.hours"
              :picker-options="pickerOptions"
              placeholder="任意时间点">
            </el-time-select>
          </template>
        </form-dialog>
    </section>
</template>
<script>
import formDialog from '@/components/mixins/formDialog'
import screenFull from '@/components/mixins/screenFull'
import ImageTextList from '../../Social/Wechat/components/ImageTextList'
import ImageTextInfo from '../../Social/Wechat/components/ImageTextInfo'
export default {
  name: 'wechatPublicEdit',
  mixins: [formDialog, screenFull],
  components: {
    ImageTextList,
    ImageTextInfo
  },
  data () {
    return {
      loading: false,
      tagShow: false,
      form: {
        'appid': '',
        'tagId': '',
        'message': 1,
        'type': 1,
        'sendDate': '',
        'sendHour': '',
        'sendMinute': '',
        'vo': [
          {
            'author': '',
            'content': '',
            'picId': '',
            'sourceUrl': '',
            'title': ''
          }
        ]
      },
      sengNumber: 0,
      edit: {
        width: '778px',
        title: '群发设置',
        formLoading: false,
        form: {
          'sendDate': '',
          'sendHour': '',
          'sendMinute': '',
          'hours': ''
        },
        rules: {
          hours: [
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
            label: '定时发送时间',
            prop: 'hours',
            type: 'slot'
          }
        ]
      },
      pickerOptions: {
        start: '',
        step: '00:01',
        end: '23:59'
      },
      getData: [
        {
          'author': '',
          'content': '',
          'picId': '',
          'sourceUrl': '',
          'title': '',
          'cover': ''
        }
      ], // 获取的文章数据
      activeIndex: 0,
      screenFullElement: '.content-wrap-view',
      tags: []
    }
  },
  inject: ['removeTab'],
  methods: {
    handleConfirm (data) {
      let times = data.hours.split(':')
      let params = {
        'sendDate': this.$moment(new Date().getTime(), 'YYYY-MM-DD', true),
        'sendHour': times[0],
        'sendMinute': times[1]
      }
      let query = Object.assign(this.form, params)
      this.saveArticle(query)
    },
    getArticleList (data) {
      var params = {
        appid: data.appid,
        contentIds: data.ids.split(',')
      }
      this.$request.contentextPreview(params).then(res => {
        if (res.code === 200) {
          if (res.data && res.data.length) {
            this.sengNumber = res.data[0].sengNumber
          }
          this.getData = res.data.map(v => {
            v.notWechat = true
            return v
          })
        }
      })
    },
    infoChange (data) {
      this.getData[this.activeIndex] = data
    },
    listChange (arr, i) {
      this.getData = Object.assign(this.getData, arr)
      this.activeIndex = i
    },
    validateData (items) {
      let flag = true
      for (const v of this.getData) {
        if (!v.title) {
          this.$message('请填写标题')
          flag = false
          break
        }
        if (!v.content) {
          this.$message('图文内容不能为空')
          flag = false
          break
        }
        if (!v.picId) {
          this.$message('图文需要一个封面')
          flag = false
          break
        }
      }
      return flag
    },
    sendGroup (type) {
      if (this.validateData()) {
        var obj = {
          'appid': this.$route.query.appid,
          'tagId': this.form.tagId,
          'message': this.form.message,
          'type': type,
          'sendDate': '',
          'sendHour': '',
          'sendMinute': '',
          'vo': this.getData
        }
        if (type === 1) {
          this.saveArticle(obj)
        } else {
          this.form = Object.assign({}, obj)
          // 时间选择弹窗
          this.edit.form.hours = this.pickerOptions.start = this.$moment(new Date().getTime() + 5 * 60 * 1000, 'HH:mm', true)
          this.$refs.editDialog.showDialog()
        }
      }
    },
    saveArticle (data) {
      let params = data
      this.$request.contentextPush(params).then(res => {
        this.$restBack(res, () => {
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/content/index', 'list')
        }, '推送成功')
      })
    },
    getTags (data) {
      var params = {
        appId: data.appid
      }
      this.$request.wechattagsApp(params).then(res => {
        if (res.code === 200) {
          this.tags = res.data.tagList
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getTags(this.$route.query)
      this.getArticleList(this.$route.query)
    })
  },
  activated () {
    this.getArticleList(this.$route.query)
  }

}
</script>
<style lang="scss">
.content-public-container{
  background-color: #ffffff;
  .content-form-item-wrap{
    display: flex;
    justify-content: center;
    .content-wrap-cont{
      min-width: 988px;
    .content-head{
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      border-radius: 4px;
      >span{
        color: #333333;
      }
      &__info{
        font-size: 14px;
        color: #666666;
        line-height: 32px;
        margin-right: 20px;
      }
    }
      .content-wrap__head{
        display: flex;
        >.el-form-item{
          margin: 20px 0;
        }
      }
      &__label{
        font-size: 16px;
        color: #333333;
        line-height: 1;
      }
    }
  }
  .el-main{
    overflow-x: hidden;
  }
  &.content-wrap-view{
    background-color: #ffffff;
    height: 100%;
    .content-head{
      background: #F1F0F0;
      height: 58px;
      display: flex;
      justify-content: center;
      align-items: center;
      .header-button{
        color: #666666;
        .jee-svg-icon{
          fill: #777777;
          padding-right: 7px;
        }
      }
      .el-button .jee-svg-icon{
        padding-right: 10px;
      }
      .header-button + .header-button,
      .header-button + .el-button{
        margin-left: 40px;
      }
    }
  }
}
</style>
