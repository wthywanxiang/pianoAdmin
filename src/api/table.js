import request from '@/utils/request'

export function getStudentDetailsByFuzzyQuery(data) {
  return request({
    url: '/api/getStudentDetailsByFuzzyQuery',
    method: 'post',
    data
  })
}
export function addStudent(data) {
  return request({
    url: '/api/addStudent',
    method: 'post',
    data
  })
}
export function deleteStudent(data) {
  return request({
    url: '/api/deleteStudent',
    method: 'post',
    data
  })
}
export function getTeacherDetailsByFuzzyQuery(data) {
  return request({
    url: '/api/getTeacherDetailsByFuzzyQuery',
    method: 'post',
    data
  })
}
export function addTeacher(data) {
  return request({
    url: '/api/addTeacher',
    method: 'post',
    data
  })
}
export function deleteTeacher(data) {
  return request({
    url: '/api/deleteTeacher',
    method: 'post',
    data
  })
}
export function getRoomByFuzzyQuery(data) {
  return request({
    url: '/api/getRoomByFuzzyQuery',
    method: 'post',
    data
  })
}
export function addRoom(data) {
  return request({
    url: '/api/addRoom',
    method: 'post',
    data
  })
}
export function deleteRoom(data) {
  return request({
    url: '/api/deleteRoom',
    method: 'post',
    data
  })
}
export function getReserveByFuzzyQuery(data) {
  return request({
    url: '/api/getReserveByFuzzyQuery',
    method: 'post',
    data
  })
}
