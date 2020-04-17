<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 课程信息管理
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
                <el-input v-model="query.coursename" placeholder="课程名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="courseid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="coursename" label="课程名" align="center"></el-table-column>
                <el-table-column prop="teachername" label="课程负责人" align="center"></el-table-column>
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
		<el-button type="primary" @click="showAddDlg">添加课程</el-button>
		<el-button type="primary">批量导入</el-button>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="90px">
		        <el-form-item label="课程名">
		            <el-input v-model="form.coursename"></el-input>
		        </el-form-item>
		        <el-form-item label="课程负责人">
		            <el-select v-model="form.teacher_id" placeholder="教师">
		                <el-option
		                	v-for="item in teacher_list"
		                	:key="item.id"
		                	:label="item.name"
		                	:value="item.id">
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
		<el-dialog title="添加课程" :visible.sync="add_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="课程名">
				    <el-input v-model="add_param.coursename"></el-input>
				</el-form-item>
                <el-form-item label="课程负责人">
				    <el-select v-model="add_param.teacherid" placeholder="教师">
		                <el-option
		                	v-for="item in teacher_list"
		                	:key="item.id"
		                	:label="item.name"
		                	:value="item.id">
		                </el-option>
		            </el-select>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveInsert">确 定</el-button>
		    </span>
		</el-dialog>
		
    </div>
</template>

<script>
import { teacherOption } from '../../../api/index.js';
import { selectCourse } from '../../../api/CourseAPI.js';
import { insertCourse } from '../../../api/CourseAPI.js';
import { updateCourse } from '../../../api/CourseAPI.js';
import { deleteCourse } from '../../../api/CourseAPI.js';
export default {
    name: 'teching_info_mgr',
    data() {
        return {
            query: {
                coursename: '',
                pageIndex: 1,
                pageSize: 10
            },
			add_param: {
                coursename: '',
                teacherid: ''
			},
            tableData: [],
			idList: [],
            editVisible: false,
			add_editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            course_list: '',
            teacher_list: ''
        };
    },
    created() {
        this.getData();
        teacherOption().then(res=>{ this.teacher_list = res });
    },
    methods: {
		showAddDlg() {
			this.add_editVisible = true
		},
        // 获取 easy-mock 的模拟数据
        getData() {
            selectCourse(this.query).then(res => {
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
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteCourse({ids: [row.courseid]}).then(res=>{
                        this.getData();
                        this.$message.success('删除成功');
                    }).catch(()=>{
                        this.$message.error('删除失败');
                    })
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
			this.idList = [];
			for (var i=0;i<val.length;i++){
				this.idList.push(val[i].courseid)
			}
        },
        delAllSelection() {
			if (this.idList.length>0){
				deleteCourse({ids: this.idList}).then(res=>{
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
		    updateCourse(this.form).then(res=>{
				this.$message.success(`修改成功`);
				this.editVisible = false;
				this.getData();
			})
		},
        saveInsert() {
            insertCourse(this.add_param).then(res=>{
				this.$message.success(`新增成功`);
				this.add_editVisible = false;
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