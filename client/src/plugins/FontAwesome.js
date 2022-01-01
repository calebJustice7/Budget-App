"use strict";

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faFileInvoiceDollar, faDollarSign } from '@fortawesome/free-solid-svg-icons';

import { faBell, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { } from '@fortawesome/fontawesome-svg-core';

import {  } from '@fortawesome/free-brands-svg-icons';

export default function(vueInst) {
    vueInst.component('font-awesome-icon', FontAwesomeIcon);
    library.add(faBell);
    library.add(faSearch);
    library.add(faFileInvoiceDollar);
    library.add(faDollarSign);
    library.add(faCheckCircle);
}
