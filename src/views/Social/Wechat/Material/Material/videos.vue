
<script>
import voices from './voices'
export default {
  name: 'videos',
  extends: voices,
  data () {
    return {
      placeholder: '搜索视频',
      icon: {
        icon: 'geshi_tongyongshipin',
        style: {
          fill: '#2987EB',
          fontSize: '48px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Upload',
            text: '上传视频素材',
            icon: 'shangchuan'
          },
          {
            type: 'Sync',
            text: '同步视频素材',
            icon: 'tongbu'
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete'
          }
        ],
        showAlertIcon: false
      },
      edit: {
        width: '600px',
        title: '上传视频',
        formLoading: false,
        form: {
          'title': '',
          'introduction': '',
          uploadFile: '',
          appId: this.id
        },
        buttons: [
          {
            text: '确认',
            type: 'Submit'
          }
        ],
        rules: {
          title: [this.$rules.required()],
          introduction: [this.$rules.required()],
          uploadFile: [this.$rules.required()]
        },
        formItems: [
          {
            label: '视频标题',
            prop: 'title',
            maxlength: 50
          },
          {
            type: 'textarea',
            label: '视频描述',
            prop: 'introduction',
            maxlength: 50
          },
          {
            type: 'slot',
            label: '视频上传',
            prop: 'uploadFile'
          }
        ]
      },
      uploadData: {
        icon: 'shangchuanicon',
        type: 'video',
        option: {
          autoUpload: false,
          size: '10', // 大小
          unit: 'MB', // 大小单位
          desc: '只能上传.mp4 文件，文件不能大于 10M',
          type: ['mp4']
        }
      }
    }
  },
  methods: {
    //  同步
    handleHeaderSync (btn) {
      if (this.id) {
        this.$request.fetchWechatMaterialSynchMaterial({ appId: this.id, type: 'video' }).then(res => {
          this.$restBack(res, () => {
            this.fetchTableApi()
          }, '同步成功')
        })
      }
    },
    handleConfirmAdd (form) {
      let { uploadFile } = form
      uploadFile.append('appId', this.id)
      uploadFile.append('title', form.title)
      uploadFile.append('introduction', form.introduction)
      this.$request.fetchWechatMaterialVideoAdd(uploadFile).then(res => {
        this.$restBack(res, () => {
          this.fetchTableApi()
        }, '新增成功')
      })
    },
    getList () {
      if (this.id && this.name === 'video') {
        this.list.api = 'fetchWechatMaterialPage'
        this.list.params.type = 'video'
        this.list.params.appId = this.id
        this.fetchTableApi()
      }
    }
  },
  watch: {
    id (newVal) {
      this.getList()
    },
    name (newVal, oldVal) {
      this.getList()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getList()
    })
  }
}
</script>
