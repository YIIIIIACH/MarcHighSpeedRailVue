<script>
  import httpClient from "@/main";
  import { ref, reactive } from "vue";
  export default {
      props:['memberId'],
      emits: ['updateMemberId'],
      setup(props) {
        return{
          account: ref(''),
          password: ref(''),
          userName: ref(''),
          // memberId: ref(props.memberId),
          shoppingCartItems: reactive([]),
          // quantity: ref(1),
          selectAll: false,
          isHovered: false,

          checkoutPrice:ref(0),
          passwordVisible:ref(false),

          currentPage: ref(1),
          perpage: ref(3),
          
          // forCheckoutItemsId: reactive([]),
        }
      },
      computed:{
        getSelectedTotalPrice(){
          let total= 0;
          for( let item of this.shoppingCartItems){
            if(item.isSelected){
              total += item.productPrice*item.quantity;
            }
          }
          return total;
        },
        getCurrentPwdInputType(){
        return (this.passwordVisible==true)?'text':'password'
        },
        isLogined(){              
          return (this.memberId == 'undefined')? false: true;
        },
        totalPage() {
          return Math.ceil(this.shoppingCartItems.length / this.perpage)
          //Math.ceil()取最小分頁整數
        },
        pageStart() {
          return (this.currentPage - 1) * this.perpage
          //取得該頁第一個值的index
        },
        pageEnd() {
          return this.currentPage * this.perpage
          //取得該頁最後一個值的index
        }
      },
      watch:{
        getSelectedTotalPrice(total){
          this.checkoutPrice = total
        }
      },
      methods: {
        goToCheckoutPage(){
          // 篩選已勾選的品項
          const selectedItems = this.shoppingCartItems.filter(item => item.isSelected)
          if(selectedItems.length === 0){
            alert('您未選取任何商品，請選取至少一件商品才可前往結帳。')
            return;
          }
          // // 儲存已勾選的品項Id儲存成陣列
          // const selectedIds = selectedItems.map(item => item.shoppingCartItemId);
          // // .join(',') -> 將陣列轉換為逗號分隔的字串以傳輸
          // const selectedIdsString = selectedIds.join(',')

          // 把已勾選的品項物件轉成字串
          const itemsString = JSON.stringify(selectedItems)
          // 把字串以 key:value 形式存到本地庫
          localStorage.setItem('items', itemsString)

          // console.log(itemsString)
          this.$router.push({ name: 'checkoutPage', params:{ memberId: this.memberId, checkoutPrice: this.checkoutPrice} })
        },
        goToGoodsDetail(productId){
          this.$router.push({ name: 'goods-detail', params: { Id: productId } });
        },
        // 處理文字的鼠標進出事件 Style
        changeStyle(itemId, isHovered) {
          const removeTextElement = document.querySelector(`#remove-text-${itemId}`);
          const pNameElement = document.querySelector(`#product-name-${itemId}`);
          // console.log(removeTextElement)

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
                pNameElement.style.color = 'blue'; 
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

          for( let i = 0; i < this.shoppingCartItems.length ; i++){
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
        // handleNumberInput(){
        //   this.quantity = this.quantity.replace(/\D/g, '');
        // },

        inputQuantity(item){
          if(item.quantity >= 1){
            httpClient.put('/ShoppingCart/update?memberId=' + this.memberId + '&quantity=' + item.quantity + '&itemId=' + item.shoppingCartItemId)
            .then((res)=>{
              console.log(res)
            })
            this.updateTotalPrice(item);
          }
        },
        //  品項數量增減
        decrementQuantity(item,itemPrice){
          if (item.quantity > 1) {
            item.quantity -= 1;
            httpClient.put('/ShoppingCart/update?memberId=' + this.memberId + '&quantity=' + item.quantity + '&itemId=' + item.shoppingCartItemId)
            .then((res)=>{
              console.log(res)

            })
            this.updateTotalPrice(item);
            //  totalPrice -= itemPrice;
          }
        },
        incrementQuantity(item,itemPrice){
          item.quantity += 1;
          httpClient.put('/ShoppingCart/update?memberId=' + this.memberId + '&quantity=' + item.quantity + '&itemId=' + item.shoppingCartItemId)
          .then((res)=>{
            console.log(res)
          })
          this.updateTotalPrice(item);
          // totalPrice += itemPrice;
        },

        // 設定分頁
        setPage(page) {
          if(page <= 0 || page > this.totalPage) {
              return //結束方法
          }
          this.currentPage = page
        },

        // 計算金額
        updateTotalPrice(item){
          item.totalPrice = item.productPrice * item.quantity
        },
        login: function() {
          httpClient.post( '/requestMemberLogin',{
            "password": this.password,
            "email": this.account
          },{withCredentials:true})
          .then((res) => {
            if(res.data.member_id == null){
              console.log('login failed')
              return; //中斷, 不執行下面的code
            }
            // console.log(res.data)
            this.userName= res.data.member_name;
            // this.memberId = res.data.member_id;

            this.$emit('updateMemberId', res.data.member_id);
            document.getElementById('login-modal-close-btn').click();
          })
        },
        logout: function(){
          this.$emit('updateMemberId','undefined')
          this.userName = ''
        },
      }, 
      beforeMount(){
        httpClient.post('/verifyLoginToken',{},{withCredentials:true})
        .then((res) => {
          console.log(res.data)
          if( res.status == 200){
            this.$emit('updateMemberId', res.data)
            console.log('emits to update memberid')
          }
        })
        .catch(err=>console.log(err))

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
  <!-- 登入登出 -->
  <div style="display: flex; justify-content: flex-end;" >
      <button type="button" class="btn btn-outline-primary" @click="logout()" v-if="isLogined">
        登出
      </button>
      <button type="button" id="login-modal-open-btn" class="btn btn-primary login-btn" data-bs-toggle="modal" data-bs-target="#exampleModal"
      v-else>
        登入
      </button>
  </div>

  <!-- 購物車內容 -->
  <div v-if="this.memberId === 'undefined'" style="text-align: center">
    <br>
    <br>
    <h1>請先<span data-bs-toggle="modal" data-bs-target="#exampleModal" style="cursor: pointer; color:blue">登入</span>會員，即可查看購物車</h1>
  </div>
  <div v-else>
    <div style="width:70%; margin: auto">
      <h1 style="text-align:center; margin:30px">🛒 購物車</h1>
      <hr>
    </div>
    <!-- <span class="cart-items-title-bottomLine"></span> -->
    <!-- 購物車品項 -->
    <!-- <div v-if="this.shoppingCartItems.length === 0">
      <h2 style="text-align:center; margin:30px">您的購物車是空的。</h2>
    </div> -->
    <div style="padding:0% 15% 2% 15%">
      <table class="table" style="margin:auto 0%; text-align:center" ><!--style="width: 1600px; margin:auto;"-->
        <thead>
          <tr class="cart-head-style table-info">
            <th scope="col" style="width:70px">
                <input class="form-check-input" type="checkbox" id="flexCheckDefault" style="transform: scale(1); border-color:darkgray; " v-model="selectAll" @change="handleSelectAll"><span style="color:blue">全選</span>
            </th>
            <th scope="col" style="width:280px">商品</th>
            <th scope="col" style="width:200px">商品名稱</th>
            <th scope="col" style="width:250px">單價</th>
            <th scope="col" style="width:130px">數量</th>
            <th scope="col" style="width:170px">小計</th>
            <th scope="col" style="width:100px">
              <span @click="removeAllItem" @mouseover="changeStyle(true)" @mouseleave="changeStyle(false)" id="remove-all-cart-item" >
                全部移除
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="cart-items-info-style" v-for="item in shoppingCartItems.slice(pageStart, pageEnd)" :key="item.shoppingCartItemId">
            <th scope="row" class="narrow-th">
              <div class="form-check" style="display: flex; justify-content: center; align-items: center;">
                <input class="form-check-input" type="checkbox" v-model="item.isSelected" id="flexCheckDefault" style="transform: scale(1.3); border-color:darkgray">
              </div>
            </th>
            <td style="width: 200px;">
              <div @mouseleave="changeStyle(item.shoppingCartItemId, false)" @mouseover="changeStyle(item.shoppingCartItemId, true)">
                <img :src="item.photoData" :alt="item.productName" style="width:150px" @click="goToGoodsDetail(item.productId)">
              </div>     
            </td>
            <td>
              <div style="padding-top:20px">
                <span style="font-size:13px;" @click="goToGoodsDetail(item.productId)" @mouseover="changeStyle(item.shoppingCartItemId, true)" @mouseleave="changeStyle(item.shoppingCartItemId, false)" :id="'product-name-' + item.shoppingCartItemId">{{item.productName}}</span>
              </div>
            </td>
            <td><h6>$ {{item.productPrice}}</h6></td>
            <td>
              <span class="mb-5 mt-5">
                <div class="d-flex justify-content-between">
                    <button @click="decrementQuantity(item)" class="btn btn-outline-secondary btn-sm custom-button">－</button>
                    <!-- <input v-model="item.quantity" type="text" @input="handleNumberInput" style="width:50px;  text-align: center;"/> -->
                    <input v-model="item.quantity" type="number" style="width:50px;  text-align: center;" @blur="inputQuantity(item)"/>
                    <button @click="incrementQuantity(item)" class="btn btn-outline-secondary btn-sm custom-button">＋</button>
                </div>
              </span>
            </td>
            <td style="color:darkorange; font-weight:bolder; width: 80px"><h5>$ {{item.totalPrice}}</h5></td>
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

    <!-- 分頁 -->
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <!-- 上一頁 -->
        <li class="page-item" @click.prevent="setPage(currentPage-1)">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <!-- 頁數 -->
        <li class="page-item" :class="{'active': (currentPage === (page))}"
            v-for="(page, index) in totalPage" :key="index" @click.prevent="setPage(page)">
          <a class="page-link" href="#">{{ page }}</a>
        </li>
        
        <!-- 下一頁 -->
        <li class="page-item" @click.prevent="setPage(currentPage+1)">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>

    <!-- 結帳用懸浮視窗 -->
    <div class="floating-window">
      <div>
        <div class="floating-window-checkbox">
          <input type="checkbox" id="flexCheckDefault"  v-model="selectAll" @change="handleSelectAll">
          <label class="form-check-label" for="flexCheckDefault">全選</label>
        </div>
        <div style="font-weight:bolder padding-left:300px;margin-left: 28%;">
          結帳總金額$ 
          <span style="color: red; font-size: 20px; vertical-align: middle;">{{getSelectedTotalPrice}}</span>
        </div>
        <div class="d-grid gap-2 col-6 mx-auto" style="margin:10px">
          <button class="btn btn-success" type="button" @click="goToCheckoutPage()">前往結帳</button>
        </div>
      </div>
    </div>

  <!-- modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">會員登入</h5>
        </div>
        <div class="modal-body">
        <div class="input-group mb-3 ">
            <span class="input-group-text" id="basic-addon1">帳號：</span>
            <input type="text" v-model="account" class="form-control" placeholder="會員帳號" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">密碼：</span>
            <input  v-model="password" :type="getCurrentPwdInputType" class="form-control" placeholder="會員密碼" aria-label="Username" aria-describedby="basic-addon1"><span class="input-group-text" @click="passwordVisible=(passwordVisible)?false:true">{{ (passwordVisible)?'隱藏密碼':'顯示密碼' }}</span>
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="login" class="btn btn-primary" >登入</button>
          <button type="button" id="login-modal-close-btn" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  #remove-all-cart-item{
    cursor: pointer;
    color: darkgray
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
    background-color: #f4ede7;
    padding: 10px;
    border: 1px solid #ccc;
    box-shadow: 10px 0px 10px rgba(108, 3, 3, 0.1);
    z-index: 1000;
    width: 220px;
    height: 150px;
  }
  .floating-window-checkbox{
    transform: scale(1.2); 
    border-color:darkgray ; 
    margin-left: 40%;
  }
  .cart-items-info-style{
    vertical-align: middle;
    height: 180px;
  }
  .cart-head-style{
    color: blue
  }
  .narrow-th {
    width: 50px;
  }
  
</style>