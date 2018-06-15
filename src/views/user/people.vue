<template>
  <div class="app-container">
    <el-form
    :inline="true"
    :model="queryForm">
      <el-form-item label="">
        <el-input placeholder="姓名或账户" v-model="queryForm.title" @keyup.enter.native="paginate(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="paginate(1)">搜索</el-button>
        <el-button @click="addUser">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="list"
    v-loading.body="listLoading"
    element-loading-text="Loading"
    header-row-class-name="el-table-head"
    border stripe fit highlight-current-row
    >
      <!-- <el-table-column align="center" label='ID' width="50">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column> -->
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="公司" prop="company"></el-table-column>
      <el-table-column label="部门" prop="depart"></el-table-column>
      <el-table-column label="职位" prop="place"></el-table-column>
      <el-table-column label="职称" prop="title"></el-table-column>
      <el-table-column label="学历" prop="education"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <!-- <el-table-column class-name="status-col" label="身份" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.rule | statusFilter">{{scope.row.rule}}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="备注" prop="note" width="110"></el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="130">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column fixed="right" label="操作" min-width="130">
        <template slot-scope="scope">
          <router-link :to="{ path: '/example' }">
            <el-button type="text" size="small" @click.prevent.stop="onUpdate(scope.row.id, scope.row.channel)">编辑</el-button>
          </router-link>
          <el-button type="text" size="small" @click="onRemove(scope.row.id)" :disabled="!!scope.row.status">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { getUserList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      queryForm: {
        name: '', // name or account
      },
      pagination: {
        current_page: 1,
        per_page: 20, // 固定不变
        total: 0,
      },
    }
  },
  filters: {
    sexFilter(value) {
      const sexMap = ['未知', '男', '女'];
      return sexMap[value];
    },
    statusFilter(status) {
      const statusMap = {
        // published: 'success',
        // draft: 'gray',
        // deleted: 'danger',
        admin: 'danger',
        manager: 'danger',
        general: 'primary',
        anonymous: 'gray',
      };
      return statusMap[status];
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getUserList({
        ...this.listQuery,
      }).then((res) => {
        this.list = res.data.items
        this.listLoading = false
      })
    },
    paginate(num) {
      // console.log(num);
      getUserList(num);
    },
    addUser() {
      // 添加用户
    },
    onUpdate(...rest) {
      console.log(rest);
    },
    onChangeStatus(...rest) {
      console.log(rest);
    },
    onRemove(id) {
      this.$confirm('确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.onDelete(id);
      }).catch(() => {

      });
    },
    onDelete(id) {
      this.$api.removeZt({ id }).then((res) => {
        this.$message({
          message: '删除成功',
          type: 'success',
        });
        this.paginate(this.pagination.current_page);
      }).catch((err) => {

      })
    },
  },
}
</script>
