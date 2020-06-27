<template>
  <div class="bg">
    <div class="login">
      <div class="title">计量异常分析系统</div>
      <div class="main-content">
        <form>
          <div class="f-item logo">
            <div class="pic"></div>
          </div>
          <div class="f-item">
            <input
              type="text"
              name="username"
              id="用户名"
              placeholder="用户名"
              v-model="dataForm.userName"
              @keyup.enter = "dataFormSubmit"
            />
          </div>
          <div class="f-item">
            <input type="password" name="password" placeholder="密码" v-model="dataForm.password"  @keyup.enter = "dataFormSubmit"/>
          </div>
          <div class="f-item vadCode">
            <input
              type="text"
              name="validateCode"
              placeholder="验证码"
              maxlength="5"
              v-model="dataForm.captcha"
              @keyup.enter = "dataFormSubmit"
            />
            <a href="javascript:void(0);" title="点击更换验证码">
              <img :src="captchaPath" @click="getCaptcha()" />
            </a>
          </div>
          <div class="f-item subBtn">
            <button id="btnSubmit" type="button" @click="dataFormSubmit()">
              <span v-if="loading">登&nbsp;&nbsp;&nbsp;&nbsp;录</span>
              <span v-else style="pointer-envnts:none;">
                <i class="el-icon-loading"></i>
              </span>
            </button>
            <div class="errorTips">{{errorTips}}</div>
          </div>
        </form>
      </div>
    </div>
    <div class="version">开发版本号:V{{devVersion}}&nbsp;&nbsp;&nbsp;&nbsp;产品版本号:V{{prodVersion}}</div>
  </div>
</template>

