<template>
<transition name="fade">
	<div class="info">
		<img class="portrait" width="200" height="200" @click="upload" />

		<div class="user-info">
			<h1 class="nick">{{account}}</h1>
			<a href="javascript:;" class="logout" @click="logout" v-if="!isLogouting"> [退出]</a>
		</div>
		<Loading v-if="isLogouting" marginTop="3%"></Loading>
	</div>
</transition>
</template>

<script>
import Loading from './Loading.vue'
import axios from 'axios'

export default {
	data() {
		return {
			isLogouting: false,
			account: '',
			headurl: ''
		}
	},
	created() {
		let tmp = JSON.parse(this.getCookie('userInfo'));
		this.account = tmp.account;
	},
	components: {
		Loading
	},
	methods: {
		logout() {
			let _this = this;
			this.isLoging = true;

			this.removeCookie('userInfo');
			setTimeout(function() {
				this.isLoging = false;
				_this.$router.push('/login')
			}, 1000)
		},
		setCookie(name, value, iDay) {　　
			var oDate = new Date();
			oDate.setDate(oDate.getDate() + iDay);
			document.cookie = name + '=' + value + ';expires=' + oDate;
		},
		getCookie(name) {　　
			var arr = document.cookie.split('; ');
			for (var i = 0; i < arr[i].length; i++) {
				var arr2 = arr[i].split('=');
				if (arr2[0] == name) {
					return arr2[1];
				}
				return '';
			}
		},
		removeCookie(name) {
			this.setCookie(name, 1, -1);
		},
		upload() {
			this.getSrc()
			// axios({
			// 	method: 'post',
			// 	url: '/api/user/register',
			// 	data: qs.stringify(param)
			// })
		}
	}
}
</script>

<style scoped>
.info {
	background: #fff;
	width: 100%;
	height: 600px;
	color: #2c3e50;
	text-align: center;
	padding-top: 170px;
}

.portrait {
	width: 200px;
	height: 200px;
	overflow: hidden;
	-webkit-border-radius: 100%;
	-moz-border-radius: 100%;
	-ms-border-radius: 100%;
	-o-border-radius: 100%;
	border-radius: 100%;
	background-color: #CCCCCC;
	margin: 0 auto 15px;
	border: 2px solid #2c3e50;
	display: block;
}

.user-info {
	margin: 38px 0 0 0;
	vertical-align: top;
}

.user-info,
.w-star,
.w-diamond,
.nick,
.level {
	display: inline-block;
}

.nick {
	margin-right: 10px;
}

.cut {
	padding: 0 10px;
	color: #E9E9E9;
	font-size: 15px;
}

.logout {
	color: #2c3e50;
	display: block;
	margin-top: 20px;
}
</style>
