<template>
  <div :style="drawerContainerStyle" class="drawer-container">
    <div class="drawer">
      <!-- 内容插槽 -->

      <slot></slot>
    </div>
    <div @click="toggleDrawer" class="toggle-button">
      <el-tooltip class="box-item" effect="dark"  :content="toggleButtonContent" placement="right">
        <img src="@/assets/arrow_left_2x.png" :style="rightButtonStyle" class="drawerRightButtonImg">
      </el-tooltip>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { ref, reactive, computed,toRefs } from 'vue';

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

// 将响应式对象转换为单独的引用
const { transform: drawerTransform } = toRefs(drawerContainerStyle);
const { transform: rightButtonTransform } = toRefs(rightButtonStyle);
// 计算属性，根据 isHidden 的值返回不同的内容
const toggleButtonContent = computed(() => {
  return isHidden.value ? '展开侧边面板' : '收合侧边面板';
});


//点击右侧按钮时执行的抽屉平移和按钮旋转的动画
const toggleDrawer = () => {
  if (isHidden.value) {
    drawerTransform.value = 'translateX(0)';
    rightButtonTransform.value = 'rotate(0deg)';
  } else {
    drawerTransform.value = `translateX(-${drawerWidth})`;
    rightButtonTransform.value = 'rotate(180deg)';
  }
  isHidden.value = !isHidden.value;
};

</script>
    
<style scoped>
.drawer-container {
  position: absolute;
  left: 0px;
  width: 600px;
  height: 100%;
  z-index: 1201;
  background-color: #881a1a;
  margin: 0;
  padding: 0;
  display: flex;
}

.drawer {
  margin: 0;
  padding: 0;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  transition: transform 0.3s ease;
  z-index: 1200;
  display: flex;
}


.toggle-button {
  position: absolute;
  top: 50%;
  left: 100%;
  width: 23px;
  height: 48px;
  background-color: #fff;
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
    