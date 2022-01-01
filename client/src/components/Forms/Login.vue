<template>  
    <div class="login-form">
        <div class="header">Welcome Back</div>
        <div class="form">
            <Input label="Email" v-model="emailAddress" type="email" />
            <Input @enter="logIn" label="Password" style="margin: 40px 0;" v-model="password" type="password" />
            <div @click="password = $event; logIn()" class="button-custom shadow-sm">Login</div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Cookies from 'js-cookie';
    import Input from '../Common/Input.vue';

    export default {
        name: 'Login',
        components: {Input},
        data() {
            return {
                emailAddress: '',
                password: ''
            }
        },
        methods: {
            logIn() {
                if (!this.emailAddress.length || !this.password.length) {
                    this.$toastr.w('Must enter in a email and password');
                    return;
                }
                axios.post('/auth/login', {
                    emailAddress: this.emailAddress,
                    password: this.password
                }).then(res => {
                    if (res && res.data) {
                        Cookies.set('token', JSON.stringify(res.data.token), { path: '/', expires: new Date(res.data.token.refresh_token_expires_at), sameSite: false });
                        this.$toastr.s('Welcome back ' + res.data.token.emailAddress);
                        this.$router.push({name: 'home'});
                    } else {
                        this.$toastr.e('An error occured');    
                    }
                }).catch(() => {
                    this.$toastr.e('Incorrect login');
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .login-form {
        width: 100%;
        margin: 0 auto;

        .header {
            text-align: center;
            margin-bottom: 50px;
            font-weight: 400;
            font-size: 2.3em;
        }
        .form {
            width: 50%;
            text-align: left;
            margin: 0 auto;
        }
    }
</style>