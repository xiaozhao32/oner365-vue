<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="部门编号">
        <el-input
          v-model="queryParams.orgCode"
          placeholder="请输入部门编号"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门名称">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入部门名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.itemCode"
            :label="dict.itemName"
            :value="dict.itemCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="orgList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="orgCode" label="部门编号"  width="260"></el-table-column>
      <el-table-column prop="orgName" label="部门名称"  width="260"></el-table-column>
      <el-table-column prop="orgOrder" label="排序"  width="100"></el-table-column>
      <el-table-column label="状态"  align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
            icon="el-icon-plus" 
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != '0'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门"">
              <treeselect
                v-model="form.parentId"
                :options="orgOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门编号" prop="orgCode">
              <el-input v-model="form.orgCode" prefix-icon="el-icon-share" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="orgName">
              <el-input v-model="form.orgName" prefix-icon="el-icon-s-flag" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别" prop="orgType">
              <el-input-number v-model="form.orgType" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orgOrder">
              <el-input-number v-model="form.orgOrder" controls-position="right" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" prefix-icon="el-icon-user" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" prefix-icon="el-icon-phone-outline" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" prefix-icon="el-icon-document" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.itemCode"
                  :label="dict.itemCode"
                >{{dict.itemName}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrg, getOrg, delOrg, saveOrg, changeStatus, checkOrgCode } from "@/api/system/org";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Org",
  components: { Treeselect },
  data() {
    var validateOrgCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('机构编号不能为空'));
      } else {
        const id = this.form.id;
        checkOrgCode("orgCode", id, value).then(response => {
          if (response.code === 1) {
            callback(new Error('机构编号已存在'));
          } else {
            callback();
          }
        });        
     }
    };
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 表格树数据
      orgList: [],
      // 部门树选项
      orgOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        orgCode: undefined,
        orgName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      queryForm: {},
      // 表单校验
      rules: {
        orgCode: [
          { required: true, validator: validateOrgCode, trigger: "blur" }
        ],
        orgName: [
          { required: true, message: "机构名称不能为空", trigger: "blur" }
        ],
        orgType: [
          { required: true, message: "级别不能为空", trigger: "blur" }
        ],
        orgOrder: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.loading = false;
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response;
    });
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listOrg(this.queryParams).then(response => {
        if (response.length > 0) {
          this.orgList = this.handleTree(response, "id", "parentId", "children", response[0].parentId);
        }
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.orgName,
        children: node.children
      };
    },
    getTreeselect(id) {
   	  const params = {
 	    id: id,
 	    parentId: this.form.parentId
 	  }
      listOrg(params).then(response => {
      	this.orgOptions = [];
        const org = { id: '0', orgName: '顶级机构', children: [] };
        org.children = this.handleTree(response, "id");
        this.orgOptions.push(org);
      });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: '0',
        orgName: undefined,
        orgOrder: 1,
        orgType: 1,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: '1'
      };
      this.resetForm("form");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = {};
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = '0';
      }
      this.getTreeselect(row.id);
      this.open = true;
      this.title = "添加部门";
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要 "' + text + '" "' + row.typeName + '" 吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect(row.id);
      getOrg(row.id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改部门";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveOrg(this.form).then(response => {
            if (response.code === 1) {
              this.msgSuccess("保存成功");
              this.open = false;
              this.getList();
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = [row.id];
      if (row.id == undefined)
        ids = this.ids;
      const names = row.orgName || this.names;
      this.$confirm('是否确认删除 "' + names + '" ?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrg(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>