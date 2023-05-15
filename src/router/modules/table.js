/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '表单查询',
    icon: 'table'
  },
  children: [
    {
      path: 'studentTable',
      component: () => import('@/views/table/studentTable.vue'),
      name: 'studentTable',
      meta: { title: '学生查询' }
    },
    {
      path: 'teacherTable',
      component: () => import('@/views/table/teacherTable.vue'),
      name: 'teacherTable',
      meta: { title: '教师查询' }
    },
    {
      path: 'RoomTable',
      component: () => import('@/views/table/RoomTable.vue'),
      name: 'RoomTable',
      meta: { title: '琴房查询' }
    },
    {
      path: 'history',
      component: () => import('@/views/table/history'),
      name: 'History',
      meta: { title: '历史记录' }
    }
  ]
}
export default tableRouter
