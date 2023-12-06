<script>
import httpClient from "@/main";
import { ref,onMounted } from "vue";
export default {
    props:['memberId'],
    setup(props) {
      const memberId = ref('');
      const shoppingCartItems = ref([]);
      
      onMounted(() => {
        memberId.value = props.memberId;

        httpClient.get('/ShoppinCart',  {params: {memberId: memberId.value}
        })
        .then((res)=>{
          let items = res.data.cartItems
          for(let item of res.data.cartItems){
            shoppingCartItems.value.push(item)
            console.log(item.product)
          }
        })
      });

      return{
        memberId,
        shoppingCartItems,
      }
    },
        
}
</script>

<template>
<div>
  <div v-for="item of shoppingCartItems.value" :key="item.shoppingCartItemId">
    <input type="checkbox">
    <h1>{{item.product.productName}}</h1>
    <img :src="item.photoData" :alt="item.productName">
    <span>productName  </span>
    <span>productprice</span>
  </div>
  <div>
    <input type="checkbox">
    <img src="" alt="">
    <span>productName  </span>
    <span>productprice</span>
  </div>
  <div>
    <input type="checkbox">
    <img src="" alt="">
    <span>productName  </span>
    <span>productprice</span>
  </div>
</div>
  
</template>