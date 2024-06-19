import request from '@/utils/request'

export function getStudentDetailsByFuzzyQuery(data) {
  return request({
    url: '/api/admin/getStudentDetailsByFuzzyQuery',
    method: 'post',
    data
  })
}
export function addStudent(data) {
  return request({
    url: '/api/admin/addStudent',
    method: 'post',
    data
  })
}
export function deleteStudent(data) {
  return request({
    url: '/api/admin/deleteStudent',
    method: 'post',
    data
  })
}
export function getTeacherDetailsByFuzzyQuery(data) {
  return request({
    url: '/api/admin/getTeacherDetailsByFuzzyQuery',
    method: 'post',
    data
  })
}
export function addTeacher(data) {
  return request({
    url: '/api/admin/addTeacher',
    method: 'post',
    data
  })
}
export function deleteTeacher(data) {
  return request({
    url: '/api/admin/deleteTeacher',
    method: 'post',
    data
  })
}
export function getRoomByFuzzyQuery(data) {
  return request({
    url: '/api/admin/getRoomByFuzzyQuery',
    method: 'post',
    data
  })
}
export function addRoom(data) {
  return request({
    url: '/api/admin/addRoom',
    method: 'post',
    data
  })
}
export function deleteRoom(data) {
  return request({
    url: '/api/admin/deleteRoom',
    method: 'post',
    data
  })
}
export function getReserveByFuzzyQuery(data) {
  return request({
    url: '/api/admin/getReserveByFuzzyQuery',
    method: 'post',
    data
  })
}
