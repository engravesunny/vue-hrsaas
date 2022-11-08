<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">新增角色</el-button>
            <el-table border :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination layout="prev,pager,next" :page-size="page.pagesize" :current-page="page.page" :total="page.total" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert type="info" :show-icon="true" :closable="false" title="对公司名称，公司地址，营业执照，公司地区的更新，将使得公司资料被重新审核" />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" :rows="3" disabled style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组建 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleData" :model="rowForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="rowForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rowForm.description" />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button @click="btnCancel">取消</el-button>
          <el-button type="primary" @click="btnOK">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置一个弹层 -->
    <el-dialog :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限树 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :check-strictly="true"
        :show-checkbox="true"
        node-key="id"
        :default-checked-keys="selectCheck"
      />
      <!-- 确定取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      list: [],
      showPermDialog: false,
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 5,
        total: 0
      },
      roleId: '',
      selectCheck: [],
      permData: [],
      showDialog: false,
      defaultProps: {
        label: 'name'
      },
      rowForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '角色名称不能为空' }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage为当前点击的页码
      this.page.page = newPage
      this.getRoleList()
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除吗')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
        console.log(id)
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.rowForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async assignPerm(id) {
      const result = await getPermissionList()
      this.permData = tranListToTreeData(result, '0')
      this.roleId = id
      // permIds 当前角色有的权限点数据
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds // 将当前按角色拥有的权限id赋值
      this.showPermDialog = true
    },
    btnCancel() {
      this.showDialog = false
      this.rowForm = {}
      this.$refs.roleData.resetFields()
    },
    async btnOK() {
      try {
        await this.$refs.roleData.validate()
        if (this.rowForm.id) {
          await updateRole(this.rowForm)
        } else {
          // 新增业务
          await addRole(this.rowForm)
        }
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    async btnPermOK() {
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

<style>

</style>
