<template>
  <div class="app-container">
    <div class="show-d">
      <el-tag>预约状态码 :</el-tag>
      <el-tag>（0为未开始，1为正常结束，2为迟到，3为违约）</el-tag>
    </div>
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
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="changePage"
    />
  </div>
</template>

<script>
import { getReserveByFuzzyQuery } from '@/api/table'
import Pagination from '@/components/Pagination'
export default {
  name: 'DragTable',
  components: { Pagination },
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
      list: [],
      total: 0,
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
        this.list = res.data.list
        this.listLoading = false
        this.total = res.data.total
        console.log('total', this.total)
      })
    },
    getStatusText(row) {
      if (row.status === 0) return '尚未开始'
      else if (row.status === 1) return '准时记录'
      else if (row.status === 2) return '迟到记录'
      else if (row.status === 3) return '违约记录'
    },
    changePage() {
      this.getData()
    }
  }
}
</script>
<style scoped>
.show-d{
  padding: 15px;
}
</style>
