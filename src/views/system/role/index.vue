<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          id="roleName"
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          id="status"
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.itemCode"
            :label="dict.itemName"
            :value="dict.itemCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" id="dateRange">
        <el-date-picker
          id="daterange"
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" prop="id" />
      <el-table-column label="角色编号" prop="roleCode" width="200" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="200" />
      <el-table-column label="角色描述" prop="roleDes" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            name="status"
            v-model="scope.row.status"
            active-value="YES"
            inactive-value="NO"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色编号" prop="roleCode">
          <el-input id="roleCode" v-model="form.roleCode" prefix-icon="el-icon-share" placeholder="请输入角色编号" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input id="roleName" v-model="form.roleName" prefix-icon="el-icon-s-flag" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group id="status" v-model="form.status">
            <el-radio
              name="itemCode"
              v-for="dict in statusOptions"
              :key="dict.itemCode"
              :label="dict.itemCode"
            >{{dict.itemName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="系统菜单">
          <el-select
            id="menuType"
            v-model="form.menuType"
            placeholder="请选择系统菜单"
            size="small"
            style="width: 240px"
            @change="changeMenuType"
          >
            <el-option
              v-for="type in menuTypeOptions"
              :key="type.id"
              :label="type.typeName"
              :value="type.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            id="menuId"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="请选择系统菜单"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注" prop="roleDes">
          <el-input id="roleDes" v-model="form.roleDes" type="textarea" placeholder="请输入内容"></el-input>
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
import { listRole, getRole, delRole, saveRole, dataScope, changeRoleStatus, checkRoleName } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect, listMenuType } from "@/api/system/menu";
import { treeselect as orgTreeselect, roleOrgTreeselect } from "@/api/system/org";
import { exportFile } from "@/utils/zipdownload";

export default {
  name: "Role",
  data() {

    var validateCode = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('角色名称不能为空'));
      } else {
        const id = this.form.id;
        checkRoleName(id, value).then(response => {
          if (response === true) {
            callback(new Error('角色名称已存在'));
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
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      menuTypeOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
        {
          value: "2",
          label: "自定数据权限"
        },
        {
          value: "3",
          label: "本部门数据权限"
        },
        {
          value: "4",
          label: "本部门及以下数据权限"
        },
        {
          value: "5",
          label: "仅本人数据权限"
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      orgOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        roleName: undefined,
        roleCode: undefined,
        status: undefined,
        order: {
          key: 'updateTime',
          val: 'desc' 
        }
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, validator: validateCode, trigger: "blur" }
        ],
        roleCode: [
          { required: true, message: "角色编号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_status").then(response => {
      this.statusOptions = response;
    });
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.content;
          this.total = response.totalElements;
          this.loading = false;
        }
      );
    },
    getMenuTypeList() {
      listMenuType().then(response => {
        this.menuTypeOptions = response;
      });
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 查询部门树结构 */
    getOrgTreeselect() {
      orgTreeselect().then(response => {
        this.orgOptions = response;
      });
    },
    // 所有部门节点数据
    getOrgAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.org.getHalfCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.org.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(id, menuTypeId) {
      return roleMenuTreeselect(id, menuTypeId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 获取菜单类型 */
    changeMenuType(id) {
      const roleMenu = this.getRoleMenuTreeselect(this.form.id, id);
      this.$nextTick(() => {
          roleMenu.then(res => {
            this.$refs.menu.setCheckedKeys(res.checkedKeys);
          });
        });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "YES" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeRoleStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "NO" ? "YES" : "NO";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        menuType: "",
        status: "YES",
        menuIds: [],
        orgIds: [],
        roleDes: undefined
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.names = selection.map(item => item.roleName)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.menuOptions = [];
      this.getMenuTypeList();
      this.open = true;
      this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.menuOptions = [];      
      this.getMenuTypeList();
      const id = row.id || this.ids
      
      getRole(id).then(response => {
        this.form = response;
        this.open = true;
        
        this.title = "修改角色";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.menuIds = this.getMenuAllCheckedKeys();
          saveRole(this.form).then(response => {
            if (response.code === 1) {
              this.msgSuccess("保存成功");
            } else {
              this.msgError(response.msg);
            }
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.id != undefined) {
        this.form.orgIds = this.getOrgAllCheckedKeys();
        dataScope(this.form).then(response => {
          if (response.code === 1) {
            this.msgSuccess("修改成功");
            this.openDataScope = false;
            this.getList();
          }
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = [row.id];
      if (row.id == undefined)
        ids = this.ids;
      const names = row.roleName || this.names;
      this.$confirm('是否确认删除角色 "' + names + '" ?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRole(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      var beginTime = '';
      var endTime = '';
      if (this.queryParams.beginTime != undefined && this.queryParams.endTime != undefined) {
        beginTime = this.queryParams.beginTime;
        endTime = this.queryParams.endTime;
      }
      var data = {
        whereList: [
          { key: 'roleName', opt: 'like', val: this.queryParams.roleName },
          { key: 'status', opt: 'enum', val: this.queryParams.status },
          { key: 'createTime', opt: 'be', val: beginTime + '|' + endTime }
        ]
      }
      const url = '/system/role/export';
      this.$confirm('是否确认导出所有数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        exportFile(url, data);   	
      });
    }
  }
};
</script>
