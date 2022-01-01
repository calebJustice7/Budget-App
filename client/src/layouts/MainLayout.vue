<template>
    <div class="main-layout">
        <div class="main-layout-body">
            <div class="sidebar" v-show="showSidebar">
                <Sidebar :showSidebar="showSidebar" />
            </div>

            <div class="main-layout-content" id="mainPageWrapper" style="overflow: scroll" :style="{height: pageHeight, width: pageWidth}">
                <router-view :style="{minHeight: pageHeight}"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import Sidebar from '../components/Nav/Sidebar.vue'
    import $ from 'jquery';
    import axios from 'axios';

    export default {
        components: { Sidebar },
        name: 'MainLayout',
        data() {
            return {
                showSidebar: true,
                showNavContents: true,
                sidebarHeight: '',
                pageHeight: '',
                pageWidth: ''
            }
        },
        watch: {
            '$route.path': {
                handler(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $('#mainPageWrapper').animate({scrollTop: "0"}, 0);
                    }
                }
            }
        },
        async mounted() {
            window.setInterval(async () => {
                let res = await this.$store.dispatch('checkToken');
                if (res !== true) {
                    this.$store.dispatch('logOut');
                    if (this.$route.name !== 'login') {
                        this.$router.push({name: 'login'})
                    }                    
                }
            }, 20000);

            this.adjustSidebar();
            window.addEventListener('resize', this.adjustSidebar);
            this.setPageHeight();

            if (this.$store.getters['getUser']) {
                axios.get('/user_profile').then(res => {
                    if (res && res.data) {
                        this.$store.commit('setUser', {...res.data.user});
                    }
                })
            }
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.adjustSidebar);
        },
        methods: {
            scrollToTop() {
                $('#mainPageWrapper').animate({scrollTop: "0"}, 1000);
            },
            setPageHeight() {
                this.pageHeight = (parseFloat(this.sidebarHeight) - 0) + 'px';
            },
            toggleSidebar() {
                this.showSidebar = !this.showSidebar;
                if (this.showSidebar) this.setSidebarHeight();
            },
            adjustSidebar() {
                this.setSidebarHeight();
                this.checkWidth();
                this.setPageHeight();
            },
            checkWidth() {
                this.showSidebar = window.innerWidth < 767 ? false : true;
                this.showNavContents = this.showSidebar;
            },
            setSidebarHeight() {
                this.sidebarHeight = (window.innerHeight) + 'px';
                $('#mainSidebar').css('height', `${window.innerHeight}px`);
                let w = $('#mainSidebar').css('width');
                this.pageWidth = (window.innerWidth - parseFloat(w)) + 'px';
            }
        }
    }
</script>

<style scoped lang="scss">
    .main-layout {
        position: relative;

        .scroll-btn {
            position: absolute;
            right: 20px;
            bottom: 20px;
            height: 40px;
            width: 40px;
            background-color: rgba(0, 0, 0, 0.4);
            color: white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            font-size: 1.3em;
            padding-bottom: 5px;
            cursor: pointer;
            justify-content: center;
        }
    }
    .main-layout-body {
        display: flex;
        align-items: flex-start;
    }
    .sidebar {
        width: 18vw;
    }
</style>