<template>
  <section class="wechat-default-add">
    <base-header
      v-bind="headers"
      />
      <base-form
        ref='form'
        v-bind="form"
        @handleConfirm="handleConfirm"
        @handleConfirmRelease="handleConfirmRelease"
        >
        <template #areaCodes="scope">
          <div class="t-inline"
            style="margin-right:10px"
            v-for="(item,codeIndex) in codeArray" :key="codeIndex">
            <el-select
              popper-class="jee-border"
              size="small"
              v-if="item.type === 'select'"
              v-bind="item"
              v-model="form.form[item.prop]" :placeholder="item.placeholder||'请选择'">
              <el-option
                v-for="(option,opIndex) in item.options" :key="opIndex"
                :value="option[item.optionValue || 'value']" :label="option[item.optionLabel || 'label']"></el-option>
            </el-select>
            <el-cascader
              size="small"
              v-model="form.form[item.prop]"
              popper-class="jee-border"
              @change="cascaderChange"
              v-else-if="item.type === 'selectSearch'"
              :placeholder="item.placeholder||'请选择'"
              :options="item.options"
              :props="item.props"
              clearable
              filterable></el-cascader>
          </div>
        </template>
        <template #menuList="scope">
          <wechat-preview ref="wechatPreview" :formData="form.form"
            :menuIndex="menuIndex" :menuSecondIndex="selectedMenuIndex"></wechat-preview>
        </template>
    </base-form>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseForm from '@/components/mixins/baseForm'
