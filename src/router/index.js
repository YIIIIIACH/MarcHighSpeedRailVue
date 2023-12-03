import { createRouter, createWebHistory } from 'vue-router'
const Home = { template: '<div>Home</div>' }
// const About = {template: '<div>About</div>'}
import booking from '../views/bookingSystem/booking.vue'
import goods from '../views/shopping/goods.vue'
import goodsDetail from '../views/shopping/goodsDetail.vue'
import lostItem from '../components/lostItem.vue'
import employeeLogin from '../views/EmployeeLoginView.vue'
import employeeIndex from '../components/backendNavbar.vue'
import buinessBooking from '../views/bookingSystem/buinessBooking.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
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
      path: '/goods',
      component: goods
    },

    {
      path: '/goods/goodsDetail/:id',
      component: goodsDetail,
      name: 'goods-detail',
      props: true
    },

    {
      path: '/emp/login',
      component: employeeLogin
    },
    {
      path: '/emp/index',
      component: employeeIndex
    },
    {
      path: '/booking/buinessSeat/:schid/:ststid/:edstid',
      component: buinessBooking,
      props:true
    }
  ]
})

export default router
