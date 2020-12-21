<template>
  <section class="received-wrap-index">
    <label class="gray">{{label}}</label>
    <base-form
        v-bind="form"
        v-on:handleConfirm="handleConfirm"
        v-on:handleConfirmDelete="handleConfirmDelete"
      >
        <template #comment="scope">
          <div class="rw-wrap t-border">
            <span>回复内容</span>
            <div class="rw-box">
              <material-select
                @handleConfirm="materialSel"
                class="t-top"
                :appId="id"
                :data="form.form.comment"
                :class="{'t-bottom':!form.form.comment}"
                ref="material"
                :type="4"></material-select>
            </div>
          </div>
        </template>
    </base-form>
  </section>
</template>
<script>
import baseForm from '@/components/mixins/baseForm'
import materialSelect from '../Menu/components/materialSelect'
export default {
  name: 'received',
  mixins: [baseForm],
  components: {
    materialSelect
  },
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
    id (newVal, oldVal) {
      if (newVal !== oldVal && this.id) {
        this.form.params.appId = newVal
        this.form.params.replyType = this.name === 'received' ? 2 : 1
        this.form.form.replyType = this.name === 'received' ? 2 : 1
        this.fetchFormApi()
      }
    },
    name (newVal, oldVal) {
      if (newVal !== oldVal && this.id) {
        this.form.params.appId = this.id
        this.form.params.replyType = this.name === 'received' ? 2 : 1
        this.form.form.replyType = this.name === 'received' ? 2 : 1
        this.fetchFormApi()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'received' && this.id) {
        this.form.params.appId = this.id
        this.fetchFormApi()
      }
    })
  },
  data () {
    return {
      label: '当未匹配到关键词规则时会使用此处的设置进行回复',
      form: {
        request: true,
        labelWidth: '0px',
        api: 'fetchWwechatreplyclick',
        params: {
          appId: '',
          replyType: 2
        },
        form: {
          'appId': this.id,
          'replyType': 2,
          'comment': null,
          'type': 'add'
        },
        submitBtns: [
          {
            text: '保存',
            subType: 'submit',
            disabled: !this._checkPermission('/wechatreplyclick', this.getType === 'add' ? 'POST' : 'PUT')
          },
          {
            text: '删除回复',
            subType: 'Delete',
            disabled: this.getReplyType === 2 || !this._checkPermission('/wechatreplyclick', 'DELETE')
          }
        ],
        formItems: [
          {
            prop: 'comment',
            type: 'slot'
          }
        ],
        rules: {
          comment: [
            this.$rules.required()
          ]
        }
      }
    }
  },
  computed: {
    getType () {
      return this.form.form.type
    },
    getReplyType () {
      return this.form.form.replyType
    }
  },
  methods: {
    // 素材选择
    materialSel (data, type) {
      this.form.form.comment = data
    },
    // 新增、修改回复
    handleConfirm (data) {
      var params = {
        'appId': this.id,
        'replyType': this.name === 'received' ? 2 : 1,
        'wechatReplyContent': {
          'content': data.comment.content || '',
          'mediaId': data.comment.msgType !== 'text' ? (data.comment.id || data.comment.wechatMaterial.id) : ''
        }
      }
      if (!data.id) {
        this.$request.fetchWwechatreplyclickAdd(params).then(res => {
          this.$restBack(res, () => {
            this.fetchFormApi()
          }, '保存成功')
        })
      } else {
        params.id = data.id
        this.$request.fetchWwechatreplyclickPut(params).then(res => {
          this.$restBack(res, () => {
            this.fetchFormApi()
          }, '修改成功')
        })
      }
    },
    // 删除回复
    handleConfirmDelete (data) {
      this.$request.fetchWwechatreplyclickDelete({ ids: [data.id] }).then(res => {
        this.$restBack(res, () => {
          this.fetchFormApi()
        })
      })
    },
    // 获取内容
    fetchFormCallBack (res) {
      if (res.code === 200) {
        if (res.data && res.data.id) {
          this.form.form = res.data
          this.form.form.type = 'edit'
          this.form.form.comment = res.data.wechatReplyContent
          this.form.form.comment.appId = this.id
          this.form.form.appId = this.id
          this.form.submitBtns.find(v => v.subType === 'Delete').disabled = false
        } else {
          this.form.form = {
            'appId': this.id,
            'replyType': this.name === 'received' ? 2 : 1,
            'comment': null,
            'type': 'add'
          }
          this.form.submitBtns.find(v => v.subType === 'Delete').disabled = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.received-wrap-index{
  font-size: 14px;
  .rw-wrap{
    min-height: 350px;
    color: #666666;
    padding: 5px 20px;
    margin-top: 15px;
    box-sizing: border-box;
  }
}
</style>
