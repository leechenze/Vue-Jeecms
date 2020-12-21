<template>
  <section class="sys-resource-container left-container">
    <el-container>
      <el-aside width="190px">
          <div class="left-head" v-show="activeName === 'myRes'">
            <base-header v-bind="asideHeaders"
              @handleAdd="myHandleHeaderAdd"
            />
          </div>
          <div class="box-items">
            <!-- 树形上的右键菜单 -->
            <ul
              @mouseleave="closeMenu"
              :style="{left:left+'px',top:top+'px'}"
              class="res-tree-menus"
              v-if="activeName === 'myRes'&&showMenus">
              <li class="res-tree-menus_item jee-hover-bg"
                v-for="(item,index) in menuLeftList"
                @click="myMenusClick(item)"
                :key="index">
                {{item.text}}
              </li>
            </ul>
            <!-- 树形 -->
            <base-tree
              ref="baseTree"
              v-bind="tree[activeName]"
              :current-node-key="activeId"
              :expandOnClickNode="false"
              @handleClick="handleClick">
              <span style="width:100%;display:inline-block"
                @contextmenu.prevent="showTreeMenus($event,data)"
                slot-scope="{ node, data }">
                <div
                  v-if="data.edit"
                  :style="'position:relative;right:'+(node.level*20+24.5)+'px'"
                  class="add-tree-input">
                  <el-input
                    autofocus
                    maxlength="50"
                    v-model="data.name"
                    @blur="userTreeAdd(data,node)"
                    placeholder="请输入分组名"></el-input>
                    <!-- <span v-if="errorMsg">分类名称已存在</span> -->
                </div>
                <span v-else >{{ data.name }}
                  <jee-icon
                    v-if="data.isShare === 2||data.isShare===3"
                    iconClass="fenxiang"
                    :style="{fontSize: '14px',fill:'#999',position:'absolute',right:'30px',top:'16px'}"></jee-icon>
                </span>
              </span>
            </base-tree>
          </div>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane name="myRes">
            <label slot="label">我的资源
              <!-- <jee-icon iconClass="caozuoshuoming1" :style="{fontSize: '16px'}"
              @click="tabsHeaders[0].showAlert = !tabsHeaders[0].showAlert"
            /> -->
            </label>
            <el-collapse-transition>
              <div v-show="tabsHeaders[0].showAlert">
                <el-alert
                  :title="$t(tabsHeaders[0].content)"
                  type="warning"
                  show-icon
                  @close="tabsHeaders[0].showAlert = false"
                ></el-alert>
              </div>
            </el-collapse-transition>
            <resource-box v-if="activeName === 'myRes'"
              :activeName="activeName" :id="activeId" :tree="tree.myRes"></resource-box>
          </el-tab-pane>
          <el-tab-pane name="shareRes">
            <label slot="label">共享资源
              <!-- <jee-icon iconClass="caozuoshuoming1" :style="{fontSize: '16px'}"
              @click="tabsHeaders[1].showAlert = !tabsHeaders[1].showAlert"
            /> -->
            </label>
            <el-collapse-transition>
              <div v-show="tabsHeaders[1].showAlert">
                <el-alert
                  :title="$t(tabsHeaders[1].content)"
                  type="warning"
                  show-icon
                  @close="tabsHeaders[1].showAlert = false"
                ></el-alert>
              </div>
            </el-collapse-transition>
            <resource-box v-if="activeName === 'shareRes'"
              :username="username" :userId="userId"
              :activeName="activeName" :id="activeId2" :tree="tree.myRes"></resource-box>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <share-form ref="shareForm" @shareConfirmAdd="shareConfirmAdd"></share-form>
    </el-container>
  </section>
