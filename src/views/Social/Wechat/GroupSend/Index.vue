<template>
  <section class="group-send-index">
    <!-- <base-header
      v-bind="headers"
      /> -->
    <jee-aside-layout
      asideWidth="250px"
      class="social-container"
      hiddenHeader :noPageView='true'>
       <section slot="asideMain" >
         <weibo-tree
         rowKey="appId"
         type="wechat"
          ref="weiboTree"
          @setActive="setActive"
          :activeId="activeId"></weibo-tree>
       </section>
       <section slot="main" v-if="activeId">
         <el-calendar
          class="send-calendar"
          v-model="activeTime">
          <template
            slot="dateCell"
            slot-scope="{date, data}"
           >
            <!-- isSelected type day -->
              <div class="send-box"
                :class="{'is-disabled':dateFilter(data.day)&&!getData[data.day]}"
                @click="sendCalendar(data,getData[data.day])" >
                <span class="send-box__time">{{ data.day.slice(8,9) !== '0' ?data.day.slice(8):data.day.slice(9)}}</span>
                <div class="send-box__comment" v-if="getData[data.day]">
                  <div class="send-box__img">
                    <div v-if="getData[data.day].comment">
                      <div v-if="getData[data.day].comment.msgType === 'video'||getData[data.day].comment.msgType === 'voice'">
                        <div class="send-box__image" style="padding:15px">
                          <jee-icon
                            :iconClass="getData[data.day].comment.msgType === 'voice'?icon.icon:icon2.icon"
                            :style="getData[data.day].comment.msgType === 'voice'?icon.style:icon2.style"></jee-icon>
                        </div>
                        <div class="send-box__span" style="padding:15px"
                          :title="getData[data.day].comment.name||''"
                          >{{getData[data.day].comment.name||''}}</div>
                      </div>
                      <div v-else>
                        <div class="send-box__image">
                          <el-image
                            class="t-img"
                            :src="getData[data.day].comment.url?$weChatUrl(getData[data.day].comment.url):''"
                            fit="contain">
                              <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                              </div>
                          </el-image>
                        </div>
                        <div class="send-box__span"
                            :title="getData[data.day].comment.name||''"
                            >{{getData[data.day].comment.name||''}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="send-box__btns" v-if="!dateFilter(data.day)">
                    <el-link
                      :underline='false'
                      @click.stop="editWechatSend(getData[data.day])"
                      :disabled="!_checkPermission('/wechatsend', 'PUT')"
                    >
                      <jee-icon iconClass="bianji"
                        :style="{fill:'#666666',marginRight:'14px',fontSize: '14px'}"
                      ></jee-icon>
                    </el-link>
                    <el-link
                      :underline='false'
                      @click.stop="deleteWechatSend(getData[data.day])"
                      :disabled="!_checkPermission('/wechatsend', 'DELETE')"
                    >
                      <jee-icon iconClass="shanchu"
                        :style="{fill:'#666666',fontSize: '14px'}"
                      ></jee-icon>
                    </el-link>
                  </div>
                </div>
              </div>
          </template>
        </el-calendar>
       </section>
    </jee-aside-layout>
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      @handleConfirm="handleConfirm"
    >
      <template #hours="scope">
        <el-time-select
          size="small"
          style="width:300px"
          v-model="edit.form.hours"
          :picker-options="pickerOptions"
          placeholder="请选择定时发送时间">
        </el-time-select>
        <!-- <el-time-picker
          v-model="edit.form.hours"
          size="small"
          style="width:300px"
          clearable
          value-format="HH:mm"
          :picker-options="pickerOptions"
          placeholder="请选择定时发送时间">
        </el-time-picker> -->
      </template>
      <template #comment="scope">
        <div style="padding:0 20px;" class="t-border">
          <material-select
            @handleConfirm="materialSel"
            :data="edit.form.comment"
            :contentShow="edit.form.comment?true:false"
            ref="material"
            :appId="activeId"
            :type='1'></material-select>
        </div>
      </template>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import formDialog from '@/components/mixins/formDialog'
import materialSelect from '../Menu/components/materialSelect'
import { mapGetters, mapActions } from 'vuex'
import weiboTree from '../../Weibo/components/WeiboTree'
var editForm = {
  'appId': '',
  'sendDate': '',
  'sendHour': '',
  'sendMinute': '',
  'tagId': '',
  'materialId': '',
  'hours': '',
  'comment': null
}
export default {
  name: 'socialWechatGroupIndex',
  mixins: [baseHeader, formDialog],
  components: {
    materialSelect,
    weiboTree
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '操作说明'
      },
      icon: {
        icon: 'geshi_tongyongyinpin',
        style: {
          fill: '#DB3E1F',
          fontSize: '40px'
        }
      },
      icon2: {
        icon: 'geshi_tongyongshipin',
        style: {
          fill: '#2987EB',
          fontSize: '40px'
        }
      },
      edit: {
        width: '778px',
        title: '群发设置',
        formLoading: false,
        form: Object.assign({}, editForm),
        rules: {
          hours: [
            this.$rules.required()
          ],
          comment: [
            this.$rules.required()
          ]
        },
        showFoot: true,
        buttons: [
          {
            text: '确认',
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
            label: '定时发送时间',
            prop: 'hours',
            type: 'slot'
          },
          {
            label: '回复内容',
            prop: 'comment',
            type: 'slot'
          }
        ]
      },
      activeId: '',
      getData: {},
      activeTime: new Date(),
      pickerOptions: {
        start: '00:01',
        step: '00:01',
        end: '23:59'
      }
    }
  },
  computed: {
    ...mapGetters(['wechatInfoList', 'wechatTags'])
  },
  mounted () {
    this.fetchWechatTags()
  },
  watch: {
    wechatTags (newVal, oldVal) {
      if (newVal) {
        let arr = [
          {
            'id': '',
            'tagName': '全部对象'
          }
        ]
        this.edit.formItems.find(v => v.prop === 'tagId').options = arr.concat(this.wechatTags)
      }
    },
    wechatInfoList () {
      this.fetchWechatTags()
    }
  },
  methods: {
    ...mapActions('wechat', ['FetchWechatTags']),
    fetchWechatTags () {
      if (this.wechatInfoList.length > 0 && !this.activeId) {
        this.edit.form.appId = this.wechatInfoList[0].appId
        this.activeId = this.wechatInfoList[0].appId
        if (!this.wechatTags.length) {
          this.FetchWechatTags({ appId: this.wechatInfoList[0].appId }, true)
        }
        this.getDataList()
      }
    },
    dateFilter (day) {
      let nowTime = new Date()
      let currentTime = new Date(day)
      let yesterDay = nowTime.getTime() - 24 * 60 * 60 * 1000
      if (currentTime.getTime() < yesterDay) {
        return true
      } else if (nowTime.getMonth() !== currentTime.getMonth()) {
        return true
      } else {
        return false
      }
    },
    sendCalendar (data, item) {
      let status = this.dateFilter(data.day)
      if (!status) {
        this.edit.showFoot = true
        const addPerm = this._checkPermission('/wechatsend', 'POST')
        const editPerm = this._checkPermission('/wechatsend', 'PUT')
        let hours = this.pickerOptions.start = this.$moment(new Date().getTime() + 5 * 60 * 1000, 'HH:mm', true)
        if (data.day === this.$moment(new Date().getTime(), 'YYYY-MM-DD', true)) {
          this.pickerOptions.start = hours
        } else {
          this.pickerOptions.start = '00:01'
        }
        if (item) {
          if (!editPerm) {
            this.$message('没有权限')
            return
          }
          this.edit.form = Object.assign(editForm, item)
          this.edit.form.id = ''
        } else {
          if (!addPerm) {
            this.$message('没有权限')
            return
          }
          this.edit.form = Object.assign({}, editForm)
          this.edit.form.sendDate = data.day
          this.edit.form.comment = null
          this.edit.form.hours = hours
        }

        this.$refs.editDialog.showDialog()
      } else if (item) {
        this.edit.form = Object.assign(editForm, item)
        this.edit.showFoot = false
        this.$refs.editDialog.showDialog()
      } else {
        return false
      }
    },
    materialSel (data, type) {
      this.edit.form.comment = data
    },
    handleConfirm (data) {
      let times = data.hours.split(':')
      let params = {
        'appId': this.activeId,
        'sendDate': data.sendDate,
        'sendHour': times[0],
        'sendMinute': times[1],
        'tagId': data.tagId,
        'materialId': data.comment.id
      }
      if (data.id) {
        params.id = data.id
        this.$request.fetchWechatsendPut(params).then(res => {
          this.$restBack(res, () => {
            this.getDataList()
          }, '修改成功')
        })
      } else {
        this.$request.fetchWechatsendAdd(params).then(res => {
          this.$restBack(res, () => {
            this.getDataList()
          }, '新增成功')
        })
      }
    },
    deleteWechatSend (data) {
      let params = { ids: [data.id] }
      this.$confirm('是否确认删除定时群发任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchWechatsendDelete(params).then(res => {
          this.$restBack(res, () => {
            this.getDataList()
          })
        })
      }).catch(() => {})
    },
    editWechatSend (item) {
      this.edit.form = Object.assign({}, editForm, item)
      this.$refs.editDialog.showDialog()
    },
    getDataList () {
      let params = { appId: this.activeId }
      this.$request.fetchWechatsendList(params).then(res => {
        if (res.code === 200) {
          let obj = {}
          res.data.forEach(v => {
            let date = this.$moment(v.sendDate, 'YYYY-MM-DD', true)
            obj[date] = {
              id: v.id,
              appId: this.activeId,
              comment: {
                id: v.material.id,
                mediaId: v.material.id,
                msgType: v.material.mediaType,
                name: v.material.objects && v.material.objects[0] ? v.material.objects[0].title : v.material.mediaName,
                requestArray: v.material.objects,
                url: v.material.objects && v.material.objects[0] ? this.$weChatUrl(v.material.objects[0].thumbMediaUrl) : this.$getPath(v.material.mediaUrl)
              },
              hours: (v.sendHour > 10 ? v.sendHour : '0' + v.sendHour) + ':' + (v.sendMinute > 10 ? v.sendMinute : '0' + v.sendMinute),
              sendDate: date,
              tagId: v.tagId || ''
            }
          })
          this.getData = obj
        }
      })
    },
    // 点击列表
    setActive (id) {
      this.activeId = id
      if (!this.wechatTags.length) {
        this.FetchWechatTags({ appId: id }, true)
      }
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">
  .group-send-index{
    .send-box{
      padding: 20px;
      min-height: 95px;
      box-sizing: border-box;
      &__time{
        font-size:18px;
      }
      &.is-active{
        background-color: #FAFAFA;
        color: #333333;
      }
      &__comment{
        width: 100%;
      }
      &__img{
        min-height: 70px;
        font-size: 12px;
        color: #333333;
        box-sizing: border-box;
        .el-image{
          width: auto;
          height: 70px;
          .el-image__inner{
            width: auto;
            border-radius: 4px;
          }
        }
      }
      &__image{
        max-height: 70px;
        max-width: 115px;
        .el-image__inner{
          width: auto;
          border-radius: 4px;
        }
      }
      &__span{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding: 10px 0;
      }
    }
  }
</style>
