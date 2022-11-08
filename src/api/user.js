import request from '@/utils/request'

// 登录接口封装
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 根据用户ID获取用户详情
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}

