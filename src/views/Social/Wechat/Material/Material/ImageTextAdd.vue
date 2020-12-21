<template>
  <section class="wechat-imagetext-add">
    <base-header v-bind="headers" />
    <base-form
        ref='form'
        v-bind="form"
        @handleConfirm="handleConfirm"
        @handleConfirmGroup="handleGroup"
        >
      <template #articles="scope">
        <div class="wechat-imgtxt__box">
          <div class="wechat-imgtxt__left">
            <label class="wechat-imgtxt__label">图文列表</label>
            <image-text-list
              :edit="$route.query.type === 'add'?true:false"
              :list="getData"
              ref="imgTextList"
              @listChange="listChange"
              :index="activeIndex"></image-text-list>
          </div>
          <div class="wechat-imgtxt__right">
            <image-text-info
              :uploadBtn="$route.query.type === 'add'?true:false"
              ref="imgTextInfo"
              @infoChange="infoChange"
              :article="getData[activeIndex]"
              :index="activeIndex"></image-text-info>
          </div>
        </div>
      </template>
    </base-form>
    <!-- 群发设置 -->
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      :footText="footText"
      v-on:handleConfirm="handleConfirmAdd"
      v-on:handleConfirmGroup="handleConfirmGroup"
    >
      <template #materialId="scope">
        <div style="padding:0 20px;" class="t-border">
          <material-select
            @handleConfirm="materialSel"
            :data="scope.form.comment"
            :appId="$route.query.appId"
            ref="material"
            :type='1'></material-select>
        </div>
      </template>
    </form-dialog>
    <form-dialog
      ref="groupDialog"
      v-bind="group"
      :footText="footText"
      v-on:handleConfirm="groupConfirm"
    >
      <template #hours="scope">
        <el-select v-model="scope.form.hours" size="mini"
          style="width:175px" placeholder="选择日期" @change="handleChangeHours">
          <el-option v-for="(item,index) in sendDateOptions" :key="index"
           :label="item.label" :value="item.value"></el-option>
        </el-select>&nbsp;
        <el-select v-model="scope.form.sendHour" size="mini"
          style="width:84px">
          <el-option v-for="(item,index) in sendHourOptions" :key="index"
            :label="item.label" :value="item.value"></el-option>
        </el-select> 时
        <el-select v-model="scope.form.sendMinute" size="mini"
          style="width:84px">
          <el-option v-for="(item,index) in sendMinuteOptions" :key="index"
            :label="item.label" :value="item.value"></el-option>
        </el-select> 分
      </template>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import ImageTextList from '../../components/ImageTextList'
