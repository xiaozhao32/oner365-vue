<template>
	<div class="app-container">

	<el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-platform"
          size="mini"
          @click="handleZipkin"
        >服务监控</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-operation"
          size="mini"
          @click="handleRefreshConfig"
        >配置刷新</el-button>
      </el-col>
      
    </el-row>

    <el-table v-loading="loading" :data="dataList" >
      <el-table-column type="selection" width="55" align="center" prop="id" />
      <el-table-column label="服务名称" prop="[0].serviceId" />
      <el-table-column label="服务器 ip" prop="[0].host" align="center" width="150" />
      <el-table-column label="端口" align="center" width="70">
      	<template slot-scope="scope">
          <el-tag type="danger">{{ scope.row[0].port }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="70">
      	<template slot-scope="scope">
          <el-tag>{{ scope.row[0].scheme }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="handleUploadView(scope.row)"
          >上传</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-key"
            @click="handleReset(scope.row)"
          >重启服务</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >详细</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="handleLog(scope.row)"
          >日志</el-button>
        </template>
      </el-table-column>
    </el-table>
	

	<el-dialog title="" :visible.sync="open" width="1040px" append-to-body>
	  <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发布类型：">{{ form.activeProfiles }}</el-form-item>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="propertySources" >
          <el-table-column label="名称" prop="name" width="200" />
          <el-table-column width="800">
            <template slot-scope="scope">
        	  <table cellspacing="0" width="100%">
		        <tbody>
		          <tr v-for="(item,index) in scope.row.properties">
		            <td width="30%">{{index}}</td>
		            <td width="70%">{{item}}</td>
		          </tr>
		        </tbody>
		      </table>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
	</el-dialog>

	<el-dialog title="" :visible.sync="openUpload" width="700px" append-to-body>
	  <el-form ref="uploadForm" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-upload
			  class="upload-demo"
			  ref="upload"
			  action="#"
			  :on-preview="handlePreview"
			  :on-remove="handleRemove"
			  :on-exceed="handleExceed"
			  :file-list="fileList"
			  :limit="1"
			  :auto-upload="false">
			  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
			</el-upload>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openUpload = false">关 闭</el-button>
      </div>
	</el-dialog>

	</div>
</template>

<script>
import { listService, changeStatus, refreshConfig, resetService, uploadService, getActuatorEnv } from "@/api/monitor/service";
import { downLoadZip } from "@/utils/zipdownload";

export default {
	name: "Service",
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
	        openUpload: false,
	        visible: false,
		    // 表单参数
      		form: {},
			// 表格数据
			dataList: [],
			propertySources: [],
			// 状态数据字典
		    statusOptions: [],
		    fileList: [],
		    host: undefined,
		    serviceId: undefined
		};
	},
	created() {
		this.getList();
		this.getDicts("sys_normal_disable").then(response => {
			this.statusOptions = response;
	    });
	},
	methods: {
		// 表单重置
	    reset() {
	      this.form = {
	      };
	      this.resetForm("form");
	      this.resetForm("uploadForm");
	    },
		/** 查询信息 */
		getList() {
			this.loading = true;
			listService().then(response => {
				this.dataList = response;
				this.loading = false;
			});
		},
		handleStatusChange(row) {
	      let text = row.status === "1" ? "启用" : "停用";
	      this.$confirm('确认要"' + text + '"吗?', "警告", {
	          confirmButtonText: "确定",
	          cancelButtonText: "取消",
	          type: "warning"
	        }).then(function() {
	          return changeStatus(row[0].serviceId, row.status);
	        }).then(() => {
	          this.msgSuccess(text + "成功");
	        }).catch(function() {
	          row.status = row.status === "0" ? "1" : "0";
	        });
	    },
	    /** 详细信息 */
	    handleView(row) {
	      const uri = row[0].uri
	      getActuatorEnv(uri).then(response => {
	        this.reset();
	        this.form = response;
	        this.propertySources = response.propertySources;
	        this.open = true;
      	    this.title = "查看服务详情";
      	  });
	    },
	    /** 日志 */
	    handleLog(row) {
	      this.$confirm('是否下载 "' + row[0].serviceId + '" 日志?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
          	var uri = '/monitor/service/getLog?ip='+row[0].host+'&serviceName='+row[0].serviceId;
            return downLoadZip(uri);
          }).then(() => {
            this.getList();
            this.msgSuccess("正在导出日志...");
          }).catch(function() {});
	    },
	    handleUploadView(row) {
	      this.host = row[0].host;
	      this.serviceId = row[0].serviceId;
	      
	      this.openUpload = true;
      	  this.title = "查看服务详情";
      	  
	    },

	    submitUpload() {
	      var formData = new FormData();
	      formData.append('multipartFile', this.$refs.upload.uploadFiles[0].raw);
          uploadService(formData, this.host, this.serviceId).then(response => {
            if (response != '') {
              this.openUpload = false;
              this.msgSuccess("上传成功");
            }
            this.visible = false;
            this.fileList = [];
          });
        },
	    handleRemove(file, fileList) {
          console.log(file, fileList);
          return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handlePreview(file) {
          console.log(file);
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
	    
	    /** 重启服务 */
	    handleReset(row) {
	      this.$confirm('是否重启 "' + row[0].serviceId + '" 服务?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return resetService(row[0].host, row[0].serviceId);
          }).then(() => {
            this.getList();
            this.msgSuccess("重启服务成功!");
          }).catch(function() {});
	    },
	    handleZipkin() {
		  this.$router.push("/monitor/service/data");
		},
	    /** 刷新Config配置 */
	    handleRefreshConfig() {
	      refreshConfig().then(response => {
	      	this.getList();
	        this.msgSuccess("刷新配置成功!");
	      });
	    }
	}
	
};
</script>