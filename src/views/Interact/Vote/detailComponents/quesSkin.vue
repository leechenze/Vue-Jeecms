<template>
  <section class="ques-skin-wrap">
    <el-collapse v-model="activeName">
      <template v-for="(tab, index) in tabs">
        <el-collapse-item :title="tab.label" :name="tab.name" :key="index">
          <base-form
            :key="index"
            :ref="'form'+tab.name"
            v-bind="form[tab.name]"
            @getUrlBg="getUrlBg"
            @getUrlHead="getUrlHead"
          >
            <template #bgImage="scope">
              <div>
                <image-upload v-model="scope.form.bgImage" ></image-upload>
              </div>
            </template>
            <template #bgImage2="scope">
              <div class="bg-images">
                <div class="bg-img" :class="{'jee-border':img.picId === scope.form.bgImage}"
                  v-for="(img,imgIdx) in (scope.item.imgType === 'Head'?imageList.headImg:imageList.bgImg) "
                  :key="imgIdx" @click="setImage(img,scope.item.imgType)">
                  <el-image :src="$getPath(img.thumbnail||img.picUrl)" fit="cover">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </div>
            </template>
            <template #fontStyle="scope">
              <set-font-config v-model="scope.form.fontStyle"></set-font-config>
            </template>
            <template #titleStyle="scope">
              <set-font-config v-model="scope.form.titleStyle"></set-font-config>
            </template>
            <template #descStyle="scope">
              <set-font-config v-model="scope.form.descStyle"></set-font-config>
            </template>
            <template #stemStyle="scope">
              <set-font-config v-model="scope.form.stemStyle"></set-font-config>
            </template>
            <template #optStyle="scope">
              <set-font-config v-model="scope.form.optStyle"></set-font-config>
            </template>
          </base-form>
        </el-collapse-item>
      </template>
    </el-collapse>
  </section>
