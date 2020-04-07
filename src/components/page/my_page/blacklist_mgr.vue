<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 黑名单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.type" placeholder="类型" class="handle-select mr10">
                    <el-option
                        v-for="item in type_list"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="程序名" align="center"></el-table-column>
				<el-table-column prop="type" label="程序类型" align="center"></el-table-column>
                <el-table-column prop="process" label="进程名" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
		<el-button type="primary" @click="showAddDlg">添加黑名单程序</el-button>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
		        <el-form-item label="程序名">
		            <el-input v-model="form.name"></el-input>
		        </el-form-item>
		        <el-form-item label="类型">
		            <el-input v-model="form.type"></el-input>
		        </el-form-item>
				<el-form-item label="进程名">
				    <el-input v-model="form.process"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 添加弹出框 -->
		<el-dialog title="添加黑名单进程" :visible.sync="add_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
		        <el-form-item label="程序名">
		            <el-input v-model="add_param.name"></el-input>
		        </el-form-item>
		        <el-form-item label="类型">
		            <el-input v-model="add_param.type"></el-input>
		        </el-form-item>
				<el-form-item label="进程名">
				    <el-input v-model="add_param.process"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="addBlackList">确 定</el-button>
		    </span>
		</el-dialog>
			
    </div>
</template>

<script>
import { getBlackListTypes } from '../../../api/index.js';
import { selectBlackList, deleteBlackList, updateBlackList, insertBlackList } from '../../../api/BlackListAPI.js';
import '../../../api/BlackListAPI.js';
export default {
    name: 'user',
    data() {
        return {
            query: {
                type: '',
                pageIndex: 1,
                pageSize: 10
            },
            add_param: {
                name: '',
                type: '',
                process: ''
            },
            tableData: [],
            idList: [],
            editVisible: false,
			add_editVisible: false,
			add_batch: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            type_list: ''
        };
    },
    created() {
        this.getData();
        getBlackListTypes().then(res=>{ this.type_list = res });
    },
    methods: {
		showAddDlg() {
			this.add_editVisible = true
		},
		showAddsDlg() {
			this.add_batch = true
		},
        // 获取 easy-mock 的模拟数据
        getData() {
            selectBlackList(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        addBlackList(){
			insertBlackList(this.add_param).then(res=>{
				this.getData();
				this.add_editVisible = false;
				this.$message.success('添加成功');
			})
		},
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					deleteBlackList({ids: [row.id]}).then(res=>{
						this.getData();
						this.$message.success('删除成功');
					})
                })
        },
        // 多选操作
        handleSelectionChange(val) {
			this.idList = [];
			for (var i=0;i<val.length;i++){
				this.idList.push(val[i].id)
			}
        },
        delAllSelection() {
			if (this.idList.length>0){
				deleteBlackList({ids: this.idList}).then(res=>{
					this.$message.error(res.msg);
					this.query.pageIndex = 1;
					this.getData();
				});
			}
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
			updateBlackList(this.form).then(res=>{
				this.$message.success(`修改第 ${this.idx + 1} 行成功`);
				this.getData();
			})
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>