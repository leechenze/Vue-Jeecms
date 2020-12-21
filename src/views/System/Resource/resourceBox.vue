<template>
  <div class="resource-box-container">

      <search-header
      class="search-header"
      v-bind="activeName === 'myRes'?searchHeader : shareSearchHeader"
      :params="list.params"
      @handleSearch="handleSearchs"
    ></search-header>
    <div class="sys-resource-box">
      <div class="link-header t-16">
        <div class="link-right">
          <jee-icon iconClass="fenlei"
            :class="isActiveName === 'list'?'jee-color':''"
            class="jee-hover-fill link-icon"
            @click="tabContent('list')"
            ></jee-icon>
            <jee-icon
            @click="tabContent('table')"
            :class="isActiveName === 'table'?'jee-color':''"
            iconClass="tupianliebiao" class="jee-hover-fill link-icon"
          ></jee-icon>
        </div>
        <div class="link-check" v-if="isActiveName === 'list'">
          <el-checkbox
            class="t-check t-16"
            :indeterminate="isIndeterminate" v-model="checkAll" @change="checksAll"
            >全选</el-checkbox>
        </div>
        <template v-for="(item, index) in linkData[activeName]">
          <el-link
            class="link-box t-16"
            :key="index"
            :underline="false"
            :disabled="item.disabled"
            @click="handleEventLink(item.type,item)"
          >
            <jee-icon :iconClass="item.icon" class="jee-hover-fill link-icon"
              v-if="item.icon"></jee-icon>
            {{item.name}}
          </el-link>
        </template>
      </div>
      <div class="resource-cont" v-loading="list.loading">
          <base-table
            :key="activeName"
            v-if="isActiveName === 'table'"
            v-bind="list"
            @handleSelectionChange="handleSelectionChange"
            @handleSizeChange="handleSizeChanges"
            @handleCurrentChange="handleCurrentChange"
            @handleDelete="handleTableDelete"
            @handleRename="handleTableRename"
            @handleDownload="handleTableDownload"
            @handleSave="handleTableSave"
            @handleMove="handleTableMove"
            @handleShare="handleTableShare"
          >
          <template #alias="scope">
            <div class="resource-wrap">
              <div class="t-img"
                v-if="scope.scope.row.resourceType === 1"
                >
                <el-image
                  class="resource-img "
                  @dblclick.prevent.native="preview(scope.scope.row)"
                  :src="$getPath(scope.scope.row.url)"
                  fit="contain">
                    <div slot="error" style="padding:18px;">
                      <jee-icon
                        class="t-img"
                        iconClass="geshi_tongyongtupian"
                        :style="{fontSize:'42px'}"
                      ></jee-icon>
                    </div>
                </el-image>
              </div>
              <div class="resource-img " style="padding:18px;"  v-else>
                <jee-icon
                  class="t-img"
                  v-if="scope.scope.row.icon"
                  :iconClass="scope.scope.row.icon"
                  :style="{fontSize:'42px',fill:scope.scope.row.fill}"
                ></jee-icon>
              </div>
              <div class="resource-name " v-if="renames[activeName][scope.scope.row.id]">
                <p class="t-overflow" :title="renames[activeName][scope.scope.row.id].alias+scope.scope.row.suffix"
                v-if="!renames[activeName][scope.scope.row.id].edit">
                {{renames[activeName][scope.scope.row.id].alias}}{{scope.scope.row.suffix}}</p>
                <el-input v-if="renames[activeName][scope.scope.row.id].edit"
                  size="small" width="387px" maxlength="50"
                  @focus="focusNameEdit($event)" autofocus
                  @blur="resourceNameEdit(scope.scope.row,'save')"
                v-model="renames[activeName][scope.scope.row.id].alias" ></el-input>
              </div>
            </div>
          </template>
        </base-table>
        <div  v-if="isActiveName === 'list'" class="resource-list">
          <ul class="resource-list-wrap">
            <el-checkbox-group v-model="list.selectedKeys">
              <li class="resource-list-item"
                @click="activeClick(item)"
                v-for="(item,index) in list.data" :key="index">
                 <!-- 图片上的右键菜单 -->
                  <ul
                    @mouseleave="closeMenu"
                    :style="{left:left+'px',top:top+'px'}"
                    class="res-tree-menus"
                    v-if="showImgMenus&&item.id === imageMenuId">
                    <li class="res-tree-menus_item jee-hover-bg"
                      v-for="(item,index) in menuItemList[activeName]"
                      @click="resourceClick(item)"
                      :key="index">
                      {{item.text}}
                    </li>
                  </ul>
                <el-popover
                  placement="right-end"
                  popper-class="img-popover"
                  :visible-arrow="true"
                   trigger="hover">
                  <ul class="img-popover__item">
                    <li> <label >文件类型：</label>  <span>{{item.resourceType|typeFilter}}</span></li>
                    <li v-if="item.resourceType===1">
                      <label >分辨率：</label> <span>{{item.dimensions}}</span></li>
                    <li v-if="item.resourceType===2||item.resourceType===3">
                      <label>时长：</label> <span>{{item.duration}}</span></li>
                    <li> <label >大小：</label> <span>{{item.sizeUnit}}</span></li>
                    <li> <label >创建日期：</label> <span>{{$moment(item.createTime)}}</span></li>
                  </ul>
                  <div
                    slot="reference"
                    :class="hasId(item.id,list.selectedKeys)?'jee-border':''"
                    class="resource-list-img jee-hover-border-important">
                    <div class="t-img"
                      style="width:100%;height:100%"
                      v-if="item.resourceType === 1"
                      >
                      <el-image
                        @contextmenu.prevent.native="showResourceMenus(item,index,$event)"
                        @dblclick.prevent.native="preview(item,list.data,$event)"
                        :src="$getPath(item.url)"
                        fit="scale-down">
                          <div slot="error"
                            style="width:100%;height:100%;padding:42px;box-sizing:border-box">
                            <jee-icon
                              class="t-img"
                              v-if="item.icon"
                              :iconClass="item.icon"
                              :style="{fontSize:'80px',fill:item.fill}"
                            ></jee-icon>
                          </div>
                      </el-image>
                      <div class="resource-list-share" v-if="item.shareStatus === 2">
                        <jee-icon
                          iconClass="fenxiang"
                          :style="{fontSize:'14px',fill:'#787878'}"
                        ></jee-icon>
                      </div>
                    </div>
                    <div
                      @contextmenu.prevent="showResourceMenus(item,index,$event)"
                      @dblclick.prevent="preview(item,list.data,$event)"
                      style="width:100%;height:100%;padding:42px;box-sizing:border-box;position:relative"
                      v-else>
                      <jee-icon
                        class="t-img"
                        v-if="item.icon"
                        :iconClass="item.icon"
                        :style="{fontSize:'80px',fill:item.fill}"
                      ></jee-icon>
                      <div class="resource-list-share" v-if="item.shareStatus === 2">
                        <jee-icon
                          iconClass="fenxiang"
                          :style="{fontSize:'14px',fill:'#787878'}"
                        ></jee-icon>
                      </div>
                    </div>
                  </div>
                </el-popover>
                <div class="resource-list-edit"
                 @dblclick.prevent="preview(item)"
                v-if="renames[activeName][item.id]">
                  <span :title="renames[activeName][item.id].alias+item.suffix"
                    v-if="!renames[activeName][item.id].edit" >
                    <el-checkbox
                      class="t-check"
                      @change="checkboxOne(item)"
                      :label="item.id" >
                        <span :class="hasId(item.id,list.selectedKeys)?'jee-color':''"
                        >{{renames[activeName][item.id].alias}}{{item.suffix}}</span>
                    </el-checkbox>
                  </span>
                  <el-input v-if="renames[activeName][item.id].edit"
                    maxlength="50" @focus="focusNameEdit($event)"
                    autofocus
                    size="small" width="387px" @blur="resourceNameEdit(item,'save')"
                    v-model="renames[activeName][item.id].alias" ></el-input>
                </div>
              </li>
            </el-checkbox-group>
          </ul>
          <div v-show="list.data&&list.data.length === 0" class="nothing t-label">暂无数据</div>
        </div>
        <jee-pagination  v-if="isActiveName === 'list'"
            :total="list.totalCount"
            @handleSelectionChange="handleSelectionChange"
            @handleSizeChange="handleSizeChanges"
            @handleCurrentChange="handleCurrentChange"></jee-pagination>
      </div>
      <form-dialog
            title="上传"
            ref="uploadDialog"
            :loading="uploadFormLoading"
            :form="uploadForm"
            :rules="uploadRules"
            :buttons="uploadButtons"
            :formItems="uploadFormItems"
            @handleConfirm="handleConfirmAdd"
            @beforeUpload="beforeUpload"
          ></form-dialog>
          <form-dialog
            :title="moveTitle"
            ref="moveDialog"
            :loading="moveFormLoading"
            :form="moveForm"
            :rules="moveRules"
            :buttons="moveButtons"
            :formItems="moveFormItems"
            @handleConfirm="moveConfirmAdd"
          ></form-dialog>
          <msg-dialog
            v-bind="msgDialog"
            @handleConfirm="handleConfirmMsg"
            @handleCancel="hideMsgDialog"
          />
          <el-dialog
            title="详细信息"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose">
            <el-form class="detail-resource" label-width="110px">
              <el-form-item label="文件名称：">{{detailInfo.alias}}{{detailInfo.suffix}}</el-form-item>
              <el-form-item label="文件类型：">{{detailInfo.resourceType | typeFilter}}</el-form-item>
              <div v-if="detailInfo.resourceType===1">
                <el-form-item label="分辨率：">{{detailInfo.dimensions}}</el-form-item>
                <el-form-item label="高度：">{{detailInfo.height}}</el-form-item>
                <el-form-item label="宽度：">{{detailInfo.width}}</el-form-item>
              </div>
              <el-form-item  v-if="detailInfo.resourceType===2||detailInfo.resourceType===3"
              label="长度：">{{detailInfo.duration}}</el-form-item>
              <el-form-item label="大小：">{{detailInfo.sizeUnit}}</el-form-item>
              <el-form-item label="创建日期：">{{$moment(detailInfo.createTime)}}</el-form-item>
              <el-form-item label="创建人：">{{detailInfo.createUser}}</el-form-item>
            </el-form >
          </el-dialog>
    <el-dialog :width="width"  :visible.sync="showFile" @close="closeDialog">
      <div v-if="resourceType === 2">
        <video
          class="video"
          preload="auto"
          autoplay
          controls
          width="760"
          height="550"
          webkit-playsinline="true"
          playsinline="true"
          ref="videoEle"
          id="android"
        >
          <source :src="$getPath(fileUrl)" type="video/mp4">
        </video>
      </div>
      <div v-else-if="resourceType === 3">
        <audio :src="$getPath(fileUrl)" controls></audio>
      </div>
      <div v-else-if="resourceType === 1">
        <el-image class="t-img" :src="$getPath(fileUrl)" fit="contain">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </el-dialog>

          <share-form ref="shareForm" @shareConfirmAdd="shareConfirmAdd"></share-form>
    </div>
  </div>
