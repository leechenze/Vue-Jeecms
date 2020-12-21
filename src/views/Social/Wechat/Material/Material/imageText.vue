<template>
  <section class="image-text-list">
    <base-header
      v-bind="headers"
      @handleSync="handleHeaderSync"
      @handleAdd="handleHeaderAdd"
      >
        <template slot>
          <div class="input-right">
            <el-input
              v-model="params.title"
              maxlength="50"
              @keyup.enter.native="handleSearch($event)"
              size="medium" placeholder="搜索素材中文章标题"
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
    <div class="we-card__list" >
      <template v-for="(content) in tableData">
        <div :key="content.id" class='we-card-wrap'>
          <div class="we-card__warpper">
            <div v-for="(item,index) in content.requestArray" :key="index">
              <div class="we-card__item we-card__item--thumb" v-if="index==0" :key="index">
                <a :href="item.url" target="_blank" class="we-card__link">
                  <el-image
                      class="we-card__img"
                      :src="$weChatUrl(item.thumbMediaUrl)"
                      fit="contain">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                  <span class="we-card__title--thumb"  v-if="item.title!=''">
                    {{item.title}}
                  </span>
                </a>
                <div class="we-card-mask__preview">
                  <a :href="item.url" target="_blank">预览文章</a>
                </div>
              </div>
              <div class="we-card__item  we-card__item--sub" v-else :key="index">
                <a :href="item.url" target="_blank" class="we-card__link">
                  <div class="we-card__sub--inner">
                    <div class="we-card__sub--img">
                      <!-- $weChatUrl -->
                      <el-image
                        class="we-card__img"
                        :src="$weChatUrl(item.thumbMediaUrl)"
                        fit="contain">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                      </el-image>
                    </div>
                    <div class="we-card__sub--title">
                      {{item.title}}
                    </div>
                  </div>
                </a>
                <div class="we-card-mask__preview">
                  <a :href="item.url" target="_blank">预览文章</a>
                </div>
              </div>
            </div>
            <div class="we-card__footer">
              <span class="fl">
                更新时间 {{$getDateDiff(content.wechatUpdateTime*1000)}}
              </span>
              <span class="fr">
                <jee-icon iconClass="bianji"
                  className='jee-hover-fill'
                  @click="editData(content.id)"></jee-icon>
                <jee-icon iconClass="shanchu"
                  className='jee-hover-fill'
                  @click="deleteData(content)"></jee-icon>
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <jee-pagination
      :total="totalCount"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"></jee-pagination>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
// jee-pagination
export default {
  name: 'imageText',
  mixins: [baseHeader],
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
  data () {
    return {
      tableData: [],
      headers: {
        buttons: [
          {
            type: 'Add',
            text: '新增图文素材',
            icon: 'shangchuan'
          },
          {
            type: 'Sync',
            text: '同步图文素材',
            icon: 'tongbu'
          }
        ],
        showAlertIcon: false
      },
      params: {
        'appId': '',
        'type': 'news',
        'title': '',
        'page': 1,
        'size': 10
      },
      totalCount: 0
    }
  },
  watch: {
    id (newVal) {
      if (this.id && this.name === 'imageText') {
        this.params.appId = this.id
        this.getListData()
      }
    },
    name (newVal, oldVal) {
      if (this.id && this.name === 'imageText') {
        this.params.appId = this.id
        this.getListData()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.id && this.name === 'imageText') {
        this.params.appId = this.id
        this.getListData()
      }
    })
  },
  methods: {
    // 搜索
    handleSearch (e) {
      this.getListData()
    },
    // 新增
    handleHeaderAdd (btn) {
      this.$routerLink('/social/wechat/imageText/add', 'add', { appId: this.params.appId })
    },
    //  同步
    handleHeaderSync (btn) {
      if (this.id) {
        this.$request.fetchWechatMaterialSynchNews({ appId: this.id }).then(res => {
          this.$restBack(res, () => {
            this.getListData()
          }, '同步成功')
        })
      }
    },
    // 修改
    editData (id) {
      this.$routerLink('/social/wechat/imageText/edit', 'edit', { id: id, appId: this.params.appId })
    },
    // 删除
    deleteData (data) {
      this.$confirm('是否确认删除素材?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = { requests: [{ 'mediaId': data.mediaId, 'id': data.id }] }
        this.$request.fetchWechatMaterialDelete(params).then(res => {
          this.$restBack(res, () => {
            this.getListData()
          })
        })
      }).catch(() => {})
    },
    // 获取数据
    getListData () {
      this.$request.fetchWechatMaterialPage(this.params).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.content
          this.totalCount = res.data.totalElements
        }
      })
    },
    handleSizeChange (val) {
      this.params.size = val
      this.ids = []
      this.getListData()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.ids = []
      this.getListData()
    }
  },
  activated () {
    if (this.$route.query.type === 'list') {
      this.getListData()
      this.$router.push({ query: { type: '', ...this.$route.query } })
    }
  }
}
</script>
<style lang="scss" scoped>
  .image-text-list{
    .input-right{
      position: absolute;
      right: 0px;
    }
    .we-card__list{
      .we-card__footer{
        .fr{
          .jee-svg-icon{
            font-size: 14px;
          }
          .jee-svg-icon + .jee-svg-icon{
            padding-left: 14px;
          }
        }
      }
    }
  }
</style>
