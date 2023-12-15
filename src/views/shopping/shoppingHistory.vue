<script>
import httpClient from "@/main";
import { ref, reactive} from "vue";
export default {
    props:['memberId'],
    emits:['updateMemberId'],
    setup(props) {
        return{
            orderItems: ref([]),
            productIds: ref([]),
            products: ref([]),
        }
    },

    beforeMount() {
        httpClient.get('/OrderHistory?memberId=' + this.memberId)
        .then((res)=>{
            let orderItems = res.data
            for(let item of orderItems){
                // console.log(item)
                this.orderItems.push(item)
                this.productIds.push(item.productId)
            }
                // console.log(this.productIds)
        })
        .then(()=>{
            httpClient.get('/product/findByProductIds?productIds=' + this.productIds.join(','))
            .then((res)=>{
                // console.log(res.data)
                let resProducts = res.data
                for(let product of resProducts){
                    this.products.push(product)
                }
                    console.log(this.products)
            })
        })
    },
}
</script>

<template>
 <h1 style="text-align:center; margin:30px">訂購紀錄</h1>
    <div class="order-history-info mx-auto">
        <table class="table" v-for="item of orderItems" :key="item.orderId">
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
                <th scope="row">{{item.orderNumber}}</th>
                <td>{{item.orderCreationDate}}</td>
                <td>{{item.orderCompletionDate}}</td>
                <td>$ {{item.totalPrice}}</td>
                <td>{{item.orderStatus}}</td>
                </tr>
            </tbody>
                <p>訂單細項</p>
            <div v-for="p of products" :key="p.productId">
                <p></p>
                <img :src="p.photoData" alt="" style="width:150px"> 
                <p>{{p.productName}}</p>       
            </div>
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