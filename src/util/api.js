const superagent = require('superagent')
const service = require('../config.js').servers.api
  // const inBrowser = typeof window !== 'undefined'
  // When using bundleRenderer, the server-side application code runs in a new
  // context for each request. To allow caching across multiple requests, we need
  // to attach the cache to the process which is shared across all requests.
  // const cache = inBrowser
  //   ? null
  //   : (process.__API_CACHE__ || (process.__API_CACHE__ = createCache()))

// function createCache () {
//   return LRU({
//     max: 1000,
//     maxAge: 1000 * 60 * 15 // 15 min cache
//   })
// }
const applyTpMap = {
  ALL: '9',
  WAP: '1',
  APP: '2',
  PC: '3',
  OTHER: '4'
}

//fetch
export function fetchItem(url) {
  let st = new Date().getTime();
  return new Promise((resolve, reject) => {
    superagent
      .get(service + url)
      .withCredentials()
      .end((err, response) => {
        if (err) {
          reject({
            code: '1',
            message: 'error!' + url
          })
          return;
        }
        const result = response.body;
        console.log(response.status);
        console.log(service + url, result.code, result.desc, result.result);
        console.log('use ', new Date().getTime() - st);
        if (result.code === 1) {
          resolve(result.result);
        } else if (result.code) {
          reject(result)
        } else {
          reject({
            code: 0,
            message: '获取数据失败，请稍后重试'
          })
        }
      })
  }).catch((err) => {
    if (err.code && err.code == -9) {
        let loginUrl =err.loginUrl || 'https://github.com/ids/login';

        window.location.href = loginUrl
    } else if (err.code == -1) {
      alert('接口异常')
    }
  })
}

//fecth with search
export function fetchSearchItems(query) {
  return new Promise((resolve, reject) => {
    superagent
      .get(service + query.url)
      .query(query.params)
      .withCredentials() //跨域传cookie证书
      .end((err, response) => {
        if (err) {
          console.log('error!' + query.url);
          return
        }
        console.log('success!' + query.url);
        const result = response.body;
        if (result.code === 1) { //请求成功
          resolve(result.result);
        } else if (result.code) { //请求失败有错误码
          reject(result)
        } else { //请求失败
          reject({
            code: 0,
            message: '获取数据失败，请稍后重试'
          })
        }
      })
  }).catch((err) => {
    if (err.code && err.code == -9) {
        let loginUrl =err.loginUrl || 'http://github.com';

      window.location.href = loginUrl
    } else if (err.code == -1) {
      alert('接口异常')
    }
  })
}