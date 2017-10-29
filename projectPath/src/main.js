// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import childMenu from './components/childMenu'
import VueResource from 'vue-resource'
import Vuex from 'vuex'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)
/**
 * 设置vuex
 */
const store = new Vuex.Store({}) // 这里你可能已经有其他 module

store.registerModule('vux', { // 名字自己定义
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      console.log(payload, '-----------')
      state.isLoading = payload
    }
  }
})

const routes = [{
  path: '/',
  component: App,
  name: 'app'
}, {
  path: '/mobile/:menu_id',
  component: childMenu,
  name: 'menu'
}, {
  name: 'tree',
  path: '/mobile/:menu_id/:action_id/tree',
  component: function (resolve) {
    require(['./components/treeComponent'], resolve)
  }
}, {
  name: 'form',
  path: '/mobile/:menu_id/:action_id/form/:record_id',
  component: function (resolve) {
    require(['./components/formComponent'], resolve)
  }
}]
const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', true)
  next()
})
router.afterEach(function (to) {
  setTimeout(function () {
    store.commit('updateLoadingStatus', false)
  }, 300)
})
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

Vue.filter('get_menu_ico_path', function (value) {
  if (value && value.indexOf(',') > 0) {
    var menuPath = value.split(',')
    return '/mobile/' + menuPath[0] + '/' + menuPath[1]
  }
})

Vue.filter('menu_to_link', function (value) {
  return '/second/nemu/' + value.id
})
Vue.filter('obj_str_to_id', function (value) {
  if (value && value.indexOf(',') > 0) {
    var menuPath = value.split(',')
    return menuPath[1]
  }
})
// Vue.http.interceptors.push(function (request, next) {
//   $.showLoading('请稍等...')
//   next(function (response) {
//     $.hideLoading('请稍等...')
//     return response
//   });
// });

Vue.filter('get_select_value', function (value) {
  if (value) {
    return value[1]
  } else {
    return ''
  }
})
Vue.filter('object_has_key', function (value, key) {
  if (value && key && value[key]) {
    return true
  } else {
    return true
  }
})
Vue.filter('tree_field_format', function (value, fieldType) {
  if (value && fieldType) {
    if (fieldType.type === 'boolean') {
      return value ? '√' : '×'
    } else if (fieldType.type === 'many2one') {
      return value[1]
    } else if (fieldType.type === 'selection') {
      for (var selectionIndex in fieldType.selection) {
        if (fieldType.selection[selectionIndex][0] === value) {
          return fieldType.selection[selectionIndex][1]
        }
      }
    } else if (fieldType.type === 'char') {
      return value
    } else {
      return value
    }
  } else {
    return '无'
  }
})
Vue.filter('length', function (value) {
  if (value == null) return 0
  if (typeof value !== 'string') {
    value += ''
  }
  return value.replace(/[^\x00-\xff]/g, '01').length
})
Vue.filter('selectionOptions', function (values) {
  var options = []
  for (var val in values) {
    options.push({'key': values[val][0], 'value': values[val][1]})
  }
  return options
})
