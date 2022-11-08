<template>
  <div style="width:100%">
    <el-row type="flex" justify="space-between" align="middle" style="height:40px;width:100%">
      <!-- 左侧内容 -->
      <el-col>
        <span>{{ treeNode.name }}</span>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <el-col>
            <span>{{ treeNode.manager }}</span>
          </el-col>
          <el-col>
            <el-dropdown @command="operateDepts">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <!-- 具名插槽 -->
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command="add" :disabled="!checkPermission('add-department')">添加子部门</el-dropdown-item> -->
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  name: 'HrsaasTreeTools',
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {
    // 点击 编辑 删除 新增时触发
    operateDepts(type) {
      if (type === 'edit') {
        // 编辑部门
        this.$emit('editDepts', this.treeNode)
      } else if (type === 'add') {
        // 添加部门
        this.$emit('showDialog', this.treeNode)
      } else if (type === 'del') {
        // 删除部门
        this.$confirm('您确认要删除该部门吗').then(() => {
          return delDepartment(this.treeNode.id)
        }).then(() => {
          this.$emit('delDepts')
          this.$message.success('删除成功')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
