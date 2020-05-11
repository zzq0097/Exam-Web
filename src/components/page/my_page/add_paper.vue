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
                <el-form ref="form" :model="form" label-width="120px" style="width: 1000px;">
					<el-form-item label="课程">
						<el-select v-model="paper.courseid" placeholder="课程" @change="chapterOption" class="handle-select mr10">
							<el-option
								v-for="item in course_list"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="考试模式">
                        <el-radio-group v-model="paper.pattern">
                            <el-radio label="1">限通信模式</el-radio>
                            <el-radio label="2">霸屏模式</el-radio>
                        </el-radio-group>
                    </el-form-item>
					<el-form-item label="监控">
                        <el-radio-group v-model="paper.ismonitor">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="2">关闭</el-radio>
                        </el-radio-group>
                    </el-form-item>
					<el-form-item label="组卷策略">
						<el-button type="primary" @click="add_editVisible = true">添加条件策略</el-button>
						<el-table
							:data="paper.strategyDTOS"
							border
							class="table"
							ref="multipleTable"
							header-cell-class-name="table-header"
						>
							<el-table-column prop="type" label="题目类型" align="center"></el-table-column>
							<el-table-column prop="score" label="分值" align="center"></el-table-column>
							<el-table-column prop="count" label="数量" align="center"></el-table-column>
							<el-table-column label="组卷条件" align="center">
								<template slot-scope="scope">
									<a v-if="scope.row.mode === '1'">全随机</a>
									<a v-else-if="scope.row.mode === '2'">按章节/难度</a>
									<a v-else-if="scope.row.mode === '3'">手动组卷</a>
								</template>
							</el-table-column>
							<el-table-column prop="chapterid" label="章节" align="center"></el-table-column>
							<el-table-column prop="difficulty" label="难度" align="center"></el-table-column>
							<el-table-column label="手动组卷" width="180" align="center">
							<template slot-scope="scope">
								<a v-if="scope.row.mode === '3'">{{scope.row.questionids}}</a>
								<!-- <el-button
									v-if="scope.row.mode === '3'"
									type="text"
									icon="el-icon-edit"
									@click="handleEdit(scope.$index, scope.row)"
								>查看</el-button> -->
								<a v-else>无</a>
							</template>
							</el-table-column>
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
					</el-form-item>
					<el-form-item label="开始时间">
						<el-date-picker
							v-model="paper.starttime"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="结束时间">
						<el-date-picker
							v-model="paper.finishtime"
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
					<el-select v-model="strategy.type">
						<el-option label="选择" value="选择"></el-option>
						<el-option label="填空" value="填空"></el-option>
						<el-option label="判断" value="判断"></el-option>
						<el-option label="简答" value="简答"></el-option>
						<el-option label="编程" value="编程"></el-option>
					</el-select>
				</el-form-item>
		        <el-form-item label="题目数量">
		            <el-select v-model="strategy.count">
		            	<el-option v-for="i in 20" :key="i" :label="i" :value="i"></el-option>
		            </el-select>
		        </el-form-item>
				<el-form-item label="题目分值">
				    <el-select v-model="strategy.score">
				    	<el-option v-for="i in 20" :key="i" :label="i" :value="i"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="组卷方式">
				    <el-select v-model="strategy.mode">
				    	<el-option label="全随机" value=1></el-option>
						<el-option label="按章节/难度随机组卷" value=2></el-option>
						<el-option label="手动组卷" value=3></el-option>
				    </el-select>
				</el-form-item>
				<template v-if="form.mode === 2">
					<el-form-item label="章节">
						<el-select v-model="strategy.chapterid">
							<el-option v-for="i in 20" :key="i" :label="i" :value="i"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="难度">
						<el-select v-model="strategy.difficulty">
							<el-option v-for="i in 20" :key="i" :label="i" :value="i"></el-option>
						</el-select>
					</el-form-item>
				</template>
				<template v-else-if="form.mode === 3">
					<el-form-item label="手动">
						<el-select v-model="strategy.questionids">
							<el-option v-for="i in 20" :key="i" :label="i" :value="i"></el-option>
						</el-select>
					</el-form-item>
				</template>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveEdit">确 定</el-button>
		    </span>
		</el-dialog>

		<!-- 添加弹出框 -->
		<el-dialog title="编辑" :visible.sync="add_editVisible" width="30%">
		    <el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="题目类型">
					<el-select v-model="strategy.type">
						<el-option label="选择" value="选择"></el-option>
						<el-option label="填空" value="填空"></el-option>
						<el-option label="判断" value="判断"></el-option>
						<el-option label="简答" value="简答"></el-option>
						<el-option label="编程" value="编程"></el-option>
					</el-select>
				</el-form-item>
		        <el-form-item label="题目数量">
		            <el-select v-model="strategy.count">
		            	<el-option v-for="i in 20" :key="i" :label="i" :value="i"></el-option>
		            </el-select>
		        </el-form-item>
				<el-form-item label="题目分值">
				    <el-select v-model="strategy.score">
				    	<el-option v-for="i in 20" :key="i" :label="i" :value="i"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="组卷方式">
				    <el-select v-model="strategy.mode">
				    	<el-option label="全随机" value="1"></el-option>
						<el-option label="按章节/难度随机组卷" value="2"></el-option>
						<el-option label="手动组卷" value="3"></el-option>
				    </el-select>
				</el-form-item>
				<template v-if="strategy.mode === '2'">
					<el-form-item label="章节">
						<el-select v-model="strategy.chapterid">
							<el-option
								v-for="item in chapter_list"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="难度">
						<el-select v-model="strategy.difficulty">
							<el-option label="简单" value="简单"></el-option>
							<el-option label="中等" value="中等"></el-option>
							<el-option label="困难" value="困难"></el-option>
						</el-select>
					</el-form-item>
				</template>
				<template v-else-if="strategy.mode === '3'">
					<el-form-item label="选择章节">
						<el-select v-model="chapterid" @change="questionOption">
							<el-option
								v-for="item in chapter_list"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择题目">
						<el-select multiple filterable v-model="strategy.questionids">
							<el-option
								v-for="item in question_list"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</template>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="add_editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="add_strategy">确 定</el-button>
		    </span>
		</el-dialog>
    </div>