</template>

<script>
import shareForm from './shareForm.vue'
import baseTable from '@/components/mixins/baseTable'
import resIndex from './resIndex.js'
export default {
  name: 'resource-box',
  mixins: [baseTable, resIndex],
  inject: ['reflushTree'],
  props: {
    activeName: {
      type: String,
      default: 'myRes'
    },
    id: {
      type: [String, Number],
      default: ''
    },
    tree: {
      type: Object,
      default: () => {
        return {}
      }
    },
    username: {
      type: String,
      default: ''
    },
    userId: {
      type: [Number, String],
      default: ''
    }
  },
  components: {
    shareForm
  },
  watch: {
    activeName (newVal, oldVal) {},
    id (newVal, oldVal) {
      this.list.params.id = newVal
      this.list.params.username = this.username
      this.list.params.userId = this.userId
      this.restData()
    },
    'list.selectedKeys': function (newData) {
      let checkedCount = newData.length
      let dataCount = this.list.data instanceof Array ? this.list.data.length : 0
      this.checkAll = dataCount === 0 ? false : checkedCount === dataCount
      this.isIndeterminate = checkedCount > 0 && (checkedCount < (this.list.data && this.list.data.length))
    },
    username (newVal, oldVal) {
      this.list.params.username = newVal
      this.list.params.userId = this.userId
      this.restData()
    }
  },
  computed: {
    getImageStyle () {
      const url = this.imgDialog.url
      if (url) {
        var imgUrl = this.$getPath(url)
        var img = new Image()
        img.src = imgUrl
        img.onload = function () {
          return {
            width: img.width + 'px',
            height: img.height + 'px'
          }
        }
      }
      return ''
    }
  },
  data () {
    return {
      // 表格上按钮点击
      linkData: {
        'myRes': [
          {
            type: 'Share',
            name: '共享',
            icon: 'gongxiang',
            disabled: !this._checkPermission('/resourceSpaceDatas/share', 'POST')
          },
          {
            type: 'UnShare',
            name: '取消共享',
            icon: 'quxiaogongxiang',
            disabled: !this._checkPermission('/resourceSpaceDatas/unShare', 'POST')
          },
          {
            type: 'Move',
            name: '移动',
            icon: 'yidong',
            disabled: !this._checkPermission('/resourceSpaceDatas/shift', 'PUT')
          },
          {
            type: 'Upload',
            name: '上传',
            icon: 'shangchuan',
            disabled: !this._checkPermission('/upload/o_upload', 'POST')
          },
          {
            type: 'Config',
            name: '共享设置',
            icon: 'gongxiangshezhi',
            disabled: !this._checkPermission('/resourceSpaceDatas/share', 'POST')
          },
          {
            type: 'Download',
            name: '批量下载',
            icon: 'piliangxiazai',
            disabled: !this._checkPermission('/resourceSpaceDatas/download', 'POST')
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/resourceSpaceDatas', 'DELETE')
          }
        ],
        'shareRes': [
          {
            type: 'Save',
            name: '保存到我的资源',
            icon: 'baocun',
            disabled: !this._checkPermission('/resourceSpaceDatas/shift', 'PUT')
          },
          {
            type: 'Download',
            name: '批量下载',
            icon: 'piliangxiazai',
            disabled: !this._checkPermission('/resourceSpaceDatas/download', 'POST')
          }
        ]
      },
      isActiveName: 'list',
      isIndeterminate: false, // 半选状态
      menuItemList: {
        'myRes': [// 菜单
          {
            key: '1',
            text: '重命名',
            disabled: !this._checkPermission('/resourceSpaceDatas', 'PUT')
          },
          {
            key: '2',
            text: '移动',
            disabled: !this._checkPermission('/resourceSpaceDatas/shift', 'PUT')
          },
          {
            key: '3',
            text: '共享',
            disabled: !this._checkPermission('/resourceSpaceDatas/share', 'POST')
          },
          {
            key: '4',
            text: '详细信息'
          },
          {
            key: '5',
            text: '删除',
            disabled: !this._checkPermission('/resourceSpaceDatas', 'DELETE')
          },
          {
            key: '6',
            text: '下载',
            disabled: !this._checkPermission('/resourceSpaceDatas/download', 'POST')
          }
        ],
        'shareRes': [// 菜单
          { key: '7', text: '保存到我的资源' },
          { key: '6', text: '下载' }
        ]
      },
      // 渲染列表结构
      list: {
        loading: false,
        columns: [],
        api: '',
        params: {
          senior: false,
          userId: ''
        },
        filterParams: [],
        handleColumn: [],
        handleColumnProp: {},
        selectedKeys: []
      },
      imageMenuId: ''
    }
  },
  methods: {
    // 自动获取输入框内容
    focusNameEdit () {
      event.currentTarget.select()
    },
    getData () {
      this.list = Object.assign(this.list, this.params[this.activeName])
      this.list.api = this.activeName === 'myRes' ? 'resourceUserPage' : 'resourceSharePage'
      this.checkAll = false
      if (!this.list.params.id && !this.list.params.username) {
        this.restData()
      }
    }
  },
  activated () {
    this.getData()
  },
  mounted () {
    this.$nextTick(() => {
      this.getData()
    })
  }
}
</script>
<style lang="scss">
.resource-box-container{
  .link-header{
      line-height: 1.2;
      padding: 8px 0 20px;
      .link-box{
        margin-right: 35px;
        font-weight: 400;
      }
      .link-check{
        margin-right: 35px;
        display: inline-block;
        .el-checkbox{
          &__label{
            font-size: 16px;
          }
        }
      }
      .link-right{
        float: right;
      }
      .link-icon{
        fill: #787878;
        position: relative;
        top: 0.5px;
        margin-right: 8px;
      }
    }
    // table 名称修改
    .resource-wrap{
      padding: 20px 0;
      display: flex;
    }
    .resource-img{
      width: 80px !important;
      height: 80px !important;
      margin-right: 12px;
      // border: 1px solid #e8e8e8;
      border-radius: 4px;
      box-sizing: border-box;
      background-color: #FAFAFA;
      &:hover{
        border: 1px solid #e8e8e8;
      }
    }
    .resource-name{
      width: 387px;
      height: 80px;
      line-height: 80px;
      cursor: pointer;
    }

    // 列表
    .resource-list-wrap{
      display: flex;
      flex-wrap: wrap;
      .el-checkbox-group{
        height: auto;
      }
      .resource-list-item{
        position: relative;
        width:178px;
        margin-right: 20px;
        margin-bottom: 20px;
        box-sizing: border-box;
        .resource-list-img{
          cursor: pointer;
          width: 178px;
          height: 178px;
          overflow: hidden;
          border: 1px solid transparent;
          background-color: #FAFAFA;
          box-sizing: border-box;
          position: relative;
          border-radius: 4px;
          &:focus{
            outline: none;
          }
          .resource-list-share{
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 50%;
            border: 1px solid #e8e8e8;
            position: absolute;
            right: 10px;
            top: 10px;
            background-color: #fff;
            font-size: 14px;
          }
        }
        .resource-list-edit{
          width: 100%;
          margin-top: 10px;
          line-height: 32px;
          height: 32px;
          .el-input{
            line-height: 28px;
          }
          .el-checkbox{
            &__label{
              display: block;
              width: 150px;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
    // 树形右键菜单
    .custom-tree-node{
      width: 100%;
      display: block;
    }
    .res-tree-menus{
      margin: 0;
      background: #fff;
      z-index: 44;
      position: absolute;
      list-style-type: none;
      min-width: 145px;
      padding: 5px 0;
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow:0px -3px 16px 0px rgba(89,155,255,0.15);
      li {
        margin: 0;
        padding: 0 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        line-height: 32px;
        color: #666;
        &:hover{
          color: #fff;
        }
      }
    }
    .detail-resource{
      .el-form-item{
        margin-bottom: 0 !important;
      }
    }

}
.img-popover{
      line-height: 24px !important;
      &__item{
        font-size: 12px;
        color: #666666;
        letter-spacing: 0.8px;
      }
    }
</style>
