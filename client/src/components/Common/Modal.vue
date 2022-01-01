<template>
    <div class="modal-wrapper" ref="modal">
        <div class="modal-content">
            <div class="p-2">
                <slot name="default" />
            </div>
            <div class="buttons-wrapper pt-3">
                <div class="cancel-btn" @click="hide()" :style="{width: confirmButton ? '50%' : '100% !important'}">Cancel</div>
                <div class="confirm-btn" v-if="confirmButton">
                    <slot name="confirmBtn">
                        <div class="confirm"> 
                            Confirm
                        </div>
                    </slot>
                </div>  
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';

    export default {
        name: 'Modal',
        props: {
            confirmButton: {
                type: Boolean,
                default: true
            }
        },
        mounted() {
            $(this.$refs.modal).fadeOut(0);
        },
        methods: {
            show() {
                $(this.$refs.modal).fadeIn(200);
            },
            hide() {
                $(this.$refs.modal).fadeOut(200);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-wrapper {
        background-color: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(3px);
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;   
        height: 100vh;
        display: flex;
        align-items:center;
        justify-content: center;

        .modal-content {
            background-color: white;
            width: fit-content;
            padding-top: 10px;
            border-radius: 5px;

            .buttons-wrapper {
                width: 100%;
                display: flex;

                .cancel-btn, .confirm-btn {
                    width: 50%;
                    background-color: #eaecf1;
                    text-align: center;
                    color: black;
                    font-size: 1.15em;
                    cursor: pointer;
                    padding: 12px 0;
                    font-weight: 300;

                    .confirm {
                        color: white;
                    }
                }
                .confirm-btn {
                    background-color: #81D022;
                    font-weight: 300;
                }
            }
        }
    }
</style>