<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-input
      v-model="listQuery.sno"
      placeholder="输入学生学号查找"
      style="width: 200px"
      class="filter-item"
    />
    <el-input
      v-model="listQuery.name"
      placeholder="输入学生姓名查找"
      style="width: 200px"
      class="filter-item"
    />
    <el-input
      v-model="listQuery.status"
      placeholder="输入预约状态码查找"
      style="width: 200px"
      class="filter-item"
    />
    <el-input
      v-model="listQuery.roomId"
      placeholder="输入房间号查找"
      style="width: 200px"
      class="filter-item"
    />
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="getData"
    >
      查找
    </el-button>
    <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180px" align="center" label="开始时间">
        <template slot-scope="{row}">
          <span>{{ row.beginTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="结束时间">
        <template slot-scope="{row}">
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="实际开始时间">
        <template slot-scope="{row}">
          <span>{{ row.realBeginTime?row.realBeginTime:'不存在实际开始时间' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="实际结束时间">
        <template slot-scope="{row}">
          <span>{{ row.realEndTime?row.realEndTime:'不存在实际结束时间' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="预约学生姓名">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="预约学生学号">
        <template slot-scope="{row}">
          <span>{{ row.sno }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="琴房号" width="95">
        <template slot-scope="{row}">
          <span>{{ row.roomId }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ getStatusText(row) }}
          </el-tag>
        </template>
      </el-table-column>

    </el-table>
    <div class="show-d">
      <el-tag>预约状态码 :</el-tag>
    </div>
    <div class="show-d">
      <el-tag>（0为未开始，1为正常结束，2为迟到，3为违约）</el-tag>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import Sortable from 'sortablejs'
import { getReserveByFuzzyQuery } from '@/api/table'
export default {
  name: 'DragTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: null,
      oldList: [],
      newList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      getReserveByFuzzyQuery(this.listQuery).then(res => {
        console.log('res', res)
        this.list = res.data
        this.listLoading = false
      })
    },
    getStatusText(row) {
      //
      if (row.status === 0) return '尚未开始'
      else if (row.status === 1) return '准时记录'
      else if (row.status === 2) return '迟到记录'
      else if (row.status === 3) return '违约记录'
    },
    async getList() {
      this.listLoading = true
      const { data } = await fetchList(this.listQuery)
      this.list = data.items
      this.total = data.total
      this.listLoading = false
      this.oldList = this.list.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
