// import Promise from 'es6-promise'
// Promise.polyfill
// require('string.prototype.startswith');
// require('../my_material.scss')
// require('../common.scss')
import Vue from 'vue'
import Axios from 'axios'
import Router from 'vue-router'
import FilteredList from '@/components/filtered_list.vue'
Vue.prototype.$http = Axios
console.log('I am application.js, entrypoint for all?')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Overview',
      component: FilteredList,
      props: { dataUrl: window.env['PAGES_LINKER_API'] }
    }
  ]
})
