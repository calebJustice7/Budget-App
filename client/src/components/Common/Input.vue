<template>
    <div class="input-wrapper">
        <div class="input-label" v-if="label">{{ label }}</div>
        <input @keyup.enter="enter" @input="emitVal" class="input" :type="type" :placeholder="placeholder" v-model="val" />
    </div>
</template>

<script>
    export default {
        name: 'Input',
        data() {
            return {
                val: ''
            }
        },
        mounted() {
            this.val = this.value;
        },
        props: {
            label: {
                type: String,
                required: false
            },
            type: {
                type: String,
                default: () => 'text'
            },
            placeholder: {
                type: String,
                required: false
            },
            value: [String, Number]
        },
        methods: {
            emitVal() {
                this.$emit('input', this.val);
            },
            enter() {
                this.$emit('enter', this.val);
            }
        }
    }
</script>

<style>

</style>