/**
 * 解析get请求url参数
 */
export function parseUrlParams (opts) {
  let params = {}
  let optsUrls = opts['url'].split('?')
  let optsUrl = optsUrls[optsUrls.length - 1]
  let paramArr = optsUrl.split('&')
  for (let i = 0; i < paramArr.length; i++) {
    let datas = paramArr[i].split('=')
    params[ datas[0] ] = datas[1]
  }
  console.log('params:', params)
  return params
}

/**
 * 排序
 */
export function sortList (dataList, params) {
  console.log('start:sortList->dataList', dataList)
  let compare = function (obj1, obj2) {
    var val1 = obj1[params.sortKey]
    var val2 = obj2[params.sortKey]
    try {
      if (val1 === Number(val1)) {
        val1 = Number(val1)
      }
      if (val2 === Number(val2)) {
        val2 = Number(val2)
      }
    } catch (e) {}
    if (val1 < val2) {
      return params.sortValue === 'descending' ? 1 : -1
    } else if (val1 > val2) {
      return params.sortValue === 'descending' ? -1 : 1
    } else {
      return 0
    }
  }
  let list = dataList.sort(compare)
  console.log('end:sortList->dataList', list)
  return list
}

/**
 * 是否查询
 */
export function needQuery (dataList, params) {
  let result = false
  if (dataList && dataList.length && dataList.length > 0) {
    let data = dataList[0]
    for (let dataKey in data) {
      for (let key in params) {
        if (dataKey === key && params[key] !== '') {
          result = true
          break
        }
      }
    }
  }
  console.log('needQueryResult:', result)
  return result
}

/**
 * 查询字段
 */
export function needQueryKeys (dataList, params) {
  let keys = []
  if (dataList && dataList.length && dataList.length > 0) {
    let data = dataList[0]
    for (let dataKey in data) {
      for (let key in params) {
        if (dataKey === key && params[key] !== '') {
          keys.push(dataKey)
        }
      }
    }
  }
  console.log('needQueryKeys keys:', keys)
  return keys
}

/**
 * 查询
 */
export function queryData (data, params, keys) {
  let result = true
  console.log('queryData keys:', keys)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    console.log('typeof data[' + key + ']:', typeof data[key])
    console.log('typeof params[' + key + ']:', typeof params[key])
    if ((typeof data[key] === 'number' && (data[key] + '') !== params[key]) || (typeof data[key] !== 'number' && data[key] && data[key].indexOf(decodeURIComponent(params[key])) === -1)) {
      result = false
      break
    }
  }
  console.log('result:', result)
  return result
}

/**
 * 查询排序
 */
export function querySortList (dataList, params) {
  if (params.sortKey && params.sortValue) {
    dataList = sortList(dataList, params)
  }
  let list = []
  let keys = needQueryKeys(dataList, params)
  if (keys && keys.length > 0) {
    for (let i = 0; i < dataList.length; i++) {
      if (queryData(dataList[i], params, keys)) {
        list.push(dataList[i])
      }
    }
  } else {
    list = dataList
  }
  console.log('querySortList:', list)
  return list
}

/**
 * 分页
 */
export function pageList (dataList, params) {
  let list = []
  let count = 1
  let start = ((params.page - 1) * params.limit)
  for (let i = 0; i < dataList.length; i++) {
    if (i >= start) {
      list.push(dataList[i])
      count++
      if (count > params.limit) {
        break
      }
    }
  }
  console.log('pageList:', list)
  return list
}
