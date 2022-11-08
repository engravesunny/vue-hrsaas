<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <!-- 指定id为唯一属性 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="菜单名称" prop="name" />
        <el-table-column label="权限标识" prop="code" />
        <el-table-column label="概述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type===1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="updatePermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="showDialog" :title="consoleIt" @close="btnCancel">
        <el-form ref="permForm" label-width="120px" :model="formData" :rules="rules">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center" align="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        code: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
      }
    }
  },
  computed: {
    consoleIt() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async delPermission(id) {
      this.$confirm('确认删除该权限吗').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('删除权限成功')
        this.getPermissionList()
      })
    },
    async getPermissionList() {
      // 将数据转化成，带children的树形结构
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    addPermission(type, pid) {
      // type=1访问权限，type=2按钮操作权
      // pid表示当前节点的父节点标识
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    btnOK() {
      this.$refs.permForm.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        } else {
          return addPermission(this.formData)
        }
      }).then(() => {
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permForm.resetFields()
      this.showDialog = false
    },
    async updatePermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
