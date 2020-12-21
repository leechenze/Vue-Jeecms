<template>
<!-- heyan -->
  <section class="voca-fontsize-index">
    <el-tabs v-model="activeTab">
      <template v-for="(item, index) in tabs">
        <el-tab-pane :label="item.label" :name="item.name" :key="index">
          <label slot="label">{{item.label}}
            <!-- <jee-icon iconClass="caozuoshuoming1" :style="{fontSize: '16px'}"
              @click="item.showAlert = !item.showAlert"
            /> -->
            </label>
            <el-collapse-transition>
              <div v-show="item.showAlert" style="padding-bottom:20px">
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
import FontMechanism from './Components/FontMechanism'
import FontYear from './Components/FontYear'
export default {
  name: 'configVocabularyFontsize',
  components: {
    FontMechanism,
    FontYear
  },
  data () {
    return {
      activeTab: '1',
      fontId: '',
      tabs: [
        {
          name: '1',
          label: '机关代字',
          // content: '操作说明',
          showAlert: false,
          component: 'FontMechanism'
        },
        {
          name: '2',
          label: '年号',
          // content: '操作说明',
          showAlert: false,
          component: 'FontYear'
        }
      ]
    }
  }

}
</script>
