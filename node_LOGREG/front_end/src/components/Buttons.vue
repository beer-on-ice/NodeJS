<template>
    <div class="buttons">
        <!-- <router-link to="/login">
            <el-button type="primary" plain class="buttonEl">登录</el-button>
        </router-link> -->
        <el-button type="primary" plain @click="login" class="buttonEl">登录</el-button>
        <el-button type="success" plain @click="register" class="buttonEl">注册</el-button>
    </div>
</template>

<script>
export default {
	data() {
		return {
        }
	},
	created() {},
	methods: {
        login() {
            this.$router.push({
                path: '/login'
            });
            this.show_button = false
		},
		register() {
            this.$router.push({
                path: '/register'
            });
            this.show_button = false
		}
	}
}
</script>

<style>
</style>