import ImageTextInfo from '../../components/ImageTextInfo'
import formDialog from '@/components/mixins/formDialog'
import materialSelect from '../../Menu/components/materialSelect'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'socialWechatMaterialImageTextAdd',
  mixins: [baseHeader, baseForm, formDialog],
  components: {
    ImageTextList,
    ImageTextInfo,
    materialSelect
  },
  computed: {
    ...mapGetters(['wechatTags']),
    footText () {
      let now = new Date()
      const m = now.getMonth() + 1
      const d = now.getDate()
      return `${m}月${d}日（今天）还能定时群发${this.groupSendNumber}次`
    }
  },
  data () {
    return {
      showInfo: false,
      headers: {
        title: '操作说明',
        content: '操作说明'
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
      form: {
        labelWidth: '0px',
        form: {
          articles: [],
          comment: 1
        },
        submitBtns: [
          {
            text: '保存',
            subType: 'submit'
          },
          {
            text: '保存并群发',
            subType: 'Group'
          }
        ],
        formItems: [
          {
            prop: 'articles',
            type: 'slot'
          },
          {
            prop: 'comment',
            label: '留言设置：',
            labelWidth: '82px',
            type: 'radio',
            options: [
              {
                label: '所有人均可留言',
                value: 1
              },
              {
                label: '仅关注后可留言',
                value: 2
              },
              {
                label: '不允许留言',
                value: 0
              }
            ]
          }
        ]
      },
      formParams: {
        'addNewsRequest': {
          'articles': []
        },
        'appId': ''
      },
      backUrl: '',
      edit: {
        width: '779px',
        title: '群发设置',
        formLoading: false,
        showCancel: false,
        form: {
          'tagId': '',
          'materialId': '',
          'appId': this.$route.query.appId,
          'comment': null
        },
        rules: {
          materialId: [
            this.$rules.required()
          ]
        },
        buttons: [
          {
            text: '定时群发',
            keepAlive: true,
            type: 'Group'
          },
          {
            text: '群发',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            label: '接收对象',
            prop: 'tagId',
            type: 'select',
            options: [],
            optionLabel: 'tagName',
            optionValue: 'id'
          },
          {
            prop: 'materialId',
            label: '选择文件',
            type: 'slot'
          }
        ]
      },
      group: {
        width: '600px',
        title: '群发设置',
        labelWidth: '100px',
        formLoading: false,
        form: {
          'appId': '',
          'hours': '',
          'sendDate': '',
          'sendHour': '',
          'sendMinute': '',
          'tagId': '',
          'materialId': ''
        },
        rules: {
          materialId: [
            this.$rules.required()
          ]
        },
        buttons: [
          {
            text: '定时群发',
            type: 'Submit'
          }
        ],
        formItems: [
          {
            text: '你可以选择今天5分钟后或本月中今天以后的任意时刻定时群发，但在设定的时间之前可修改或取消，设定后会占用群发条数，取消后不占用群发条数。',
            type: 'place',
            style: {
              paddingLeft: '10px',
              color: '#999999',
              lineHeight: '24px'
            }
          },
          {
            prop: 'hours',
            label: '发送时间',
            style: {
              marginTop: '25px'
            },
            type: 'slot'
          }
        ]
      },
      groupSendNumber: 0,
      sendDateOptions: [],
      sendHourOptions: [],
      sendMinuteOptions: []
    }
  },
  watch: {
    wechatTags (newVal, oldVal) {
      if (newVal) {
        let arr = [ { 'id': '', 'tagName': '全部对象' } ]
        this.edit.formItems.find(v => v.prop === 'tagId').options = arr.concat(this.wechatTags)
      }
    },
    activeIndex (newVal, oldVal) {
      this.showInfo = false
      this.$nextTick(() => {
        this.showInfo = true
      })
    }
  },
  inject: ['removeTab'],
  methods: {
    ...mapActions('wechat', ['FetchWechatTags']),
    materialSel (data, type) {
      this.edit.form.comment = data
      this.edit.form.materialId = data.id || data.mediaId
    },
    infoChange (data) {
      this.getData.splice(this.activeIndex, 1, data)
    },
    listChange (arr, i) {
      this.getData = Object.assign(this.getData, arr)
      this.activeIndex = i
    },
    // 群发
    wechatsendSend () {
      // fetchWwechatsendSend
    },
    handleConfirm (data, type) {
      if (this.validateData()) {
        var arr = []
        arr = this.getData.map(v => {
          return {
            'title': v.title,
            'thumbMediaId': v.mediaId || v.thumbMediaId || '',
            'author': v.author,
            'digest': '',
            'showCoverPic': 0,
            'content': this.$encode(v.content),
            'contentSourceUrl': this.$encode(v.sourceUrl),
            'thumbMediaUrl': this.$encode(v.mediaUrl || v.thumbMediaUrl || ''),
            'needOpenComment': data.comment ? 1 : 0,
            'onlyFansCanComment': data.comment ? data.comment - 1 : 0
          }
        })
        let params = {
          'addNewsRequest': {
            'articles': arr
          },
          'appId': this.formParams.appId
        }
        this.saveArticle(params, type)
      }
    },
    saveArticle (data, type) {
      const that = this
      this.$request.fetchWechatMaterialNewsAdd(data).then(res => {
        // 保存并群发
        if (res.code === 200) {
          if (type === 'grupSend') {
            const comment = {
              requestArray: data.addNewsRequest.articles,
              msgType: 'news',
              mediaId: res.data.id
            }
            that.$set(that.edit.form, 'comment', comment)
            that.$set(that.edit.form, 'materialId', res.data.id)
            that.groupSendNumber = res.data.number
            that.$refs.editDialog.showDialog()
          } else {
            // 直接保存
            this.$restBack(res, () => {
              this.removeTab(this.$route.fullPath)
              if (this.$route.query.type === 'add') {
                this.$routerLink('/social/wechat/material/index', 'list')
              }
            }, '保存成功')
          }
        }
      })
    },
    // 点击保存并群发
    handleGroup (data) {
      // this.$refs.editDialog.showDialog()
      this.handleConfirm(data, 'grupSend')
    },
    handleConfirmAdd (data, btn) {
      let params = data
      delete params.comment
      this.$request.fetchWechatsendSend(data).then(res => {
        this.$restBack(res, () => {
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/social/wechat/material/index', 'list')
        }, '群发成功')
      })
    },
    handleChangeHours (val) {
      let date = new Date()
      let t = val.split('-')
      date.setMonth(t[0] - 1)
      date.setDate(t[1])
      this.getDateOptions(date)
    },
    handleConfirmGroup (data, btn) {
      let date = new Date()
      let defaultData = {}
      defaultData.sendDate = this.$moment(date.getTime(), 'YYYY-MM-DD', true)
      defaultData.hours = this.$moment(date.getTime(), 'MM-DD', true)
      defaultData.sendHour = date.getHours()
      defaultData.sendMinute = date.getMinutes() + 5
      this.group.form = Object.assign({}, defaultData, data)
      this.getDateOptions(date)
      this.$refs.groupDialog.showDialog()
    },
    // 群发设置的下拉时间
    getDateOptions (date) {
      this.sendDateOptions = []
      this.sendHourOptions = []
      this.sendMinuteOptions = []
      let now = new Date()
      let isToday = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate()

      let M = date.getMonth() + 1
      let D = now.getDate()
      let h = isToday ? date.getHours() : 0
      let m = isToday ? date.getMinutes() : 1
      let mon = 30
      if ((M < 9 && M % 2 > 0) || (M > 9 && M % 2 === 0)) {
        mon = 31
      }
      let arr = []
      let arr1 = []
      let arr2 = []
      for (var i = 0; i <= mon - D; i++) {
        arr.push({
          label: M + '-' + (Number(D) + i),
          value: M + '-' + (Number(D) + i)
        })
      }
      for (var j = 0; j < 60 - m; j++) {
        arr1.push({
          label: m + j,
          value: m + j
        })
      }
      for (var t = 0; t < 24 - h; t++) {
        arr2.push({
          label: h + t,
          value: h + t
        })
      }
      this.sendDateOptions = arr
      this.sendHourOptions = arr2
      this.sendMinuteOptions = arr1
    },
    groupConfirm (data, btn) {
      let y = new Date().getFullYear()
      let params = data
      params.sendDate = y + '-' + data.hours
      this.$request.fetchWechatsendAdd(params).then(res => {
        this.$restBack(res, () => {
          this.removeTab(this.$route.fullPath)
          this.$routerLink('/social/wechat/material/index', 'list')
        }, '群发成功')
      })
    },
    validateData (items) {
      let flag = true
      this.getData.forEach((v, i) => {
        if (!v.title) {
          this.$message('请填写标题')
          flag = false
          this.activeIndex = i
          return
        }
        if (!v.content) {
          this.$message('图文内容不能为空')
          this.activeIndex = i
          flag = false
          return
        }
        if (!v.picId) {
          this.$message('图文需要一个封面')
          this.activeIndex = i
          flag = false
        }
      })
      return flag
    }
  },
  mounted () {
    this.showInfo = true
    if (this.$route.query.appId) {
      this.formParams.appId = this.$route.query.appId
      if (!this.wechatTags.length) {
        this.FetchWechatTags({ appId: this.$route.query.appId }, true)
      }
    }

    if (this.$route.query.backUrl) {
      this.backUrl = this.$route.query.backUrl
    }
  }
}
</script>
