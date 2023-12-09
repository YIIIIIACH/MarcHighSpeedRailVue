<script>
import httpClient from "@/main";
import { ref, reactive } from "vue";
export default {
    props:['memberId'],
    setup(props) {
      return{
        shoppingCartItems: reactive([]),
        quantity: ref(1),
        selectAll: false,
        isHovered: false,
      }
    },
    computed:{
      getSelectedTotalPrice(){
        let checkoutPrice=0;
        for( let item of this.shoppingCartItems){
          if(item.isSelected){
            checkoutPrice += item.productPrice*item.quantity;
          }
        }

        return checkoutPrice;
      }
    },
    mounted() {
    },
/// arr [ 1, 2,3,4,?,?]  when i=3 find same 
// slice( 3,1) => [1,2,3,?] i=3 再檢查一次 continue;
// 
    methods: {
      goToGoodsDetail(productId){
        this.$router.push({ name: 'goods-detail', params: { Id: productId } });
      },
      // 處理文字的鼠標進出事件 Style
      changeStyle(itemId, isHovered) {
        const removeTextElement = document.querySelector(`#remove-text-${itemId}`);
        const pNameElement = document.querySelector(`#product-name-${itemId}`);

          if(removeTextElement) {      
            if (isHovered) {        
              removeTextElement.style.color = '#FF5151'; 
              document.body.style.cursor = 'pointer'; 
            } else {        
              removeTextElement.style.color = 'black'; 
              document.body.style.cursor = 'auto'; 
            }
          }
          if(pNameElement){
            if (isHovered) {        
              pNameElement.style.color = '#FF5151'; 
              document.body.style.cursor = 'pointer'; 
            } else {        
              pNameElement.style.color = 'black'; 
              document.body.style.cursor = 'auto'; 
            }
          }
      },

      // 移除單一品項
      removeItem(itId){
        httpClient.delete('/ShoppingCart/delete?memberId=' + this.memberId + '&itemId=' + itId)
        .then((res)=>{
          console.log(res)
        })
        .catch((err)=>{
          console.log(err)
        })

        for( let i=0; i < this.shoppingCartItems.length;i++){
          if(this.shoppingCartItems[i].shoppingCartItemId == itId){
            this.shoppingCartItems.splice(i,1)
            continue;
          }
        }
        console.log( this.shoppingCartItems);
      },

      // 移除所有品項
      removeAllItem(){
        httpClient.delete(`/ShoppingCart/deleteAll?memberId=${this.memberId}`)
        .then((res)=>{
          console.log(res)
          this.shoppingCartItems.splice(0, this.shoppingCartItems.length);
        })
        .catch(()=>{
          console.log(res)
        })

      },
      // 全選
      handleSelectAll() {
        this.shoppingCartItems.forEach(item => {
          item.isSelected = this.selectAll;
        });
      },

      // 限制輸入型態為數字
      handleNumberInput(){
        this.quantity = this.quantity.replace(/\D/g, '');
      },
      //  品項數量增減
      decrementQuantity(item,itemPrice){
        if (item.quantity > 1) {
          item.quantity -= 1;
           this.updateCheckoutPrice(item);
          //  totalPrice -= itemPrice;
        }
      },
      incrementQuantity(item,itemPrice){
        item.quantity += 1;
        this.updateCheckoutPrice(item);
        // totalPrice += itemPrice;
      },

      // 計算金額
      updateCheckoutPrice(item){
        item.totalPrice = item.productPrice * item.quantity
      },
    }, 
    beforeMount(){
      const memberId = this.memberId;
      // console.log(memberId)
      httpClient.get('/ShoppingCart?memberId=' + memberId)
      .then((res)=>{
        console.log(res.data)
        let items = res.data
        for(let item of items){
          this.shoppingCartItems.push(item)
          // console.log(item)
        }
      })
      .catch((error) => {
        console.error(error);
      });
    },
      
}

</script>

