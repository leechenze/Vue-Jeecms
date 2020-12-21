<template>
  <section class="fans-aside-index">
    <div class="fans-aside-item is-active">
      <div class="fl" @click="tagIdSel('')">全部用户（{{count}}）</div>
      <div class="fr">
        <el-link :underline='false' @click="syncTags"
          :disabled="!_checkPermission('/wechattags/syncTags', 'GET')"
        >
          <jee-icon
            class="jee-hover-fill"
            iconClass="shuaxin"
            :style="{fontSize:'18px',marginRight:'15px'}"></jee-icon>
        </el-link>
        <el-link :underline='false' @click="addTags"
          :disabled="!_checkPermission('/wechattags', 'POST')"
        >
          <jee-icon
            class="jee-hover-fill"
            iconClass="jia"
            :style="{fontSize:'16px'}"></jee-icon>
        </el-link>
      </div>
    </div>
    <ul class="fans-aside-list">
      <li
        v-for="(item,index) in fansList" :key="index"
        class="fans-aside-item"
        :class="{'is-active':item.id === tagid}">
        <div class="fl" @click="tagIdSel(item.id)">{{item.tagName}}（{{item.userCount}}）</div>
        <div class="fr fans-aside-edit">
          <el-link :underline='false' @click="editTags(item)"
            :disabled="!_checkPermission('/wechattags', 'PUT')"
          >
            <jee-icon
              class="jee-hover-fill"
              iconClass="bianji"
              :style="{fontSize:'9px',marginRight:'15px'}"></jee-icon>
          </el-link>
          <el-link :underline='false' @click="deleteTags(item)"
            :disabled="!_checkPermission('/wechattags', 'DELETE')"
          >
            <jee-icon
              class="jee-hover-fill"
              iconClass="tangchuangguanbi"
              :style="{fontSize:'9px'}"></jee-icon>
          </el-link>
        </div>
      </li>
    </ul>
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      v-on:handleConfirm="handleConfirm"
    >
    </form-dialog>
  </section>
</template>

<script>
import formDialog from '@/components/mixins/formDialog'

export default {
  name: 'fans-aside',
  mixins: [formDialog],
  props: {
    tagid: {
      type: [String, Number],
      default: ''
    },
    appId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      fansList: [],
      edit: {
        title: '',
        formLoading: false,
        form: {},
        rules: {},
        buttons: [
          {
            text: '确认',
            type: 'Submit'
          }
        ],
        formItems: []
      },
      count: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getTags()
    })
  },
  watch: {
    appId (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getTags()
      }
    }
  },
  methods: {
    // 选择标签
    tagIdSel (val) {
      this.$emit('tagIdSel', val)
    },
    // 获取标签列表
    getTags () {
      if (this.appId) {
        let params = { appId: this.appId }
        this.$request.wechattagsApp(params).then(res => {
          if (res.code === 200) {
            this.fansList = res.data.tagList
            this.count = res.data.fansSize
            this.$emit('tagList', res.data.tagList)
          }
        })
      }
    },
    // 同步标签
    syncTags () {
      if (this.appId) {
        let params = { appId: this.appId }
        this.$request.fetchWechattagsSyncTags(params).then(res => {
          this.$restBack(res, () => {
            this.getTags()
          }, '同步成功')
        })
      }
    },
    // 新增弹窗
    addTags () {
      this.edit.title = '新建标签'
      this.edit.form = {
        'appId': this.appId,
        'tagname': '',
        'type': 'add'
      }
      this.edit.formItems = [
        {
          label: '粉丝标签',
          prop: 'tagname',
          maxlength: 10,
          placeholder: '请输入标签名称，最多10个字符'
        }
      ]
      this.edit.rules = {
        tagname: [this.$rules.required(), { validator: (rule, value, callback) => {
          if (value === '') {
            callback()
          } else {
            var params = {
              'tagName': value,
              'appId': this.appId
            }
            this.$request.fetchWechattagsCheck(params).then(res => {
              if (res.code === 200) {
                if (res.data) {
                  callback()
                } else {
                  callback(new Error('标签名称已存在'))
                }
              } else {
                callback(new Error(res.message))
              }
            })
          }
        },
        trigger: ['blur'] }]
      }
      this.$refs.editDialog.showDialog()
    },
    // 修改弹窗
    editTags (item) {
      this.edit.title = '粉丝标签修改'
      this.edit.form = {
        'appId': this.appId,
        'tagId': item.id,
        'tagname': item.tagName,
        'type': 'edit'
      }
      this.edit.formItems = [
        {
          label: '粉丝标签',
          maxlength: 10,
          prop: 'tagname',
          placeholder: '请输入标签名称，最多10个字符'
        }
      ]
      this.edit.rules = {
        tagname: [this.$rules.required()]
      }
      this.$refs.editDialog.showDialog()
    },
    // 删除标签
    deleteTags (data) {
      this.$confirm('确认删除当前标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          appId: this.appId,
          tagId: data.id
        }
        this.$request.fetchWechattagsDelete(params).then(res => {
          this.$restBack(res, () => {
            this.getTags()
          })
        })
      }).catch(() => {})
    },
    // 确认
    handleConfirm (data) {
      let params = data
      if (data.type === 'add') {
        this.$request.fetchWechattagsAdd(params).then(res => {
          this.$restBack(res, () => {
            this.getTags()
          }, '新增成功')
        })
      } else if (data.type === 'edit') {
        this.$request.fetchWechattagsPut(params).then(res => {
          this.$restBack(res, () => {
            this.getTags()
          }, '修改成功')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .fans-aside-index{
    .fans-aside-item{
      height: 45px;
      font-size: 14px;
      padding: 0 20px;
      color: #333;
      cursor: pointer;
      line-height: 45px;
      border-bottom: 1px solid #e8e8e8;
      .jee-svg-icon{
        fill:#787878;
      }
      &.is-active{
        background-color: #FAFAFA;
        .fans-aside-edit{
          display: block;
        }
      }
      .fans-aside-edit{
        display: none;
      }
      &:hover{
        .fans-aside-edit{
          display: block;
        }
      }
    }
  }
</style>
