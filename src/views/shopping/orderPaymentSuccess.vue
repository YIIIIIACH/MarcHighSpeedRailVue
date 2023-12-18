<script setup>
import { onBeforeMount } from "vue"
import httpClient from "../../main";

const props = defineProps(['orderId'])
onBeforeMount(()=>{
    // get the paypal  orderid 
    let paypaltoken = window.location.search;
    paypaltoken = paypaltoken.slice(1)
    paypaltoken = paypaltoken.split('&')[0].split('=')[1]
    console.log( paypaltoken)
    // ajax call back end server to change order status to '已付款'
    httpClient.post('/changeOrderStatus?paypalOrderId=' + paypaltoken,props.orderId, {withCredentials:true})
    .then(res => {
        console.log( res.data)
        if(res.status == 200){
            // alert('product order status change !!')
        }else{
            alert('product order status change failed')
        }
    })
})
</script>
<template>
<div class="container">
    <h3>您已成功付款。</h3>
</div>
</template>
<style></style>