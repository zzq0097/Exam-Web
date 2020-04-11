<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
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
                <el-select v-model="query.role" placeholder="角色" class="handle-select mr10" @change="getUserByRole">
                    <el-option key="1" label="教师" value="2"></el-option>
                    <el-option key="2" label="学生" value="3"></el-option>
					<el-option key="3" label="管理员" value="1"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="password" label="密码" align="center"></el-table-column>
				<el-table-column prop="tel" label="电话" align="center"></el-table-column>
                <el-table-column label="角色" align="center">
                    <template slot-scope="scope">
                        <a v-if="scope.row.role==='1'">管理员</a>
                        <a v-else-if="scope.row.role==='2'">教师</a>
                        <a v-else-if="scope.row.role==='3'">学生</a>
                    </template>
                </el-table-column>
				<el-table-column prop="classname" label="班级" align="center"></el-table-column>
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
		<el-button type="primary" @click="showAddDlg">添加用户</el-button>
		<el-button type="primary" @click="showAddsDlg">批量导入</el-button>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
		        <el-form-item label="用户名">
		            <el-input v-model="form.username"></el-input>
		        </el-form-item>
				<el-form-item label="密码">
				    <el-input v-model="form.password"></el-input>
				</el-form-item>
				<el-form-item label="姓名">
				    <el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="电话">
				    <el-input v-model="form.tel"></el-input>
				</el-form-item>
				<el-form-item label="角色">
				    <el-select v-model="form.role">
				    	<el-option label="管理员" value="1"></el-option>
				    	<el-option label="教师" value="2"></el-option>
				    	<el-option label="学生" value="3"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="班级">
				    <el-select v-model="form.classname">
				    	<el-option
				    		v-for="item in class_list"
				    		:key="item.classid"
				    		:label="item.classname"
				    		:value="item.classname">
				    	</el-option>
				    </el-select>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 添加弹出框 -->
		<el-dialog title="添加用户" :visible.sync="add_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
		        <el-form-item label="用户名">
		            <el-input v-model="add_param.username"></el-input>
		        </el-form-item>
				<el-form-item label="密码">
				    <el-input v-model="add_param.password"></el-input>
				</el-form-item>
				<el-form-item label="姓名">
				    <el-input v-model="add_param.name"></el-input>
				</el-form-item>
				<el-form-item label="电话">
				    <el-input v-model="add_param.tel"></el-input>
				</el-form-item>
				<el-form-item label="角色">
					<el-select v-model="add_param.role">
						<el-option label="管理员" value="1"></el-option>
						<el-option label="教师" value="2"></el-option>
						<el-option label="学生" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级">
				    <el-select v-model="add_param.classid">
						<el-option
							v-for="item in class_list"
							:key="item.classid"
							:label="item.classname"
							:value="item.classid">
						</el-option>
				    </el-select>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="addUser">确 定</el-button>
		    </span>
		</el-dialog>
		
		<!-- 批量导入弹出框 -->
		<el-dialog title="批量添加" :visible.sync="add_batch" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
		        <el-upload
					class="upload-demo"
					drag
					action="https://jsonplaceholder.typicode.com/posts/"
					multiple>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
		        </el-upload>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_batch = false">取 消</el-button>
		        <el-button type="primary" @click="saveEdit">确 定</el-button>
		    </span>
		</el-dialog>
		
    </div>
</template>

<script>
import { getUserInfo } from '../../../api/UserAPI';
import { insertUser } from '../../../api/UserAPI';
import { deleteUser } from '../../../api/UserAPI';
import { updateUser } from '../../../api/UserAPI';
import { getClassList } from '../../../api/index';
export default {
    name: 'user',
    data() {
        return {
            query: {
				role: '',
				name: '',
				pageIndex: 1, 
				pageSize: 10
            },
			add_param:{
				role: '',
				classid: '',
				username: '',
				password: '',
				tel: '',
				name: '',
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
			class_list: ''
        };
    },
    created() {
        this.getData();
		getClassList().then(res=>{ this.class_list = res })
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
            getUserInfo(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal;
            });
        },
		getUserByRole(){
			this.query.name = '';
			this.getData();
		},
        // 触发搜索按钮
        handleSearch() {
			this.query.role = '';
            this.getData();
        },
		addUser(){
			insertUser(this.add_param).then(res=>{
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
					deleteUser({ids: [row.id]}).then(res=>{
						this.getData();
						this.$message.success('删除成功');
					}).catch(()=>{
                        this.$message.error('删除成功');
                    })
                })
                .catch(() => {});
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
				deleteUser({ids: this.idList}).then(res=>{
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
			updateUser(this.form).then(res=>{
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