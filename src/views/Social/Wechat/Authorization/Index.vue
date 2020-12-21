<template>
<!-- heyan -->
  <section class="wechat-authorization-index">
    <el-tabs v-model="activeTab">
      <template v-for="(item, index) in tabs">
        <el-tab-pane :label="item.label" :name="item.name" :key="index">
          <label slot="label">{{item.label}}<jee-icon iconClass="caozuoshuoming1" @click="item.showAlert = !item.showAlert" :style="{fontSize: '16px'}"/></label>
            <el-collapse-transition>
              <div v-show="item.showAlert" style="margin-bottom:20px">
                <el-alert
                  :title="$t(item.content)"
                  type="warning"
                  show-icon
                  @close="item.showAlert = false"
                ></el-alert>
              </div>
            </el-collapse-transition>
          <component :is="item.component" :name="activeTab"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </section>
</template>

<script>
import wechatPublic from './WechatPublic'
import wechatApplet from './WechatApplet'
export default {
  name: 'socialWechatAuthorizationIndex',
  components: {
    wechatPublic,
    wechatApplet
  },
  data () {
    return {
      activeTab: 'wechatPublic',
      tabs: [
        {
          label: '微信公众号',
          name: 'wechatPublic',
          component: 'wechatPublic',
          showAlert: true,
          content: '显示所有已授权的公众号，可授权多个。同一公众号在站群中不可重复授权；当站点授权多个公众号时，会使用默认登录授权账号作为登录绑定账号。在一个站点中只能设置一个默认登录授权账号；'
        },
        {
          label: '微信小程序',
          name: 'wechatApplet',
          component: 'wechatApplet',
          showAlert: true,
          content: '显示所有已授权的微信小程序，一个站点只能授权一个小程序。同一小程序在站群中不可重复授权；'
        }
      ]
    }
  }
}
</script>
