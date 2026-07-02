<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户姓名" prop="realName">
      <el-input id="realName" v-model="user.realName" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input id="phone" v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input id="email" v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group id="sex" v-model="user.sex">
        <el-radio
            v-for="dict in sexOptions"
            :key="dict.itemCode"
            :label="dict.itemCode"
        >{{dict.itemName}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      sexOptions: [],
      // 表单校验
      rules: {
        realName: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
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
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response;
    });
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            if (response != null) {
              this.msgSuccess("保存成功");
            } else {
              this.msgError("保存失败");
            }
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
