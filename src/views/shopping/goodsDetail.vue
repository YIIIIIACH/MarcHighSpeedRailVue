<script>
import httpClient from "@/main";
import { ref, reactive} from "vue";
export default {
        props:['Id'],
        setup(props) {
            return{
                product: ref({}),
                quantity: ref(1),
                productType: ref(''),
                recommendProducts: ref([]),
            }            
        },
        methods:{
            // 加入購物車
            addItemToShoppingCart(productId){
            const memberId = 'E28B7835-B93D-4560-AD49-8E1D77F3C0F0'
            httpClient.post('/ShoppinCart/addProductToCart?productId=' + productId + '&' + 'memberId=' + memberId)
            .then((res) =>{
                alert(res.data)
            }
            )},
            decrementQuantity(){
                if (this.quantity > 1) {
                    this.quantity -= 1;
                }
            },
            incrementQuantity(){
                // if(this.quantity < 5){
                    this.quantity += 1;
                // }
            },
            handleNumberInput(){
                this.quantity = this.quantity.replace(/\D/g, '');
            }
        },
        beforeMount() {
            const productId = this.Id
    
            httpClient.get(`/api/product/${productId}`)
            .then((res) =>{
                //物件用.value
                //陣列用.push()
                this.product.value = res.data
                this.productType = res.data.productType
            })
            .then(() =>{
                    httpClient.get('/product/findByType?selectType=' + this.productType)
                    .then((res)=>{
                        // console.log(res.data)
                        for(let p of res.data){
                            this.recommendProducts.push(p)
                        }
                    })
            })
        },
        onMounted() {
            
        }
}
</script>

<template>    
    <h1 class="display-5" id="productType-head">{{this.product.value.productType}}
        <span class="productType-head-bottomLine"></span>
    </h1>
    <div class="product-section">
        <img :src="this.product.value.photoData" class="rounded float-start img-customize" alt="this.product.value.productName">
    </div>
    <div class="row">
        <h1 class="display-6 mb-1" style="color:darkblue">{{this.product.value.productName}}</h1><br>
        <hr style="width: 90%; margin: 0px;">
        <h4 class="mb-5 mt-5">
            <small class="text-muted ">建議售價 </small>
            <span :style="{ color: 'red' }">${{this.product.value.productPrice}}</span>
            <hr style="width: 90%; margin: 0px;">
        </h4>
        <h4 class="mb-5">{{this.product.value.productDescription}}</h4>
        <h5 class="mb-5 mt-5">數量  
            <span class="quantity-controls">
                <button @click="decrementQuantity">–</button>
                <input v-model="quantity" type="text" @input="handleNumberInput" style="width:50px; text-align: center;"/>
                <button @click="incrementQuantity">＋</button>
             </span>
        </h5>    
             <hr style="width: 90%; margin: 0px;">
    </div>

    <div class="mt-5">
        <button type="button" class="btn btn-primary mx-5" @click="addItemToShoppingCart(this.id)">加入購物車</button>
        <button type="button" class="btn btn-primary mx-5" data-bs-toggle="button" autocomplete="off">直接購買</button>
        <button type="button" class="btn btn-primary mx-5" data-bs-toggle="button" autocomplete="off">加入追蹤</button>
    </div>
    <br>
    <br>
    <hr style="width: 90%; margin: 20px auto;">
    <br>
    <!-- <div style="display: flex; flex-direction: column;justify-content:center; align-items: center;text-align: center;">
        <h2 style="margin-bottom: 10px;">推薦商品</h2>
        <div style="display: flex; justify-content: space-around;">
            <div style="width: 230px;">
                <img :src="recommendProducts[0].photoData" :alt="recommendProducts[0].productName" style="width:100%">
                <p>{{recommendProducts[0].productName}}</p>
            </div>
            <div style="width: 230px;">
                <img :src="recommendProducts[1].photoData" :alt="recommendProducts[1].productName" style="width:100%">
                <p>{{recommendProducts[1].productName}}</p>
            </div>
            <div style="width: 230px;">
                <img :src="recommendProducts[2].photoData" :alt="recommendProducts[2].productName" style="width:100%">
                <p>{{recommendProducts[2].productName}}</p>
            </div>
            <div style="width: 230px;">
                <img :src="recommendProducts[3].photoData" :alt="recommendProducts[3].productName" style="width:100%">
                <p>{{recommendProducts[3].productName}}</p>
            </div>
            <div style="width: 230px;">
                <img :src="recommendProducts[4].photoData" :alt="recommendProducts[4].productName" style="width:100%">
                <p>{{recommendProducts[4].productName}}</p>
            </div>
        </div>
    </div> -->
</template>

<style>
    .img-customize{
        /* border: 2px solid; */
        width: 460px;
        margin: 0px 80px 0px 200px;
    }
    .product-section{
        /* display: flex; */
        flex-wrap: wrap;
    }
    .productType-head-bottomLine{
        position: absolute; 
        bottom: 0; 
        left: 50%; 
        transform: translateX(-50%);
        width: 100px; 
        height: 4px; 
        background-color: darkgray; 
        margin-bottom: -5px;
    }
    #productType-head{
        text-align:center; 
        margin: 40px; 
        position: relative; 
        font-weight: bold
    }
    .recommend-product{
        width: 10px;
    }
</style>