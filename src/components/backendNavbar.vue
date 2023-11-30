<script setup>

const imgURL = ""
</script>

<template>
    <nav class="navbar bg-light">
        <div class="container-fluid">
            <a class="navbar-brand">Navbar</a>
            <form class="d-flex" role="search" @submit.prevent>
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
                <span @click="hiddendanger"> //外層包裹的容器
                    <!-- < i class="el-icon-bell" style="color:white;font-size: 24px;"> </ i> //鈴鐺 -->
                    <!-- < div :style="{opacity}"> 99+ </ div> //訊息數 -->
                </span>
                <img :src="imgURL" alt="頭像">
            </form>
        </div>
    </nav>
</template>