</template>
<script>
import baseHeader from '@/components/mixins/baseHeader'
import baseTree from '@/components/tree/BaseTree'
import formDialog from '@/components/mixins/formDialog'
import resourceBox from './resourceBox.vue'
import shareForm from './shareForm.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'resource',
  components: {
    baseTree,
    resourceBox,
    shareForm
  },
  mixins: [baseHeader, formDialog],
  provide () {
    return {
      reflushTree: this.getTreeList
    }
  },
  data () {
    return {
      username: '',
      userId: '',
      tabsHeaders: [
        {
          // content: '我的资源说明',
          showAlert: false
        },
        {
          // content: '共享资源说明',
          showAlert: false
        }
      ],
      // 树状结构
      tree: {
        myRes: {
          data: [
            {
              children: [],
              edit: false,
              parentId: null,
              name: '所有资源',
              id: ''
            }
          ],
          defaultProps: {
            children: 'children',
            label: 'name'
          }
        },
        shareRes: {
          data: [
            {
              children: [],
              edit: false,
              parentId: null,
              name: '所有共享资源',
              id: ''
            }
          ],
          defaultProps: {
            children: 'children',
            label: 'name'
          }
        }
      },
      showMenus: false, // 树形右键菜单
      // 当前点击-我的-共享
      activeName: 'myRes',
      left: 0, // 菜单位置
      top: 0, //
      // 树形上面-按钮
      asideHeaders: {
        buttons: [
          {
            type: 'Add',
            text: '新建分类',
            icon: 'xinjian',
            disabled: !this._checkPermission('/resourceSpaces', 'POST')
          }
        ],
        title: '',
        showAlertIcon: false
      },
      activeId: '',
      activeId2: '',
      menuLeftList: [
        {
          key: '1',
          text: '新建',
          disabled: !this._checkPermission('/resourceSpace', 'POST')
        },
        {
          key: '2',
          text: '重命名',
          disabled: !this._checkPermission('/resourceSpace', 'PUT')
        },
        {
          key: '3',
          text: '共享',
          disabled: !this._checkPermission('/resourceSpace/share', 'POST')
        },
        {
          key: '4',
          text: '删除',
          disabled: !this._checkPermission('/resourceSpace', 'DELETE')
        }
      ]
    }
  },
  computed: {
    // 获取系统设置项
    ...mapGetters(['organizeOptionsAll', 'roleOptions'])
  },
  methods: {
    ...mapActions('system', ['FetchOrganizeOptionsAll', 'FetchRoleOptions']),

    // 切换资源库
    handleTabClick (tab) {
      this.addParams = Object.assign({}, {})
      if (this.tree[tab.name].data && this.tree[tab.name].data.length <= 1) {
        this.getTreeList(tab.name)
      }
    },
    // 新建分类-我的
    myHandleHeaderAdd (data) {
      // addParams
      var nodes = this.tree.myRes.data[0].children
      var newChild = {}
      if (nodes.length > 0) {
        if (!nodes[nodes.length - 1].edit) {
          this.closeEdit()
          if (this.addParams && this.addParams.id) {
            var node = this.$refs.baseTree.$refs.tree.getNode(this.addParams.id)
            newChild = {
              children: [],
              edit: true,
              parentId: this.addParams.id,
              name: '',
              id: '',
              type: 'add'
            }
            node.data.children.push(newChild)
          // this.tree.myRes.data[0].children.push(newChild)
          } else {
            newChild = {
              children: [],
              edit: true,
              parentId: this.tree.myRes.data[0].id,
              name: '',
              id: '',
              type: 'add'
            }
            this.tree.myRes.data[0].children.push(newChild)
          }
        }
      } else {
        this.closeEdit()
        newChild = {
          children: [],
          edit: true,
          parentId: '',
          name: '',
          id: '',
          type: 'add'
        }
        this.tree.myRes.data[0].children.push(newChild)
      }
    },
    closeMenu () {
      this.showMenus = false
    },
    // 列表操作
    showTreeMenus (e, data) {
      this.showMenus = true
      this.left = e.clientX
      this.top = e.clientY
      this.addParams = Object.assign({}, data)
      if (this.activeName === 'myRes' && (data.isShare === 2 || data.isShare === 3)) {
        this.menuLeftList[2].text = '取消共享'
      } else {
        this.menuLeftList[2].text = '共享'
      }
    },
    myMenusClick (data) {
      var newChild = {}
      var node = this.$refs.baseTree.$refs.tree.getNode(this.addParams.id)
      switch (data.key) {
        case '1':
          this.closeEdit()
          newChild = {
            children: [],
            edit: true,
            parentId: this.addParams.id,
            name: '',
            id: '',
            type: 'add'
          }
          node.data.children.push(newChild)
          break
        case '2':
          if (this.addParams.id) {
            newChild = {
              children: this.addParams.children || [],
              edit: true,
              parentId: this.addParams.parentId || '',
              name: this.addParams.name || '',
              id: this.addParams.id,
              type: 'edit'
            }
            node.data = newChild
            this.closeEdit(this.addParams.id)
          } else {
            this.$message('此分类不可修改')
          }
          break
        case '3':
          if (this.addParams.id) {
            if (this.addParams.isShare === 2 || this.addParams.isShare === 3) {
              this.$request.resourceSpaceUnShare({ ids: [this.addParams.id] }).then(res => {
                if (res.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.getTreeList(this.activeName)
                }
              })
            } else {
              this.$refs.shareForm.showDialog('datas', this.addParams)
            }
          } else {
            this.$message('此分类不可共享')
          }
          break
        case '4':
          if (this.addParams.id) {
            this.$confirm('是否删除该分类', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then((res) => {
              this.$request.resourceSpaceDelete({ ids: [this.addParams.id] }).then(res => {
                if (res.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.getTreeList(this.activeName)
                }
              })
            }).catch(() => {})
          } else {
            this.$message('该分类不可删除')
          }
          break
        default:
          return false
      }
      this.closeMenu()
    },
    shareConfirmAdd (data, btn) {
      // 分享
      var params = {}
      if (data.type === 'Datas') {
        if (data.orgIds.length > 0 || data.roleIds.length > 0 || data.userIds.length > 0) {
          params = {
            id: data.id,
            ...data
          }
          this.$request.resourceSpaceShare(params).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '共享成功',
                type: 'success'
              })
              this.$refs.shareForm.handleCancel()
              this.getTreeList(this.activeName)
            }
          })
        } else {
          this.$message('请在组织，角色，用户中至少选择一项')
        }
      }
    },
    closeEdit (id) {
      let arr = this.tree.myRes.data
      const loop = function (data) {
        if (data instanceof Array) {
          return data.map((d, i) => {
            if (id && d.id === id) {
              d.edit = true
            } else {
              d.edit = false
            }
            if (d.children && d.children instanceof Array) {
              d.children = loop(d.children, true)
            }
            return d
          })
        }
      }
      this.tree.myRes.data = loop(arr)
    },
    userTreeAdd (data, node) {
      // 新增我的资源分类
      if (data.name) {
        var param = {
          name: data.name,
          id: data.id
        }
        this.$request.resourceSpaceNameUnique(param).then(res => {
          if (res.code === 200) {
            if (res.data) {
              data.edit = false
              if (data.type === 'add') {
                this.resourceSpaceSave(data)
              } else {
                this.resourceSpaceUpdate(data)
              }
            } else {
              this.$message({
                message: '资源空间名重复',
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      } else {
        data.edit = false
        this.getTreeList(this.activeName)
      }
    },
    // 初始化数据加载
    resourceSpaceSave (data) {
      var params = {
        parentId: data.parentId,
        name: data.name
      }
      this.$request.resourceSpaceSave(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getTreeList(this.activeName)
        } else {
          this.getTreeList(this.activeName)
        }
      })
    },
    resourceSpaceUpdate (data) {
      var params = {
        id: data.id,
        name: data.name
      }
      this.$request.resourceSpaceUpdate(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getTreeList(this.activeName)
        } else {
          this.getTreeList(this.activeName)
        }
      })
    },
    // 获取侧边树形结构
    getTreeList (type) {
      if (type === 'myRes') {
        // 我的
        this.activeId = ''
        this.$request.resourceUserTree({ username: localStorage.getItem('userName') || 'system' }).then(res => {
          if (res.code === 200) {
            if (res.data instanceof Array) {
              var arr = res.data.map((d, i) => {
                return d
              })
              this.tree.myRes.data[0].children = arr
            }
          } else {
            this.$message.error(res.message)
          }
        })
      } else if (type === 'shareRes') {
        this.activeId2 = ''
        // 共享
        this.$request.resourceShareTree().then(res => {
          if (res.code === 200) {
            this.tree.shareRes.data[0].children = res.data.map(v => {
              if (v.userId) {
                v.id = v.name + '-' + v.userId
              }
              return v
            })
            // res.data.system
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    handleClick (data, node, ev) {
      this.username = ''
      if (!data.userId) {
        this.userId = ''
        if (this.activeName === 'myRes') {
          this.activeId = data.id
        } else {
          this.activeId2 = data.id
          this.activeId = data.id
        }
        this.addParams = Object.assign({}, data)
      } else {
        this.userId = data.userId
        this.activeId = data.id
        this.username = data.name
        this.activeId2 = ''
      }
    }
  },
  mounted () {
    this.FetchOrganizeOptionsAll()
    this.FetchRoleOptions()
    this.getTreeList('myRes')
  }
}
</script>

<style lang="scss">
  .sys-resource-container{
    .el-tabs{
      padding-top: 17px;
      &__content{
        overflow: inherit;
      }
      .el-tab-pane{
        padding-top: 5px;
        .el-alert{
          margin-bottom: 10px;
        }
      }
    }
    .add-tree-input{
      width: 188px;
      display: inline-block;
      .el-input{
        &__inner{
          border-color:#1ec6df !important;
          border-radius: 0px !important;
        }
      }
    }
    .res-tree-menus{
      margin: 0;
      background: #fff;
      z-index: 44;
      position: absolute;
      list-style-type: none;
      min-width: 130px;
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
}
</style>
