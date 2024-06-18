<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="输入名称查找"
        style="width: 200px"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.number"
        placeholder="输入编号查找"
        style="width: 200px"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.grade"
        placeholder="年级"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in grade"
          :key="item.key"
          :label="item.display_name + '级'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.clazz"
        placeholder="班级"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in clazz"
          :key="item.key"
          :label="item.display_name + '班'"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getData"
      >
        查找
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        增加
      </el-button>
      <!--      <el-button-->
      <!--        v-waves-->
      <!--        :loading="downloadLoading"-->
      <!--        class="filter-item"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-download"-->
      <!--        @click="handleDownload"-->
      <!--      >-->
      <!--        导出-->
      <!--      </el-button>-->
      <!--      <el-upload-->
      <!--        class="filter-item"-->
      <!--        drag-->
      <!--        action="https://jsonplaceholder.typicode.com/posts/"-->
      <!--        multiple-->
      <!--      >-->
      <!--        <i class="el-icon-upload" />-->
      <!--        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
      <!--      </el-upload>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="编号"
        prop="id"
        sortable="custom"
        align="center"
        width="150"
      >
        <template slot-scope="{ row }">
          <span>{{ row.tno }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责班级" width="600px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.clazz }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="120px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{
            row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
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

    <el-dialog title="创建教师" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="班级" prop="clazz">
          <el-input v-model="temp.clazz" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="编号" prop="name">
          <el-input v-model="temp.number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="createData() "
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import {
  getTeacherDetailsByFuzzyQuery,
  addTeacher,
  deleteTeacher
} from '@/api/table' // secondary package based on el-pagination

const grade = [
  { key: 2022, display_name: '2022' },
  { key: 2021, display_name: '2021' },
  { key: 2020, display_name: '2020' },
  { key: 2019, display_name: '2019' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = grade.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      clazz: [
        { key: 1, display_name: '1' },
        { key: 2, display_name: '2' },
        { key: 3, display_name: '3' },
        { key: 4, display_name: '4' },
        { key: 5, display_name: '5' },
        { key: 6, display_name: '6' },
        { key: 7, display_name: '7' },
        { key: 8, display_name: '8' },
        { key: 9, display_name: '9' },
        { key: 10, display_name: '10' }
      ],
      grade,
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      roomFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        clazz: [
          { required: true, message: '请填入负责班级', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请填入姓名', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.listQuery.grade === '') {
        this.listQuery.grade = null
      }
      if (this.listQuery.clazz === '') {
        this.listQuery.clazz = null
      }
      getTeacherDetailsByFuzzyQuery(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          addTeacher({
            tno: this.temp.number,
            name: this.temp.name,
            clazz: JSON.parse(this.temp.clazz)
          }).then(() => {
            this.getData()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row, index) {
      console.log(this.$store.getters.roles)
      this.$confirm('此操作将永久删除此教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTeacher({
            tno: row.tno
          }).then(() => {
            this.getData()
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
        .catch(() => {
          this.$notify({
            title: 'fail',
            message: '撤回删除',
            type: 'info',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
    },
    changePage() {
      this.getData()
    }
  }
}
</script>