</template>
<script>
import baseForm from '@/components/mixins/baseForm'
import setFontConfig from './setFontConfig'
import imageUpload from './imageUpload'
import { mapGetters } from 'vuex'
import { deepClone } from '../../../../utils'
export default {
  name: 'ques-skin',
  mixins: [baseForm],
  components: {
    setFontConfig,
    imageUpload
  },
  props: {
    cssStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters('app', ['colorOption']),
    bgColor () {
      return this.colorOption(0)[0]
    }
  },
  data () {
    return {
      tabs: [
        { label: '页面背景', name: 'bgConfig' },
        { label: '页眉图片', name: 'headConfig' },
        { label: '内容区设置', name: 'contConfig' },
        { label: '字体设置', name: 'fontConfig' },
        { label: '提交按钮设置', name: 'subConfig' }
      ],
      activeName: ['bgConfig'],
      form: {
        bgConfig: {
          labelWidth: '83px',
          showSubmitButton: false,
          form: {
            bgType: 2,
            bgImage: '',
            bgImage2: '',
            bgImageUrl: '',
            alignType: 'left top',
            opacity: 100,
            isRepeat: 1,
            bgColor: '#F0F0F0'
          },
          formItems: [
            {
              prop: 'bgType',
              label: '背景类型：',
              type: 'radioBtn',
              options: [
                {
                  label: '图片背景',
                  value: 1
                },
                {
                  label: '颜色背景',
                  value: 2
                }
              ]
            },
            {
              prop: 'bgImage',
              label: '背景图片：',
              type: 'imageUpload',
              imgType: 'Bg',
              class: 'line-1',
              hiddenKey: 'bgType',
              hiddenValue: 1,
              urlProp: 'bgImageUrl',
              isResource: true,
              option: {
                autoUpload: false
              }
            },
            {
              prop: 'bgImage2',
              labelWidth: 0,
              class: 'dis-label',
              imgType: 'Bg',
              type: 'slot',
              hiddenKey: 'bgType',
              hiddenValue: 1
            },
            {
              prop: 'bgColor',
              label: '背景颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true,
              hiddenKey: 'bgType',
              hiddenValue: 2
            },
            {
              prop: 'alignType',
              label: '对齐方式：',
              type: 'radioBtn',
              btnWidth: '79px',
              class: 'align-type',
              options: [
                {
                  label: '左对齐',
                  value: 'left top'
                },
                {
                  label: '居中对齐',
                  value: 'center top'
                },
                {
                  label: '右对齐',
                  value: 'right top'
                }
              ],
              hiddenKey: 'bgType',
              hiddenValue: 1
            },
            {
              prop: 'isRepeat',
              label: '是否重复：',
              type: 'radioBtn',
              options: [
                {
                  label: '是',
                  value: 1
                },
                {
                  label: '否',
                  value: 2
                }
              ],
              hiddenKey: 'bgType',
              hiddenValue: 1
            },
            {
              prop: 'opacity',
              label: '透明度：',
              type: 'number',
              min: 0,
              max: 100,
              hiddenKey: 'bgType',
              hiddenValue: 1
            }
          ]
        },
        headConfig: {
          labelWidth: '83px',
          form: {
            bgImage: '',
            bgImageUrl: '',
            bgImage2: ''
          },
          formItems: [
            {
              prop: 'bgImage',
              label: '选择图片：',
              type: 'imageUpload',
              class: 'line-1',
              isResource: true,
              imgType: 'Head',
              urlProp: 'bgImageUrl',
              option: {
                autoUpload: false
              }
            },
            {
              prop: 'bgImage2',
              labelWidth: 0,
              imgType: 'Head',
              class: 'dis-label',
              type: 'slot'
            }
          ],
          showSubmitButton: false
        },
        contConfig: {
          labelWidth: '83px',
          form: {
            bgColor: '#ffffff',
            hasBorder: 1,
            borderColor: '#e8e8e8',
            borderWidth: 1,
            borderRadius: 0
          },
          formItems: [
            {
              prop: 'bgColor',
              label: '背景颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true
            },
            {
              prop: 'hasBorder',
              label: '使用边框：',
              type: 'radioBtn',
              options: [
                {
                  label: '是',
                  value: 1
                },
                {
                  label: '否',
                  value: 2
                }
              ]
            },
            {
              prop: 'borderColor',
              label: '边框颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'borderWidth',
              label: '边框粗细：',
              type: 'number',
              min: 1,
              max: 10,
              step: 1,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'borderRadius',
              label: '边框圆角：',
              type: 'number',
              min: 0,
              step: 1,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            }
          ],
          showSubmitButton: false
        },
        fontConfig: {
          labelWidth: '54px',
          showSubmitButton: false,
          form: {
            titleStyle: {
              fontSize: 24,
              fontWigth: 600,
              fontColor: '#333333',
              fontAlign: 'center'
            },
            descStyle: {
              fontSize: 14,
              fontWigth: 400,
              fontColor: '#333333',
              fontAlign: 'left'
            },
            stemStyle: {
              fontSize: 14,
              fontWigth: 400,
              fontColor: '#333333'
            },
            optStyle: {
              fontSize: 14,
              fontWigth: 400,
              fontColor: '#333333'
            }
          },
          formItems: [
            {
              prop: 'titleStyle',
              label: '标题：',
              type: 'slot'
            },
            {
              prop: 'descStyle',
              label: '描述：',
              type: 'slot'
            },
            {
              prop: 'stemStyle',
              label: '题干：',
              type: 'slot'
            },
            {
              prop: 'optStyle',
              label: '选项：',
              type: 'slot'
            }
          ]
        },
        subConfig: {
          labelWidth: '83px',
          showSubmitButton: false,
          form: {
            text: '提交',
            fontStyle: {
              fontSize: 14,
              fontWigth: 400,
              fontColor: '#ffffff'
            },
            bgColor: '#1ec6df',
            hasBorder: 1,
            borderColor: '#ffffff',
            borderWidth: 1,
            borderRadius: 4,
            btnWidth: 100,
            btnHeight: 36
          },
          formItems: [
            {
              prop: 'text',
              label: '文字：',
              maxlength: 6,
              labelWidth: '54px'
            },
            {
              prop: 'fontStyle',
              label: '字体：',
              labelWidth: '54px',
              type: 'slot'
            },
            {
              prop: 'bgColor',
              label: '背景颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true
            },
            {
              prop: 'hasBorder',
              label: '使用边框：',
              type: 'radioBtn',
              options: [
                {
                  label: '是',
                  value: 1
                },
                {
                  label: '否',
                  value: 2
                }
              ]
            },
            {
              prop: 'borderColor',
              label: '边框颜色：',
              type: 'color',
              disInput: true,
              showAlpha: true,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'borderWidth',
              label: '边框粗细：',
              type: 'number',
              min: 1,
              max: 10,
              step: 1,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'borderRadius',
              label: '边框圆角：',
              type: 'number',
              min: 0,
              step: 1,
              hiddenKey: 'hasBorder',
              hiddenValue: 1
            },
            {
              prop: 'btnWidth',
              label: '按钮宽度：',
              type: 'number',
              min: 1,
              step: 1
            },
            {
              prop: 'btnHeight',
              label: '按钮高度：',
              type: 'number',
              min: 0,
              step: 1
            }
          ]
        }
      },
      imageList: {
        headImg: [],
        bgImg: []
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler (newVal, oldVal) {
        this.$emit('change', this.form)
      }
    },
    cssStyle (newVal) {
      if (newVal && newVal.id) {
        this.form.bgConfig.form = newVal.bgConfig
        this.form.headConfig.form = newVal.headConfig
        this.form.contConfig.form = newVal.contConfig
        this.form.fontConfig.form = newVal.fontConfig
        this.form.subConfig.form = newVal.subConfig
      }
    }
  },
  methods: {
    getUrlBg (data, item, prop) {
      // 多个上传组件，返回内容不一样，导致图片没有回显，通过判断是否有url，如果没有则设置fileUrl
      this.form.bgConfig.form.bgImageUrl = data ? (data.url || data.fileUrl || '') : ''
    },
    getUrlHead (data, item, prop) {
      // 多个上传组件，返回内容不一样，导致图片没有回显，通过判断是否有url，如果没有则设置fileUrl
      this.form.headConfig.form.bgImageUrl = data ? (data.url || data.fileUrl || '') : ''
    },
    getImageList () {
      this.$request.fetchQuestionnairePic().then(res => {
        if (res.code === 200) {
          this.imageList = res.data
        }
      })
    },
    setImage (item, type) {
      if (type === 'Head') {
        this.form.headConfig.form.bgImage = item.picId
        this.form.headConfig.form.bgImageUrl = item.picUrl
      } else {
        this.form.bgConfig.form.bgImage = item.picId
        this.form.bgConfig.form.bgImageUrl = item.picUrl
      }
    }
  },
  activated () {
    if (this.$route.query.type === 'Add') {
      this.$emit('change', deepClone(this.form), 'add')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getImageList()
      this.$emit('change', this.form)
    })
  }
}
</script>
<style lang="scss">
  .ques-skin-wrap{
    height: 100%;
    overflow-y: auto;
    .el-collapse{
        border: none;
        .el-collapse-item{
           margin-bottom: 12px;
          .el-collapse-item__header {
            border-bottom-color: transparent;
            font-size: 16px;
            font-weight: 600;
            line-height: 32px;
            height: 32px;
            padding: 20px 0 0;
            border-bottom-color: #e8e8e8;
            &.is-active{

            }
            .el-collapse-item__arrow{
              font-size: 18px;
            }
          }
          .el-collapse-item__wrap{
            border-bottom: 0;
            overflow: inherit;
            .el-collapse-item__content{
              padding-bottom: 0;
              padding-top: 30px;
            }
          }
          // & + .el-collapse-item{
          //   margin-bottom: 20px;
          // }
          .el-radio-button{
            &__inner{
              padding: 8px 20px;
              font-size: 14px;
            }
          }
          .el-form{
            .el-form-item{
              margin-bottom:20px;
              &.line-1{
                .el-form-item__label{
                  line-height: 1.2;
                }
              }
              &.dis-label{
                .el-form-item__content{
                  margin-left: 0 !important;
                }
              }
              &.align-type{
                .el-radio-button{
                  &__inner{
                    padding: 8px 0;
                    width: 100%;
                    text-align: center;
                  }
                }
              }
              .bg-images{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                .bg-img{
                  width: 50px;
                  height: 50px;
                  box-sizing: border-box;
                  border-radius: 4px;
                  overflow: hidden;
                  background-color: #f0f0f0;
                  border: 2px solid #fff;
                  &:first-of-type{
                    margin-bottom: 6px;
                  }
                  .el-image{
                    display: block;
                  }
                }
              }
            }
            .form-item-wrap:last-of-type{
              .el-form-item{
                margin-bottom: 0
              }
            }
          }
        }
      }
  }
</style>
