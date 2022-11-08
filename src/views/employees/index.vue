<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像" align="center">
            <template v-slot="{row}">
              <img v-imagerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto" alt="" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px">
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column label="聘用形式" :formatter="formatEmployment" prop="formOfEmployment" sortable="" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" prop="enableState" sortable="">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmploy(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <add-employee :show-dialog.sync="showDialog" />
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import AssignRole from './components/assign-role.vue'
import { getEmployeeList, delEmploy } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false, // 显示遮罩层
      showDialog: false,
      showRoleDialog: false,
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      console.log(this.list)
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      // eslint-disable-next-line
      const obj = EmployeeEnum.hireType.find(item => item.id == cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmploy(id) {
      try {
        await this.$confirm('确定删除该员工吗')
        await delEmploy(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    },
    exportData() {
      //   username: '',姓名
      //   mobile: '', 手机号
      //   formOfEmployment: '',
      //   workNumber: '',工号
      //   departmentName: '',
      //   timeOfEntry: '',入职日期
      //   correctionTime: ''转正日期
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 复杂表头
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      // 合并单元格
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      import('@/vendor/Export2Excel').then(async excel => {
        // 导出 header Object.keys()
        // data
        // 只能获取每单页数据， 无法获取全部数据
        // 设置每页条数为 100 1000 10000 this.total√
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJSON(headers, rows)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader,
          merges
        })
      })
    },
    // return  [[]]
    formatJSON(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          } else {
            return item[headers[key]]
          }
        })
        // ['132','张三']
      })
      // [['132','张三'],['21312','李四']]
      // 个别格式处理
    }
  }
}
</script>

<style>

</style>
