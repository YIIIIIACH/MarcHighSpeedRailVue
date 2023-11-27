import { createRouter, createWebHistory } from 'vue-router'
const Home = { template: '<div>Home</div>' }
// const About = {template: '<div>About</div>'}
import booking from '../components/booking.vue'
import shopping from '../components/shopping.vue'
import lostItem from '../components/lostItem.vue'
import employeeLogin from '../views/EmployeeLoginView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/lostItem',
      component: lostItem
    },
    {
      path: '/booking',
      component: booking
    },
    {
      path: '/shopping',
      component: shopping
    },
    {
      path: '/employee',
      component: employeeLogin
    }
  ]
})

export default router
