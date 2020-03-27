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
					    <el-select v-model="data">
					    	<el-option label="C++"></el-option>
					    	<el-option label="Java"></el-option>
					    	<el-option label="Python"></el-option>
					    	<el-option label="C#"></el-option>
					    	<el-option label="Vue.js"></el-option>
					    </el-select>
					</el-form-item>
                    <el-form-item label="考试模式">
                        <el-radio-group v-model="form.pattern">
                            <el-radio label="限通信模式"></el-radio>
                            <el-radio label="霸屏模式"></el-radio>
                        </el-radio-group>
                    </el-form-item>
					<el-form-item label="开启监控">
					    <el-switch v-model="form.monitor"></el-switch>
					</el-form-item>
					
					<el-form-item label="组卷方式">
					    <el-radio-group v-model="create_type" @change="createType">
					        <el-radio label="全随机组卷"></el-radio>
					        <el-radio label="按章节/难度随机组卷"></el-radio>
							<el-radio label="手动组卷"></el-radio>
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
                        <el-col :span="11">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.start_date1"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-select
                                placeholder="选择时间"
                                v-model="form.end_date1"
                                style="width: 100%;"
                            ></el-time-select>
                        </el-col>
                    </el-form-item>
					<el-form-item label="结束时间">
					    <el-col :span="11">
					        <el-date-picker
					            type="date"
					            placeholder="选择日期"
					            v-model="form.start_date2"
					            value-format="yyyy-MM-dd"
					            style="width: 100%;"
					        ></el-date-picker>
					    </el-col>
					    <el-col class="line" :span="2">-</el-col>
					    <el-col :span="11">
					        <el-time-select
					            placeholder="选择时间"
					            v-model="form.end_date2"
					            style="width: 100%;"
					        ></el-time-select>
					    </el-col>
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
		            	<el-option v-for="i in 20" label="">{{i}}</el-option>
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
				    	<el-option v-for="i in 20" label="">{{i}}</el-option>
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
            options: [
                {
                    value: 'guangdong',
                    label: '广东省',
                    children: [
                        {
                            value: 'guangzhou',
                            label: '广州市',
                            children: [
                                {
                                    value: 'tianhe',
                                    label: '天河区'
                                },
                                {
                                    value: 'haizhu',
                                    label: '海珠区'
                                }
                            ]
                        },
                        {
                            value: 'dongguan',
                            label: '东莞市',
                            children: [
                                {
                                    value: 'changan',
                                    label: '长安镇'
                                },
                                {
                                    value: 'humen',
                                    label: '虎门镇'
                                }
                            ]
                        }
                    ]
                },
                {
                    value: 'hunan',
                    label: '湖南省',
                    children: [
                        {
                            value: 'changsha',
                            label: '长沙市',
                            children: [
                                {
                                    value: 'yuelu',
                                    label: '岳麓区'
                                }
                            ]
                        }
                    ]
                }
            ],
            form: {
                name: '',
                region: '',
                start_date1: '',
                start_date2: '',
				end_date1: '',
				end_date2: '',
				pattern: '',
				monitor: '',
                options: []
            }
        };
    },
    methods: {
        onSubmit() {
            this.$message.success('提交成功！');
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
		}
    }
};
</script>