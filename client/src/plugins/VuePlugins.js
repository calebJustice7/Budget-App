"use strict";

import VueRouter from 'vue-router';
import VueToastr from 'vue-toastr';
import vSelect from 'vue-select';
import VueApexCharts from 'vue-apexcharts';

export default function(vueInst) {
    vueInst.use(VueRouter);
    vueInst.use(VueToastr);
    vueInst.component('v-select', vSelect);
    vueInst.config.productionTip = false;
    vueInst.use(VueApexCharts);
    vueInst.component('apexchart', VueApexCharts);
}
