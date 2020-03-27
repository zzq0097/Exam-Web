<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 试卷管理
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
                <el-select v-model="query.address" placeholder="关键字" class="handle-select mr10">
                    <el-option key="1" label="课程名" value="课程名"></el-option>
                    <el-option key="2" label="时间" value="时间"></el-option>
					<el-option key="3" label="班级" value="班级"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="pattern" label="考试模式" width="100" align="center"></el-table-column>
				<el-table-column prop="monitor" label="是否开启监控" width="120" align="center"></el-table-column>
				<el-table-column prop="start_time" label="考试开始时间" align="center"></el-table-column>
				<el-table-column prop="course" label="考试相关课程" align="center"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
						<el-button
						    type="text"
						    icon="el-icon-edit"
						    @click="handleEditInfo(scope.$index, scope.row)"
						>查看试题</el-button>
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
			<el-button type="primary" @click="add_paper">新增试卷</el-button>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="考试课程">
				    <el-input v-model="form.course"></el-input>
				</el-form-item>
                <el-form-item label="考试模式">
                    <el-input v-model="form.pattern"></el-input>
                </el-form-item>
                <el-form-item label="是否开启监控">
                    <el-input v-model="form.monitor"></el-input>
                </el-form-item>
				<el-form-item label="考试开始时间">
				    <el-input v-model="form.start_time"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		<!-- 详细信息弹出框 -->
		<el-dialog title="详细信息" :visible.sync="detailInfo" width="60%">
		    <el-form ref="form" :model="form" label-width="70px">
		        <el-form-item v-for="item in test" :key="test.test_id">
		            <p>题目：{{ item.test_title }}</p>
		        	<p>题目分数：{{ item.test_score }}分</p>
		        </el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="detailInfo = false">取 消</el-button>
		        <el-button type="primary" @click="saveEdit">确 定</el-button>
		    </span>
		</el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import { getPaper } from '../../../api/index';
export default {
    name: 'paper',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
			test: [{
					test_id: 1,
					test_title: "qqqqqqqqqqqqqq",
					test_score: 5
				},
				{
					test_id: 2,
					test_title: "aaaaaaaaaaaaaaaa",
					test_score: 5
				}
			],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
			add_editVisible: false,
			detailInfo: false,
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
		add_paper(){
			this.add_editVisible = true
		},
        // 获取 easy-mock 的模拟数据
        getData() {
            getPaper(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal || 50;
            });
        },
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
		// 编辑操作
		handleEditInfo(index, row) {
		    this.idx = index;
		    this.form = row;
		    this.detailInfo = true;
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
