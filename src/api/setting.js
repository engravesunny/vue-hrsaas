import request from '@/utils/request'

/**
 * 获取角色列表
 */

export const getRoleList = params => request({
  url: '/sys/role',
  params
})

/**
 * 删除角色
*/

export const deleteRole = id => request({
  url: `/sys/role/${id}`,
  method: 'DELETE'
})

/**
 * 修改角色
 */

export const updateRole = data => request({
  url: `/sys/role/${data.id}`,
  method: 'put',
  data
})

/**
 * 获取角色详情
 */

export const getRoleDetail = id => request({
  url: `/sys/role/${id}`
})

/**
 * 新增角色
 */

export function addRole(data) {
  return request({
    url: 'sys/role',
    method: 'post',
    data
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

