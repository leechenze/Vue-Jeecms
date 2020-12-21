<template>
  <section class="s-video-upload-preview s-draggable-preview">
    <el-form-item
      v-if="deviceTab === 2"
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <div class="s-limit-form-item" v-if="option.type.length>0">
        支持
        <template v-for="(item,index) in option.type" >
          <span :key="index" v-if="index < option.type.length-1">
            {{item}},
          </span>
          <span :key="index" v-else>{{item}} </span>
        </template>
        等视频格式<span v-if="option.size">(文件大小不超过{{option.size}}{{option.unit}})</span>
      </div>
      <jee-video-content-upload
        v-bind="option"
        v-model="val"
        :isDescShow="false"
        :uploadOption="option"
        :tipShow="false"
      ></jee-video-content-upload>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
    <el-form-item
      v-else
      class="smart-mobile-video-upload"
      :label="option.label"
      :prop="option.name"
      :rules="getRules"
    >
      <div class="s-limit-form-item" v-if="option.type">
        支持
        <template v-for="(item,index) in option.type" >
          <span :key="index" v-if="index < option.type.length-1">
            {{item}},
          </span>
          <span :key="index" v-else>{{item}} </span>
        </template>
        等视频格式 (文件大小不超过{{option.size}}{{option.unit}})
      </div>
      <jee-video-content-upload
        v-bind="option"
        v-model="val"
        :isDescShow="false"
        :uploadOption="option"
        :tipShow="false"
      ></jee-video-content-upload>
      <div class="z-tip-form-item" v-if="option.tip">{{option.tip}}</div>
    </el-form-item>
  </section>
</template>

<script>
import previewMixin from '@/components/draggable/Mixin/previewMixin'
export default {
  name: 'NewDVideoUploadPreview',
  mixins: [previewMixin]
}
</script>
<style lang="scss" scoped>
  .s-video-upload-preview{
    .el-form-item{
      .el-form-item__label{
        line-height: unset;
      }
    }
  }
</style>

<style lang="scss">
  .s-video-upload-preview.s-draggable-preview{
    .el-form-item{
      .el-form-item__label{
        line-height: unset;
      }
      .z-tip-form-item{
        padding-left: 0px;
        padding-top: 10px;
      }

    }
    .el-form-item.smart-mobile-video-upload{
      .el-form-item__content{
        .s-limit-form-item{
          color: #666;
          font-size: 14px;
        }
        .jee-video-content-upload-container{
          height: 190px;
          .resource-upload-wrap{
            width: 100%;
            height: 100%;
            .z-video-uploader{
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }

    }
  }
</style>
