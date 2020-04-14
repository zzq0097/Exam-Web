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
                <el-select v-model="query.courseid" placeholder="课程" @change="getData" class="handle-select mr10">
                    <el-option
                    	v-for="item in course_list"
                    	:key="item.courseid"
                    	:label="item.coursename"
                    	:value="item.courseid">
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
                <el-table-column prop="chapterid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="index" label="章节" align="center"></el-table-column>
                <el-table-column prop="chaptername" label="章节名" align="center"></el-table-column>
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
		<el-button type="primary" @click="showAddDlg">添加章节</el-button>
		<el-button type="primary">批量导入</el-button>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
		        <el-form-item label="课程">
		            <el-select v-model="form.courseid" placeholder="课程" @change="getChapterList">
		                <el-option
		                	v-for="item in course_list"
		                	:key="item.courseid"
		                	:label="item.coursename"
		                	:value="item.courseid">
		                </el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item label="章节">
		            <el-select v-model="form.index" placeholder="章节" @change="getChapterList">
		                <el-option v-for="i in 15" :key="i" :label="i" :value="i"></el-option>
		            </el-select>
		        </el-form-item>
				<el-form-item label="章节名">
				    <el-input v-model="form.chaptername"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 添加弹出框 -->
		<el-dialog title="添加章节" :visible.sync="add_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
		        <el-form-item label="课程">
		            <el-select v-model="add_param.courseid" placeholder="课程" @change="getChapterList">
		                <el-option
		                	v-for="item in course_list"
		                	:key="item.courseid"
		                	:label="item.coursename"
		                	:value="item.courseid">
		                </el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item label="章节">
		            <el-select v-model="add_param.index" placeholder="章节" @change="getChapterList">
		                <el-option v-for="i in 15" :key="i" :label="i" :value="i"></el-option>
		            </el-select>
		        </el-form-item>
				<el-form-item label="章节名">
				    <el-input v-model="add_param.chaptername"></el-input>
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
import { getCourseList } from '../../../api/index.js';
import { getChapterList } from '../../../api/index.js';
import { listChapter } from '../../../api/CourseAPI.js';
import { insertChapter } from '../../../api/CourseAPI.js';
import { updateChapter } from '../../../api/CourseAPI.js';
import { deleteChapter } from '../../../api/CourseAPI.js';
export default {
    name: 'course_info_mgr',
    data() {
        return {
            query: {
                courseid: '',
				chapterid: '',
				index: '',
                pageIndex: 1,
                pageSize: 10
            },
			add_param: {
				courseid: '',
				chapterid: '',
				index: '',
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
			chapter_list: ''
        };
    },
    created() {
        this.getData();
		this.getCourseList();
    },
    methods: {
		showAddDlg() {
			this.add_editVisible = true
		},
        // 获取 easy-mock 的模拟数据
        getData() {
            listChapter(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal;
            });
        },
		getCourseList(){
			getCourseList().then(res=>{
				console.log(res);
				this.course_list = res;
			});
        },
        getChapterList(){
			getChapterList({courseid: this.form.courseid}).then(res=>{
				console.log(res);
				this.course_list = res;
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
                    deleteChapter({ids: [row.chapterid]}).then(res=>{
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
				this.idList.push(val[i].id)
			}
        },
        delAllSelection() {
			if (this.idList.length>0){
				deleteChapter({ids: this.idList}).then(res=>{
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
		    updateChapter(this.form).then(res=>{
				this.$message.success(`修改成功`);
				this.editVisible = false;
				this.getData();
			})
		},
        saveInsert() {
            insertChapter(this.insert_param).then(res=>{
				this.$message.success(`新增成功`);
				this.add_editVisible = false;
				this.insert_param = '';
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