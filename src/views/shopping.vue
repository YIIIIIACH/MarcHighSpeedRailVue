<script>
import httpClient from "@/main";
import backendURL from "@/main";
import { ref, reactive, onMounted } from "vue";
export default {
  setup() {
    return {
      // cardText : ref(''),
      products: ref([]), //要渲染的商品資料
      source_products: ref([]), //原始商品資料

      keyword: ref(""), 

      minPrice: ref(""),
      maxPrice: ref(""),

      productType: ref(""),

      // totalPages: ref(0),

      currentPage: ref(1),
      perpage: ref(8), //一頁的商品資料數

    };
  },
  computed: {
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

    setPage(page) {
        if(page <= 0 || page > this.totalPage) {
            return //結束方法
        }
        this.currentPage = page
    },

    search: function () {
      // fetch product by keyword
      this.products = [];
      httpClient
        .get("http://localhost:8080/MarcHighSpeedRail/product/findByNameLike?nameInput=" +this.keyword)
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
    searchByPrice: function () {
      // fetch product by price
      console.log('search  by price')
      this.products = [];
      httpClient
        .get( "http://localhost:8080/MarcHighSpeedRail/product/findByPrice?firstPrice=" + this.minPrice + "&" + "secondPrice=" + this.maxPrice)
        .then((res) => {
          let pps = res.data;
          for (let p of pps) {
            this.products.push(p);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectedType(type) {
        // 2. 參數(type) asign 給 productType
      this.productType = type;
        // 3. p 代表 source_products 裡所有的 product , 將參數(type) asign 給 p.productType
      this.products = this.source_products.filter(p=>p.productType==type);
    },

    // goToPage: function(page){
    //   httpClient
    //   .get('http://localhost:8080/MarcHighSpeedRail/product/page?p=' + page)
    //   .then((res)=>{
    //     let page = res.data;
    //     let ps = page.content;

    //     this.products = [];
    //     this.source_products = [];

    //     for (let p of ps) { 
    //       this.source_products.push(p);
    //       this.products.push(p);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // }
  },
  components: {},
  beforeMount() {
    // fetch all product and pages before mount
    httpClient
      // .get("http://localhost:8080/MarcHighSpeedRail/product/page?p=1")
      .get("http://localhost:8080/MarcHighSpeedRail/products")
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
    <button class="btn btn-outline-success" @click="search" type="submit">search</button>
  </div>

  <!-- 分類 -->
  <nav class="navbar navbar-expand-lg bg-light justify-content-center ">
        <ul class="navbar-nav center">
            <!-- <div class="list-product-type"></div> -->
          <li class="nav-item">
            |
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
  <!-- 側邊攔 -->
  <aside class="sideBar">
    <fieldset>
        <legend style="display: inline; text-align: center">價格範圍</legend>
            <div>
                <input type="text" placeholder=" $ 最小值" class="min-price" v-model="minPrice"/>
                ——
                <input type="text" placeholder=" $ 最大值" class="max-price" v-model="maxPrice"/>
            </div>
        <button class="btn btn-outline-success price-btn" @click="searchByPrice" type="submit">搜尋</button>
    </fieldset>
  </aside>

  <!-- 產品 -->
  <div class="each-product">
    <div class="card card-gap" style="width: 300px" v-for="p of products.slice(pageStart, pageEnd)" :key="p.productId">
        <div> 
            {{p.productId}}
            <img :src="p.PhotoData" class="img-thumbnail" :alt="p.productName" style="object-fit: width: 100%; height: 300px;"/>
            <p class="card-title">{{ p.productName }}</p>
            <span>${{ p.productPrice }}</span>
        </div>
        <div class="card-body">
            <!-- <p class="card-text">{{p.productDescription}}</p>
            <a href="#" class="btn btn-primary">Go somewhere</a> -->
        </div> 
    </div>
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
  width: 200px;
  margin: 20px 30px;
}

/* style for  productType */
.list-product-type {
    /* border: 1px solid; */
    margin: 10px 400px;
}
.btn-width{
    width: 200px;
}
.color{
    background-color:blue;
}
</style>
