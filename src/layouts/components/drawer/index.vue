<template>
    <!-- 抽屉打开关闭过渡效果根据name去指定 -->
    <transition :name="computedName">
        <!-- clickMaskCloseFn搭配@click.stop -->
        <div @click="clickMaskCloseFn" class="myDrawerWrap" :class="{ isShowDrawerMask: mask }" v-show="isShowDrawer">
            <div ref="drawerContentRef" :class="['drawerContent']" :style="computedDrawerPosition" @click.stop>
                <header v-show="isShowHeader" class="drawerHeader">
                    <slot name="title">
                        <span>{{ title }}</span>
                    </slot>
                    <i class="el-icon-close" @click="closeDrawer" v-show="showCloseIcon"></i>
                </header>
                <section class="drawerBody">
                    <slot></slot>
                </section>
            </div>
            <div class="drawerRightButton" @click="clickRightButton">
                <img src="@/assets/arrow_left_2x.png" class="drawerRightButtonImg">
            </div>
        </div>
    </transition>
</template>
  
<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue';


const moveObj: { [key: string]: string } = {
    top: "topMove",
    bottom: "bottomMove",
    left: "leftMove",
    right: "rightMove",
};

const props = defineProps({
    isShowDrawer: {
        type: Boolean,
        default: false,
    },
    isShowHeader: {
        type: Boolean,
        default: true,
    },
    title: {
        type: String,
        default: "我是title",
    },
    showCloseIcon: {
        type: Boolean,
        default: true,
    },
    mask: {
        type: Boolean,
        default: true,
    },
    clickMaskClose: {
        type: Boolean,
        default: true,
    },
    direction: {
        type: String,
        default: "right",
        validator(val: string) {
            return directionArr.includes(val);
        },
    },
    beforeClose: {
        type: Function,
    },
});

const isShowDrawer = ref(props.isShowDrawer);
const isShowHeader = ref(props.isShowHeader);
const title = ref(props.title);
const showCloseIcon = ref(props.showCloseIcon);
const mask = ref(props.mask);
const clickMaskClose = ref(props.clickMaskClose);
const direction = ref(props.direction);
const beforeClose = ref(props.beforeClose);

const drawerContentRef = ref(null);

const computedDrawerPosition = computed(() => {
    let positionObj: Record<string, string> = {
        width: (direction.value === "left" || direction.value === "right") ? "30%" : "100%",
        height: (direction.value === "top" || direction.value === "bottom") ? "30%" : "100%",
    };
    positionObj[direction.value] = "0";
    return positionObj;
});

const computedName = computed(() => moveObj[direction.value]);

const clickMaskCloseFn = () => {
    if (clickMaskClose.value) {
        closeDrawer();
    } else {
        return;
    }
};

const closeDrawer = () => {
    if (beforeClose.value) {
        beforeClose.value(close);
    } else {
        close();
    }
};

const close = () => {
    isShowDrawer.value = false;
    emit("update:isShowDrawer", false);
    emit("shutDown");
};
//右侧关闭按钮点击
const clickRightButton=()=>{
    isShowDrawer.value = !isShowDrawer.value ;
    emit("update:isShowDrawer", false);
    emit("shutDown");
}

watch(isShowDrawer, (newValue) => {
    if (newValue) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
});

const emit = defineEmits(["update:isShowDrawer", "shutDown"]);
</script>
<script lang="ts">
const directionArr = ["top", "bottom", "left", "right"]; // "ttb","btt","ltr","rtl"

export default {}
</script> 
  
<style lang='less' scoped>
// 基本样式
.myDrawerWrap {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1200;
    overflow: hidden;

    .drawerContent {
        // 搭配定位的方式控制在上下左右的那个方位
        position: absolute;
        background-color: #fff;
        box-shadow: 2px 2px 12px 0 rgba(0, 0, 0, 0.24);
        display: flex;
        flex-direction: column;

        // 抽屉头部
        .drawerHeader {
            width: 100%;
            height: 48px;
            box-sizing: border-box;
            padding: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: bolder;
            color: #333;

            i {
                cursor: pointer;
            }
        }

        // 抽屉内容体部分
        .drawerBody {
            width: 100%;
            box-sizing: border-box;
            padding: 12px;
            flex: 1;
            overflow-y: auto;
        }


    }

    .drawerRightButton {
        width: 23px;
        height: 48px;
        color: aqua;
        position: relative;
        left: 30%;
        top: 50%;
        z-index: 1201;
        background-color: #fff;
        border-radius: 0 10px 10px 0;
        display:flex
    }
    .drawerRightButtonImg{
        width:22.2px;
        height:22.2px;
        margin: auto;
    }
}

// 遮罩层即为背景色
.isShowDrawerMask {
    background-color: rgba(0, 0, 0, 0.3);
    text-align: center;
    vertical-align:middle;
}

/*
    下方是抽屉过渡动画的重点
  */
// 上方进入和退出
.topMove-enter-active,
.topMove-leave-active {
    transition: all 0.36s ease-in-out;
    transform: translateY(0%);
    opacity: 1;
}

.topMove-enter,
.topMove-leave {
    transform: translateY(-100%);
    opacity: 0;
}

.topMove-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

// 下方进入和退出
.bottomMove-enter-active,
.bottomMove-leave-active {
    transition: all 0.36s ease-in-out;
    transform: translateY(0);
    opacity: 1;
}

.bottomMove-enter,
.bottomMove-leave {
    transform: translateY(100%);
    opacity: 0;
}

.bottomMove-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

// 左侧进入和退出
.leftMove-enter-active,
.leftMove-leave-active {
    transition: all 0.36s ease-in-out;
    transform: translateX(0%);
    opacity: 1;
}

.leftMove-enter,
.leftMove-leave {
    transform: translateX(-100%);
    opacity: 0;
}

.leftMove-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

// 右侧进入和退出
.rightMove-enter-active,
.rightMove-leave-active {
    transition: all 0.36s ease-in-out;
    transform: translateX(0);
    opacity: 1;
}

.rightMove-enter,
.rightMove-leave {
    transform: translateX(100%);
    opacity: 0;
}

.rightMove-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
  