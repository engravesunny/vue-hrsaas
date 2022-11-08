import request from '@/utils/request'

// 获取组织架构的数据
export const getDepartments = () => request({
  url: '/company/department'
})

// 删除组织架构的部门

export const delDepartment = (id) => request({
  url: `/company/department/${id}`,
  method: 'DELETE'
})

// 新增组织架构部门

export const addDepartment = data => request({
  url: '/company/department',
  method: 'POST',
  data
})

// 获取某个部门的详情
export const getDepartDetail = id => request({
  url: `/company/department/${id}`
})

// 编辑部门详情
export const editDepartDetail = (data) => request({
  url: `/company/department/${data.id}`,
  method: 'put',
  data
})
