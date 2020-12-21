import SearchHeader from '@/components/header/SearchHeader'

export default {
  components: {
    SearchHeader
  },
  data () {
    return {
      searchHeader: {
        loading: false,
        searchItems: [],
        searchBtns: []
      }
    }
  },
  methods: {
    // 搜索操作
    handleSearch () {
      this.list.pageNo = 1
      this.fetchTableApi()
    }
  }
}
