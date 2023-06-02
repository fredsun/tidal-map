<template>
    <div :style="drawerContainerStyle" class="drawer-container">
      <div class="drawer">
        <!-- 内容插槽 -->
        <slot></slot>
      </div>
      <div  @click="toggleDrawer" class="toggle-button">
        <img src="@/assets/arrow_left_2x.png" :style="rightButtonStyle" class="drawerRightButtonImg">
      </div>
    </div>
  </template>
    
  <script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  
  const drawerWidth = '100%';
  const isHidden = ref(false);

  //抽屉默认状态
  const drawerContainerStyle = reactive({
    transform: 'translateX(0)', //具体过渡动画
    transition: 'transform 0.36s ease', // 添加过渡属性
  });
  //右侧按钮默认状态
  const rightButtonStyle = reactive({
    transform: 'rotate(0deg)', //具体过渡动画
    transition: 'transform 0.36s ease', // 添加过渡属性
  });
  
  //点击右侧按钮时执行的抽屉平移和按钮旋转的动画
  const toggleDrawer = () => {
    if (isHidden.value) {
      drawerContainerStyle.transform = 'translateX(0)';
      rightButtonStyle.transform =   'rotate(0deg)';
    } else {
      drawerContainerStyle.transform = `translateX(-${drawerWidth})`;
      rightButtonStyle.transform =   'rotate(180deg)';
    }
    isHidden.value = !isHidden.value;
  };
  
  </script>
    
  <style scoped>
  .drawer-container {
    position: fixed;
    width: 408px;
    height: 100%;
    z-index: 1201;
    background-color: #881a1a;
  }
  
  .drawer {
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
    background-color: #f2f2f2;
    transition: transform 0.3s ease;
    z-index: 1200;
  }
  
  .toggle-button {
    position: absolute;
    top: 50%;
    left: 100%;
    width: 23px;
    height: 48px;
    background-color: #f2f2f2;
    color: white;
    border: none;
    cursor: pointer;
    z-index: 1200;
    border-radius: 0 10px 10px 0;
    display: flex;
  }
  
  .drawerRightButtonImg {
    width: 22.2px;
    height: 22.2px;
    margin: auto;
  }
  </style>
    