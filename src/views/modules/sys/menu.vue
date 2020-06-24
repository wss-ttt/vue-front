<template>
  <div class="mod-menu common">
    <!-- <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>-->
    <div class="query-area">
      <ul>
        <li>
          <button
            type="button"
            class="bg-btn"
            @click="addOrUpdateHandle()"
            v-if="isAuth('sys:menu:save')"
          >新增</button>
        </li>
      </ul>
    </div>
    <el-table :data="dataList" border style="width: 100%;">
      <el-table-column prop="menuId" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <table-tree-column prop="name" header-align="center" treeKey="menuId" width="150" label="名称" :show-overflow-tooltip="true"></table-tree-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success">显示</el-tag>
          <el-tag v-else type="danger">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" label="排序号"></el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      ></el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      ></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:menu:update')"
            type="text"
            @click="addOrUpdateHandle(scope.row.menuId)"
          >修改</el-button>
          <el-button
            v-if="isAuth('sys:menu:delete')"
            type="text"
            @click="deleteHandle(scope.row.menuId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import TableTreeColumn from '@/components/table-tree-column'
import AddOrUpdate from './menu-add-or-update'
import { treeDataTranslate } from '@/utils'
export default {
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    TableTreeColumn,
    AddOrUpdate
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/menu/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataList = treeDataTranslate(data, 'menuId')
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      // this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
      this.$confirm(`确定进行删除操作吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
