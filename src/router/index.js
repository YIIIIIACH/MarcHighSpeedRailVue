import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/home.vue'
import booking from '../views/bookingSystem/booking.vue'
import goods from '../views/shopping/goods.vue'
import goodsDetail from '../views/shopping/goodsDetail.vue'
import shoppingCart from '../views/shopping/shoppingCart.vue'
import watchList from '../views/shopping/watchList.vue'
import checkoutPage from '../views/shopping/checkoutPage.vue'
import shoppingHistory from '../views/shopping/shoppingHistory.vue'
import lostItem from '../components/lostItem.vue'
import buinessBooking from '../views/bookingSystem/buinessBooking.vue'
import searchSchedule from '../views/bookingSystem/searchScheduleView.vue'
import bookSuccess from '../views/bookingSystem/bookSuccess.vue'
import bookFail from '../views/bookingSystem/bookFail.vue'
import userLogin from '../views/UserLoginPage.vue'
import userProfile from '../views/UserProfilePage.vue'
import UserRegister from '../views/UserRegisterPage.vue'
import memberTicketOrder from '../views/bookingSystem/memberTicketOrder.vue'
import ticketOrderDetail from '../views/bookingSystem/ticketOrderDetail.vue'

import orderPaymentSuccess from '../views/shopping/orderPaymentSuccess.vue'

import paypalCheckoutReturn from '../views/bookingSystem/paypalCheckoutReturn.vue'
import paypalBuinessCheckoutReturn from '../views/bookingSystem/paypalBuinessCheckoutReturn.vue'

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
      props: true
    },
    {
      path: '/ticketOrder',
      component: memberTicketOrder,
      meta:{transition:'slide-right'}
    },
    {
      path: '/ticketOrderDetail/:tckodid',
      component: ticketOrderDetail,
      props: true
    },
    {
      path: '/paypalCheckoutReturn/:tckodid',
      component: paypalCheckoutReturn,
      props: true
    },
    {
      path: '/paypalBuinessCheckoutReturn/:tckodid',
      component: paypalBuinessCheckoutReturn,
      props: true
    },
    {
      path: '/bookSuccess/:tckodid',
      component: bookSuccess,
      props: true,
      meta:{transition:'slide-right'}
    },
    {
      path: '/bookFail',
      component: bookFail,
      meta:{transition:'slide-right'}
    },
    {
      path: '/goods',
      component: goods,
      name: 'goods'
    },
    {
      path: '/goods/goodsDetail/:Id',
      component: goodsDetail,
      name: 'goods-detail',
      props: true
    },
    {
      path: '/shoppingCart',
      component: shoppingCart,
      name: 'shoppingCart',
    },
    {
      path:'/watchList',
      component: watchList,
      props: true
    },
    {
      // path: '/checkout/:memberId/:checkoutPrice',
      path: '/checkout/:checkoutPrice',
      component: checkoutPage,
      name: 'checkoutPage',
      props: true
    },
    {
      path:'/orderPaymentSuccess/:orderId/:orderNumber/:checkoutPrice',
      component: orderPaymentSuccess,
      props: true
    },
    {
      path: '/shoppingHistory',
      component: shoppingHistory,
      name: 'shoppingHistory',
    },
    {
      path: '/login',
      component: userLogin
    },
    {
      path: '/profile',
      component: userProfile
    },
    {
      path: '/register',
      component: UserRegister
    }
  ]
})

export default router
