<template>
  <section class="config-site-detail-container" id="viewBox">
    <div class="box-left" >
      <div class="drag-tree-btn">
        <el-button
          size="medium"
          type='primary'
          @click="handleHeaderRecycle()"
          :disabled="!_checkPermission('/sites/recycle', 'GET')"
        >
          <jee-icon iconClass="huishouzhan"></jee-icon>站点回收站
        </el-button>
      </div>
      <drag-tree v-bind="tree"
        @handleClick='handleClick'
        @handleSort="handleSort"
        v-if="tree.currentNodeKey"
      ></drag-tree>
    </div>
    <section class="box-right">
      <el-tabs v-model="activeTab" class="forbid-tabs">
        <template v-for="(item, index) in tabs">
          <el-tab-pane :label="item.label" :name="item.name" :key="index">
            <component :is="item.component" :id="id"></component>
          </el-tab-pane>
        </template>
      </el-tabs>
    </section>
  </section>
</template>

<script>
import sites from './sites'
import baseForm from '@/components/mixins/baseForm'
import home from './statikus/home'
import column from './statikus/column'
import templates from './statikus/templates'

export default {
  name: 'configSiteStatic',
  components: {
    home,
    column,
    templates
  },
  mixins: [sites, baseForm],
  data () {
    return {
      name: 'configSiteStatic',
      id: '',
      activeTab: '1',
      fontId: '',
      tabs: [
        {
          name: '1',
          label: '首页',
          component: 'home'
        },
        {
          name: '2',
          label: '栏目',
          component: 'column'
        },
        {
          name: '3',
          label: '内容页',
          component: 'templates'
        }
      ]

    }
  },
  inject: ['removeTab'],
  methods: {
    handleClick (data) {
      this.id = data.id
      this.$router.push({ query: { id: data.id } })
    }
  },
  activated () {
    const { id } = this.$route.query
    this.id = id
  },
  mounted () {
    this.fetchSiteseList()
  },
  watch: {
    id () {
      this.tree.currentNodeKey = Number(this.$route.query.id)
    }
  }
}
</script>

<style lang="scss">
.config-site-detail-container{
  height: calc(100vh - 140px);
  background-color: #ffffff;
  display: flex;
  .box-left{
    width: 190px;
    padding-top: 10px;
    .drag-tree-btn{
      padding-left: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(232,232,232,1);
    }
    border: 1px solid rgba(232,232,232,1);
    border-radius:0px 0px 4px 4px;
  }
  .box-right{
    padding-left: 30px;
    width:calc(100% - 250px);
    .agreement{
      display: flex;
      .el-select{
        width: 110px;
      }
      .el-form-item{
        width: 300px;
        margin-left: 5px;
        margin-top: -2px;
        button{
          width: 100%;
        }
      }
      .el-input-group__append{
        width: 63px;
        text-align: center;
      }
    }
    .agreement:last-child{
      height: 40px;
    }
    .location-box{
      width:144px;
      height:97px;
      background:rgba(249,249,249,1);
      border:1px solid rgba(226,226,226,1);
      border-radius:4px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap ;
      padding-top: 7px;
    }
    .location-children{
      width:37px;
      height:22px;
      border:1px dashed rgba(226,226,226,1);
      border-radius:2px;
      text-align: center;
      line-height: 22px;
      font-size: 12px;
      color: #666666;
      cursor:pointer;
    }
    .location-children:hover{
      border:1px dashed #1EC6DF;
      color: #1EC6DF;
    }
    .location-children-on{
      background-color: #1EC6DF !important;
      color: #ffffff !important;
      border: solid 1px #1EC6DF !important;
    }

  }
  .depiction{
    position: fixed;
    right: 78px;
    top: 50%;
    transform: translateY(-50%);
    border-right:#e8e8e8 1px solid;
    padding: 40px 24px 40px 0;
    a{
      font-size: 14px;
      display: block;
      width: 150px;
      text-align: right;
      color: #666666;
      line-height: 31px;
    }
  }
  .topBtn{
    margin-bottom:21px ;
  }
}

</style>
