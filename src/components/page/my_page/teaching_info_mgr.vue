<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 授课信息管理
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
                <el-select v-model="query.courseid" placeholder="课程" @change="getData" class="handle-select mr10">
                    <el-option
                    	v-for="item in course_list"
                    	:key="item.id"
                    	:label="item.name"
                    	:value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="教师姓名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="teachername" label="教师姓名" align="center"></el-table-column>
				<el-table-column prop="coursename" label="所授课程" align="center"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
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
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleInsert(scope.row)"
                        >添加上课班级</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="上课班级" align="center">
                    <template slot-scope="scope">
                        <p v-for="item in scope.row.classes" :key="item.classid">
                            {{ item.classname }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleClassEdit(scope.row)"
                        >编辑</el-button>
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
		<el-button type="primary" @click="showAddDlg">添加授课信息</el-button>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="授课教师">
                    <el-select v-model="form.teacherid">
                        <el-option
                            v-for="item in teacher_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
		        </el-form-item>
				<el-form-item label="课程">
                    <el-select v-model="form.courseid" placeholder="课程">
                        <el-option
                            v-for="item in course_list"
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
		<el-dialog title="添加授课信息" :visible.sync="add_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="授课教师">
                    <el-select v-model="add_param.teacherid">
                        <el-option
                            v-for="item in teacher_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
		        </el-form-item>
				<el-form-item label="课程">
                    <el-select v-model="add_param.courseid" placeholder="课程">
                        <el-option
                            v-for="item in course_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="insertEdit">确 定</el-button>
		    </span>
		</el-dialog>

        <!-- 添加上课班级弹出框 -->
		<el-dialog title="添加上课班级" :visible.sync="add_class_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="班级">
                    <el-select v-model="add_class.classid" filterable>
                        <el-option
                            v-for="item in class_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
		        </el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_class_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="insertClass">确 定</el-button>
		    </span>
		</el-dialog>
        <!-- 修改上课班级弹出框 -->
		<el-dialog title="添加上课班级" :visible.sync="edit_class_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="班级">
                    <el-select v-model="edit_class.classes" multiple filterable>
                        <el-option
                            v-for="item in class_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
		        </el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="edit_class_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="multipleEdit">确 定</el-button>
		    </span>
		</el-dialog>
		
    </div>
</template>

<script>
import { teacherOption } from '../../../api/index.js';
import { selectTeachInfo, deleteTeachInfo, updateTeachInfo, insertTeachInfo } from '../../../api/TeachInfoAPI.js';
import { updateGetClass,insertGetClass } from '../../../api/AttendClassAPI.js';
import { getClassList } from '../../../api/index.js';
import { courseOption } from '../../../api/index.js';
export default {
    name: 'teaching_info_mgr',
    data() {
        return {
            query: {
                courseid: '',
                classid: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            add_param: {
                courseid: '',
                teacherid: ''
            },
            add_class: {
                teachid: '',
                classid: ''
            },
            edit_class: {
                teachid: '',
                classes: []
            },
            tableData: [],
			idList: [],
            editVisible: false,
            add_editVisible: false,
            add_class_editVisible: false,
            edit_class_editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            course_list: '',
            class_list: '',
            teacher_list: ''
        };
    },
    created() {
        this.getData();
        courseOption().then(res=>{ this.course_list = res });
        getClassList().then(res=>{ this.class_list = res });
        teacherOption().then(res=>{this.teacher_list = res})
    },
    methods: {
		showAddDlg() {
			this.add_editVisible = true
		},
        // 获取 easy-mock 的模拟数据
        getData() {
            selectTeachInfo(this.query).then(res => {
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
        handleInsert(row) {
            this.add_class_editVisible = true;
            this.add_class.teachid = row.id
        },
        handleClassEdit(row) {
            this.edit_class_editVisible = true;
            this.edit_class.teachid = row.id;
            this.edit_class.classes = [];
            for (let index = 0; index < row.classes.length; index++) {
                this.edit_class.classes.push(row.classes[index].classid)
            }
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					deleteTeachInfo({ids: [row.id]}).then(res=>{
						this.getData();
						this.$message.success('删除成功');
					}).catch(()=>{
                        this.$message.error('删除成功');
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
				deleteTeachInfo({ids: this.idList}).then(res=>{
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
        insertEdit(){
            this.add_class_editVisible = false;
            insertTeachInfo(this.add_param).then(res=>{
                this.$message.success(res.msg);
				this.getData();
            }).catch(()=>{
                this.$message.error(`添加失败`);
            })
        },
        insertClass(){
            this.add_class_editVisible = false;
            insertGetClass(this.add_class).then(res=>{
                this.$message.success(res.msg);
				this.getData();
            }).catch(()=>{
                this.$message.error(`添加失败`);
            })
        },
        multipleEdit(){
            this.edit_class_editVisible = false;
            updateGetClass(this.edit_class).then(res=>{
                this.$message.success(res.msg);
				this.getData();
            }).catch(()=>{
                this.$message.error(`修改失败`);
            })
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
			updateTeachInfo(this.form).then(res=>{
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