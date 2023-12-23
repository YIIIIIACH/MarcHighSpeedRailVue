<script>
import httpClient from "@/main";
import { ref, reactive} from "vue";
export default {
    props:['memberId'],
    emits:['updateMemberId'],
    setup(props) {
        return{
            trackingProducts : ref([]),
            highlightId: ref(0),
        }
    },
    methods:{
        goToGoodsDetail(productId) {
            this.$router.push({ name: 'goods-detail', params: { Id: productId } });
        },  
        handleMouseOver: function(productId) {
            this.highlightId = productId;
        },
        handleMouseLeave: function() {
            this.highlightId = null;
        },
        addItemToShoppingCart(t){

            if( this.memberId==''){
            document.getElementById('login-modal-open-btn').click();
            return ;
            }
            httpClient.post('/ShoppingCart/addProduct?productId=' + t.productId + '&' + 'memberId=' + this.memberId)
            .then((res)=>{
            console.log(res)
            })
            t.showAddInCart = true
            setTimeout(function(){t.showAddInCart=false},1500)
        },
        deleteTracking(tId){
            httpClient.delete('/ProductTrackingList/delete?mId=' + this.memberId + '&tId=' + tId)
            .then((res)=>{
                console.log(res.data)
            })
            .catch((err)=>{
            console.log(err)
            })

            for(let i = 0 ; i < this.trackingProducts.length ; i++){
                if(this.trackingProducts[i].trackingId == tId){
                    this.trackingProducts.splice(i,1)
                    continue;
                }

            }
        }
    },
    beforeMount() {
        httpClient.get('/ProductTrackingList?mId=' + this.memberId)
        .then(res =>{
            console.log(res.data)
            for(let tracking of res.data){
                this.trackingProducts.push(tracking)
            }
        })
    },
}
</script>
<template>
    <div id="main-content">
        <h1 style="text-align:center; margin:30px">追蹤清單</h1>
        <hr>
        <div class="product-container">
            <div v-for="t of trackingProducts" :key="t.trackingId">
                <div class="card card-gap" @click="goToGoodsDetail(t.productId)">
                    <div @mouseover="handleMouseOver(t.productId)" @mouseleave="handleMouseLeave" :style="{ border: highlightId === t.productId ? '1px solid rgb(221, 112, 112)' : 'none','pos-ab': t.showAddInCart}" style="height:400px">
                        <p style="text-align:end;" @click.stop="deleteTracking(t.trackingId)" ><span style="cursor: pointer">X</span></p>
                        <img :src="t.photoData" class="card-img-top" :alt="t.productName" style="height:200px">
                        <div v-show="t.showAddInCart" class="inimg-notification">已加入購物車</div>
                        <div class="card-body">
                            <p class="card-title">{{t.productName}}</p>
                            <div>
                                <p style="color:#EA7500;">${{t.productPrice}}</p>
                            </div>
                            <button class="btn btn-success mt-1 add-btn" @click.stop="addItemToShoppingCart(t) " type="submit">加入購物車</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style >
    .product-container {
    display: flex;
    justify-content:flex-start;
     flex-wrap: wrap;
    }
    .inimg-notification {
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(57, 53, 46, 0.6);
    color: white;
    padding: 15px;
    border-radius: 10px;
    z-index: 1000;
    }
    .card-gap{
    width: 12rem; 
    box-shadow: 5px 5px 5px #EBD6D6;
    }
    .card-title{
        font-size: 14px;
    }
    #main-content{
        width:70%;
        margin: auto;
    }
</style>