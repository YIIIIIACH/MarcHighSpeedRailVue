<script>
import httpClient from "@/main";
import { ref, reactive} from "vue";
export default {
    props:['memberId'],
    emits:['updateMemberId'],
    setup(props) {
        return{
            orders: ref([]),
            productIds: ref([]),
            products: ref([]),
        }
    },
    methods:{
        toPayPal(order){
            let productIds = []
            let sum = 0;
            if(order.orderStatus == '已付款'){
                alert('此訂單已付款')
                return;
            }else{
                for( let i=0; i< order.products.length; i++){
                    for( let j=0; j< order.quantity[i] ; j++){
                        // productIds.push( order.products[i])
                        sum+= order.products[i].productPrice;
                    }
                }
                httpClient.post('/createPaypalOrder',{
                    orderId: order.orderId,
                    memerId: this.memberId,
                    totalPrice: sum
                }).then((res)=>{
                   console.log(res.data)
                   if( res.status==200){
                    
                        let json = res.data;
                        for( let linkObj of json['links']){
                            if( linkObj['rel'] == 'approve'){
                                window.location= linkObj['href']
                            }
                        }
                        return;
                    }
                    alert('create paypal order failed')
                })
            }
        }
    },
    beforeMount() {
        httpClient.get('/OrderHistory?memberId=' + this.memberId)
        .then((res)=>{
            let orders = res.data
            for(let order of orders){
                console.log(order)
                this.orders.push(order)
                this.productIds.push(order.productId)
            }
                // console.log(this.productIds)
        })
        .then(()=>{
            httpClient.get('/product/findByProductIds?productIds=' + this.productIds.join(','))
            .then((res)=>{
                console.log(res.data)
                let resProducts = res.data
                for(let product of resProducts){
                    this.products.push(product)
                }
                    // console.log(this.products)
            })
        })
    },
}
</script>

<template>
 <h1 style="text-align:center; margin:30px">訂購紀錄</h1>
    <div class="order-history-info mx-auto">
        <table class="table" v-for="order of orders" :key="order.orderId">
            <thead class="table-info">
                <tr>
                <th scope="col">訂單編號</th>
                <th scope="col">訂單成立日期</th>
                <th scope="col">訂單完成日期</th>
                <th scope="col">訂單金額</th>
                <th scope="col">訂單狀態</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">{{order.orderNumber}}</th>
                <td>{{order.orderCreationDate}}</td>
                <td>{{order.orderCompletionDate}}</td>
                <td>$ {{order.totalPrice}}</td>
                <td>{{order.orderStatus}}</td>
                </tr>
            </tbody>
                <div>
                    <button type="button" class="btn btn-success" @click="toPayPal(order)">前往付款</button>
                </div>
                <!-- <p>訂單細項</p>
                <div>

                </div> -->
                <!-- <div v-for="(pd,index) of item.photoData" :key="pd[index]">
                    <p></p>
                    <img :src="pd" :alt="item.product" style="width:100px">  
                    <div v-for="(p, index) of item.products" :key="p[index]">
                        <p>{{p.productName}}</p> 
                    </div>      
                </div> -->
        </table>
        
    </div>
</template>
<style>
    .order-history-info{
        width:1000px;
    }
    .table{
        text-align: center;
    }
</style>