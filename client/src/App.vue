<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "App",
};
</script>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap");

  div {
    color: #313131;
  }
  * {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: "Open-Sans", sans-serif;
  }
  .toast-plugin {
    font-family: "Open-Sans", sans-serif;
    transition: 0.2s all;
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.2);
    animation: 0.3s fade;
  }
  .toast-message {
    color: white !important;
  }
  .fade-in {
    animation: 0.3s fade;
  }
  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.95;
    }
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
    transform: scale(0.9);
  }

  .m-1 {
    margin: 4px;
  }
  .m-2 {
    margin: 8px;
  }
  .m-3 {
    margin: 15px;
  }
  .m-4 {
    margin: 20px;
  }
  .m-5 {
    margin: 30px;
  }
  .ml-1 {
    margin: 0px 0px 0px 4px;
  }
  .ml-2 {
    margin: 0px 0px 0px 8px;
  }
  .ml-3 {
    margin: 0px 0px 0px 15px;
  }
  .ml-4 {
    margin: 0px 0px 0px 20px;
  }
  .ml-5 {
    margin: 0px 0px 0px 30px;
  }
  .mr-1 {
    margin: 0px 4px 0px 0px;
  }
  .mr-2 {
    margin: 0px 8px 0px 0px;
  }
  .mr-3 {
    margin: 0px 15px 0px 0px;
  }
  .mr-4 {
    margin: 0px 20px 0px 0px;
  }
  .mr-5 {
    margin: 0px 30px 0px 0px;
  }
  .mb-1 {
    margin: 0px 0px 4px 0px;
  }
  .mb-2 {
    margin: 0px 0px 8px 0px;
  }
  .mb-3 {
    margin: 0px 0px 15px 0px;
  }
  .mb-4 {
    margin: 0px 0px 20px 0px;
  }
  .mb-5 {
    margin: 0px 0px 30px 0px;
  }
  .mt-1 {
    margin: 4px 0px 0px 0px;
  }
  .mt-2 {
    margin: 8px 0px 0px 0px;
  }
  .mt-3 {
    margin: 15px 0px 0px 0px;
  }
  .mt-4 {
    margin: 20px 0px 0px 0px;
  }
  .mt-5 {
    margin: 30px 0px 0px 0px;
  }

  .p-1 {
    padding: 4px;
  }
  .p-2 {
    padding: 8px;
  }
  .p-3 {
    padding: 15px;
  }
  .p-4 {
    padding: 20px;
  }
  .p-5 {
    padding: 30px;
  }
  .pl-1 {
    padding: 0px 0px 0px 4px;
  }
  .pl-2 {
    padding: 0px 0px 0px 8px;
  }
  .pl-3 {
    padding: 0px 0px 0px 15px;
  }
  .pl-4 {
    padding: 0px 0px 0px 20px;
  }
  .pl-5 {
    padding: 0px 0px 0px 30px;
  }
  .pr-1 {
    padding: 0px 4px 0px 0px;
  }
  .pr-2 {
    padding: 0px 8px 0px 0px;
  }
  .pr-3 {
    padding: 0px 15px 0px 0px;
  }
  .pr-4 {
    padding: 0px 20px 0px 0px;
  }
  .pr-5 {
    padding: 0px 30px 0px 0px;
  }
  .pb-1 {
    padding: 0px 0px 4px 0px;
  }
  .pb-2 {
    padding: 0px 0px 8px 0px;
  }
  .pb-3 {
    padding: 0px 0px 15px 0px;
  }
  .pb-4 {
    padding: 0px 0px 20px 0px;
  }
  .pb-5 {
    padding: 0px 0px 30px 0px;
  }
  .pt-1 {
    padding: 4px 0px 0px 0px;
  }
  .pt-2 {
    padding: 8px 0px 0px 0px;
  }
  .pt-3 {
    padding: 15px 0px 0px 0px;
  }
  .pt-4 {
    padding: 20px 0px 0px 0px;
  }
  .pt-5 {
    padding: 30px 0px 0px 0px;
  }

  .bg-light {
    background-color: #f8f8f8;
  }
  .text-light {
    color: #e2e2e2 !important;
  }
  .shadow-sm {
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2);
  }
  .input {
    border: none;
    outline: none;
    background: none;
    padding: 8px 0px;
    width: 100%;
    font-size: 1.2em;
    border-bottom: 1px solid rgb(70, 70, 70);
  }
  .input-label {
    color: #565758;
    font-size: 0.9em;
  }
  .card {
    border-radius: 5px;
    background-color: white;
    padding: 8px 10px;
  }
</style>
