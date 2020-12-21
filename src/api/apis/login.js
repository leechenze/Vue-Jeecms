import axios from '../axios'
import loginUrls from '../urls/login'

export default {
  fetchSingleLogin (data) {
    return axios.get(loginUrls.singleLogin, data)
  },
  fetchSingleInfo (data) {
    return axios.get(loginUrls.singleInfo, data)
  },
  fetchSingleLoginDetail (data) {
    return axios.get(loginUrls.singleLoginDetail, data)
  },
  fetchSingleLoginUpdate (data) {
    return axios.post(loginUrls.singleLoginUpdate, data)
  },
  fetchCode () {
    return axios.get(loginUrls.code)
  },
  fetchLogin (data) {
    return axios.login(loginUrls.login, data)
  },
  fetchLogout (data) {
    return axios.post(loginUrls.logout, data)
  },
  fetchUpload (data, onUploadProgress) {
    return axios.upload(loginUrls.upload, data, onUploadProgress)
  },
  fetchPinyin (data) {
    return axios.get(loginUrls.pinyin, data)
  },
  fetchSummary (data) {
    return axios.post(loginUrls.summary, data)
  },
  fetchAdminPsw (data) {
    return axios.post(loginUrls.adminpsw, data)
  },
  fetchDocImport (data) {
    return axios.upload(loginUrls.docImport, data)
  },
  fetchRegisterGetImage () {
    return axios.get(loginUrls.registerImg)
  },
  fetchLoginTypeData () {
    return axios.get(loginUrls.loginType)
  },
  fetchLoginSendLogin (data) {
    return axios.get(loginUrls.sendLogin, data)
  }
}
