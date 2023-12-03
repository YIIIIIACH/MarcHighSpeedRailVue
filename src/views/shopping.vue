<script>
import httpClient from "@/main";
import backendURL from "@/main";
import { ref, reactive, onMounted } from "vue";
export default {
  setup() {
    return {
      // cardText : ref(''),
      products: ref([]), //要渲染的資料
      source_products: ref([]), //原始資料

      keyword: ref(""), 

      minPrice: ref(""),
      maxPrice: ref(""),

      productType: ref(""),
    };
  },
  computed: {},
  methods: {
    search: function () {
      // fetch product by keyword
      console.log('search')
      this.products = [];
      httpClient
        .get(
          "/product/findByNameLike?nameInput=" +
            this.keyword
        )
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
        .get(
          "/product/findByPrice?firstPrice=" +
            this.minPrice +
            "&" +
            "secondPrice=" +
            this.maxPrice
        )
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
    searchByType: function () {
      //     this.products = [];
      //     httpClient
      //     .get('/product/findByType?selectType=' + )
      console.log("aa");
    },
    selectedType(type) {
        // 2. 參數(type) asign 給 productType
      this.productType = type;
        // 3. p 代表 source_products 裡所有的 product , 將參數(type) asign 給 p.productType
      this.products = this.source_products.filter(p=>p.productType==type);
    },
  },
  components: {},
  beforeMount() {
    // fetch all product before mount
    httpClient
      .get("/products")
      .then((res) => {
        let ps = res.data;
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
              :class="{'btn-outline-primary': productType != '紀念品','btn-primary': productType == '紀念品', }"
              @click="selectedType('紀念品')"
            >
              紀念品
            </button>
            |
          </li>
          
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '生活用品','btn-primary': productType == '生活用品', }"
              @click="selectedType('生活用品')"
            >
              生活用品
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
              :class="{'btn-outline-primary': productType != '模型','btn-primary': productType == '模型', }"
              @click="selectedType('模型')"
            >
              模型
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '文具','btn-primary': productType == '文具', }"
              @click="selectedType('文具')"
            >
              文具
            </button>
            |
          </li>
          <li class="nav-item">
            <button
              class="btn btn-lg mb-0 border-0 btn-width"
              :class="{'btn-outline-primary': productType != '旅行用品','btn-primary': productType == '旅行用品', }"
              @click="selectedType('旅行用品')"
            >
              旅行用品
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
    <div class="card card-gap" style="width: 300px" v-for="p of products" :key="p.productId">
        <div class=""> 
            <!-- {{p.productId}} -->
            <img :src="p.PhotoData" class="img-thumbnail" :alt="p.productName" />
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
  <nav aria-label="...">
    <ul class="pagination">
      <li class="page-item disabled">
        <span class="page-link">Previous</span>
      </li>
      <div>
        <li class="page-item">
          <a class="page-link" href="#">{{pageNumber}}</a>
         </li>
      </div>
      <li class="page-item">
        <a class="page-link" href="#">Next</a>
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
