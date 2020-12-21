<template>
  <section class="social-fans-index">
    <base-header v-bind="headers" />
    <jee-aside-layout
      asideWidth="250px"
      class="social-container"
      hiddenHeader :noPageView='true'>
       <section slot="asideMain" >
         <weibo-tree
          ref="weiboTree"
          @setActive="setActive"
          :rowKey="rowKey"
          :activeId="activeId"></weibo-tree>
       </section>
       <section slot="main" v-if="activeId">

            <search-header
      class="search-header"
            v-bind="searchHeader"
            :params="list.params"
            @handleSearch="handleSearch"
            @handleBtn="handleBtnSync"
          >
          </search-header>
          <base-table
            v-bind="list"
            @handleSelectionChange="handleSelectionChange"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
          >
          </base-table>
       </section>
    </jee-aside-layout>
  </section>
</template>

<script>
import weiboTree from '../components/WeiboTree'
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import { mapGetters } from 'vuex'

var columns = [
  {
    prop: 'id',
    label: '序号'
  },
  {
    prop: 'profileImageUrl',
    label: '粉丝头像',
    scopeType: 'img',
    hasPath: true,
    style: {
      width: '50px',
      height: '50px',
      borderRadius: '100%',
      backgroundColor: '#fafafa',
      margin: '15px 0'
    }
  },
  {
    prop: 'screenName',
    label: '粉丝昵称',
    minWidth: '120px'
  },
  {
    prop: 'gender',
    label: '性别',
    formatter: (row) => {
      switch (row.gender) {
        case 'm':
          return '男'
        case 'f':
          return '男'
        case 'n':
          return '男'
      }
    }
  },
  {
    prop: 'location',
    label: '所在地',
    minWidth: '120px'
  },
  {
    prop: 'followersCount',
    label: '粉丝数'
  },
  {
    prop: 'friendsCount',
    label: '关注数'
  },
  {
    prop: 'statusesCount',
    label: '微博数'
  },
  {
    prop: 'description',
    label: '简介',
    width: '245px',
    showOverflowTooltip: true
  },
  {
    prop: 'blogUrl',
    label: '微博主页',
    scopeType: 'link',
    width: '200px',
    showOverflowTooltip: true
  }
]
export default {
  name: 'socialWeiboFans',
  mixins: [baseTable, baseHeader, searchHeader],
  components: {
    weiboTree
  },
  computed: {
    ...mapGetters(['weiboinfoList'])
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataList()
    })
  },
  data () {
    return {
      rowKey: 'id',
      headers: {
        title: '操作说明',
        content: '首次使用时请先同步粉丝数据'
      },
      searchHeader: {
        searchItems: [
          {
            type: 'select',
            label: '性别:',
            style: {
              width: '98px'
            },
            value: 'gender',
            options: [
              { label: '全部', value: '' },
              { label: '男', value: 'm' },
              { label: '女', value: 'f' },
              { label: '其他', value: 'n' }
            ]
          },
          {
            type: 'searchInput',
            value: 'screenName',
            placeholder: '粉丝昵称'
          },
          {
            type: 'henderBtns',
            disabled: !this._checkPermission('/weibofans/sync', 'GET'),
            text: '同步粉丝'
          }
        ]
      },
      list: {
        columns,
        api: '',
        params: {
          'id': '',
          'gender': '',
          'screenName': ''
        }
      },
      activeId: ''
    }
  },
  methods: {
    getDataList () {
      if (this.weiboinfoList.length > 0) {
        this.list.params.id = this.weiboinfoList[0].id
        this.activeId = this.weiboinfoList[0].id
        this.list.api = 'weibofansPage'
        this.fetchTableApi()
      }
    },
    // 同步粉丝
    handleBtnSync (item) {
      this.$request.weibofansSync({ id: this.activeId }).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, '同步成功')
      })
    },
    // 点击列表
    setActive (id) {
      this.activeId = id
      this.list.params.id = id
      this.list.api = 'weibofansPage'
      this.fetchTableApi()
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
<style lang="scss" scoped>
  .social-fans-index{
    .social-container{
      padding: 0 !important;
      height: calc(100vh - 230px);
    }
  }
</style>
