<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="主键" prop="id">
        <el-input
          id="id"
          v-model="queryParams.id"
          placeholder="请输入主键"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实验室编号" prop="initServerNo" :inline="true" label-width="98px">
        <el-input
          id="initServerNo"
          v-model="queryParams.initServerNo"
          placeholder="请输入实验室编号"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="人员编号" prop="personCode" :inline="true" label-width="98px">
        <el-input
          id="personCode"
          v-model="queryParams.personCode"
          placeholder="请输入人员编号"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>
    
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" prop="id" />
      <el-table-column label="主键" align="center" prop="id" width="200" />
      <el-table-column label="实验室编号" align="center" prop="initServerNo" width="98" />
      <el-table-column label="人员编号" align="center" prop="personCode" width="80" />
      <el-table-column label="基因类型" align="center" prop="geneType" width="200">
      	<template slot-scope="scope">
          <el-radio-group name="geneType" v-model="scope.row.geneType" size="small">
	        <el-radio-button name="X" label="X">X</el-radio-button>
	        <el-radio-button name="Y" label="Y">Y</el-radio-button>
	      </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" prop="geneInfo" :show-overflow-tooltip="false">
        <template slot-scope="scope">
          {{ scope.row.geneInfo }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
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
    
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-form-item label="主键" prop="id">
          <el-input id="id" v-model="form.id" prefix-icon="el-icon-s-flag" placeholder="请输入主键" />
        </el-form-item>
        <el-form-item label="实验室编号" prop="initServerNo">
          <el-input id="initServerNo" v-model="form.initServerNo" prefix-icon="el-icon-user-solid" placeholder="请输入实验室编号" />
        </el-form-item>
        <el-form-item label="人员编号" prop="personCode">
          <el-input id="personCode" v-model="form.personCode" prefix-icon="el-icon-s-goods" placeholder="请输入人员编号" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="基因类型">
              <el-radio-group name="geneType" v-model="form.geneType" size="small">
                <el-radio-button label="X">X</el-radio-button>
                <el-radio-button label="Y">Y</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容"> 
          <el-button type="primary" size="mini" @click="handleInsertGene">添加基因型</el-button>
          <el-table :data="form.geneList">
            <el-table-column prop="name" label="键" width="200">
              <template slot-scope="scope">
                <el-input name="name" v-model="scope.row.name" />
              </template>
            </el-table-column> 
            <el-table-column prop="value" label="值">
              <template slot-scope="scope">
                <el-input name="value" v-model="scope.row.value" />
              </template>
            </el-table-column>
            <el-table-column label="操作" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteGene(scope.$index)">删除</el-button>
              </template>
      </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sampleGeneList, saveSampleGene, getSampleGene, deleteSampleGene } from "@/api/monitor/elasticsearch";
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
        id: '',
        initServerNo: '',
        personCode: ''
      },
      // 表单参数
      form: {
        geneInfo: {}
      },
      dataList: [],
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        initServerNo: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
	this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      sampleGeneList(this.queryParams).then(response => {
    	  this.dataList = response.content;
        this.total = response.totalElements;
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
      this.form = {
        id: '',
    	  initServerNo: '',
    	  geneInfo: {}
      };
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加ES字段";
      this.form.geneList = [];
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSampleGene(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改ES字段";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
        	saveSampleGene(this.form).then(response => {
            if (response != null) {
              this.msgSuccess("保存成功");
            } else {
              this.msgError("保存失败");
            }
            this.open = false;
            this.getList();
          });
        }
      });
    },
	  /** 删除按钮操作 */
    handleDelete(row) {
      let ids = [row.id];
      if (row.id == undefined)
        ids = this.ids;
      this.$confirm('是否确认删除?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return deleteSampleGene(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 动态添加基因型 */
    handleInsertGene() {
      var gene = {
        name: '',
        value: ''
      }
      this.form.geneList.push(gene);
    },
    handleDeleteGene(index) {
      this.form.geneList.splice(index, 1);
    }
  }
};
</script>