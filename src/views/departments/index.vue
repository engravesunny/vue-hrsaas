<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 -->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @showDialog="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps">
          <!-- 传入内容 插槽内容 会循环节点数目次数 -->
          <!-- 作用域插槽 slot-scope='obj' 接收传递给插槽的数据 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @showDialog="addDepts" @delDepts="getDepartments" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import TreeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    addDept
  },
  data() {
    return {
      company: {}, // 就是头部的数据结构
      defaultProps: {
        label: 'name'
      },
      departs: [],
      showDialog: false,
      node: null,
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      try {
        const data = await getDepartments()
        this.company = { name: data.companyName, manager: '负责人', id: '' }
        this.departs = tranListToTreeData(data.depts, '') // 需要将其转化为树形结构
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card{
  padding: 30px  140px;
  font-size:14px;
}
</style>
