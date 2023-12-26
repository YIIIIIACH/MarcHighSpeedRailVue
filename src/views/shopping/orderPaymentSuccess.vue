<script setup>
import { onBeforeMount } from "vue"
import httpClient from "../../main";

const props = defineProps(['orderId','orderNumber', 'checkoutPrice'])

onBeforeMount(()=>{
    // get the paypal  orderid 
    httpClient.post('/verifyLoginToken',{},{withCredentials:true})
    .then((res) => {
        console.log(res.data)
        if( res.status== 200){
        this.$emit('updateMemberId',res.data)
        console.log( 'emits to update memberid ')
        }
    })
    .catch(err=>console.log(err))
    
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
function copyOrderNumber(){
    let orderNum = document.getElementById('order-number');
    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(orderNum);
        range.select();
        document.execCommand("copy");
        alert("複製成功!");
    }
    else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(orderNum);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        alert("複製成功!");
    } else {
        alert('無法複製內容、瀏覽器不支援');       
    }
}
</script>
<template>
    <div class="res-container">
        <div class="card res-card">
            <div class="card-body">
                <h3 class="paymentSuccseeMsg">您已付款成功。</h3>
                
                <img 
                src="@\assets\checked-mark.webp" 
                alt="成功"
                class="checkedImg-style"
                >
                <hr>
                <div class="cPriceAndoNumber">
                    <p class="card-text">付款金額：{{props.checkoutPrice}} TWD</p>
                    <h6 class="card-subtitle mb-2 text-muted">訂單編號：
                        <span id="order-number">{{props.orderNumber}}</span>
                        <span @click="copyOrderNumber()" class="one-click-copy">Copy</span>
                    </h6>
                    
                </div>
                <br>
                <br>
                <div style="text-align:center">
                    <router-link :to="{ name: 'goods' }" class="card-link">返回購物中心</router-link>
                    <router-link :to="{ name: 'shoppingHistory' }" class="card-link">前往訂購紀錄</router-link>
                </div>
            </div>
        </div> 
    </div>
</template>
<style>
    .one-click-copy{
        cursor: pointer;    
        margin-left: 20px;
        border: 1px gray solid;
        border-radius:5px;
        padding: 3px 5px 3px 5px
    }
    .res-card{
        margin: 100px auto 0px auto;
        width: 25rem;
    }
    .paymentSuccseeMsg{
        margin:20px 0px 30px 0px;
        text-align:center; 
        font-weight:bold;
    }
    .cPriceAndoNumber{
        margin-left: 21px;
    }
    .checkedImg-style{
        width:60%; 
        margin: 10px 50px 30px 65px;
    }
</style>