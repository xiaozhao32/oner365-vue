<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button icon="el-icon-delete" size="mini" type="danger" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
    </el-form>
    
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" prop="name" />
      <el-table-column label="Node" align="center" prop="node" width="140" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="State" align="center" prop="state" width="100">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Ready" align="center" prop="messages_ready" width="80" />
      <el-table-column label="Unacked" align="center" prop="messages_unacknowledged" width="80" />
      <el-table-column label="Since" align="center" prop="idle_since" width="180" />
      <el-table-column label="操作" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    
  </div>
</template>

<script>
import { rabbitmqList,rabbitmqDelete } from "@/api/monitor/rabbitmq";
export default {
  name: "Data",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
    	  pageIndex: 1,
        pageSize: 10,
        name: ''
      },
      // 表单参数
      form: {
      },
      dataList: []
    };
  },
  created() {
	  this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      rabbitmqList('QUEUES', this.queryParams).then(response => {
    	  this.dataList = response.items;
        this.total = response.total_count;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.name)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    
	  /** 删除按钮操作 */
    handleDelete(row) {
      let ids = this.ids;
      if(row.name != undefined) {
        ids = [row.name]
      }

      this.$confirm('是否确认删除为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return rabbitmqDelete('queues', ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>