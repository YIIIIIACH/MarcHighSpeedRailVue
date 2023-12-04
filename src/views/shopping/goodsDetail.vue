<script>
import httpClient from "@/main";
import { ref, reactive, onMounted } from "vue";
export default {
        props:['id'],
        setup(props) {
            return{
                product: ref({}),
            }            
        },

        beforeMount() {
            const productId = this.id;

            httpClient.get(`http://localhost:8080/MarcHighSpeedRail/api/product/${productId}`)
            .then((res) =>{
                //物件用.value
                //陣列用.push()
                this.product.value = res.data

            })
            .catch((err) => {
            console.log(err);
            });
        },
        onMounted() {
            
        }
}
</script>

<template>    
    <h1 class="display-5" style="text-align:center; margin: 40px">{{this.product.value.productType}}</h1>
    <div class="product-section">
        <img :src="this.product.value.photoData" class="rounded float-start img-customize" alt="this.product.value.productName">
    </div>
    <div class="row">
        <h1 class="display-6 mb-5">{{this.product.value.productName}}</h1><br>
        <h4 class="mb-5">
            <small class="text-muted ">建議售價 </small>
            <span :style="{ color: 'red' }">${{this.product.value.productPrice}}</span>
        </h4>
        <h3 class="mb-5">{{this.product.value.productDescription}}</h3>
        <h4 class="mb-5 mt-5">數量 
            <span>
            </span>
        </h4>    
    </div>

    <div class="mt-5">
        <button type="button" class="btn btn-primary mx-5" data-bs-toggle="button" autocomplete="off">加入購物車</button>
        <button type="button" class="btn btn-primary " data-bs-toggle="button" autocomplete="off">直接購買</button>
    </div>
</template>

<style>
    .img-customize{
        /* border: 2px solid; */
        width: 500px;
        margin: 0px 80px 0px 200px;
    }
    .product-section{
        /* display: flex; */
        flex-wrap: wrap;
    }
    /* .product-data{
        background: rgb(237, 237, 241);
    } */
</style>