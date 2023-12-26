<script>
  import httpClient from "@/main";
  import { ref, reactive, onMounted } from "vue";
  export default {
    props:['memberId'],
    // $emits('updateMemberId', [arg1, arg2])// log out
    emits:['updateMemberId'],
    setup(props) {
      return {
        account: ref(''),
        password: ref(''),
        userName: ref(''),
        // memberId: ref(props.memberId),
        filterMode: ref('全部商品'),
        products: ref([]), //要渲染的商品資料

        source_products: ref([]), //原始商品資料，用於暫存所有資料

        keyword: ref(""), 

        minPrice: ref(""),
        maxPrice: ref(""),

        productType: ref("全部商品"),

        highlightId: ref(0),

        currentPage: ref(1),
        perpage: ref(8), //一頁的商品資料數

        priceErrorMessage: ref(''),

        notification: ref(''),
        showNotification: false,
        passwordVisible:ref(false),

      };
    },
    computed: {
      
      isLogined(){
        return (this.memberId == 'undefined')? false: true;
      },
      getCurrentPwdInputType(){
        return (this.passwordVisible==true)?'text':'password'
      },
      totalPage() {
        return Math.ceil(this.products.length / this.perpage)
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
    // onMounted(){
    //   const allCookies = document.cookie.split(';');
    //     for(let c of allCookies){
    //         const [name, value] = c.trim().split('=');
    //         if(name  === "member-name"){
    //             this.userName = value
    //             console.log(this.userName)
    //             console.log("55664")
    //             break;
    //         }
    //     }
    // },
    methods: {
      // 加入追蹤清單
      addProductToTrackingList(p){
        if(this.memberId == ''){
          document.getElementById('login-modal-open-btn').click();
          return ;
        }
        httpClient.post('/ProductTrackingList/add',{
          pId: p.productId,
          mId: this.memberId
        })
        .then((res)=>{
          console.log(res.data)
        })
        p.showAddInTracking = true
        setTimeout(function(){p.showAddInTracking=false},1500)

        p.isTracking = true;
      },
      cancelTracking(p){
        httpClient.delete('/ProductTrackingList/delete2?mId=' + this.memberId + '&pId=' + p.productId)
            .then((res)=>{
                console.log(res.data)
            })
            .catch((err)=>{
            console.log(err)
            })
        p.isTracking = false;
      },
      // 加入購物車
      addItemToShoppingCart(p){
        // const memberId = '123abc'
        if( this.memberId==''){
          // not login stat need to login 
          document.getElementById('login-modal-open-btn').click();
          return ;
        }
        httpClient.post('/ShoppingCart/addProduct?productId=' + p.productId + '&' + 'memberId=' + this.memberId)
        .then((res)=>{
          console.log(res)
          if(res.data == "商品已在購物車中。"){
            alert("商品已在購物車中，無需重複添加")
          }else{
            p.showAddSuccseeInCartMessage = true
            setTimeout(function(){p.showAddSuccseeInCartMessage=false}, 1500)
          }
        })
      },
      // 導向商品詳細頁
      goToGoodsDetail(productId) {
        this.$router.push({ name: 'goods-detail', params: { Id: productId } });
      },    
    // addItemToShoppingCart(productId){
    //   if(this.memberId==''){
    //     document.getElementById('login-modal-open-btn').click()
    //   }
    //   console.log( 'found was in login state')
      // const memberId = '123abc'
      // httpClient.post('/ShoppingCart/addProduct?productId=' + productId + '&' + 'memberId=' + this.memberId,{},{
      //   withCredentials:true
      // })
      // .then((res) =>{
      //   if(res.data == '商品已在購物車中。'){
      //     this.notification = res.data
      //     this.showNotification = true;
      //     setTimeout(()=>{
      //       this.showNotification = false;
      //     }, 100)
      //   }else{
      //     this.notification = res.data
      //     this.showNotification = true;
      //     setTimeout(()=>{
      //       this.showNotification = false;
      //     }, 100)
      //   }
      // })
      // .catch((err)=>{
      //   console.log(err.data)
      // })
      // },
      

      //設定分頁
      setPage(page) {
          if(page <= 0 || page > this.totalPage) {
              return //結束方法
          }
          this.currentPage = page
      },

      //關鍵字搜尋 
      searchByKeyword: function () {
        document.getElementById('product-type-allproduct').click();
        this.products = [];
        httpClient.get("/product/findByNameLike?nameInput=" + this.keyword)
          .then((res) => {
            let kps = res.data;
            for (let p of kps) {
              this.products.push(p);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      //價格區間搜尋
      searchByPrice: function () {
        this.priceErrorMessage = ''
        if(this.minPrice == ''){
          this.priceErrorMessage = '請輸入最小值'
        }else if(this.maxPrice == ''){
          this.priceErrorMessage = '請輸入最大值'
        }
        //   else if((this.minPrice >> this.maxPrice) || isNaN(this.minPrice) || isNaN(this.maxPrice)){
        //   this.priceErrorMessage = '請輸入合法數值'
        // }
        else{
          this.products = [];
          httpClient.get( "/product/findByPrice?firstPrice=" + this.minPrice + "&" + "secondPrice=" + this.maxPrice)
          .then((res) => {
            let pps = res.data;
            // console.log(pps)
            if(this.filterMode != '全部商品'){
              pps = pps.filter(p => p.productType == this.filterMode);
            }
            for (let p of pps) {
              this.products.push(p);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        }
      },
      clearPrice: function(){
        this.priceErrorMessage = '',
        this.maxPrice = '',
        this.minPrice = ''
      },
      selectedType(type) {
        this.minPrice = '';
        this.maxPrice = '';
        this.priceErrorMessage = '';

        this.filterMode = type;
        // retunr page number to 1 
        this.currentPage= 1;
          // 2. 參數(type) asign 給 productType
        this.productType = type;
          // 3. p 代表 source_products 裡所有的 product , 將參數(type) asign 給 p.productType
          if(this.filterMode != '全部商品'){
            this.products = this.source_products.filter(p=>p.productType==type);
          }else{
            this.products = this.source_products
          }
      },

      // 游標進出事件
      handleMouseOver: function(productId) {
        this.highlightId = productId;
      },
      handleMouseLeave: function() {
        this.highlightId = null;
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
          this.userName = res.data.member_name;
          // console.log(this.userName)
          // this.memberId = res.data.member_id;
          this.$emit('updateMemberId', res.data.member_id);
          document.getElementById('login-modal-close-btn').click();
        })
      },
      logout: function(){
        // httpClient.post('/logout')
        // .then((res)=>{
          this.$emit('updateMemberId','undefined')
          this.userName = ''
          // console.log(res.data)
        // })
        // .catch((err)=>{
        //   console.error('登出失敗', err);
        // })
      },
    },
    beforeMount() {

      httpClient.post('/verifyLoginToken',{},{withCredentials:true})
        .then((res) => {
          // console.log(res.data)
          if( res.status == 200){
            this.$emit('updateMemberId', res.data)
            // console.log( 'emits to update memberid ')
          }
        })
        .catch(err=>console.log(err))
        
      // fetch all product and pages before mount
      // httpClient.get("/products")
        httpClient.get("/products?mId=" + this.memberId)
        .then((res) => {
          let ps = res.data;
          // let page = res.data;
          // let ps = page.content;
          // this.totalPages = page.totalPages

          for (let p of ps) { 
              // 1. 遍歷出來的 product 放到 source_products & products
            this.source_products.push(p);
            this.products.push(p);
          }

        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
</script>

<template>
  <!-- 登入登出按鈕 -->
  <div style="display: flex; justify-content: flex-end;" >
      <button type="button" class="btn btn-outline-primary" @click="logout()" v-if="isLogined">
        登出
      </button>
      <button type="button" id="login-modal-open-btn" class="btn btn-primary login-btn" data-bs-toggle="modal" data-bs-target="#exampleModal"
      v-else>
        登入
      </button>
  </div>

  <div id="test">
    <!-- 搜尋欄 -->
    <div class="search-bar">
      <input class="form-control me-2" type="search" placeholder="請輸入關鍵字" aria-label="Search" v-model="keyword"/>
      <button class="btn btn-outline-success" @click="searchByKeyword" style="width:100px">搜尋</button>
    </div>
    
    <!-- 分類 -->
    <nav class="navbar navbar-expand-lg bg-light justify-content-center" >
      <ul class="navbar-nav center" style="display: flex; justify-content: center;">
          <!-- <div class="list-product-type"></div> -->
        <li class="nav-item">
          
          <button
            id="product-type-allproduct"
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-dark': productType != '全部商品','btn-dark': productType == '全部商品', }"
            @click="selectedType('全部商品')"
          >
            <span class="icon">🌟</span><span style="font-weight:bold;"> 全部商品</span>
          </button>
          
        </li>
        <li class="nav-item">
          <button
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-secondary': productType != '精選食品','btn-secondary': productType == '精選食品', }"
            @click="selectedType('精選食品')"
          >
            <span class="icon">🍔</span><span style="font-weight:bold;"> 精選食品</span>
          </button>
          
        </li>
        <li class="nav-item">
          <button
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-secondary': productType != '日用生活','btn-secondary': productType == '日用生活', }"
            @click="selectedType('日用生活')"
          >
            <span class="icon">🏠</span><span style="font-weight:bold;"> 日用生活</span>
          </button>
          
        </li>         
        <li class="nav-item">
          <button
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-secondary': productType != '旅行戶外','btn-secondary': productType == '旅行戶外', }"
            @click="selectedType('旅行戶外')"
          >
            <span class="icon">🌴</span><span style="font-weight:bold;"> 旅行戶外</span>
          </button>
          
        </li>
        <li class="nav-item">
          <button
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-secondary': productType != '休閒用品','btn-secondary': productType == '休閒用品', }"
            @click="selectedType('休閒用品')"
          >
            <span class="icon">⛱️</span><span style="font-weight:bold;"> 休閒用品</span>
          </button>
          
        </li>
        <li class="nav-item">
          <button
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-secondary': productType != '數位產品','btn-secondary': productType == '數位產品', }"
            @click="selectedType('數位產品')"
          >
            <span class="icon">🎮</span><span style="font-weight:bold;"> 數位產品</span>
          </button>
          
        </li>
        <li class="nav-item">
          <button
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-secondary': productType != '紀念商品','btn-secondary': productType == '紀念商品', }"
            @click="selectedType('紀念商品')"
          >
            <span class="icon">🎁</span><span style="font-weight:bold;"> 紀念商品</span>
          </button>
          
        </li>
        <li class="nav-item">
          <button
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-secondary': productType != '經典模型','btn-secondary': productType == '經典模型', }"
            @click="selectedType('經典模型')"
          >
            <span class="icon">🎨</span><span style="font-weight:bold;"> 經典模型</span>
          </button>
          
        </li>
        <li class="nav-item">
          <button
            class="btn btn-lg mb-0 border-0 btn-width"
            :class="{'btn-outline-secondary': productType != '實用文具','btn-secondary': productType == '實用文具', }"
            @click="selectedType('實用文具')"
          >
            <span class="icon">✏️</span><span style="font-weight:bold;"> 實用文具</span>
          </button>
          
        </li>
      </ul>
    </nav>

    <!-- 展示窗 -->
    <!-- <div id="carouselExampleCaptions" class="carousel slide mx-auto" data-bs-ride="carousel" style="width:400px">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div>
        <div class="carousel-inner">
          <h2 style="text-align:center">熱銷商品</h2>
          <div class="carousel-item active" >
            <img :src="products[0].photoData" class="d-block w-100" :alt="products[0].productName">
            <div class="carousel-caption d-none d-md-block">
              <h5 class="showcase-productName">{{products[0].productName}}</h5>
            </div>
          </div>
          <div class="carousel-item">
            <img :src="products[19].photoData" class="d-block w-100" :alt="products[19].productName">
            <div class="carousel-caption d-none d-md-block">
              <h5 class="showcase-productName">{{products[19].productName}}</h5>
            </div>
          </div>
          <div class="carousel-item">
            <img :src="products[18].photoData" class="d-block w-100" :alt="products[18].productName">
            <div class="carousel-caption d-none d-md-block">
              <h5 class="showcase-productName">{{products[18].productName}}</h5>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div> -->
  
    <!-- 側邊攔 -->
    <aside class="sideBar">
      <fieldset style="text-align: center;">
          <legend style="display: inline; text-align: center">價格範圍</legend>
              <div>
                  <input type="text" placeholder=" $ 最小值" class="min-price" v-model="minPrice"/>
                  ——
                  <input type="text" placeholder=" $ 最大值" class="max-price" v-model="maxPrice"/>
                  <div style="height: 1.2em;">
                  <p style="color:red; margin-bottom: 0;">{{priceErrorMessage}}</p>
                  </div>
              </div>
          <button class="btn btn-outline-success set-price-range-btn" @click="searchByPrice" type="submit">套用</button>
          <button class="btn btn-outline-success set-price-range-btn" @click="clearPrice" type="submit">清除</button>
      </fieldset>
    </aside>

  <!-- 讀取圖示 -->
  <div v-if="this.products.length == 0" class="loading-container">
    <div class="spinner-grow text-primary large" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="spacer"></div>
    <div class="spinner-grow text-secondary large" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="spacer"></div>
    <div class="spinner-grow text-success large" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="spacer"></div>
    <div class="spinner-grow text-danger large" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="spacer"></div>
    <div class="spinner-grow text-warning large" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="spacer"></div>
    <div class="spinner-grow text-info large" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="spacer"></div>
    <div class="spinner-grow text-light large" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
    <!-- <aside class="sideBar">
      <fieldset>
          <span>價格範圍</span>
              <span>
                  <input type="text" placeholder=" $ 最小值" class="min-price" v-model="minPrice"/>
                  ——
                  <input type="text" placeholder=" $ 最大值" class="max-price" v-model="maxPrice"/>
                  <div style="height: 1.2em;">
                    <p style="color:red; margin-bottom: 0;">{{priceErrorMessage}}</p>
                  </div>
              </span>
          <button class="btn btn-outline-success price-btn" @click="searchByPrice" type="submit">套用</button>
          <button class="btn btn-outline-success price-btn" @click="clearPrice" type="submit">清除</button>
      </fieldset>
    </aside> -->
  
  <div v-else>
    <!-- 產品 -->
    <article> 
      <div class="each-product">
        <div class="card card-gap" id="product-card" v-for="p of products.slice(pageStart, pageEnd)" :key="p.productId" @click="goToGoodsDetail(p.productId)">
          <div @mouseover="handleMouseOver(p.productId)" @mouseleave="handleMouseLeave" :style="{ border: highlightId === p.productId ? '1px solid rgb(221, 112, 112)' : 'none','pos-ab': p.showAddInCart}"> 
            <img :src="p.photoData" class="img-thumbnail" :alt="p.productName" style="width: 100%; height: 300px;"/>
            <div v-show="p.showAddSuccseeInCartMessage" class="inimg-notification">成功加入購物車</div>
            <div v-show="p.showAddInTracking" class="inimg-notification">已加入追蹤</div>
            <div class="row">
              <div class="col-7">
                <h3 class="card-title product-name">{{ p.productName }}</h3>
                <p class="product-price">$ {{ p.productPrice }}</p>
              </div>
            </div>
            <div class="btn-add">
              <button class="btn btn-success add-cart-btn" @click.stop="addItemToShoppingCart(p)" type="submit">🛒 加入購物車</button>
              <button type="submit" class="btn btn-outline-danger add-tracking-btn" @click.stop="addProductToTrackingList(p)" v-show="!p.isTracking">🤍 加入追蹤</button>
              <button type="submit" class="btn btn-outline-danger add-tracking-btn" @click.stop="cancelTracking(p)" v-show="p.isTracking">❤️ 已追蹤</button> 
            </div>
          </div>
        </div> 
      </div>
    </article>
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
        <!-- <div v-for="page in totalPages" :key="page" :class="{ active: pageNumber === page }"> -->
        <li class="page-item" :class="{'active': (currentPage === (page))}"
            v-for="(page, index) in totalPage" :key="index" @click.prevent="setPage(page)">
          <!-- <a class="page-link" href="#" @click="goToPage(page)">{{ page }}</a> -->
          <a class="page-link" href="#">{{ page }}</a>
        </li>
        <!-- </div> -->
        
        <!-- 下一頁 -->
        <li class="page-item" @click.prevent="setPage(currentPage+1)">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- <div v-show="showNotification" class="notification">{{this.notification}}</div> -->
    <!-- Button trigger modal -->
  </div>
</div>

<!-- Modal -->
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
#product-card{
  width: 300px; 
  box-shadow: 5px 5px 10px #6d6d6d
}
.spacer {
  margin-right: 2rem; /* 設定右邊距，根據需要調整 */
}
.spinner-grow.large {
  width: 4rem; 
  height: 4rem;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 設定高度為視窗高度，使其垂直置中 */
}
.search-bar {
  padding: 0px;
  margin: 20px 30%;
  display: flex;
}
.each-product {
  /* border-style: double; */
  display: flex;
  flex-wrap: wrap; /*flex-wrap -> https://w3c.hexschool.com/flexbox/4ed6ec22 */
  padding: 0px 5%;
}
.card-gap {
  margin: 10px;
}

/* style for sideBar */
.sideBar {
  float: left;
  height: 200px;
  padding: 10px;
  background: rgb(242, 251, 251);
  /* border: rgb(189, 186, 186) 3px;； */
  border-style:groove;
  margin: 20px 0px 0px 20px;
}
.min-price {
  width: 100px;
  margin: 5px;
}
.max-price {
  width: 100px;
  margin: 5px;
  margin-left: 10px;
  display: inline;
}
.set-price-range-btn {
  width: 80px;
  margin: 20px 28px;
  /* padding: 20px; */
}

/* style for  productType */
.list-product-type {
  /* border: 1px solid; */
  margin: 10px 400px;
}
.btn-width{
  width: 170px;
  color: aquamarine;
}
.showcase-productName{
  color: rgb(47, 35, 11);
}
.product-name{
  margin: 10px 0px 0px 13px;
  font-weight: bold;
}
.product-price{
  color:#da0202;
  margin: 0px 0px 10px 13px;
  font-weight: bold;
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
.pos-ab{
  position: absolute;
}
.add-cart-btn{
  width:140px;
  margin-bottom: 5px;
}
.add-tracking-btn{
  width:120px;
  margin: 0px 0px 5px 15px;
}
#test{
  width:80%;
  /* border:2px red solid;  */
  margin:auto;
}
.btn-add{
  text-align: center;
}
</style>