<template>
  
  <h1 style="text-align:center; margin:40px" class="cart-items-title">購物車</h1>
  <span class="cart-items-title-bottomLine"></span>

  <!-- 購物車品項 -->
  <div style="display:flex;justify-content:space-around;padding-left:15%;padding-right:15%;">
    <table class="table .table-striped" style="margin:auto 0%" ><!--style="width: 1600px; margin:auto;"-->
      <thead class="">
        <tr class="cart-items-info-style">
          <th scope="col">
              <input class="form-check-input" type="checkbox" id="flexCheckDefault" style="transform: scale(1.5); border-color:darkgray" v-model="selectAll" @change="handleSelectAll">
              <label class="form-check-label" for="flexCheckDefault">
                全選
              </label>
          </th>
          <th scope="col" style="width:280px">商品</th>
          <th scope="col" style="width:130px">單價</th>
          <th scope="col" style="width:130px">數量</th>
          <th scope="col">總計</th>
          <th scope="col">
            <span style="color: blue" @click="removeAllItem" @mouseover="changeStyle(true)" @mouseleave="changeStyle(false)" id = "removeAll">
              全部移除
            </span>
          </th>
        </tr>
      </thead>
      <tbody v-for="item in shoppingCartItems" :key="item.shoppingCartItemId">
        <tr class="cart-items-info-style">
          <th scope="row">
            <div class="form-check" >
              <input class="form-check-input" type="checkbox" v-model="item.isSelected" id="flexCheckDefault" style="transform: scale(1.5); border-color:darkgray">
            </div>
          </th>
          <td style="width:300px;display:flex">
            <div @mouseleave="changeStyle(item.shoppingCartItemId, false)" @mouseover="changeStyle(item.shoppingCartItemId, true)"><img :src="item.photoData" :alt="item.productName" style="width:150px" @click="goToGoodsDetail(item.productId)" ></div>
            <div style="padding-top:20px"><span style="font-size:13px" @click="goToGoodsDetail(item.productId)" @mouseover="changeStyle(item.shoppingCartItemId, true)" @mouseleave="changeStyle(item.shoppingCartItemId, false)" :id="'product-name-' + item.shoppingCartItemId">{{item.productName}}</span></div>
          </td>
          <td><h6>$ {{item.productPrice}}</h6></td>
          <td>
            <span class="mb-5 mt-5">
              <span class="quantity-controls">
                  <button @click="decrementQuantity(item)" class="btn btn-outline-secondary btn-sm">－</button>
                  <input v-model="item.quantity" type="text" @input="handleNumberInput" style="width:50px;  text-align: center;"/>
                  <button @click="incrementQuantity(item)" class="btn btn-outline-secondary btn-sm">＋</button>
              </span>
            </span>
          </td>
          <td style="color:darkorange; font-weight:bolder"><h5>$ {{item.totalPrice}}</h5></td>
          <td>
            <p >
              <span :id="'remove-text-' + item.shoppingCartItemId" @mouseover="changeStyle(item.shoppingCartItemId, true)" @mouseleave="changeStyle(item.shoppingCartItemId, false)" @click="removeItem(item.shoppingCartItemId)">
                移除
              </span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 結帳用懸浮視窗 -->
  <div class="floating-window">
    <div style="floating-window">
      <div>
        <input type="checkbox" id="flexCheckDefault" class="floating-window-checkbox" v-model="selectAll" @change="handleSelectAll">
        <label class="form-check-label" for="flexCheckDefault">全選</label>
      </div>
      <div style="font-weight:bolder padding-left:300px;">
        結帳總金額$ 
        <span style="color: red; font-size: 25px; vertical-align: middle">{{getSelectedTotalPrice}}</span>
      </div>
      <div class="d-grid gap-2 col-6 mx-auto" style="margin:30px">
        <button class="btn btn-primary" type="button">結帳</button>
      </div>
    </div>
  </div>
</template>

<style>
  .cart-items-head-style{
    font-size: 20px;
    font-style: oblique;
    line-height: 60px;
    text-align: center;
  }
  .cart-items-info-style {
    text-align: center;
    vertical-align: middle;
    display: flex;
    justify-content: space-around;
    align-content: center;
  }
  td, th{
    display: flex;
    align-items: center;
  }
  .cart-items-title-bottomLine{
    position: absolute; 
    bottom: 0; 
    left: 50%; 
    transform: translateX(-50%);
    /*width: 100px;*/ 
    height: 4px; 
    background-color: darkgray; 
    margin-bottom: -5px;
  }
  .cart-items-title{
    text-align:center; 
    margin: 40px; 
    position: relative; 
    font-weight: bold
  }
  .floating-window {
    position: fixed;
    bottom: 10px;
    left: 92%;
    transform: translateX(-50%);
    background-color: #f6dbc8;
    padding: 10px;
    border: 1px solid #ccc;
    box-shadow: 10px 0px 10px rgba(108, 3, 3, 0.1);
    z-index: 1000;
    width: 250px;
    height: 150px;
  }
  .floating-window-checkbox{
    transform: scale(1.2); 
    border-color:darkgray ; 
    padding-left: 100px;
  }

</style>