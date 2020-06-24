<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || homePageName"
        unique-opened
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu"
      >
        <!--此处为静态添加菜单-->
        <!-- <el-submenu index="home">
          <template slot="title">
            <icon-svg name="shoucang" class="site-sidebar__menu-icon"></icon-svg>
            <span>首页</span>
          </template>
          <el-menu-item index="demo-echarts" @click="$router.push({ name: 'map' })">
            <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">监控地图</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="manage" @click="$router.push({ name: 'manage' })">
          <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>
          <span slot="title">用电管理</span>
        </el-menu-item>

        <el-menu-item index="renren" @click="$router.push({ name: 'home' })">
          <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>
          <span slot="title">人人介绍</span>
        </el-menu-item>

        <el-submenu index="demo">
          <template slot="title">
            <icon-svg name="shoucang" class="site-sidebar__menu-icon"></icon-svg>
            <span>demo</span>
          </template>
          <el-menu-item index="demo-echarts" @click="$router.push({ name: 'demo-echarts' })">
            <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">echarts</span>
          </el-menu-item>
          <el-menu-item index="demo-ueditor" @click="$router.push({ name: 'demo-ueditor' })">
            <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">ueditor</span>
          </el-menu-item>

          <el-menu-item index="demo-ueditor2" @click="$router.push({ name: 'demo-ueditor2' })">
            <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">ueditor2</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="test">
          <template slot="title">
            <icon-svg name="shoucang" class="site-sidebar__menu-icon"></icon-svg>
            <span>测试</span>
          </template>
          <el-menu-item index="test-page1" @click="$router.push({ name: 'page1' })">
            <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">页面1</span>
          </el-menu-item>
          <el-menu-item index="test-page2" @click="$router.push({ name: 'page2' })" v-show>
            <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">页面2</span>
          </el-menu-item>
        </el-submenu> -->
        <!--此处为动态添加菜单-->
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes"
        ></sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from "./main-sidebar-sub-menu";
import { isURL } from "@/utils/validate";
export default {
  data() {
    return {
      dynamicMenuRoutes: []
    };
  },
  components: {
    SubMenu
  },
  computed: {
    sidebarLayoutSkin: {
      get() {
        return this.$store.state.common.sidebarLayoutSkin;
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      }
    },
    menuList: {
      get() {
        return this.$store.state.common.menuList;
      },
      set(val) {
        this.$store.commit("common/updateMenuList", val);
      }
    },
    menuActiveName: {
      get() {
        return this.$store.state.common.menuActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMenuActiveName", val);
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    },
    mainTabsActiveName: {
      get() {
        return this.$store.state.common.mainTabsActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMainTabsActiveName", val);
      }
    },
    homePageName(){
        return this.$store.state.common.homePageName
    }
  },
  watch: {
    $route: "routeHandle"
  },
  created() {
    this.menuList = JSON.parse(sessionStorage.getItem("menuList") || "[]");
    this.dynamicMenuRoutes = JSON.parse(
      sessionStorage.getItem("dynamicMenuRoutes") || "[]"
    );
    // this.routeHandle(this.$route)
    // 清空操作
    this.mainTabs = [];
    // 如果当前本身就处在homePageName上,需要手动调用一次routeHandle方法
    if (this.$route.name === this.homePageName) {
      this.routeHandle(this.$route);
    }
    // 路由回到homePageName
    this.$router.push({
      name: this.homePageName
    });
  },
  methods: {
    // 路由操作
    routeHandle(route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        var tab = this.mainTabs.filter(item => item.name === route.name)[0];
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(
              item => item.name === route.name
            )[0];
            if (!route) {
              return console.error("未能找到可用标签页!");
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? "iframe" : "module",
            iframeUrl: route.meta.iframeUrl || ""
          };
          this.mainTabs = this.mainTabs.concat(tab);
        }
        this.menuActiveName = tab.menuId + "";
        this.mainTabsActiveName = tab.name;
      }
    }
  }
};
</script>
<style>
.site-sidebar__menu.el-menu--collapse  span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>