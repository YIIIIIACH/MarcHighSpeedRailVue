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
        // memberId : ref(''),
        memberId: ref(props.memberId),
        filterMode: ref('全部商品'),
        products: ref([]), //要渲染的商品資料
        // products[ {
        //   'xx':'xx',
        //   'showAddInCart': false
        // }]
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
    methods: {
      // 加入購物車
      addItemToShoppingCart(p){
        // const memberId = '123abc'
        if( this.userName==''){
          // not login stat need to login 
          document.getElementById('login-modal-open-btn').click();
          return ;
        }
        httpClient.post('/ShoppingCart/addProduct?productId=' + p.productId + '&' + 'memberId=' + this.memberId)
        .then((res)=>{
          console.log(res)
        })
        p.showAddInCart = true
        setTimeout(function(){p.showAddInCart=false},700)
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
        },{withCredentials:true}).then((res) => {
          if(res.data.member_id == null){
            console.log('login failed')
            return; //中斷, 不執行下面的code
          }
          // console.log(res.data)
          this.userName= res.data.member_name;
          this.memberId = res.data.member_id;

          document.getElementById('login-modal-close-btn').click();
        })
      }
    },
    components: {},
    beforeMount() {
      // fetch all product and pages before mount
      httpClient.get("/products")
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
  <!-- 搜尋欄 -->
  <div class="search-bar">
    <input class="form-control me-2" type="search" placeholder="請輸入關鍵字" aria-label="Search" v-model="keyword"/>
    <button class="btn btn-outline-success" @click="searchByKeyword" style="width:100px">搜尋</button>
  </div>

  <!-- 分類 -->
  <nav class="navbar navbar-expand-lg bg-light justify-content-center" >
        <ul class="navbar-nav center">
            <!-- <div class="list-product-type"></div> -->
          <li class="nav-item">
            |
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '全部商品','btn-primary': productType == '全部商品', }"
              @click="selectedType('全部商品')"
            >
              全部商品
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '精選食品','btn-primary': productType == '精選食品', }"
              @click="selectedType('精選食品')"
            >
              精選食品
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '日用生活','btn-primary': productType == '日用生活', }"
              @click="selectedType('日用生活')"
            >
              日用生活
            </button>
            |
          </li>
          
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '旅行戶外','btn-primary': productType == '旅行戶外', }"
              @click="selectedType('旅行戶外')"
            >
              旅行戶外
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '休閒用品','btn-primary': productType == '休閒用品', }"
              @click="selectedType('休閒用品')"
            >
              休閒用品
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '數位產品','btn-primary': productType == '數位產品', }"
              @click="selectedType('數位產品')"
            >
              數位產品
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '紀念商品','btn-primary': productType == '紀念商品', }"
              @click="selectedType('紀念商品')"
            >
              紀念商品
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '經典模型','btn-primary': productType == '經典模型', }"
              @click="selectedType('經典模型')"
            >
              經典模型
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '實用文具','btn-primary': productType == '實用文具', }"
              @click="selectedType('實用文具')"
            >
              實用文具
            </button>
            |
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
        <button class="btn btn-outline-success price-btn" @click="searchByPrice" type="submit">套用</button>
        <button class="btn btn-outline-success price-btn" @click="clearPrice" type="submit">清除</button>
    </fieldset>
  </aside>

  <!-- 產品 -->
  <article> 
    <div class="each-product">
      <div class="card card-gap" style="width: 300px" v-for="p of products.slice(pageStart, pageEnd)" :key="p.productId" @click="goToGoodsDetail(p.productId)">
        <div @mouseover="handleMouseOver(p.productId)" @mouseleave="handleMouseLeave" :style="{ border: highlightId === p.productId ? '1px solid rgb(221, 112, 112)' : 'none','pos-ab': p.showAddInCart}"> 
          <!-- {{p.productId}} -->
          <img :src="p.photoData" class="img-thumbnail" :alt="p.productName" style="object-fit: width: 100%; height: 300px;"/>
          <div v-show="p.showAddInCart" class="inimg-notification">已加入購物車</div>
          <div class="row">
            <div class="col-7 ">
              <p class="card-title">{{ p.productName }}</p>
              <div >
                <p style="color:#EA7500;">${{ p.productPrice }}</p>
              </div>
            </div>
            <div class="col-5 ">
                <button class="btn btn-primary mt-3 add-btn" @click.stop="addItemToShoppingCart(p) " type="submit">加入購物車</button><!--@click.stop="addItemToShoppingCart(p.productId)"-->
            </div>
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
<button type="button" id="login-modal-open-btn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  登入
</button>

<!-- Modal -->
<div class="modal fade aa" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">會員登入</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" >
       <div class="input-group mb-3">
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
        <button type="button" @click="logout" class="btn btn-warning">登出</button>
        <button type="button" id="login-modal-close-btn" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
      </div>
    </div>
  </div>
</div>
</template>

<style>
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
  background: rgb(243, 243, 233);
  margin-left: 20px;
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
.price-btn {
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
  width: 150px;
  color: aquamarine;
}
.showcase-productName{
  color: rgb(47, 35, 11);
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
.add-btn{
  width:110px;
}
</style>
