<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 考试分析
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.address" placeholder="考试场次" class="handle-select mr10">
                    <el-option key="1" label="C++ | 2019-上" value="教师"></el-option>
                    <el-option key="2" label="Python | 2019-下" value="学生"></el-option>
					<el-option key="3" label="Java | 2019-下" value="班级"></el-option>
                </el-select>
				<el-select v-model="query2" placeholder="班级" class="handle-select mr10">
					<el-option key="1" label="全年级" value="班级"></el-option>
				    <el-option key="2" label="RB软工网161" value="教师"></el-option>
				    <el-option key="3" label="RB软工网162" value="学生"></el-option>
					<el-option key="4" label="RB软工移163" value="班级"></el-option>
				</el-select>
				试卷平均分：<el-button></el-button>
				试卷得分方差:<el-button></el-button>
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
                <el-table-column prop="name" label="题目"></el-table-column>
                <el-table-column prop="username" label="得分率" align="center"></el-table-column>
                <el-table-column prop="password" label="平均分" align="center"></el-table-column>
				<el-table-column prop="tel" label="方差" align="center"></el-table-column>
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
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
		        <el-form-item label="姓名">
		            <el-input v-model="form.name"></el-input>
		        </el-form-item>
		        <el-form-item label="用户名">
		            <el-input v-model="form.username"></el-input>
		        </el-form-item>
				<el-form-item label="密码">
				    <el-input v-model="form.password"></el-input>
				</el-form-item>
				<el-form-item label="角色">
				    <el-input v-model="form.role"></el-input>
				</el-form-item>
				<el-form-item label="班级">
				    <el-input v-model="form.class"></el-input>
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
		        <el-form-item label="姓名">
		            <el-input v-model="form.name"></el-input>
		        </el-form-item>
		        <el-form-item label="用户名">
		            <el-input v-model="form.username"></el-input>
		        </el-form-item>
				<el-form-item label="密码">
				    <el-input v-model="form.password"></el-input>
				</el-form-item>
				<el-form-item label="角色">
				    <el-input v-model="form.role"></el-input>
				</el-form-item>
				<el-form-item label="班级">
				    <el-input v-model="form.class"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveEdit">确 定</el-button>
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
import { getUserInfo } from '../../../api/index.js';
export default {
    name: 'user',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
			query2: {},
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
			add_editVisible: false,
			add_batch: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
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
                this.pageTotal = res.pageTotal || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
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
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
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