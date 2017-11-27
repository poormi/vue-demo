import axios from 'axios'

const requeste = async(endpoint, params) => {
  return axios.get(endpoint, {
    params
  }).then(resp => {
    if (resp.data.code === 1) {
      return Promise.resolve(resp.data)
    }
    if (resp.data.code === -9) {
      window.location.href = resp.data.loginUrl
      return
    }
    return Promise.reject(resp.data.code)
  })
}

export 