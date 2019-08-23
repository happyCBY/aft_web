import Vue from 'vue'
export default {
  /**
     *ajax的封装（post）
     * @param funcUrl  请求的方法地址
     * @param argsData 入参
     * @param successFunc 成功的回调函数
     * @param errorFunc 失败的回调函数
     */
  post: function (funcName, argsData, successFunc) {
    let UA = navigator.userAgent
    let TOKEN = 'dreamtouch'
    window.$axios.post(funcName, {
      args: argsData,
      token: TOKEN,
      deviceinfo: UA
    }).then(function (res) {
      successFunc(res.data)
    }).catch(function (error) {
      console.log('Error', error.message)
    })
  }

}
Vue.filter('enumFormat', function (enumValue, enumType) {
  var result = '--'
  enumType = parseInt(enumType)
  enumValue = parseInt(enumValue)
  for (var i = 0; i < window.$constant.ICP_VALUE_ENUM_MAPPING.length; i++) {
    if (window.$constant.ICP_VALUE_ENUM_MAPPING[i].type === enumType) {
      var temp = window.$constant.ICP_VALUE_ENUM_MAPPING[i].data
      for (var j = 0; j < window.$constant.ICP_VALUE_ENUM_MAPPING[i].data.length; j++) {
        if (window.$constant.ICP_VALUE_ENUM_MAPPING[i].data[j].key === enumValue) {
          result = window.$constant.ICP_VALUE_ENUM_MAPPING[i].data[j].value
          break
        }
      }
      break
    }
  }
  return result
})
Vue.filter('noDataFormat', function (value) {
  if (value === '' || value === null || value === undefined || window.isNaN(value)) {
    return '--'
  } else {
    return value
  }
})
