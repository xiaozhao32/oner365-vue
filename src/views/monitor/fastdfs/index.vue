<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="文件目录" prop="fileDirectory">
        <el-input
          v-model="queryParams.displayName"
          placeholder="请输入文件名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleUpload" >上传</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" prop="id" />
      <el-table-column label="序号" type="index" align="center" width="60">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="文件名称" align="center" prop="fileName">
        <template slot-scope="scope">
          <el-link type="info" @click="handlePreview(scope.row)">{{ scope.row.displayName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="后缀" align="center" prop="fileSuffix" width="90">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.fileSuffix }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="大小" align="center" prop="size" width="90">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.size }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handlePreview(scope.row)">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-share" v-if="scope.row.directory === false" @click="handleDownload(scope.row)">下载</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.directory === false" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog :visible.sync="openImage" title="预览文件">
      <el-image :src="url"></el-image>
    </el-dialog>
    <el-dialog :visible.sync="openPdf" title="预览文件">
      <pdf ref="pdf" :src="url"></pdf>
    </el-dialog>
    
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
                         将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：上传文件到 fdfs 服务</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDirectory, listFile, deleteFile } from "@/api/monitor/fastdfs";
import { downLoadZip, previewPdf } from "@/utils/zipdownload";
import { getToken } from '@/utils/auth'
import pdf from 'vue-pdf'

export default {
  name: "fastdfs",
  components:{
      pdf
  },
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
      openImage: false,
      openPdf: false,
      srcList: [],
      url: undefined,
      // 总条数
      total: 0,
      dataList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        displayName: undefined,
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/files/fdfs/uploadMultipartFile"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 列表 */
    getList() {
      this.openImage = false;
      this.openPdf = false;
      this.loading = true;
      listFile(this.queryParams).then(response => {
        this.dataList = response.content;
        this.total = response.totalElements;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = [row.id];
      if (row.id == undefined)
        ids = this.ids;
      this.$confirm('是否要删除选中文件?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        deleteFile(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 上传按钮操作 */
    handleUpload() {
      this.upload.title = "上传文件";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // 处理导入结果
      this.msgSuccess("文件上传成功");
      //this.$alert(response, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.submit();
    },
    /** 下载按钮操作 */
    handleDownload(row) {
      let url = "/files/fdfs/download?fileUrl="+row.id+"&filename="+row.displayName;
      downLoadZip(url);
    },
    /** 预览 */
    handlePreview(row) {
      if (row.fileSuffix === '') {
    	this.queryParams.fileDirectory = row.fileName;
    	this.getList();
      }
      if (row.fileSuffix === 'jpg' || row.fileSuffix === 'jpeg' 
    		  || row.fileSuffix === 'png') {
        this.url = row.fastdfsUrl + '/' + row.id;
        this.openImage = true;
      }
      if (row.fileSuffix === 'pdf') {
        let url = "/files/fdfs/downloadFile?fileUrl="+row.id;
        previewPdf(url);
      }
    }
  }
}
</script>




