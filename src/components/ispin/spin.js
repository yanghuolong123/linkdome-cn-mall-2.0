import Vue from 'vue'
import {Spin} from 'iview'
import store from '@/store'
import { transferIndex, transferIncrease } from 'iview/src/utils/transfer-queue'

function handleGetIndex () {
  transferIncrease()
  return transferIndex
}

let tIndex = handleGetIndex()

Spin.newInstance = properties => {
  const _props = properties || {}

  const Instance = new Vue({
    data: Object.assign({}, _props, {

    }),
    render (h) {
      let vnode = ''
      if (this.render) {
        vnode = h(Spin, {
          props: {
            fix: true,
            fullscreen: true
          }
        }, [this.render(h)])
      } else {
        vnode = h(Spin, {
          props: {
            size: 'large',
            fix: true,
            fullscreen: true
          }
        })
      }
      return h('div', {
        'class': 'ivu-spin-fullscreen ivu-spin-fullscreen-wrapper',
        'style': {
          'z-index': 2010 + tIndex,
          'position': 'fix',
          'left': store.state.report.leftWidth ? '80px' : '244px',
          'top': '128px'

        }
      }, [vnode])
    }
  })

  const component = Instance.$mount()
  document.querySelector('.main-content-con').appendChild(component.$el)
  const spin = Instance.$children[0]

  return {
    show () {
      spin.visible = true
      tIndex = handleGetIndex()
    },
    remove (cb) {
      spin.visible = false
      setTimeout(function () {
        spin.$parent.$destroy()
        if (document.getElementsByClassName('ivu-spin-fullscreen')[0] !== undefined) {
          document.querySelector('.main-content-con').removeChild(document.getElementsByClassName('ivu-spin-fullscreen')[0])
        }
        cb()
      }, 500)
    },
    component: spin
  }
}

export default Spin
