<template>
    <div class="home-wrapper bg-light p-4">
        <div class="dashboard-wrapper">
            <div class="top">
                <div class="left">
                    <div class="custom-card card shadow-sm">
                        <div>3 Accounts</div>
                        <font-awesome-icon style="color: gray" :icon="'file-invoice-dollar'" />
                    </div>
                    <div class="custom-card mt-4 card shadow-sm">
                        <div>4.75$ Total Balance</div>
                        <font-awesome-icon style="color: gray" :icon="'dollar-sign'" />
                    </div>
                    <div class="custom-card mt-4 card shadow-sm">
                        <div>18 Transactions This Month</div>
                        <font-awesome-icon style="color: gray" :icon="'dollar-sign'" />
                    </div>
                    <div @click="getLinkToken" class="button-custom mt-4" style="font-size: .8em;">Add Account</div>
                </div>
            </div>
        </div>

        <Modal ref="plaidModal" :confirmButton="false">
            <plaid-link
                v-if="token"
                env="sandbox"
                :token="token"
                v-bind="{ onSuccess }"
            > 
                <template slot="button" slot-scope="props">
                    <div class="button-custom" style="width:400px;" @click="props.onClick">Connect Account</div>
                </template>
            </plaid-link>
        </Modal>

        <Modal ref="accountsModal" :confirmButton="false">
            <div class="accounts">
                <div class="account" @click="selectAccount(account)" v-for="(account, idx) of activeAccounts" :key="idx">
                    <font-awesome-icon class="circle-icon" :icon="['far', 'check-circle']" style="cursor: pointer;" :style="{color: selectedAccounts.find(ac => ac.account_id === account.account_id) ? 'rgb(48,209,88)' : ''}" />
                    <div>
                        <div class="account-name-wrapper">
                            <div class="account-name">
                                <div>{{ account.name }}</div>
                                <div v-if="account.subtype">{{ account.subtype }}</div>
                            </div>
                            <div class="account-type">
                                <div>{{ account.balances.current.toLocaleString('en-US', {style: 'currency', currency: account.balances.iso_currency_code}) }} {{ account.balances.iso_currency_code }}</div>
                                <div>{{ account.type }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- {{ account }} -->
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import PlaidLink from "vue-plaid-link";
    import axios from 'axios';
    import {mapGetters} from 'vuex';
    import Modal from '../components/Common/Modal.vue';

    export default {
        components: {PlaidLink, Modal},
        name: 'Home',
        data() {
            return {
                token: '',
                activeAccounts: [],
                selectedAccounts: []
            }
        },
        mounted() {
            // axios.get('/records/accounts').then(res => {
            //     console.log(res.data);
            // })
            // axios.get('/records/transactions').then(res => {
            //     console.log(res.data);
            // })
        },
        computed: {
            ...mapGetters(['getUser']),
            user() {
                return this.getUser;
            },
        },
        methods: {
            selectAccount(account) {
                let found = this.selectedAccounts.find(acc => acc.account_id === account.account_id);
                if (found) {
                    this.selectedAccounts = this.selectedAccounts.filter(acc => acc.account_id !== account.account_id);
                } else {
                    this.selectedAccounts.push(account);
                }
            },
            getLinkToken() {
                axios.get('/plaid_token/create_link_token').then(res => {
                    if (res && res.data && res.data.data) {
                        this.token = res.data.data.link_token;
                        this.$refs.plaidModal.show();
                    }
                }).catch(() => {
                    this.$toastr.e('Error getting plaid token');
                })
            },
            onSuccess(token) {  
                axios.post('/plaid_token/get_access_token', {public_token: token}).then(res => {
                    if (res && res.data) {
                        axios.post('/records/account', {access_token: res.data.publicToken.access_token}).then(res => {
                            this.$refs.plaidModal.hide();
                            this.$refs.accountsModal.show();
                            this.activeAccounts = res.data.accounts.accounts;
                        })
                        this.$toastr.s('Account added');
                    } else {
                        this.$toastr.e('Error getting access token from plaid');
                    }
                }).catch(() => {
                    this.$toastr.e('Error getting access token from plaid');
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .home-wrapper {
        .dashboard-wrapper {
            .top {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left {
                    width: 30%;
                    font-size: 1.45em;
                    font-weight: 300;

                    .custom-card {
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                }
            }
        }

        .accounts {
            width: 30vw;
            max-height: 310px;
            overflow-y: scroll;

            .account:hover  .circle-icon {
                color :green !important;
            }

            .account {
                padding: 10px 20px;
                position: relative;
                padding-left: 40px;
                cursor: pointer;

                .circle-icon {
                    position: absolute;
                    left: 7px;
                    color: rgb(214, 209, 209);
                    font-size: 1.2em;
                    top: 17px;
                    transition: 0.2s all;
                }

                .account-name-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .account-name {
                        div:first-child {
                            font-size: 1.1em;
                            font-weight: 400;
                        }
                        div:last-child {
                            font-size: .9em;
                            color: gray;
                            font-weight: 300;
                        }
                    }

                    .account-type {
                        div:first-child {
                            font-size: 1.1em;
                            font-weight: 400;
                        }
                        div:last-child {
                            font-size: .9em;
                            color: gray;
                            text-align: right;
                            font-weight: 300;
                        }
                    }
                }
            }
        }
    }
</style>