import wechatPreview from './components/wechatPreview'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'socialWechatMenuDefaultAdd',
  mixins: [baseHeader, baseForm],
  components: {
    wechatPreview
  },
  computed: {
    ...mapGetters(['wechatTags', 'areaOptions'])
  },
  data () {
    return {
      headers: {
        title: '操作说明',
        showAlertIcon: true,
        content: '保存按钮即保存当前编辑数据但不会推送至微信平台；保存并发布即保存且推送至微信平台'
      },
      form: {
        // showSubmitButton: false,
        labelWidth: '166px',
        form: {
          'appId': '',
          'menuGroupName': '',
          'menuGroupType': 1,
          'sexDictCode': '',
          'status': 2,
          'id': '',
          'menuList': [
            {
              'choiceType': 1,
              'childs': [],
              'linkUrl': '',
              'menuKey': '',
              'menuName': '默认菜单',
              'menuType': 'media_id',
              'miniprogramAppid': '',
              'miniprogramPagepath': '',
              'mediaId': ''
            }
          ]
        },
        formItems: [
          {
            prop: 'menuGroupName',
            label: '菜单方案组名称：',
            placeholder: '请输入菜单方案名称',
            maxlength: 50
          },
          {
            prop: 'menuList',
            type: 'slot'
          }
        ],
        submitBtns: [
          {
            text: '保存',
            subType: 'submit',
            disabled: !this._checkPermission('/wechatMenu', 'POST')
          },
          {
            text: '保存并发布',
            subType: 'Release',
            hiddenKey: 'id',
            hiddenValue: '',
            disabled: !this._checkPermission('/wechatMenu', 'POST')
          }
        ],
        rules: {
          menuGroupName: [
            this.$rules.required()
          ]
        }
      },
      codeArray: [
        {
          prop: 'sexDictCode',
          placeholder: '请选择性别',
          type: 'select',
          width: '150px',
          options: [
            {
              value: '',
              label: '不限性别'
            },
            {
              value: '1',
              label: '男'
            },
            {
              value: '2',
              label: '女'
            }
          ]
        },
        {
          prop: 'tagId',
          placeholder: '请选择粉丝标签',
          type: 'select',
          width: '150px',
          optionLabel: 'tagName',
          optionValue: 'id',
          options: []
        },
        {
          prop: 'clientDictCode',
          placeholder: '请选择客户端',
          type: 'select',
          width: '150px',
          options: [
            {
              value: '3',
              label: '不限客户端'
            },
            {
              value: '1',
              label: 'IOS'
            },
            {
              value: '2',
              label: '安卓'
            }
          ]
        },
        {
          prop: 'languageDictCode',
          placeholder: '请选择语言',
          type: 'select',
          width: '150px',
          options: [
            {
              value: '',
              label: '不限语言'
            },
            {
              value: '1',
              label: '简体中文'
            },
            {
              value: '2',
              label: '繁体中文TW'
            },
            {
              value: '3',
              label: '繁体中文HK'
            },
            {
              value: '4',
              label: '英文'
            },
            {
              value: '5',
              label: '印尼'
            },
            {
              value: '6',
              label: '马来'
            },
            {
              value: '7',
              label: '西班牙'
            },
            {
              value: '8',
              label: '韩国'
            },
            {
              value: '9',
              label: '意大利'
            },
            {
              value: '10',
              label: '日本'
            },
            {
              value: '11',
              label: '波兰'
            },
            {
              value: '12',
              label: '葡萄牙'
            },
            {
              value: '13',
              label: '俄国'
            },
            {
              value: '14',
              label: '泰文'
            },
            {
              value: '15',
              label: '越南'
            },
            {
              value: '16',
              label: '阿拉伯语'
            },
            {
              value: '17',
              label: '北印度'
            },
            {
              value: '18',
              label: '希伯来'
            },
            {
              value: '19',
              label: '土耳其'
            },
            {
              value: '20',
              label: '德语'
            },
            {
              value: '21',
              label: '法语'
            }
          ]
        },
        {
          prop: 'areaCodes',
          type: 'selectSearch',
          width: '300px',
          placeholder: '请选择地区 支持输入搜索',
          props: {
            label: 'areaName',
            value: 'areaCode'
          },
          options: []
        }
      ],
      selectedMenuIndex: '',
      menuIndex: 0
    }
  },
  inject: ['removeTab'],
  methods: {
    ...mapActions('wechat', ['FetchWechatTags']),
    ...mapActions('system', ['FetchSystemAreaTree']),
    // 选中子菜单
    handleConfirmRelease (data) {
      data.status = 1
      this.handleConfirm(data)
    },
    handleConfirm (data) {
      var params = {}
      if (data.menuGroupType === 2) {
        params = {
          appId: this.$route.query.appId,
          menuGroupType: 2,
          menuGroupName: data.menuGroupName,
          status: data.status,
          clientDictCode: data.clientDictCode,
          languageDictCode: data.languageDictCode,
          sexDictCode: data.sexDictCode,
          tagId: data.tagId,
          menuList: []
        }
        if (data.areaCodes.length) {
          params.areaCode = data.areaCodes[data.areaCodes.length - 1]
        }
      } else {
        params = {
          appId: this.$route.query.appId,
          menuGroupType: 1,
          menuGroupName: data.menuGroupName,
          status: data.status,
          menuList: []
        }
      }

      if (this.rulesMenu(data.menuList)) {
        params.menuList = data.menuList.map(t => {
          /* hyt-link s */
          // t.linkUrl = this.$encode(t.linkUrl)
          // t.miniprogramPagepath = this.$encode(t.miniprogramPagepath)
          /* hyt-link e */
          return t
        })
        this.confirmData(params)
      }
    },
    rulesMenu (data) {
      var sel = true
      data.forEach((v, i) => {
        if (v.menuName === '') {
          this.$message('请填写菜单名称')
          this.menuIndex = i
          sel = false
          return false
        }
        if (v.childs && v.childs.length) {
          v.childs.forEach((e, j) => {
            if (e.menuName === '') {
              this.$message('请填写菜单名称')
              this.menuIndex = i
              this.selectedMenuIndex = j
              sel = false
              return false
            }
            if (e.menuType === 'click') {
              if (!e.menuKey || e.menuKey === '') {
                this.$message('请选择关键词回复内容')
                this.menuIndex = i
                this.selectedMenuIndex = j
                sel = false
                return false
              }
            } else if (e.menuType === 'media_id') {
              if (!e.mediaId || e.mediaId === '') {
                this.$message('请选择回复素材')
                this.menuIndex = i
                this.selectedMenuIndex = j
                sel = false
                return false
              }
            } else if (e.menuType === 'view') {
              if (!e.linkUrl || e.linkUrl === '') {
                this.$message('请填写跳转url')
                this.menuIndex = i
                this.selectedMenuIndex = j
                sel = false
                return false
              }
            } else if (e.menuType === 'miniprogram') {
              if (!e.linkUrl || e.linkUrl === '') {
                this.$message('请填写小程序跳转url')
                this.menuIndex = i
                this.selectedMenuIndex = j
                sel = false
                return false
              }
              if (!e.miniprogramAppid || e.miniprogramAppid === '') {
                this.$message('请填写小程序appid')
                this.menuIndex = i
                this.selectedMenuIndex = j
                sel = false
                return false
              }
              if (!e.miniprogramPagepath || e.miniprogramPagepath === '') {
                this.$message('请填写小程序页面路径')
                this.menuIndex = i
                this.selectedMenuIndex = j
                sel = false
                return false
              }
              if (e.menuType === '' || !e.menuType) {
                this.$message('请选择回复内容')
                this.menuIndex = i
                this.selectedMenuIndex = j
                sel = false
                return false
              }
            }
            if (sel) {
              delete e.mediaData
              delete e.keyword
            }
          })
          delete v.menuType
          delete v.menuKey
          delete v.mediaId
          delete v.linkUrl
          delete v.miniprogramAppid
          delete v.miniprogramPagepath
          delete v.choiceType
        } else {
          if (v.menuType === 'click') {
            if (!v.menuKey || v.menuKey === '') {
              this.$message('请选择关键词回复内容')
              this.menuIndex = i
              sel = false
              return false
            }
          } else if (v.menuType === 'media_id') {
            if (!v.mediaId || v.mediaId === '') {
              this.$message('请选择回复素材')
              this.menuIndex = i
              sel = false
              return false
            }
          } else if (v.menuType === 'view') {
            if (!v.linkUrl || v.linkUrl === '') {
              this.$message('请填写跳转url')
              this.menuIndex = i
              sel = false
              return false
            }
          } else if (v.menuType === 'miniprogram') {
            if (!v.linkUrl || v.linkUrl === '') {
              this.$message('请填写小程序跳转url')
              this.menuIndex = i
              sel = false
              return false
            }
            if (!v.miniprogramAppid || v.miniprogramAppid === '') {
              this.$message('请填写小程序appid')
              this.menuIndex = i
              sel = false
              return false
            }
            if (!v.miniprogramPagepath || v.miniprogramPagepath === '') {
              this.$message('请填写小程序页面路径')
              this.menuIndex = i
              sel = false
              return false
            }
          }
          if (v.menuType === '' || !v.menuType) {
            this.$message('请选择回复内容')
            this.menuIndex = i
            sel = false
            return false
          }
        }
        if (sel) {
          delete v.mediaData
          delete v.keyword
        }
      })
      if (sel) {
        return true
      }
    },
    confirmData (data) {
      let type = this.$route.query.linkType
      let params = data
      if (type === 'edit') {
        params.id = this.form.form.id
        delete params.appId
        delete params.menuGroupType
        this.$request.fetchWechatmenuPut(params).then(res => {
          this.$restBack(res, () => {
            this.clearData()
            this.removeTab(this.$route.fullPath)
            this.$routerLink('/social/wechat/menu/index', 'list')
          })
        })
      } else {
        this.$request.fetchWechatmenuAdd(params).then(res => {
          this.$restBack(res, () => {
            this.clearData()
            this.removeTab(this.$route.fullPath)
            this.$routerLink('/social/wechat/menu/index', 'list')
          })
        })
      }
    },
    clearData () {
      this.form.form.menuList = []
      this.form.form.menuList[0] = {
        'choiceType': 1,
        'childs': [],
        'linkUrl': '',
        'menuKey': '',
        'menuName': '默认菜单',
        'menuType': 'media_id',
        'miniprogramAppid': '',
        'miniprogramPagepath': '',
        'mediaId': ''
      }
    },
    getFormDatas () {
      const { appId, id } = this.$route.query
      if (appId) {
        this.form.form.appId = appId
        this.FetchWechatTags({ appId: appId }, true)
        this.$nextTick(() => {
          let arr = [{ id: '', tagName: '不限标签' }]
          this.codeArray.find(v => v.prop === 'tagId').options = arr.concat(this.wechatTags)
        })
      }
      if (id) {
        this.getTheData(id)
      }
    },
    getTheData (id) {
      this.$request.fetchWechatmenugroupGet({ id: id }).then(res => {
        if (res.code === 200) {
          const loop = function (data) {
            return data.map(t => {
              if (t.menuType === 'media_id') {
                // t.type = 1
                t.comment = t.material
                t.mediaId = t.material.id
              } else if (t.menuType === 'view') {
                // t.type = 2
              } else if (t.menuType === 'click') {
                // t.type = 3
                t.comment = t.wechatReplyContent
                t.comment.menuKey = t.wechatReplyContent.id
              } else if (t.menuType === 'miniprogram') {
                // t.type = 9
              }
              if (t.childs && t.childs.length) {
                t.childs = loop(t.childs)
              }
              delete t.id
              return t
            })
          }
          if (res.data.tagId) res.data.tagId = Number(res.data.tagId)
          this.form.form = res.data
          this.form.form.areaCodes = res.data.area ? this.areaShow(res.data.area) : []
          this.form.form.menuList = loop(res.data.menuList)
        }
      })
    },
    areaShow (area) {
      if (area) {
        let arr = []
        arr.push(area.areaCode)
        if (area.parent) {
          arr.unshift(area.parent.areaCode)
          if (area.parent.parent) {
            arr.unshift(area.parent.parent.areaCode)
          }
        }
        return arr
      } else {
        return []
      }
    },
    cascaderChange (data) {
      if (data && data.length) {
        this.form.form.areaCode = data[data.length - 1]
      }
    }
  },
  watch: {
    areaOptions (newData) {
      this.codeArray.find(v => v.prop === 'areaCodes').options = newData
    }
  },
  mounted () {
    this.FetchSystemAreaTree()
    this.$nextTick(() => {
      this.getFormDatas()
      if (this.areaOptions.length) {
        this.codeArray.find(v => v.prop === 'areaCodes').options = this.areaOptions
      }
    })
  },
  activated () {
    this.getFormDatas()
  }
}
</script>
