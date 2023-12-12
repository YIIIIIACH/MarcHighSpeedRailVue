import { createRouter, createWebHistory } from 'vue-router'
const Home = { template: '<div style="background-color:red;width:1000px;height:800px">Home</div>' }
// const About = {template: '<div>About</div>'}
import booking from '../views/bookingSystem/booking.vue'
import goods from '../views/shopping/goods.vue'
import goodsDetail from '../views/shopping/goodsDetail.vue'
import shoppingCart from '../views/shopping/shoppingCart.vue'
import checkoutPage from '../views/shopping/checkoutPage.vue'
import lostItem from '../components/lostItem.vue'
import employeeLogin from '../views/EmployeeLoginView.vue'
import employeeIndex from '../components/backendNavbar.vue'
import buinessBooking from '../views/bookingSystem/buinessBooking.vue'
import searchSchedule from '../views/bookingSystem/searchScheduleView.vue'
import bookSuccess from '../views/bookingSystem/bookSuccess.vue'
import bookFail from '../views/bookingSystem/bookFail.vue'
import memberTicketOrder from '../views/bookingSystem/memberTicketOrder.vue'
import ticketOrderDetail from '../views/bookingSystem/ticketOrderDetail.vue'
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
      path: '/searchSchedule',
      component: searchSchedule
    },
    {
      path: '/booking',
      component: booking
    },
    {
      path: '/booking/buinessSeat/:schid/:ststid/:edstid/:amount',
      component: buinessBooking,
      props:true
    },
    {
      path: '/ticketOrder',
      component: memberTicketOrder
    },
    {
      path: '/ticketOrderDetail/:tckodid',
      component: ticketOrderDetail,
      props: true
    },
    {
      path: '/bookSuccess/:tckodid',
      component: bookSuccess,
      props: true
    },
    {
      path: '/bookFail',
      component: bookFail,
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/goods/goodsDetail/:Id',
      component: goodsDetail,
      name: 'goods-detail',
      props: true
    },
    {
      path: '/shoppingCart/:memberId',
      // path: '/shoppingCart',
      component: shoppingCart,
      name: 'shoppingCart',
      props: true
    },
    // {
    //   path: '/checkout/:memberId/:checkoutPrice/:selectedIds',
    //   component: checkoutPage,
    //   name: 'checkoutPage',
    //   props:true
    // },
    {
      path: '/checkout/:memberId/:checkoutPrice',
      component: checkoutPage,
      name: 'checkoutPage',
      props:true
    },
    {
      path: '/emp/login',
      component: employeeLogin
    },
    {
      path: '/emp/index',
      component: employeeIndex
    }
  ]
})

export default router
