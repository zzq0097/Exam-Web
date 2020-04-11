<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 试题管理
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
				<el-select v-model="query.chapterid" placeholder="章节" @change="getData" class="handle-select mr10">
					<el-option
						v-for="item in chapter_list"
						:key="item.chapterid"
						:label="item.chaptername"
						:value="item.chapterid">
					</el-option>
				</el-select>
				<el-select v-model="query.difficulty" placeholder="难度" @change="getData" class="handle-select mr10">
				    <el-option key="1" label="1" value="1"></el-option>
				    <el-option key="2" label="2" value="2"></el-option>
					<el-option key="3" label="3" value="3"></el-option>
				</el-select>
                <el-input v-model="query.key" placeholder="关键字" class="handle-input mr10"></el-input>
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
                <el-table-column prop="subjectid" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="type" label="题目类型" width="80" align="center"></el-table-column>
                <el-table-column prop="content" label="题目"></el-table-column>
				<el-table-column prop="options" label="选项"></el-table-column>
				<el-table-column prop="answer" label="答案" width="55" align="center"></el-table-column>
				<el-table-column prop="difficulty" label="难度" width="55" align="center"></el-table-column>
                <el-table-column prop="courseName" label="所属课程" width="120" align="center"></el-table-column>
                <el-table-column prop="chapterName" label="所属章节" width="70" align="center"></el-table-column>
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
		<el-button type="primary" @click="showAddDlg">添加试题</el-button>
		<el-button type="primary" @click="showAddsDlg">批量导入</el-button>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="70%">
            <el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="所属课程">
				    <el-select v-model="form.courseid">
				    	<el-option
				    		v-for="item in course_list"
				    		:key="item.courseid"
				    		:label="item.coursename"
				    		:value="item.courseid">
				    	</el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="所属章节">
				    <el-select v-model="form.chapterid">
				    	<el-option
				    		v-for="item in chapter_list"
				    		:key="item.chaptereid"
				    		:label="item.chaptername"
				    		:value="item.chapterid">
				    	</el-option>
				    </el-select>
				</el-form-item>
		        <el-form-item label="题目类型">
		            <el-select v-model="form.type">
		            	<el-option label="选择" value="选择"></el-option>
						<el-option label="判断" value="判断"></el-option>
						<el-option label="填空" value="填空"></el-option>
						<el-option label="简答" value="简答"></el-option>
						<el-option label="编程" value="编程"></el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item label="题目">
		            <el-input v-model="form.title"></el-input>
		        </el-form-item>
				<el-form-item label="选项">
				    <el-input v-model="form.answer"></el-input>
				</el-form-item>
				<el-form-item label="答案">
				    <el-input v-model="form.answer"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 批量导入弹出框 -->
		<el-dialog title="批量添加" :visible.sync="add_batch" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
		        <el-upload
					class="upload-demo"
					drag
					action="http://localhost:8088/exam/importQuestion"
					multiple>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
		        </el-upload>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_batch = false">确定</el-button>
		    </span>
		</el-dialog>
		
		<!-- 添加弹出框 -->
		<el-dialog title="添加用户" :visible.sync="add_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="所属课程">
				    <el-select v-model="add_param.courseid" @change="getChapterList">
				    	<el-option
				    		v-for="item in course_list"
				    		:key="item.courseid"
				    		:label="item.coursename"
				    		:value="item.courseid">
				    	</el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="所属章节">
				    <el-select v-model="add_param.chapterid">
				    	<el-option
				    		v-for="item in chapter_list"
				    		:key="item.chaptereid"
				    		:label="item.chaptername"
				    		:value="item.chapterid">
				    	</el-option>
				    </el-select>
				</el-form-item>
		        <el-form-item label="题目类型">
		            <el-select v-model="add_param.type">
		            	<el-option label="选择" value="选择"></el-option>
						<el-option label="判断" value="判断"></el-option>
						<el-option label="填空" value="填空"></el-option>
						<el-option label="简答" value="简答"></el-option>
						<el-option label="编程" value="编程"></el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item label="题目">
		            <el-input v-model="add_param.content"></el-input>
		        </el-form-item>
				<el-form-item label="选项">
				    <el-input v-model="add_param.option1"></el-input>
				</el-form-item>
				<el-form-item label="答案">
				    <el-input v-model="add_param.answer"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="add_test">确 定</el-button>
		    </span>
		</el-dialog>
    </div>
</template>

<script>
import { selectQuestion, insertQuestion, deleteQuestion } from '../../../api/QuestionAPI';
import { getCourseList } from '../../../api/index';
import { getChapterList } from '../../../api/index';
export default {
    name: 'test_mgr',
    data() {
        return {
            query: {
                difficulty: '',
                courseid: '',
				chapterid: '',
				type: '',
                key: '',
                pageIndex: 1,
                pageSize: 10
            },
            add_param: {
                courseid: '',
                chapterid: '',
                type: '',
                difficulty: '',
                content: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                answer: ''
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
			course_list: '',
			chapter_list: ''
        };
    },
    created() {
        this.getData();
		getCourseList().then(res=>{this.course_list = res});
    },
    methods: {
		showAddDlg() {
			this.add_editVisible = true
		},
		showAddsDlg() {
			this.add_batch = true
		},
        getData() {
            selectQuestion(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal;
				if(this.query.courseid !== ''){
					getChapterList({courseid: this.query.courseid}).then(res=>{
						this.chapter_list = res
					})
				}
            });
        },
        getChapterList(){
			getChapterList({courseid :this.add_param.courseid}).then(res=>{
				this.chapter_list = res;
			});
        },
        add_test(){
            insertQuestion(this.add_param).then(res=>{
                this.getData(); 
				this.add_editVisible = false;
				this.$message.success('添加成功');
            })
        },
        // 触发搜索按钮
        handleSearch() {
			this.query.courseid = '';
			this.query.chapterid = '';
			this.query.difficulty = '';
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteQuestion({ids: [row.subjectid]}).then(res=>{
						this.getData();
						this.$message.success('删除成功');
					}).catch(()=>{
                        this.$message.success('删除失败');
                    })
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
			this.idList = [];
			for (var i=0;i<val.length;i++){
				this.idList.push(val[i].subjectid)
			}
        },
        delAllSelection() {
			if (this.idList.length>0){
				deleteQuestion({ids: this.idList}).then(res=>{
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