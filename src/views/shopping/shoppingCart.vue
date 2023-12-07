<script>
import httpClient from "@/main";
import { ref,onMounted } from "vue";
export default {
    props:['memberId'],
    setup(props) {
      return{
        shoppingCartItems: ref([]),
        quantity: ref(1),
        totalPrice: ref(0),
        floatingWindowRef: ref(null),
      }
    },
    computed:{
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    unmounted() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      // 懸浮框
      handleScroll() {
        if (this.floatingWindowRef) {
          const rect = this.floatingWindowRef.getBoundingClientRect();
          const offset = window.innerHeight - rect.height;

          if (window.scrollY > offset) {
            this.floatingWindowRef.style.bottom = '10px';

          } else {
            this.floatingWindowRef.style.bottom = 'initial';
          }
        }
      },
      beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
      }, 
      handleNumberInput(){
        this.quantity = this.quantity.replace(/\D/g, '');
      },
      decrementQuantity(item){
        if (item.quantity > 1) {
          item.quantity -= 1;
           this.updateCheckoutPrice(item);
        }
      },
      incrementQuantity(item){
        item.quantity += 1;
        this.updateCheckoutPrice(item);
      },
      updateCheckoutPrice(item){
        item.checkoutPrice = item.productPrice * item.quantity
      },
    }, 
    beforeMount(){
      const memberId = this.memberId;
      // console.log(memberId)
      httpClient.get('/ShoppingCart?memberId=' + memberId)
      .then((res)=>{
        // console.log(res.data)
        let items = res.data
        for(let item of items){
          this.shoppingCartItems.push(item)
          console.log(item)
        }
      })
      .catch((error) => {
        console.error(error);
      });
    },
      
}

</script>

<template>

  <h1 style="text-align:center; margin:40px" class="cart-items-title">購物車
  <span class="cart-items-title-bottomLine"></span>
  </h1>
  <!-- 購物車品項 -->
  <table class="table .table-striped" style="width: 1600px; margin:auto;">
    <thead class="cart-items-head-style">
      <tr>
        <th scope="col">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" style="transform: scale(1.7); border-color:darkgray">
            <label class="form-check-label" for="flexCheckDefault">
              全選
            </label>
        </th>
        <th scope="col">商品</th>
        <th scope="col">單價</th>
        <th scope="col">數量</th>
        <th scope="col">總計</th>
      </tr>
    </thead>
    <tbody v-for="item in shoppingCartItems" :key="item.shoppingCartItemId">
      <tr class="cart-items-info-style">
        <th scope="row">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" style="transform: scale(2); border-color:darkgray">
          </div>
        </th>
        <td>
          <img :src="item.photoData" :alt="item.productName" style="width:250px">
          <span style="font-size:25px; padding: 100px">{{item.productName}}</span>
        </td>
        <td><h6>$ {{item.productPrice}}</h6></td>
        <td>
          <span class="mb-5 mt-5">
            <span class="quantity-controls">
                <button @click="decrementQuantity(item)">－</button>
                <input v-model="item.quantity" type="text" @input="handleNumberInput" style="width:50px; text-align: center;"/>
                <button @click="incrementQuantity(item)">＋</button>
            </span>
          </span> 
        </td>
        <td style="color:darkorange; font-weight:bolder"><h5>$ {{item.checkoutPrice}}</h5></td>
      </tr>
    </tbody>
  </table>

  <div ref="floatingWindowRef" class="floating-window">
      <p>總金額$ </p>
  </div>
</template>

<style>
  .cart-items-head-style{
    font-size: 25px;
    font-style: oblique;
    line-height: 60px;
    text-align: center;
  }
  .cart-items-info-style{
    text-align: center;
    vertical-align: middle;
  }
  .cart-items-title-bottomLine{
        position: absolute; 
        bottom: 0; 
        left: 50%; 
        transform: translateX(-50%);
        width: 100px; 
        height: 4px; 
        background-color: darkgray; 
        margin-bottom: -5px;
  }
  .cart-items-title{
        text-align:center; 
        margin: 40px; 
        position: relative; 
        font-weight: bold
  }
  .floating-window {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f58b3f;
    padding: 10px;
    border: 1px solid #ccc;
    box-shadow: 10px 0px 10px rgba(108, 3, 3, 0.1);
    z-index: 1000;
    width: 800px;
  }

</style>