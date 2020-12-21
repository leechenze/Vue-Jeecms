<template>
  <section class="keyword-warp-index">
    <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      >
        <template slot>
          <div class="input-right">
            <el-input
              v-model="list.params.searchStr"
              maxlength="50"
              @keyup.enter.native="handleSearch($event)"
              size="medium" :placeholder="placeholder"
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
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      @handleEdit="handleTableEdit"
    >
      <template #wechatReplyKeywordList="scope">
        <span
         v-for="(item,index) in scope.scope.row.wechatReplyKeywordList"
         :key="index">
        {{item.wordkeyEq?item.wordkeyEq:item.wordkeyLike}}</span>
      </template>
    </base-table>
    <form-dialog
      ref="editDialog"
      v-bind="edit"
      v-on:handleConfirm="handleConfirmAdd"
    >
      <template #keys="scope">
        <div class="scope-input" v-for="(item,index) in keyData" :key="index">
          <el-select size="small" class="select-input"
            popper-class="jee-border"
            v-model="item.type" placeholder="请选择">
            <el-option label="半匹配" :value="2"></el-option>
            <el-option label="全匹配" :value="1"></el-option>
          </el-select>
          <el-input size="small" maxlength="20" placeholder="请输入内容" v-model="item.name" class='input-wrap'>
          </el-input>
          <div class="append-btn">
            <jee-icon
                v-if="index === keyData.length-1"
              iconClass="jia1" @click="addKey(index,item)"
              :style="{fill:'#999'}" class="jee-hover-fill"></jee-icon>
            <jee-icon v-if="keyData.length >1"
              iconClass="jianqu" @click="deleteKey(index,item)"
              :style="{fill:'#999'}" class="jee-hover-fill"></jee-icon>
          </div>
        </div>
      </template>
      <template #comment="scope">
        <div style="padding:0 20px;" class="t-border t-radius">
          <material-select
            @handleConfirm="materialSel"
            :data="scope.form.comment"
            :appId="id"
            ref="material"
            :type='3'></material-select>
        </div>
      </template>
    </form-dialog>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import materialSelect from '../Menu/components/materialSelect'
