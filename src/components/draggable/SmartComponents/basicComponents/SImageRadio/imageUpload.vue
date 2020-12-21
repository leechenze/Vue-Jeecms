<template>
  <section class="s-image-radio-upload-ques">
    <div class="upload-img" v-if="value.picUrl">
        <el-image class="t-img"
          :src="$getPath(value.picUrl)"
          fit="contain"></el-image>
          <div class="upload-mode">
            <jee-icon iconClass="guanbi" @click="delPic"
              :style="{fill:'#fff',fontSize:'11px'}"></jee-icon>
          </div>
      </div>
      <div class="upload-btn" v-else>
        <jee-icon iconClass="shangchuantupian" class="jee-hover-fill" @click="showUpload"></jee-icon>
        <upload
          ref="imageUpload"
          resourceType="image"
          @handleConfirm="handleConfirmImg"
        ></upload>
      </div>
  </section>
</template>

<script>
import Upload from '@/components/editor/Upload'
export default {
  name: 'iamge-upload',
  props: {
    value: Object
  },
  components: {
    Upload
  },
  computed: {
    id: {
      get () {
        return this.value.pic
      },
      set (val) {
        this.value.pic = val
        this.$emit('input', this.value)
      }
    }
  },
  methods: {
    showUpload () {
      this.$refs.imageUpload.showDialog()
    },
    handleConfirmImg (html, data, file) {
      if (data) {
        this.value.picUrl = data.url
        this.id = data.id
      } else {
        this.value.picUrl = ''
        this.id = ''
      }
    },
    delPic () {
      this.value.picUrl = ''
      this.id = ''
    }
  }
}
</script>

<style lang="scss">
.s-image-radio-upload-ques{
  position: relative;
  z-index: 1002;
    .btn-88{
      width: 88px;
      padding: 10px 20px !important;
      font-size: 12px !important;
    }
    .upload-btn{
      width: 38px;
      height: 26px;
      border: 1px dashed #e2e2e2;
      border-radius: 4px;
      padding-top: 12px;
    }
    .upload-img{
      width: 40px;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      margin-top: -27px;
      top: 13px;
      .upload-mode{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        text-align: right;
        background-color: rgba(0, 0, 0, 0.7);
        display: none;
        .jee-svg-icon{
          vertical-align: top;
          cursor: pointer;
          margin: 0;
        }
      }
      &:hover{
        .upload-mode{
          display: block;
        }
      }
    }
}

</style>
