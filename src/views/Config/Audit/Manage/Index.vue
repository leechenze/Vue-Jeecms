<template>
  <section class="audit-manage-index">
    <base-header
      v-bind="headers"
      @handleAdd="handleHeaderAdd"
      @handleDelete="handleHeaderDelete"
      />

      <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
    >
    </search-header>
    <base-table
      v-bind="list"
      @handleSelectionChange="handleSelectionChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @handleDelete="handleTableDelete"
      @handleStatus="handleStatus"
      v-on:handleSelectionChange="handleMultipleSelect"
    >
    <template #name="scope">
      <el-input class="inp" v-model="strategyName" v-if="scope.scope.row.isEdit" ref='inp' @blur="blur(scope.scope.row)" maxlength="25"></el-input>
      <div class="nameBox" v-else>
        <p class="strategyTitle">{{scope.scope.row.name}}</p>
        <div @click="editName(scope.scope.row)" :class="[{'event':!_checkPermission('/auditStrategy/name', 'PUT')},'hide']">
          <jee-icon iconClass="bianji" :class="['icon', {'jee-popover':_checkPermission('/auditStrategy/name', 'PUT')}]"></jee-icon>
        </div>
      </div>
    </template>
    <template #textAuditScene='scope'>
      <div :class="['jee-popover','fcs','jee-hover-color',{'jee-click':scope.scope.row.isText}]">
          <el-popover
            popper-class="jee-border"
            width="81"
            placement="bottom-end"
            @show='textShow(scope.scope.row)'
            @hide='textHide(scope.scope.row)'
            :visible-arrow='false'
            :class="{'event':!_checkPermission('/auditStrategy/scene/text', 'PUT')}"
            trigger="click">
            <el-checkbox-group
              v-model="textChecked"
              @change="checked=>handleCheckedText(checked, scope.scope.row.id)"
            >
              <el-checkbox  v-for="item in textList" :label="item" :key="item" class="jee-popover" :disabled="(scope.scope.row.pictureAuditScene === '' || scope.scope.row.pictureAuditScene === '无') && textChecked.length === 1 && textChecked[0] === item ">{{item}}</el-checkbox>
            </el-checkbox-group>
            <span slot="reference">
                <span>{{scope.scope.row.textAuditScene || '无'}}</span>
                <i style="color:#999" :class="['el-input__icon','el-icon-caret-bottom','jee-hover-color',{reverse:scope.scope.row.isText}]"/>
              </span>
          </el-popover>
        </div>

    </template>
    <template #pictureAuditScene='scope'>
      <div :class="['jee-popover','fcs',{'jee-click':scope.scope.row.isImage}]">
        <el-popover
          popper-class="jee-border"
          width="108"
          placement="bottom-end"
          @show='imageShow(scope.scope.row)'
          @hide='imageHide(scope.scope.row)'
          :visible-arrow= 'false'
          :class="{'event':!_checkPermission('/auditStrategy/scene/picture', 'PUT')}"
          trigger="click">
          <el-checkbox-group
            v-model="imageChecked"
            @change="checked=>handleCheckedImage(checked, scope.scope.row.id)"
          >
            <el-checkbox  v-for="item in imageList" :label="item" :key="item" class="jee-popover" :disabled="(scope.scope.row.textAuditScene === '' || scope.scope.row.textAuditScene === '无') && imageChecked.length === 1 && imageChecked[0] === item ">{{item}}</el-checkbox>
          </el-checkbox-group>
          <span slot="reference">
            <span>{{scope.scope.row.pictureAuditScene || '无'}}</span>
            <i style="color:#999" :class="['el-input__icon','el-icon-caret-bottom','jee-hover-color',{reverse:scope.scope.row.isImage}]"/>
          </span>
        </el-popover>
      </div>
    </template>
    </base-table>
    <form-dialog
      ref="createStrategy"
      :title='editTitle'
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :buttons="editButtons"
      :formItems="editFormItems"
      @handleConfirm="handleConfirm"
    >
    <template #strategyType='scope'>
      <div class="text">
        <span class="textTitle">文本审核</span><el-checkbox :indeterminate="isTextIndeterminate" v-model="textCheckAll" @change="handleTextCheckAllChange">全选</el-checkbox>
        <div class="textBox">
          <el-checkbox-group v-model="checkedtext" @change="handleCheckedTextChange">
            <el-checkbox v-for="item in textList" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="image">
        <span class="imageTitle">图片审核</span><el-checkbox :indeterminate="isImageIndeterminate" v-model="imageCheckAll" @change="handleImageCheckAllChange">全选</el-checkbox>
        <div class="imageBox">
          <el-checkbox-group v-model="checkedImage" @change="handleCheckedImageChange">
            <el-checkbox v-for="item in imageList" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </template>
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import { deepClone } from '@/utils'
export default {
  name: 'configAuditManage',
  mixins: [searchHeader, baseHeader, baseTable, formDialog],
  data () {
    var nameUnique = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var params = {
          name: this.editForm.name
        }
        this.$request.fetchAuditStrategyUnique(params).then(res => {
          if (res.code === 200) {
            if (res.data) {
              callback()
            } else {
              callback(new Error('策略名称已存在'))
            }
          } else {
            callback(new Error(res.message))
          }
        })
      }
    }
    const columns = [
      {
        prop: 'name',
        label: '策略名称',
        minWidth: '170px',
        scopeType: 'slot'
        // showOverflowTooltip: true,
        // fixed: 'left'
      },
      {
        prop: 'textAuditScene',
        label: '文本审核',
        minWidth: '280px',
        scopeType: 'slot'
      },
      {
        prop: 'pictureAuditScene',
        label: '图片审核',
        minWidth: '280px',
        scopeType: 'slot'
      },
      {
        prop: 'status',
        label: '状态',
        scopeType: 'switch',
        type: 'Status',
        minWidth: '140px',
        enableText: '开启',
        disableText: '关闭',
        disabled: !this._checkPermission('/auditStrategy/open', 'GET')
      }
    ]
    return {
      temporaryText: [],
      temporaryImage: [],
      strategyName: '',
      isEdit: false,
      textChecked: [],
      imageChecked: [],
      textList: ['文本色情', '暴恐违禁', '政治敏感', '恶意推广', '低俗辱骂', '低质灌水'],
      imageList: ['暴恐识别', '色情识别', '政治人物识别', '官方违禁库'],
      list: {
        api: 'fetchAuditStrategyPage',
        columns,
        params: {
          'name': ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/auditStrategy', 'DELETE')
          }
        ],
        handleColumnProp: {
          label: '操作',
          align: 'left',
          width: '75',
          fixed: 'right'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '创建策略',
            icon: 'xinjian',
            disabled: !this._checkPermission('/auditStrategy', 'POST')
          },
          {
            type: 'Delete',
            text: '批量删除',
            icon: 'delete',
            disabled: !this._checkPermission('/auditStrategy', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false
        // content: '操作说明'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'searchInput',
            value: 'name',
            placeholder: '请输入关键词'
          }
        ]
      },
      editFormLoading: false,
      editForm: {
        'name': '',
        'strategyType': '',
        'status': true
      },
      editRules: {
        name: [this.$rules.required(), { validator: nameUnique, trigger: ['change', 'blur'] }],
        strategyType: [this.$rules.required()]
      },
      editFormItems: [
        {
          prop: 'name',
          label: '策略名称',
          placeholder: '请输入策略名称',
          maxlength: '25'
        },
        {
          prop: 'strategyType',
          label: '审核类型',
          type: 'slot'
        },
        {
          prop: 'status',
          label: ' 状态',
          type: 'switch',
          enableText: '开启',
          disableText: '关闭'
        }
      ],
      editButtons: [
        {
          text: '保存',
          type: 'Submit'
        }
      ],
      editTitle: '创建策略',
      isTextIndeterminate: false,
      isImageIndeterminate: false,
      textCheckAll: false,
      imageCheckAll: false,
      checkedtext: [],
      checkedImage: []
    }
  },
  methods: {
    // 文本策略排序
    textSort (objs) {
      objs.sort(function (a, b) {
        // order是规则  objs是需要排序的数组
        var order = ['文本色情', '暴恐违禁', '政治敏感', '恶意推广', '低俗辱骂', '低质灌水']
        return order.indexOf(a) - order.indexOf(b)
      })
    },
    // 图片策略排序
    ImageSort (objs) {
      objs.sort(function (a, b) {
        // order是规则  objs是需要排序的数组
        var order = ['暴恐识别', '色情识别', '政治人物识别', '官方违禁库']
        return order.indexOf(a) - order.indexOf(b)
      })
    },
    handleMultipleSelect (data) {
      var ids = data.map(v => v[this.list.rowKey || 'id'])
      this.list.selectedKeys = ids
    },
    // 删除接口
    deletePort (ids) {
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.fetchAuditStrategy({
          'ids': ids
        }).then(res => {
          this.$restBack(res, () => {
            this.handleSearch()
          }, '删除成功')
        })
      }).catch(() => {})
    },
    // 编辑策略名称
    editName (row) {
      if (this.list.data.find(d => d.isEdit)) {
        return
      }
      row.isEdit = true
      this.strategyName = row.name
      this.$nextTick(() => {
        this.$refs['inp'].focus()
      })
    },
    blur (row) {
      row.isEdit = false
      if (this.strategyName !== '') {
        this.$request.fetchAuditStrategyUnique({
          name: this.strategyName,
          id: row.id
        }).then(res => {
          if (res.code === 200) {
            this.$request.fetchAuditStrategyName({
              name: this.strategyName,
              id: row.id
            }).then(res => {
              this.$restBack(res, () => {
                this.handleSearch()
              }, '操作成功')
            })
          } else {
            this.$message('名称重复')
          }
        })
      } else {
        this.$message('策略名称不能为空')
      }
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length > 0) {
        this.deletePort(this.list.selectedKeys)
      } else {
        this.$message('请选择需要操作的数据')
      }
    },
    // 开启关闭策略
    handleStatus (row, index, item) {
      if (row.status) {
        this.$request.fetchAuditStrategyOpen({
          id: row.id
        }).then(res => {
          this.$restBack(res, () => {
            this.handleSearch()
          }, '操作成功')
        })
      } else {
        this.$request.fetchAuditStrategyClose({
          id: row.id
        }).then(res => {
          this.$restBack(res, () => {
            this.handleSearch()
          }, '操作成功')
        })
      }
    },
    textShow (row) {
      var array = row.textAuditScene.split(',')
      this.textChecked = deepClone(array)
      row.isText = true
      this.temporaryText = deepClone(array)
    },
    textHide (row) {
      row.isText = false
      this.temporaryText = []
    },
    handleTableDelete (row, index) {
      this.deletePort([row.id])
    },
    imageShow (row) {
      var array = row.pictureAuditScene.split(',')
      this.imageChecked = deepClone(array)
      row.isImage = true
      this.temporaryImage = deepClone(array)
    },
    imageHide (row) {
      row.isImage = false
      this.temporaryImage = []
    },
    getArrDifference (arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },

    // 修改文本审核策略
    handleCheckedText (val, id) {
      let arr = this.getArrDifference(this.temporaryText, val)
      let index = this.textList.findIndex(t => t === arr[0])
      this.$request.fetchAuditStrategySceneText({
        id: id,
        scene: index + 1
      }).then(res => {
        if (res.code === 200) {
          this.temporaryText = deepClone(val)
          this.list.data.map(v => {
            if (v.id === id) {
              var arr = deepClone(val)
              if (arr.indexOf('无') !== -1) {
                arr.splice(arr.indexOf('无'), 1)
              }
              if (arr.indexOf('') !== -1) {
                arr.splice(arr.indexOf(''), 1)
              }
              this.textSort(arr)
              v.textAuditScene = arr.join(',')
            }
          })
        }
      })
    },
    // 修改图片审核策略
    handleCheckedImage (val, id) {
      let arr = this.getArrDifference(this.temporaryImage, val)
      let index = this.imageList.findIndex(t => t === arr[0])
      this.$request.fetchAuditStrategyScenePicture({
        id: id,
        scene: index + 1
      }).then(res => {
        if (res.code === 200) {
          this.temporaryImage = deepClone(val)
          this.list.data.map(v => {
            if (v.id === id) {
              var arr = deepClone(val)
              if (arr.indexOf('无') !== -1) {
                arr.splice(arr.indexOf('无'), 1)
              }
              if (arr.indexOf('') !== -1) {
                arr.splice(arr.indexOf(''), 1)
              }
              this.ImageSort(arr)
              v.pictureAuditScene = arr.join(',')
            }
          })
        }
      })
    },
    // 创建策略
    handleHeaderAdd () {
      this.textCheckAll = false
      this.imageCheckAll = false
      this.checkedtext = []
      this.checkedImage = []
      this.isTextIndeterminate = false
      this.isImageIndeterminate = false
      this.editForm.strategyType = []
      this.$refs.createStrategy.showDialog()
    },
    handleTextCheckAllChange (val) {
      this.checkedtext = val ? this.textList : []
      this.isTextIndeterminate = false
      let arr = this.checkedtext.concat(this.checkedImage)
      if (arr.length > 0) {
        this.editForm.strategyType = 'aaa'
      } else {
        this.editForm.strategyType = ''
      }
    },
    handleImageCheckAllChange (val) {
      this.checkedImage = val ? this.imageList : []
      this.isImageIndeterminate = false
      let arr = this.checkedtext.concat(this.checkedImage)
      if (arr.length > 0) {
        this.editForm.strategyType = 'aaa'
      } else {
        this.editForm.strategyType = ''
      }
    },
    handleCheckedTextChange (value) {
      let checkedCount = value.length
      this.textCheckAll = checkedCount === this.textList.length
      this.isTextIndeterminate = checkedCount > 0 && checkedCount < this.textList.length
      var newArr = this.checkedtext.concat(this.checkedImage)
      if (newArr.length > 0) {
        this.editForm.strategyType = 'aaa'
      } else {
        this.editForm.strategyType = ''
      }
    },
    handleCheckedImageChange (value) {
      let checkedCount = value.length
      this.imageCheckAll = checkedCount === this.imageList.length
      this.isImageIndeterminate = checkedCount > 0 && checkedCount < this.imageList.length
      var newArr = this.checkedtext.concat(this.checkedImage)
      if (newArr.length > 0) {
        this.editForm.strategyType = 'aaa'
      } else {
        this.editForm.strategyType = ''
      }
    },
    // 回调
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content.map((d, i) => {
          d.isText = false
          d.isImage = false
          d.isEdit = false
          return d
        })
        this.list.totalCount = res.data.totalElements
      }
    },
    // 提交表单
    handleConfirm (data) {
      var textScenes = []
      this.checkedtext.forEach(v => {
        let index = this.textList.findIndex(t => t === v)
        textScenes.push(index + 1)
      })
      var pictureScenes = []
      this.checkedImage.forEach(v => {
        let index = this.imageList.findIndex(t => t === v)
        pictureScenes.push(index + 1)
      })
      data.textScenes = textScenes
      data.pictureScenes = pictureScenes
      delete data.strategyType
      this.$request.fetchAddAuditStrategy(data).then(res => {
        this.$restBack(res, () => {
          this.handleSearch()
        }, '创建成功')
      })
    }
  }
}
</script>
<style lang="scss">
.audit-manage-index{
  .nameBox{
    display: flex;
    align-items: center;
    .strategyTitle{
      margin-right: 20px;
    }
    .icon{
      fill: #777777;
      font-size: 13px;
    }
  }
  .inp{
    width: 140px;
    height: 32px;
    .el-input__inner{
      height: 32px;
    }
  }
   .el-button{
    margin-bottom: 0 !important;//删除操作说明新增样式
  }
    .reverse {
    transform: rotate(180deg);
  }
  .fcs{
    display: flex;
    align-items: center;
  }
  .fcs:focus{
    outline: none;
  }
  .text{
    .textBox{
      width: 300px;
      border: 1px solid #E8E8E8;
      margin-top: 12px;
      padding: 20px 0 10px 20px;
      box-sizing: border-box;
      border-radius: 4px;
    }
    .textTitle{
      margin-right: 30px;
    }
  }
  .image{
    margin-top: 10px;
    .imageBox{
      width: 300px;
      border: 1px solid #E8E8E8;
      margin-top: 12px;
      padding: 20px 0 10px 20px;
      box-sizing: border-box;
      border-radius: 4px;
    }
    .imageTitle{
      margin-right: 30px;
    }
  }
  .el-checkbox-group .el-checkbox{
    padding-bottom: 20px!important;
  }
  .image .el-checkbox-group .el-checkbox{
    width: 107px!important;
  }
  .notAllowed{
    cursor:not-allowed;
  }
  .event{
    pointer-events:none;
  }
  .hide{
    display: none;
  }
  .el-table__row:hover .hide{
    display: inline-block;
  }
}
.audit-manage-index .el-popover{
  min-width: 40px!important;
  margin-top: 14px!important;
  .el-checkbox-group .el-checkbox{
    padding-bottom: 17px;
  }
}
</style>
