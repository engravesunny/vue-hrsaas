<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addDepartment } from '@/api/departments'
import { getDepartments, getDepartDetail, editDepartDetail } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'HrsaasAddDept',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rules, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      // 找出所有同级部门的子部门
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经存在${value}`)) : callback()
    }
    const checkCodeRepeat = async(rules, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构下已存在${value}`)) : callback()
    }
    return {
      formData: {
        name: '',
        manager: '',
        code: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '此项为必填项', trigger: 'blur' }, { min: 1, max: 50, message: '长度应为1-50字符' }, {
          validator: checkNameRepeat, trigger: 'blur'
        }],
        manager: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        code: [{ required: true, message: '此项为必填项', trigger: 'blur' }, { min: 1, max: 50, message: '长度应为1-50字符' }, {
          validator: checkCodeRepeat, trigger: 'blur'
        }],
        introduce: [{ required: true, message: '此项为必填项', trigger: 'blur' }, { min: 1, max: 50, message: '长度应为1-30 0字符' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  mounted() {

  },

  methods: {
    async getEmployeeSimple() {
      const result = await getEmployeeSimple()
      this.peoples = result
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            await editDepartDetail(this.formData)
          } else {
            await addDepartment({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      this.formData = {
        name: '',
        manager: '',
        code: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields()
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
