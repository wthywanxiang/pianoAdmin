<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加成员</el-button>

    <el-table :data="rolesList" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="身份" width="220">
        <template slot-scope="scope">
          {{ scope.row.rank===1?'admin':'vistors' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.introduction }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="密码">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="role.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.introduction"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="role.password"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="密码"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false"
          >Cancel</el-button
        >
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>np
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from '@/utils'
import {
  deleteUser,
  checkBackUser,
  addUser
} from '@/api/role'

const defaultRole = {
  key: "",
  name: "",
  description: "",
  routes: [],
};

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  computed: {
  },
  created() {
    this.checkBackUser()
  },
  methods: {
    handleAddRole() {
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
      }
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleDelete({ $index, row }) {
      this.$confirm("确认删除该角色？", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log('row.id',row.id)
          deleteUser({
            id:row.id,
          }).then( res =>{
            this.checkBackUser()
            this.$notify({
              title: "删除成功",
              dangerouslyUseHTMLString: true,
              message: `
              <div>成功删除用户</div>
            `,
              type: "success",
            });
          })
        })
        .catch((err) => {
          console.error(err);
        });
    },
    checkBackUser(){
      checkBackUser().then((res)=>{
        console.log('res' , res);
        this.rolesList=res.data
      })
    },
    generateTree(routes, basePath = "/", checkedKeys) {
      const res = [];

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path);

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          );
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route);
        }
      }
      return res;
    },
    async confirmRole() {
      addUser(this.role).then(()=>{
        this.dialogVisible = false;
        this.$notify({
          title: "新建成功",
          dangerouslyUseHTMLString: true,
          message: `
              <div>新建用户成功</div>
            `,
          type: "success",
        });
        this.checkBackUser()
      })

    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null;
      const showingChildren = children.filter((item) => !item.hidden);

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0];
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path);
        return onlyOneChild;
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return onlyOneChild;
      }

      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
