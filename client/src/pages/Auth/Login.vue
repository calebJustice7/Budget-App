<template>
    <div class="login-wrapper">
        <div class="left">
            <transition name="fade" mode="out-in">
                <Login v-if="tab === 'login'"/>
            </transition>
            <transition name="fade" mode="out-in">
               <SignUp @tabChange="setTab" v-if="tab === 'signup'" />
            </transition>
            <div v-if="tab === 'login'" class="sub-message" @click="setTab('signup')">
                Don't have an account yet? <span>Click here</span> to create one
            </div>
            <div v-else class="sub-message">
                Already registered? <span @click="setTab('login')">Click here</span> to log back in
            </div>
        </div>
        <div class="right">

        </div> 
    </div>
</template>

<script>

    import Login from '../../components/Forms/Login.vue';
    import SignUp from '../../components/Forms/SignUp.vue';

    export default {
        name: 'LoginWrapper',
        components: {Login, SignUp},
        data() {
            return {
                tab: 'login'
            }
        },
        methods: {
            setTab(to) {
                this.tab = '';
                setTimeout(() => {
                    this.tab = to;
                }, 500);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-wrapper {
        height: 100vh;
        width: 100vw;
        display: flex;
        background-color: #f0f0f0;

        .left {
            width: 50vw;
            display: flex; 
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .sub-message {
                margin-top: 25px;
                font-weight: 300;

                span {
                    color: black;
                    font-weight: 400;
                    cursor: pointer;
                }
            }
        }

        .right {
            width: 50vw;
            background-image: url('../../assets/images/login.jpeg');
            background-size: cover;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: 0.5s all;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>