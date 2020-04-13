<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 添加
                </el-breadcrumb-item>
                <el-breadcrumb-item>添加考试</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px" style="width: 700px;">
					<el-form-item label="课程">
						<el-select v-model="form.courseid" placeholder="课程" class="handle-select mr10">
							<el-option
								v-for="item in course_list"
								:key="item.courseid"
								:label="item.coursename"
								:value="item.courseid">
							</el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="考试模式">
                        <el-radio-group v-model="form.pattern">
                            <el-radio label="1">限通信模式</el-radio>
                            <el-radio label="2">霸屏模式</el-radio>
                        </el-radio-group>
                    </el-form-item>
					<el-form-item label="监控">
                        <el-radio-group v-model="form.ismonitor">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="2">关闭</el-radio>
                        </el-radio-group>
                    </el-form-item>
					<el-form-item label="组卷方式">
					    <el-radio-group v-model="form.mode" @change="createType">
					        <el-radio label="1">全随机组卷</el-radio>
					        <el-radio label="2">按章节/难度随机组卷</el-radio>
							<el-radio label="3">手动组卷</el-radio>
					    </el-radio-group>
					</el-form-item>
					<el-form-item>
					    <div v-if="box2">
							<el-button type="primary" @click="add_test">添加条件策略</el-button>
							<el-table
							    :data="tableData"
							    border
							    class="table"
							    ref="multipleTable"
							    header-cell-class-name="table-header"
							>
								<el-table-column prop="type" label="题目类型" width="80"></el-table-column>
							    <el-table-column prop="num" label="数量" width="55"></el-table-column>
								<el-table-column prop="score" label="分值" width="55"></el-table-column>
								<el-table-column prop="chapter" label="章节" align="center"></el-table-column>
							    <el-table-column prop="difficulty" label="难度" width="55" align="center"></el-table-column>
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
						</div>
						<div v-if="box3">
							<el-select v-model="data" placeholder="请选择章节">
								<el-option label="第一章" value="1"></el-option>
								<el-option label="第二章" value="2"></el-option>
								<el-option label="第三章" value="3"></el-option>
								<el-option label="第四章" value="4"></el-option>
								<el-option label="第五章" value="5"></el-option>
							</el-select>
							
							<template>
								<el-transfer v-model="value" :data="datas"></el-transfer>
							</template>
						</div>
					</el-form-item>
					<el-form-item label="开始时间">
						<el-date-picker
							v-model="form.starttime"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="结束时间">
						<el-date-picker
							v-model="form.finishtime"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定添加</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
		
		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="题目类型">
					<el-select v-model="data">
						<el-option label="选择"></el-option>
						<el-option label="填空"></el-option>
						<el-option label="判断"></el-option>
						<el-option label="简答"></el-option>
						<el-option label="编程"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="题目章节">
				    <el-select v-model="data">
				    	<el-option label="第一章"></el-option>
				    	<el-option label="第二章"></el-option>
				    	<el-option label="第三章"></el-option>
						<el-option label="第四章"></el-option>
						<el-option label="第五章"></el-option>
				    </el-select>
				</el-form-item>
		        <el-form-item label="题目数量">
		            <el-select v-model="data">
		            	<el-option v-for="i in 20" :key="i" label="">{{i}}</el-option>
		            </el-select>
		        </el-form-item>
		        <el-form-item label="题目难度">
		            <el-select v-model="data">
		            	<el-option label="1"></el-option>
		            	<el-option label="2"></el-option>
		            	<el-option label="3"></el-option>
		            </el-select>
		        </el-form-item>
				<el-form-item label="题目分值">
				    <el-select v-model="data">
				    	<el-option v-for="i in 20" :key="i" label="">{{i}}</el-option>
				    </el-select>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveEdit">确 定</el-button>
		    </span>
		</el-dialog>
    </div>
</template>

<script>
import { getCourseList } from '../../../api/index';
import { updatePaper, insertPaper } from '../../../api/PaperAPI';
export default {
    name: 'add_paper',
    data() {
		  const generateData = _ => {
			const data = [];
			for (let i = 1; i <= 15; i++) {
			  data.push({
				key: i,
				label: `备选项 ${ i }`,
				disabled: i % 4 === 0
			  });
			}
			return data;
		  };
        return {
			editVisible: false,
			value: [1, 4],
			data: '',
			datas: generateData(),
			create_type: '',
			box2: false,
			box3: false,
			tableData: [{
				type: '选择',
				num: 5,
				score: 5,
				chapter: '第二章',
				difficulty: 2
			}],
            form: {
                mode: '',
                starttime: '',
                finishtime: '',
				pattern: '',
				ismonitor: '',
				// strategyDTOS:[{
				// 	type: '',
				// 	count: '',
				// 	score: '',
				// 	chapterid: '',
				// 	difficulty: ''
				// }],
                questionids: []
			},
			course_list: ''
        };
	},
	created() {
		getCourseList().then(res=>{this.course_list = res;});
	},
    methods: {
        onSubmit() {
			insertPaper(this.form).then(res=>{
				this.$message.success('提交成功！');
			})
        },
		add_test() {
			this.editVisible = true
		},
		createType() {
			if (this.create_type === "全随机组卷") {
				this.box2 = false;
				this.box3 = false;
			} else if (this.create_type === "按章节/难度随机组卷"){
				this.box2 = true;
				this.box3 = false;
			} else if (this.create_type === "手动组卷"){
				this.box2 = false;
				this.box3 = true;
			}
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
					deletePaper({ids: [row.paperId]}).then(res=>{
						this.getData();
						this.$message.success('删除成功');
					})
                })
                .catch(() => {});
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
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        }
    }
};
</script>