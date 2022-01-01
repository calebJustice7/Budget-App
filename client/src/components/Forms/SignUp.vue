<template>
    <div class="register-form">
        <div class="header">Create An Account</div>
        <div class="form">
            <Input label="Email" v-model="emailAddress" type="email" />
            <Input label="Username" style="margin: 40px 0;" v-model="username"/>
            <Input label="Password" v-model="password" type="password" />
            <Input label="Confirm Password" style="margin: 40px 0;" v-model="confirmPassword" type="password" />
            <div @click="signUp" class="button-custom shadow-sm">Sign Up</div>
        </div>
    </div>
</template>

<script>
    import Input from '../Common/Input.vue';
    import axios from 'axios';

    export default {
        components: {Input},
        name: 'SignUp',
        data() {
            return {
                emailAddress: '',
                password: '',
                username: '',
                confirmPassword: ''
            }
        },
        methods: {
            signUp() {
                let {password, emailAddress, username, confirmPassword} = this;
                if (!emailAddress || !password || !username) {
                    this.$toastr.w('Must have all fields entered in');
                    return;
                }
                if (password !== confirmPassword) {
                    this.$toastr.w('Passwords must match');
                    return;
                }
                axios.post('/auth', {
                    emailAddress: emailAddress,
                    username: username,
                    password: password
                }).then(res => {
                    if (res && res.data) {
                        this.$emit('tabChange', 'login');
                        this.$toastr.s('User successfully created');
                    } else {
                        this.$toastr.e('An unknown error occured');
                    }
                }).catch((e) => {
                    this.$toastr.e('User with that email already exists');
                })
            } 
        }
    }
</script>

<style lang="scss" scoped>
    .register-form {
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
        .button-custom {
            width: 100%;
            color: white;
            background-color: black;
            text-align: center;
            border-radius: 5px;
            cursor: pointer;
            padding: 13px 0;
            font-size: 1em;
            font-weight: 300;
            transition: 0.3s all;
        }
        .button-custom:hover {
            transform: scale(.9);
        }
    }
</style>