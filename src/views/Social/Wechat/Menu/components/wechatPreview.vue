<template>
  <section class="wechat-preview-index">
    <div class="weixin-wrap">
      <!-- 预览窗 -->
      <div class="weixin-preview">
        <div class="weixin-hd">
          <img class="head-img" src="../../../../../assets/img/wechat-menu-head.png" />
          <!-- <div class="weixin-title">{{formData.menuGroupName}}</div> -->
        </div>
        <div class="weixin-bd">
          <div class="weixin-img">
            <img class="head-img" src="../../../../../assets/img/wechat-event.png" />
          </div>
          <ul class="weixin-menu" id="weixin-menu">
            <draggable v-model="formData.menuList"
              @update="datadragEnd" :animation="500">
              <li
                v-for="(btn,i) in formData.menuList"
                class="menu-item drag-item jee-hover-fill" :key="i"
                :class="{'jee-color':selectedMenuIndex===i&&selectedMenuLevel()==1}"
                @click="selectedMenu(btn,i,$event)">
                <div class="menu-item-title">
                  <jee-icon v-if="btn.menuName === '默认菜单'" iconClass="caidan" :style="{width:'7px',paddingRight: '5px', fill:'#ccc'}"></jee-icon>
                  <span>{{ btn.menuName }}</span>
                </div>
                <ul class="weixin-sub-menu" v-show="selectedMenuIndex===i">
                  <draggable v-model="btn.childs"
                  @update="datadragEnd" :animation="500">
                    <li
                      v-for="(sub,i2) in btn.childs"
                      :key="i2" class="menu-sub-item drag-item"
                      :class="{'jee-color jee-hover-fill':selectedSubMenuIndex===i2&&selectedMenuLevel()==2}"
                      @click.stop="selectedSubMenu(sub,i2,i,$event)">
                      <div class="menu-item-title">
                        <span>{{sub.menuName}}</span>
                      </div>
                    </li>
                  </draggable>
                  <li v-if="btn.childs.length<5"
                    class="menu-sub-item" @click.stop="addMenu(2)">
                    <div class="menu-item-title">
                      <jee-icon iconClass="tianjiaxian" :style="{fontSize:'16px'}"></jee-icon>
                    </div>
                  </li>
                  <i class="menu-arrow arrow_out"></i>
                  <i class="menu-arrow arrow_in"></i>
                </ul>
              </li>
            </draggable>
            <li class="menu-item" v-if="formData.menuList.length<3" @click="addMenu(1)">
              <jee-icon iconClass="tianjiaxian" :style="{fontSize:'16px'}"></jee-icon>
            </li>
          </ul>
        </div>
      </div>
      <!-- 内容框 -->
      <preview-box
        v-if="selectedMenuIndex !== ''"
        ref="previewBox"
        @deleteMenu="deleteMenu"
        @changeMenuData="changeMenuData"
        :data="menuData"></preview-box>
    </div>
  </section>
</template>