var columns = [
  {
    prop: 'ruleName',
    label: '规则名称',
    minWidth: '200px'
  },
  {
    prop: 'wechatReplyKeywordList',
    label: '关键词',
    minWidth: '160px',
    scopeType: 'slot'
  },
  {
    prop: 'content',
    label: '回复内容',
    minWidth: '200px',
    formatter: (row) => {
      let obj = {
        'voice': '语音',
        'news': '图文',
        'image': '图片',
        'video': '视频',
        'music': '音乐',
        'text': '文本'
      }
      return row.content ? row.content : obj[row.msgType]
    }
  }
]
export default {
  name: 'keyword',
  mixins: [baseHeader, baseTable, formDialog],
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
    id (newVal) {
      if (this.name === 'keyword' && newVal) {
        this.list.params.appId = newVal
        this.list.api = 'fetchWechatreplycontentPage'
        this.fetchTableApi()
      }
    },
    name (newVal, oldVal) {
      if (newVal === 'keyword' && this.id) {
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.name === 'keyword' && this.id) {
        this.list.params.appId = this.id
        this.list.api = 'fetchWechatreplycontentPage'
        this.fetchTableApi()
      }
    })
  },
  data () {
    return {
      headers: {
        paddingBottom: '10px',
        buttons: [
          {
            type: 'Add',
            text: '添加回复',
            icon: 'xinjian',
            disabled: !this._checkPermission('/keyWord', 'POST')
          }
        ],
        showAlertIcon: false
      },
      placeholder: '搜索关键词/规则名称',
      list: {
        columns,
        showSelection: false,
        api: '',
        params: {
          'appId': '',
          'searchStr': ''
        },
        handleColumn: [
          {
            type: 'Edit',
            name: '编辑',
            icon: 'bianji',
            disabled: !this._checkPermission('/wechatreplycontent', 'PUT')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'tangchuangguanbi',
            disabled: !this._checkPermission('/wechatreplycontent', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: 'global.handle',
          width: '175px',
          align: 'left'
        }
      },
      edit: {
        width: '778px',
        title: '添加回复',
        labelWidth: '114px',
        formLoading: false,
        form: {
          'appId': '',
          'keyEq': [],
          'keyLike': [],
          'content': '',
          'ruleName': '',
          'sortNum': 1,
          'mediaId': '',
          'isEnable': true,
          'comment': null,
          'type': ''
        },
        rules: {
          'ruleName': [this.$rules.required()],
          'sortNum': [this.$rules.required(), this.$rules.rangeNum(1, 99), this.$rules.plusNumber()],
          'comment': [this.$rules.required()]
        },
        buttons: [
          {
            text: '确认',
            keepAlive: true,
            reset: true,
            type: 'Submit'
          }
        ],
        formItems: [
          {
            label: '规则名称',
            prop: 'ruleName',
            showWordLimit: true,
            style: {
              maxWidth: '700px'
            },
            maxlength: '60',
            placeholder: ' 规则名最多60个字'
          },
          {
            label: '匹配优先级',
            style: {
              maxWidth: '700px'
            },
            prop: 'sortNum',
            maxlength: 2,
            explian: '请输入大于0的整数，在多组规则关键词都匹配到的情况下，选用优先级更大的规则进行回复  '
          },
          {
            label: '关键词',
            prop: 'keys',
            type: 'slot'
          },
          {
            label: '回复内容',
            prop: 'comment',
            type: 'slot'
          },
          {
            label: '状态',
            prop: 'isEnable',
            type: 'switch',
            enableText: '启用',
            disableText: '禁用'
          }

        ]
      },
      keyData: [
        {
          name: '',
          type: 1
        }
      ]
    }
  },
  methods: {
    handleSearch () {
      this.fetchTableApi()
    },
    materialSel (data, type) {
      this.edit.form.comment = data
    },
    // 删除关键词
    deleteKey (i, data) {
      this.keyData.splice(i, 1)
    },
    addKey (i, data) {
      this.keyData.push({
        name: '',
        type: 1
      })
    },
    handleHeaderAdd () {
      this.edit.title = '添加回复'
      // 新增回复弹窗
      this.edit.form = {
        'appId': '',
        'keyEq': [],
        'keyLike': [],
        'content': '',
        'ruleName': '',
        'sortNum': 1,
        'mediaId': '',
        'isEnable': true,
        'comment': {},
        'type': 'add'
      }
      this.keyData = [
        {
          name: '',
          type: 1
        }
      ]
      this.$refs.editDialog.showDialog()
    },
    handleConfirmAdd (data, btn) {
      if (data.comment.content || data.comment.id || typeof data.comment.mediaId === 'number') {
        // 新增
        let keyEq = []
        let keyLike = []
        this.keyData.forEach(v => {
          if (v.name) {
            if (v.type === 1) {
              keyEq.push(v.name)
            } else {
              keyLike.push(v.name)
            }
          }
        })
        var params = {
          'keyEq': keyEq,
          'keyLike': keyLike,
          'appId': this.list.params.appId,
          'wechatReplyContent': {
            'content': data.comment.content || '',
            'ruleName': data.ruleName,
            'sortNum': data.sortNum,
            'mediaId': ((typeof data.comment.mediaId === 'number') ? data.comment.mediaId : data.comment.id) || '',
            'isEnable': data.isEnable
          }
        }
        if (data.type === 'add') {
          this.$request.fetchKeyWord(params).then(res => {
            this.$restBack(res, () => {
              this.$refs.editDialog.handleCancel()
              this.fetchTableApi()
            }, '添加成功')
          })
        } else {
          params.wechatReplyContent.id = data.id
          this.$request.fetchWechatreplycontent(params).then(res => {
            this.$restBack(res, () => {
              this.$refs.editDialog.handleCancel()
              this.fetchTableApi()
            }, '修改成功')
          })
        }
      } else {
        this.$message('回复内容不能为空')
      }
    },
    handleTableEdit (data, btn) {
      // 修改回复
      this.$request.fetchWechatreplycontentGet({ id: data.id }).then(res => {
        if (res.code === 200) {
          this.getDetailInfo(res.data)
        }
      })
    },
    getDetailInfo (data) {
      this.edit.title = '编辑回复'
      let comment = {
        'appId': data.appId,
        'content': data.content,
        'mediaId': data.mediaId, // 素材id
        'description': data.description, // 音乐描述
        'hqMusicUrll': data.hqMusicUrll, // 高质量音乐链接
        'musicUrl': data.musicUrl, // 音乐链接
        'thumbMediaId': data.thumbMediaId, // 缩略图的媒体id
        'title': data.title, // 音乐标题
        'msgType': data.msgType,
        'wechatMaterial': data.wechatMaterial
      }
      var arr = data.wechatReplyKeywordList.map(v => {
        let obj = {}
        if (v.wordkeyEq) {
          obj = {
            type: 1,
            name: v.wordkeyEq
          }
        } else {
          obj = {
            type: 2,
            name: v.wordkeyLike
          }
        }
        return obj
      })
      let arr2 = [
        {
          name: '',
          type: 1
        }
      ]
      this.keyData = arr.length ? arr : arr2

      this.edit.form.comment = comment
      this.edit.form.type = 'edit'
      this.edit.form = Object.assign(this.edit.form, data)
      this.$refs.editDialog.showDialog()
    },
    // 删除回复
    handleTableDelete (data, btn) {
      // 删除回复
      this.$confirm('是否确认删除回复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchWechatreplycontentDelete({ ids: [data.id] }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          })
        })
      }).catch(() => {})
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    }
  }
}
</script>

<style lang="scss">
  .keyword-warp-index{
    .input-right{
      position: absolute;
      right: 20px;
    }
    .scope-input{
      .select-input{
        width: 122px;
        margin-right: 10px;
      }
      .input-wrap {
        max-width:410px;
      }
      .append-btn{
        line-height: 32px;
        display: inline;
        .jee-svg-icon{
          margin-left: 8px;
        }
      }
      &:last-child{
        margin-bottom: 0;
      }
      margin-bottom: 10px;
      .el-input__inner{
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
</style>
