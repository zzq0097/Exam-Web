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
                <el-select v-model="query.courseid" placeholder="课程" @change="getData()" class="handle-select mr10">
                    <el-option
                    	v-for="item in course_list"
                    	:key="item.id"
                    	:label="item.name"
                    	:value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="query.classid" placeholder="班级" @change="getData()" class="handle-select mr10">
                    <el-option
                    	v-for="item in class_list"
                    	:key="item.id"
                    	:label="item.name"
                    	:value="item.id">
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
                <el-table-column prop="paperId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="考试模式" width="100" align="center">
                    <template slot-scope="scope">
                        <a v-if="scope.row.pattern===1">限通信模式</a>
                        <a v-else-if="scope.row.pattern===2">霸屏模式</a>
                    </template>
                </el-table-column>
				<el-table-column label="是否开启监控" width="120" align="center">
                    <template slot-scope="scope">
                        <a v-if="scope.row.isMonitor==='1'">开启</a>
                        <a v-else-if="scope.row.isMonitor==='2'">关闭</a>
                    </template>
                </el-table-column>
				<el-table-column prop="startTime" label="考试开始时间" align="center"></el-table-column>
				<el-table-column prop="finishTime" label="考试结束时间" align="center"></el-table-column>
				<el-table-column prop="courseName" label="考试相关课程" align="center"></el-table-column>
                <el-table-column label="操作" width="500" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
						<el-button
						    type="text"
						    icon="el-icon-edit"
						    @click="handleEditInfo(scope.row)"
						>查看试题</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                        <el-button
						    type="text"
						    icon="el-icon-edit"
						    @click="smallHandle(scope.row)"
						>生成小试卷分析</el-button>
                        <el-button
						    type="text"
						    icon="el-icon-edit"
						    @click="bigHandle(scope.row)"
						>生成大试卷分析</el-button>
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
            <router-link to="/add_paper">
			    <el-button type="primary">新增试卷</el-button>
            </router-link>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="考试课程">
				    <el-select v-model="form.courseid" placeholder="课程" disabled class="handle-select mr10">
				        <el-option
				        	v-for="item in course_list"
				        	:key="item.id"
				        	:label="item.name"
				        	:value="item.id">
				        </el-option>
				    </el-select>
				</el-form-item>
                <el-form-item label="考试模式">
                    <el-select v-model="form.pattern" placeholder="模式" class="handle-select mr10">
				        <el-option value="1" label="限通信模式"></el-option>
                        <el-option value="2" label="霸屏模式"></el-option>
				    </el-select>
                </el-form-item>
                <el-form-item label="是否开启监控">
                    <el-select v-model="form.isMonitor" placeholder="是/否" class="handle-select mr10">
				        <el-option value="1" label="开启"></el-option>
                        <el-option value="2" label="关闭"></el-option>
				    </el-select>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                        v-model="form.finishTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		<!-- 详细信息弹出框 -->
		<el-dialog title="详细信息" :visible.sync="detailInfo" width="60%">
            <hr/>
		    <el-form ref="form" :model="form" v-for="item in test_list" :key="item.test_id" label-width="70px">
		        <el-form-item label="题目：">
                    <el-tag>{{item.type}}</el-tag>
                    {{ item.content }} 
                </el-form-item>
                <template v-if="item.type === '选择'">
                    <el-form-item label="选项A："> {{ item.option1 }} </el-form-item>
                    <el-form-item label="选项B："> {{ item.option2 }} </el-form-item>
                    <el-form-item label="选项C："> {{ item.option3 }} </el-form-item>
                    <el-form-item label="选项D："> {{ item.option4 }} </el-form-item>
                </template>
                <el-form-item label="难度："> {{ item.difficulty }} </el-form-item>
                <hr/>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="detailInfo = false">取 消</el-button>
		        <el-button type="primary" @click="saveEdit">确 定</el-button>
		    </span>
		</el-dialog>

        <!-- 小试卷播放窗口 -->
        <el-dialog title="监控视频" :visible.sync="s_link_editVisible" width="60%" height="60%">
            <a>ftp:122.51.73.146/video/avi_{{ form.recordId }}.avi</a>
            <span slot="footer" class="dialog-footer">
                <el-button @click="s_link_editVisible = false">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 大试卷分析窗口 -->
        <el-dialog title="监控视频" :visible.sync="b_link_editVisible" width="60%" height="60%">
            <a>ftp:122.51.73.146/analysis/p{{ form.paperId }}.docx</a>
            <span slot="footer" class="dialog-footer">
                <el-button @click="b_link_editVisible = false">关闭</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { selectPaper, deletePaper, selectQuestionByPaper, updatePaper } from '../../../api/PaperAPI';
import { getClassList } from '../../../api/index';
import { courseOption } from '../../../api/index';
export default {
    name: 'paper',
    data() {
        return {
            query: {
                courseid: '',
                classid: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
			idList: [],
            editVisible: false,
            add_editVisible: false,
            s_link_editVisible: false,
            b_link_editVisible: false,
			detailInfo: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            course_list: '',
            class_list: '',
            test_list: ''
        };
    },
    created() {
        this.getData();
		this.courseOption();
    },
    methods: {
		add_paper(){
			this.add_editVisible = true
		},
        // 获取 easy-mock 的模拟数据
        getData() {
            selectPaper(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal;
            });
        },
		courseOption(){
			courseOption().then(res=>{
				console.log(res);
				this.course_list = res;
			});
        },
        getTestList(){
            getTestList().then(res=>{
                this.test_list = res
            })
        },
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        bigHandle(row){
            this.form = row;
            this.b_link_editVisible = true
        },
        smallHandle(row){
            this.form = row;
            this.s_link_editVisible = true
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					deletePaper({ids: [row.paperId]}).then(res=>{
						this.getData();
						this.$message.success('删除成功');
					})
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
			this.idList = [];
			for (var i=0;i<val.length;i++){
				this.idList.push(val[i].paperId)
			}
        },
        delAllSelection() {
			if (this.idList.length>0){
				deletePaper({ids: this.idList}).then(res=>{
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
		// 查看试题
		handleEditInfo(row) {
            selectQuestionByPaper({paperid: row.paperId}).then(res=>{
                this.test_list = res.data
            })
		    this.detailInfo = true;
		},
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
			updatePaper(this.form).then(res=>{
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