<script>
import { getUUID } from '@/utils'
import { Decrypt, Encrypt } from '@/utils/crypto.js'
export default {
  data() {
    return {
      dataForm: {
        userName: 'admin',
        password: 'admin',
        uuid: '',
        captcha: ''
      },
      errorTips: '', // 后台返回的错误提示小时
      captchaPath: '',
      loading: true,
      devVersion:'',   // 开发版本号
      prodVersion:'',   // 产品版本号
    }
  },
  created() {
    this.getCaptcha()
    this.getVersion().then((data)=>{
      this.devVersion = data.devVersion
      this.prodVersion = data.prodVersion
    })
  },
  mounted() {
    // this.getUserIP();
    this.resize()
    // 监听窗口大小改变事件
    window.onresize = () => {
      this.resize()
    }
  },
  computed: {
    isValid() {
      return this.errorTips ? false : true
    },
    homePageName(){
        return this.$store.state.common.homePageName
    }
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      // 用户名非空校验
      if (this.dataForm.userName === '') {
        this.errorTips = '用户名不能为空'
        return
      }
      if (this.dataForm.password === '') {
        this.errorTips = '密码不能为空'
        return
      }
      /* if (this.dataForm.captcha === '') {
        this.errorTips = '验证码不能为空'
        return
      } */
      this.errorTips = ''
      if (this.isValid) {
        this.loading = false
        this.$http({
          url: this.$http.adornUrl('/sys/login'),
          method: 'post',
          data: this.$http.adornData({
            username: this.dataForm.userName,
            // password: this.dataForm.password,
            password: Encrypt(this.dataForm.password),
            uuid: this.dataForm.uuid,
            captcha: this.dataForm.captcha
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.loading = true
            let industryList = []
            this.errorTips = ''
            this.$cookie.set('token', data.token)
            
            this.$router.replace({
              // name: 'home'
              name: this.homePageName
            })
          } else {
            this.loading = true
            this.getCaptcha()
            // this.$message.error(data.msg)
            this.errorTips = data.msg + '...'
          }
        })
      }
    },
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID()
      this.captchaPath = this.$http.adornUrl(
        `/captcha.jpg?uuid=${this.dataForm.uuid}`
      )
    },
    resize() {
      var wH = window.innerHeight // 当前窗口的高度
      var wW = window.innerWidth // 当前窗口的宽度
      // 表示1920的设计图,使用100PX的默认值
      var whdef = 100 / 1920
      if (wW > 1200) {
        var rem = wW * whdef // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
        var html = document.documentElement
        html.style.fontSize = rem + 'px' //适用于PC网站
      } else {
        var rem = 1200 * whdef
        var html = document.documentElement
        html.style.fontSize = rem + 'px'
      }
    },
    checkInput(type) {
      if (type === 'userName') {
        if (this.dataForm.userName === '') {
          this.errorTips = '用户名不能为空'
          return
        }
        this.errorTips = ''
      }
      if (type === 'password') {
        if (this.dataForm.password === '') {
          this.errorTips = '密码不能为空'
          return
        }
        this.errorTips = ''
      }
      if (type === 'captcha') {
        if (this.dataForm.captcha === '') {
          this.errorTips = '验证码不能为空'
          return
        }
        this.errorTips = ''
      }
    },
    getVersion(){
      return new Promise((resolve,reject)=>{
        this.$http({
          url:this.$http.adornUrl('/versions'),
          method:'get'
        }).then(({data})=>{
          resolve(data)
        })
      })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  background-image: url(~@/assets/img/login_bg4.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 16px;
  font-size: 0.16rem;
}

.login {
  width: 1000px;
  width: 10rem;
  // height: 500px;
  // height: 5rem;
  padding: 50px 0;
  padding: 0.5rem 0;
  border-radius: 10px;
  border-radius: 0.1rem;
  text-align: center;
  background: rgba(193, 236, 233, 0.39);
  box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.61);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .title {
    font-size: 36px;
    font-size: 0.36rem;
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
    margin-bottom: 0.2rem;
    color: #007069;
  }
  .main-content {
    width: 40%;
    display: inline-block;
    .f-item {
      width: 100%;
      margin-bottom: 20px;
      margin-bottom: 0.2rem;
      // border: 1px solid red;
      input:not([name='validateCode']) {
        width: 100%;
        height: 40px;
        height: 0.4rem;
        border-radius: 10px;
        border-radius: 0.1rem;
        border: none;
        outline: none;
        text-indent: 15px;
        text-indent: 0.15rem;
        color: #007069;
        box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.2);
        transition: all 0.5s ease-in-out;
        &:hover {
          box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.61);
        }
      }
      &.logo {
        .pic {
          height: 40px;
          height: 0.4rem;
          width: 50%;
          background-image: url(~@/assets/img/log_sg.png);
          background-position: left center;
          background-repeat: no-repeat;
          background-size: 60%;
          // border:1px solid red;
        }
      }
      &.vadCode {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        input {
          width: 50%;
          height: 40px;
          height: 0.4rem;
          border-radius: 10px;
          border-radius: 0.1rem;
          border: none;
          outline: none;
          text-indent: 15px;
          text-indent: 0.15rem;
          color: #007069;
          box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.2);
          transition: all 0.5s ease-in-out;
          &:hover {
            box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.61);
          }
        }
        a {
          width: percentage($number: 130/400);
          height: 40px;
          height: 0.4rem;
          border-radius: 10px;
          border-radius: 0.1rem;
          box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.2);
          transition: all 0.5s ease-in-out;
          img {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            border-radius: 0.1rem;
          }
          &:hover {
            box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.61);
          }
        }
      }
      &.subBtn {
        margin-bottom: 0;
        button {
          width: 100%;
          height: 40px;
          height: 0.4rem;
          border-radius: 10px;
          border-radius: 0.1rem;
          border: none;
          outline: none;
          color: #fff;
          font-size: 20px;
          font-size: 0.2rem;
          background: linear-gradient(-90deg, #0eb2a8, #15d2d4);
          box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.2);
          transition: all 0.5s ease-in-out;
          cursor: pointer;
          &:hover {
            box-shadow: 0px 2px 8px 0px rgba(14, 68, 65, 0.61);
          }
        }
      }
    }
    // 验证码
    .captcha {
      display: flex;
    }
    // 错误提示信息
    .errorTips {
      height: 30px;
      height: 0.3rem;
      line-height: 30px;
      line-height: 0.3rem;
      color: red;
      font-weight: bold;
    }
  }
}

.version{
  position: absolute;
  bottom:0;
  right:0;
  color:#fff;
  font-size:14px;
  padding-bottom:5px;
  padding-right:5px;
}
/*修改placeholder样式*/
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #9dbebc;
  font-size: 16px;
  font-size: 0.16rem;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #9dbebc;
  font-size: 16px;
  font-size: 0.16rem;
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #9dbebc;
  font-size: 16px;
  font-size: 0.16rem;
}
</style>
<style lang="scss">
</style>