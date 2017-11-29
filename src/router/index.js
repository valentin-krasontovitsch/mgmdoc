import Promise from 'es6-promise'
import Vue from 'vue'
import Axios from 'axios'
import Router from 'vue-router'
import FilteredList from '@/components/filtered_list.vue'
require('string.prototype.startswith')
require('../common.scss')
require('../my_material.scss')
require('material-components-web/dist/material-components-web.css')
Vue.prototype.$http = Axios
Promise.polyfill()
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: FilteredList,
      props: { dataUrl: window.env['PAGES_LINKER_API'], label: 'name' }
    }
  ]
})
