<template>
    <div class="sidebar" v-show="showSidebar" id="mainSidebar">
        <div class="top-icons">
            <font-awesome-icon style="font-size: 1.25em;" class="text-light" :icon="['far', 'bell']" />
            <font-awesome-icon style="font-size: 1.25em;" icon="search" class="text-light" />
        </div>

        <div class="profile">
            <img :src="userProfile" />
            <div>{{ user.username }}</div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'Sidebar',
        props: {
            showSidebar: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                links: []
            }
        },
        computed: {
            ...mapGetters(['getUser']),
            user() {
                return this.getUser;
            },
            userProfile() {
                return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png';
            }
        },
        methods: {
            routeTo(link) {
                if (link.disabled) return;
                if (this.$route.name === link.routeTo) return;
                if (link.routeTo.includes('/')) {
                    if (link.routeTo === this.$route.path) {
                        return;
                    }
                    this.$router.replace(link.routeTo);
                } else {
                    this.$router.push({name: link.routeTo});
                }
            }
        },
    }
</script>

<style lang="scss">
    .sidebar {
        overflow-y: scroll;
        width: 100%;
        // min-width: 110px;
        background-color: #2a2a79;

        .top-icons {
            padding: 21px 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .profile {
            text-align: center;
            padding-top: 30px;

            img {
                width: 50%;
                margin: 0 auto;
                text-align: center;
                border-radius: 50%;
            }

            div {
                color: white;
                margin-top: 21px;
                font-weight: 300;
                font-size: 1.4em;
            }
        }
    }
</style>
