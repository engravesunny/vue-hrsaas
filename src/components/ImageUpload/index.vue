<template>
  <div>
    <!-- file-list是上传的文件列表  可以绑定到上传组件上  让组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-change="changeImage"
      :class="{disabled: fileComputed}"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showProgress" :percentage="percent" style="width:180px" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云
const cos = new COS({
  SecretId: 'AKIDCReossjR3X0WwFRYXPAnMD1kP0X1Pm1A', // 身份识别 ID
  SecretKey: '7TippmsuQuHUaZSCoMziOwNhyEUpCVlx' // 身份密钥
})
export default {
  name: 'ImageUpload',

  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      percent: 0,
      showProgress: false,
      currentFileUid: ''
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },

  mounted() {

  },

  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.fileList = fileList
    },
    changeImage(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // console.log(file)
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 如果不存在一个类型为图片类型
        this.$message.error('上传图片类型只能为JPG，GIF，BMP，PNG格式')
        return false // 上传终止
      }
      // 检查文件大小
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showProgress = true
      return true
    },
    upload(params) {
      // console.log(params)
      if (params.file) {
        cos.putObject({
          Bucket: 'images-131415-1314233166',
          Region: 'ap-nanjing',
          Key: params.file.name,
          Body: params.file,
          StorageClass: 'STANDARD',
          onProgress: (params) => {
            this.percent = params.percent * 100
          }

        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            // 上传成功后 更新fileList
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            // 关闭进度条
            //  重置百分比
            setTimeout(() => {
              this.showProgress = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none;
}
</style>
