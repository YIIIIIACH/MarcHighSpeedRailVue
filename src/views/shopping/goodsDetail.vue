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
    <br>    
    <h1 class="display-5" style="text-align:center">{{this.product.value.productType}}</h1>
    <br>
    <img :src="this.product.value.photoData" class="rounded float-start" alt="this.product.value.productName" style="width:650px">
    <dl class="row">
        <h1 class="display-6">{{this.product.value.productName}}</h1><br>
        <h1 class="display-6">建議售價$ {{this.product.value.productPrice}}</h1>
        <h1 class="display-6">{{this.product.value.productDescription}}</h1>
        
    </dl>

    
</template>

<style>
    
</style>