</template>

<script>
import { courseOption,getChapterList,questionOption } from '../../../api/index';
import { updatePaper, insertPaper } from '../../../api/PaperAPI';
export default {
    name: 'add_paper',
    data() {
        return {
			editVisible: false,
			add_editVisible: false,
			form: {},
			paper:{
				courseid: '',
				starttime: '',
                finishtime: '',
				pattern: '',
				ismonitor: '',
				strategyDTOS:[]
			},
			strategy:{
				type: '',
				count: '',
				score: '',
				mode: '',
				chapterid: '',
				difficulty: '',
				questionids: []
			},
			course_list: '',
			chapter_list: '',
			question_list: '',
			chapterid: ''
        };
	},
	created() {
		courseOption().then(res=>{this.course_list = res;});
	},
    methods: {
        onSubmit() {
			insertPaper(this.paper).then(res=>{
				this.$message.success('提交成功！');
			})
        },
		add_strategy() {
			this.add_editVisible = false;
			this.paper.strategyDTOS.push(this.strategy);
			console.log(this.strategy);
			this.strategy = {
				type: '',
				count: '',
				score: '',
				mode: '',
				chapterid: '',
				difficulty: '',
				questionids: []
			}
		},
		chapterOption(){
			getChapterList({id: this.paper.courseid}).then(res=>{ this.chapter_list = res })
		},
		questionOption(){
			questionOption({id: this.chapterid}).then(res=>{ this.question_list = res })
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
					deletePaper().then(res=>{
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