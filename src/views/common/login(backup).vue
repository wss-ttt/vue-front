<template>
  <div class="bg">
    <div class="login">
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        status-icon
      >
        <el-form-item prop="userName">
          <el-input v-model="dataForm.userName" placeholder="帐号" auto-complete="new-userName"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="dataForm.password"
            type="password"
            placeholder="密码"
            auto-complete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <!--<el-row :gutter="20">
						<el-col :span="14">
							<el-input v-model="dataForm.captcha" placeholder="验证码">
							</el-input>
						</el-col>
						<el-col :span="10" class="login-captcha">
							<img :src="captchaPath" @click="getCaptcha()" alt="">
						</el-col>
          </el-row>-->

          <div class="captcha">
            <el-input v-model="dataForm.captcha" placeholder="验证码"></el-input>
            <img :src="captchaPath" @click="getCaptcha()" alt />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            typ="info"
            class="login-btn-submit"
            @click="dataFormSubmit()"
          >登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
          <div style="height:30px;line-height:30px;color:red;font-weight:bold;">{{errorTips}}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getUUID } from "@/utils";
import {Decrypt, Encrypt} from '@/utils/crypto.js'
export default {
  data() {
    return {
      dataForm: {
        userName: "admin",
        password: "admin",
        uuid: "",
        captcha: "",
        ipAddr: "" // 保存客户端的ip地址
      },
      errorTips: "", // 后台返回的错误提示小时
      dataRule: {
        userName: [
          {
            required: true,
            message: "帐号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        captcha: [
          // { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      captchaPath: ""
    };
  },
  created() {
    this.getCaptcha();
  },
  mounted() {
    // this.getUserIP();
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/login"),
            method: "post",
            data: this.$http.adornData({
              username: this.dataForm.userName,
              // password: this.dataForm.password,
              password: Encrypt(this.dataForm.password),
              uuid: this.dataForm.uuid,
              captcha: this.dataForm.captcha,
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.errorTips = "";
              this.$cookie.set("token", data.token);
              this.$router.replace({
                // name: 'home'
                name: "electric-manage"
              });
            } else {
              this.getCaptcha();
              // this.$message.error(data.msg)
              this.errorTips = data.msg + "...";
              setTimeout(() => {
                this.errorTips = "";
              }, 1000);
            }
          });
        }
      });
    },
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.captchaPath = this.$http.adornUrl(
        `/captcha.jpg?uuid=${this.dataForm.uuid}`
      );
    },
    getUserIP() {
      var RTCPeerConnection =
        window.RTCPeerConnection ||
        window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection
      if (RTCPeerConnection) {
        var rtc = new RTCPeerConnection();
        rtc.createDataChannel("");
        rtc.createOffer(
          offerDesc => {
            rtc.setLocalDescription(offerDesc);
          },
          e => {
            console.log(e);
          }
        );
		let flag = true
        rtc.onicecandidate = evt => {
          if (evt.candidate) {
            if(flag){
				let info = evt.candidate.candidate
				let arr = info.split(' ')
				// var ip_addr = evt.candidate.address
				// let ip_addr = arr[4]
				var ip_addr = arr[4]
				this.dataForm.ipAddr = ip_addr;
				flag = false
			}
          }
        };
      } else {
      }
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  background-image: url(~@/assets/img/login_bg2.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.login {
  width: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  /*.login-captcha {
			width: 120px;
			height: 40px;
			border: 1px solid rgba(0, 51, 119, 1);
			overflow: hidden;
			>img {
				width: 100%;
				cursor: pointer;
			}
		}*/
  .captcha {
    display: flex;
    justify-content: space-between;
    img {
      width: 120px;
      height: 40px;
      margin-left: 30px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.login {
  .el-input {
    input {
      background-color: #154e99;
      height: 40px;
      font-size: 16px;
      border: 1px solid rgba(0, 51, 119, 1);
      color: #fff;
    }
  }
  .el-button:hover,
  el-button:focus {
    border: 1px solid rgba(0, 51, 119, 1);
    color: #fff;
    background: linear-gradient(
      90deg,
      rgba(0, 51, 119, 1),
      rgba(22, 85, 169, 1),
      rgba(0, 51, 119, 1)
    );
  }
}

.login-btn-submit {
  width: 100%;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(0, 51, 119, 1),
    rgba(22, 85, 169, 1),
    rgba(0, 51, 119, 1)
  );
  border-radius: 10px;
  outline: none;
  border: 1px solid rgba(0, 51, 119, 1);
  font-size: 22px;
  color: #fff;
  cursor: pointer;
}
</style>