import Vue from 'vue'
import Alert from './alert.vue'

const AlertBox = Vue.extend(Alert);

AlertBox.install = function (data) {
    let instance = new AlertBox({
        data
    }).$mount()

    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
        instance.show = true
    })
}

export default AlertBox