<script>
import previewBox from './previewBox'
import draggable from 'vuedraggable'
export default {
  name: 'wechatPreview',
  components: {
    previewBox,
    draggable
  },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    menuIndex: {
      type: [Number, String],
      default: 0
    },
    menuSecondIndex: {
      type: [Number, String],
      default: 0
    }
  },
  watch: {
    menuSecondIndex (newVal) {
      this.selectedSubMenuIndex = newVal
    },
    menuIndex (newVal) {
      this.selectedMenuIndex = newVal
    }
  },
  data () {
    return {
      selectedMenuIndex: '',
      selectedSubMenuIndex: '',
      menuData: {}
    }
  },
  methods: {
    selectedMenu (data, i, event) {
      data.isAdd = false
      this.selectedSubMenuIndex = ''
      this.selectedMenuIndex = i
      this.menuData = Object.assign({}, data)
      this.menuData.level = 1
    },
    datadragEnd (evt) {
      evt.preventDefault()
    },
    selectedSubMenu (data, i2, i, event) {
      data.isAdd = false
      this.selectedSubMenuIndex = i2
      this.selectedMenuIndex = i
      this.menuData = Object.assign({}, data)
      this.menuData.level = 2
    },
    // 选中菜单级别
    selectedMenuLevel () {
      if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex === '') {
        // 主菜单
        return 1
      } else if (this.selectedSubMenuIndex !== '') {
        // 子菜单
        return 2
      } else {
        // 未选中任何菜单
        return 0
      }
    },
    // 添加菜单
    addMenu (level) {
      if (level === 1 && this.formData.menuList.length < 3) {
        this.formData.menuList.push({
          menuType: 'media_id',
          menuName: '菜单名称',
          choiceType: 1,
          childs: [],
          mediaData: null,
          linkUrl: '',
          keyword: [],
          isAdd: true
        })
        this.selectedMenuIndex = this.formData.menuList.length - 1
        this.selectedSubMenuIndex = ''
        this.menuData = this.formData.menuList[this.selectedMenuIndex]
      }
      if (level === 2 && this.formData.menuList[this.selectedMenuIndex].childs.length < 5) {
        this.formData.menuList[this.selectedMenuIndex].childs.push({
          menuType: 'media_id',
          menuName: '子菜单名称',
          linkUrl: '',
          choiceType: 1,
          childs: [],
          mediaData: null,
          keyword: [],
          isAdd: true
        })
        this.selectedSubMenuIndex = this.formData.menuList[this.selectedMenuIndex].childs.length - 1
        this.menuData = this.formData.menuList[this.selectedMenuIndex].childs[this.selectedSubMenuIndex]
      }
    },
    deleteMenu () {
      if (this.selectedMenuLevel() === 1) {
        this.$confirm('删除后菜单下设置的内容将被删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.selectedMenuIndex === 0) {
            this.formData.menuList.splice(this.selectedMenuIndex, 1)
            this.selectedMenuIndex = 0
          } else {
            this.formData.menuList.splice(this.selectedMenuIndex, 1)
            this.selectedMenuIndex -= 1
          }
          if (this.formData.menuList.length === 0) {
            this.selectedMenuIndex = ''
            this.menuData = {
              menuName: ''
            }
          } else {
            this.menuData = this.formData.menuList[this.selectedMenuIndex]
          }
        })
      } else if (this.selectedMenuLevel() === 2) {
        this.$confirm('确定要删除此子菜单吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.selectedSubMenuIndex === 0) {
            this.formData.menuList[this.selectedMenuIndex].childs.splice(
              this.selectedSubMenuIndex,
              1
            )
            this.selectedSubMenuIndex = 0
          } else {
            this.formData.menuList[this.selectedMenuIndex].childs.splice(
              this.selectedSubMenuIndex,
              1
            )
            this.selectedSubMenuIndex -= 1
          }
          if (this.formData.menuList[this.selectedMenuIndex].childs.length === 0) {
            this.selectedSubMenuIndex = ''
            this.menuData = this.formData.menuList[this.selectedMenuIndex]
          } else {
            this.menuData = this.formData.menuList[this.selectedMenuIndex].childs[this.selectedSubMenuIndex]
          }
        })
      }
    },
    changeMenuData (data) {
      if (this.selectedMenuLevel() === 1) {
        this.formData.menuList.splice(this.selectedMenuIndex, 1, data)
      } else if (this.selectedMenuLevel() === 2) {
        // let menu = this.formData.menuList[this.selectedMenuIndex]
        // menu.childs.splice(this.selectedSubMenuIndex, 1, data)
        // this.formData.menuList.splice(this.selectedMenuIndex, 1, menu)
        this.formData.menuList[this.selectedMenuIndex].childs.splice(this.selectedSubMenuIndex, 1, data)
      }
    }

  },
  mounted () {
    // 为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>

<style lang="scss">
  .wechat-preview-index{
    .weixin-wrap{
      max-width: 1200px;
      min-width: 1000px;
      display: flex;
    }
    .weixin-preview{
      position: relative;
      width: 296px;
      height: 582px;
      border: 1px solid #E8E8E8;
      .weixin-hd{
        color: #fff;
        text-align: center;
        position: relative;
        top:0px;
        left:0px;
        width: 100%;
        height:58px;
        position: relative;
        .weixin-title{
          color:#fff;
          font-size:15px;
          width:100%;
          text-align: center;
          position:absolute;
          top: 20px;
          left: 0px;
        }
        .head-img{
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          height: 58px;
        }
      }
      .weixin-menu{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #e8e8e8;
        background-position: 0 0;
        background-repeat: no-repeat;
        background-color: #FAFAFA;
        padding-left: 43px;
        margin-bottom:0px;
        /*一级*/
        .menu-item{
          position: relative;
          float: left;
          line-height: 50px;
          height:50px;
          text-align: center;
          min-width:32.5%;
          border-left: 1px solid #e8e8e8;
          cursor: pointer;
          color:#616161;
          .jee-svg-icon{
            fill: #666666;
          }
        }
      }
      /*键盘*/
      .weixin-img{
          position: absolute;
          line-height: 50px;
          left: 10px;
          bottom: 15px;
          padding-top: 12px;
          z-index: 1;
        }
      /*二级*/
      .weixin-sub-menu{
        position: absolute;
        bottom: 60px;
        left: 0;
        right: 0;
        // border-top: 1px solid #d0d0d0;
        margin-bottom:0px;
        background: #fafafa;
        display: block;
        padding:0;
        .menu-sub-item{
          line-height: 50px;
          height:50px;
          text-align: center;
          width:100%;
          border: 1px solid #d0d0d0;
          border-bottom-width: 0;
          cursor: pointer;
          position: relative;
          color:#616161;
        }
        >li.menu-sub-item:last-of-type{
          border-bottom-width: 1px;
        }
      }
      .menu-arrow{
        position: absolute;
        left: 50%;
        margin-left: -6px;
      }
      .arrow_in{
        bottom: -4px;
        display: inline-block;
        width: 0px;
        height: 0px;
        border-width: 6px 6px 0px;
        border-style: solid dashed dashed;
        border-color: #fafafa  transparent transparent;
      }
      .arrow_out{
        bottom: -5px;
        display: inline-block;
        width: 0px;
        height: 0px;
        border-width: 6px 6px 0px;
        border-style: solid dashed dashed;
        border-color: #d0d0d0 transparent transparent;
      }
    }
    .weixin-preview .menu-item .menu-item-title,.weixin-preview .menu-sub-item .menu-item-title{
      width:100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;
      .jee-svg-icon{
            fill: #666666;
          }
    }
    .weixin-preview .weixin-sub-menu.show{
      display:block;
    }
    .weixin-preview .menu-item:hover{
      color: #000;
    }
    .weixin-preview .menu-sub-item:hover{
      background: #eee;
    }
  }
</style>
