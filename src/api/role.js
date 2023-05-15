import request from '@/utils/request'

export function checkBackUser() {
  return request({
    url: '/api/admin/checkBackUser',
    method: 'post'
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/admin/deleteUser',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/api/admin/addUser',
    method: 'post',
    data
  })
}
