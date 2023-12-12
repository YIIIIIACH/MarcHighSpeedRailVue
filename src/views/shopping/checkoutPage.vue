<script>
    import httpClient from "@/main";
    import { ref, reactive } from "vue";

    export default {
        props:['memberId', 'checkoutPrice'],
        emits: ['updateMemberId'],
        setup(props){
            return{
                selectedItems: ref([]),
            }
        },
        methods: {
            showArray(){
                console.log(this.selectedItems)
            }
        },
        beforeMount(){
            // 以 key 抓本地儲存庫資料
            let items = localStorage.getItem('items');
            // 資料轉 js 陣列
            let itemsArray = JSON.parse(items);

            for( let i = 0 ; i<itemsArray.length ; i++){
                this.selectedItems.push( itemsArray[i]);
            }
        }
    }
</script>

<template>
    <header>
        <h3 style="text-align: center">訂單商品</h3>
    </header>
    <article>   
        <table class="table">
            <thead class="table-info">
                <tr>
                    <th scope="col" >訂單商品</th>
                    <th></th>
                    <th scope="col">單價</th>
                    <th scope="col">數量</th>
                    <th scope="col">總價</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" item in this.selectedItems" :key="item.shoppingCartItemId" class="checkout-items">
                    <th scope="row" colspan="1">
                        <img :src="item.photoData" :alt="item.productName" style="width:100px">    
                    </th>
                    <td><span>{{item.productName}}</span></td>
                    <td rowspan="1">$ {{item.productPrice}}</td>
                    <td>{{item.quantity}}</td>
                    <td>$ {{item.totalPrice}}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th></th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="text-align: right;">
                        <p style="margin: 50px;">結帳總金額:$ <span style="color:red; font-size: 20px; padding-right:10px">{{this.checkoutPrice}}</span><span><button type="button" class="btn btn-primary">確認結帳</button></span></p>     
                    </td>
                </tr>
            </tfoot>
        </table>
    </article> 
    
    <article>
        <div class="buyer-info mx-auto">
            <h3 style="text-align: center">訂購人資料</h3>
            <div class="input-group mb-3">
                <span class="input-group-text">訂購人姓名</span>
                <input type="text" class="form-control" placeholder="請輸入真實中文姓名" aria-label="Server">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">電話</span>
                <input type="text" class="form-control" placeholder="Ex : 0912345678" aria-label="Username" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">收貨地址</span>
                <input type="text" class="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1">
            </div>
            <div class="input-group">
                <span class="input-group-text">備註:</span>
                <textarea class="form-control" aria-label="With textarea"></textarea>
            </div>
        </div>

        <div style="text-align: right;">
            <p style="margin: 50px;">結帳總金額:$ <span style="color:red; font-size: 20px; padding-right:10px">{{this.checkoutPrice}}</span><span><button type="button" class="btn btn-primary">確認結帳</button></span></p>     
        </div>
    </article>
</template>

<style>
    .buyer-info{
        width:40%;
        text-align: center;
        margin-bottom: 100px;
    }
    button{
        width:100px;
    }
    .table{
        width:80%;
        border: solid;
        justify-content: center;
    }
    .checkout-items{
        vertical-align: middle;
    }
     th,td{
        border: solid;
    } 
</style> 