import request from '@/utils/request'

export function getUserCount() {
  return request({
    url: '/api/admin/getUserCount',
    method: 'post'
  })
}
export function getReverseCount() {
  return request({
    url: '/api/admin/getReverseCount',
    method: 'post'
  })
}
export function getStartCount() {
  return request({
    url: '/api/admin/getStartCount',
    method: 'post'
  })
}

export function getEndCount() {
  return request({
    url: '/api/admin/getEndCount',
    method: 'post'
  })
}
