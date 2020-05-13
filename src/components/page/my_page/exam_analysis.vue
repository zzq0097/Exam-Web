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
                <el-select v-model="table_select.paperid" placeholder="请选择试卷" class="handle-select mr10">
                    <el-option
                        v-for="item in paper_list"
                        :key="item.paperid"
                        :label="item.paperid"
                        :value="item.paperid">
                    </el-option>
                </el-select>
				<el-select v-model="table_select.classid" placeholder="请选择班级" class="handle-select mr10">
					<el-option
                        v-for="item in class_list"
                        :key="item.classid"
                        :label="item.classname"
                        :value="item.classid">
                    </el-option>
				</el-select>
                <el-button type="success" @click="getTableData">查询</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="questionid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="content" label="题目"></el-table-column>
                <el-table-column prop="maxnum" label="最高分" align="center"></el-table-column>
                <el-table-column prop="minnum" label="最低分" align="center"></el-table-column>
                <el-table-column prop="avgnum" label="平均分" align="center"></el-table-column>
                <el-table-column prop="percent" label="得分率" align="center"></el-table-column>v
            </el-table>
        </div>

        <el-col :span="12" :offset="6">
            <div class="schart-box">
                <el-select v-model="bar_select.paperid" placeholder="请选择试卷" @change="getClassList(bar_select.paperid)">
                    <el-option
                        v-for="item in paper_list"
                        :key="item.paperid"
                        :label="item.paperid"
                        :value="item.paperid">
                    </el-option>
                </el-select>
                <el-select v-model="bar_select.classids" multiple placeholder="请选择班级">
                    <el-option
                        v-for="item in class_list"
                        :key="item.classid"
                        :label="item.classname"
                        :value="item.classid">
                    </el-option>
                </el-select>
                <el-button type="success" @click="getBarData">查询</el-button>
                <schart class="schart" canvasId="bar" :options="bar_option"></schart>
            </div>
        </el-col>
		
        <el-col :span="12" :offset="6">
            <div class="schart-box">
                <el-select v-model="pie_select.paperid" placeholder="请选择试卷" @change="getClassList(pie_select.paperid)">
                    <el-option
                        v-for="item in paper_list"
                        :key="item.paperid"
                        :label="item.paperid"
                        :value="item.paperid">
                    </el-option>
                </el-select>
                <el-select v-model="pie_select.classid" placeholder="请选择班级">
                    <el-option
                        v-for="item in class_list"
                        :key="item.classid"
                        :label="item.classname"
                        :value="item.classid">
                    </el-option>
                </el-select>
                <el-button type="success" @click="getPieData">查询</el-button>
                <schart class="schart" canvasId="pie" :options="pie_option"></schart>
            </div>
        </el-col>
        
        <el-col :span="12" :offset="6">
            <div class="schart-box">
                <el-select v-model="line_select.courseid" placeholder="请选择课程" class="handle-select mr10">
                    <el-option
                        v-for="item in course_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <!-- <el-select v-model="line_select.classid" placeholder="请选择班级" class="handle-select mr10">
                    <el-option
                        v-for="item in class_list"
                        :key="item.classid"
                        :label="item.classname"
                        :value="item.classid">
                    </el-option>
                </el-select> -->
                <el-date-picker
                    v-model="line_select.line_time"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>
                <el-button type="success" @click="getLineData">查询</el-button>
                <schart class="schart" canvasId="line" :options="line_option"></schart>
            </div>
        </el-col>

    </div>
</template>

<script>
import Schart from 'vue-schart';
import { selectClassByPaper, selectSpread, getAllPaper, selectEverQues, getLineChart, selectAverage } from '../../../api/ChartAPI';
import { courseOption } from '../../../api/index'
export default {
    name: 'user',
    components: {
        Schart
    },
    data() {
        return {
            tableData: [],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            table_select: {
                paperid: '',
                classid: ''
            },
            bar_select: {
                paperid: '',
                classids: ''
            },
            pie_select: {
                paperid: '',
                classid: ''
            },
            line_select: {
                courseid: '',
                classid: '',
                line_time: ''
            },
            bar_option: {
                type: 'bar',
                title: {
                    text: '成绩分析'
                },
                labels: ['RB软工网161', 'RB软工网162', 'RB软工网163', 'RB软工网164', 'RB软工网165'],
                datasets: [
                    {
                        label: '最高分',
                        data: [88, 98, 89, 99, 100]
                    },
                    {
                        label: '平均分',
                        data: [68, 78, 69, 81, 73]
                    },
                    {
                        label: '最低分',
                        data: [10, 11, 15, 31, 25]
                    },
                    {
                        label: '方差',
                        data: [1, 1, 1, 1, 1]
                    }
                ]
            },
            pie_option: {
                type: 'pie',
                title: {
                    text: '分数段'
                },
                legend: {
                    position: 'left'
                },
                labels: ['60以下', '60-70', '70-80', '80-90', '90以上'],
                datasets: [
                    {
                        data: [334, 278, 190, 235, 260]
                    }
                ]
            },
            line_option: {
                type: 'line',
                title: {
                    text: '最近几次考试成绩趋势图'
                },
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '最高分',
                        data: [100, 95, 98, 90, 89]
                    },
                    {
                        label: '平均分',
                        data: [68, 71, 80, 75, 70]
                    },
                    {
                        label: '最低分',
                        data: [10, 40, 50, 30, 20]
                    }
                ]
            },
            class_list: '',
            paper_list: '',
            course_list: ''
        };
    },
    created() {
        getAllPaper().then(res=>{ this.paper_list = res })
        courseOption().then(res=>{ this.course_list = res })
    },
    methods: {
        getClassList(paperid){
            selectClassByPaper({paperid: paperid}).then(res=>{ this.class_list = res })
        },
        getPieData() {
            if (this.pie_select.paperid === ''){
                this.$message.error('请选择试卷')
            } else {
                selectSpread(this.pie_select).then(res=>{
                    this.pie_option.datasets[0].data = res;
                })
            }
        },
        getLineData() {
            if (this.line_select.courseid === '' || this.line_select.line_time === ''){
                this.$message.error('请选择课程或时间')
            } else {
                getLineChart(this.line_select).then(res=>{
                    this.line_option.labels = [];
                    this.line_option.datasets[0].data = [];
                    this.line_option.datasets[1].data = [];
                    this.line_option.datasets[2].data = [];
                    for(var i=0;i<res.length;i++){
                        this.line_option.labels.push(res[i].time);
                        this.line_option.datasets[0].data.push(res[i].maxScore);
                        this.line_option.datasets[1].data.push(res[i].avgScore);
                        this.line_option.datasets[2].data.push(res[i].minScore);
                    }
                })
            }
        },
        getTableData() {
            if (this.table_select.paperid === ''){
                this.$message.error('请选择试卷')
            } else {
                selectEverQues(this.table_select).then(res=>{
                    this.tableData = res;
                })
            }    
        },
        getBarData() {
            if (this.bar_select.paperid === ''){
                this.$message.error('请选择试卷')
            } else {
                selectAverage(this.bar_select).then(res=>{
                    this.bar_option.labels = [];
                    this.bar_option.datasets[0].data = [];
                    this.bar_option.datasets[1].data = [];
                    this.bar_option.datasets[2].data = [];
                    this.bar_option.datasets[3].data = [];
                    for(var i=0;i<res.length;i++){
                        this.bar_option.labels.push(res[i].classname);
                        this.bar_option.datasets[0].data.push(res[i].maxScore);
                        this.bar_option.datasets[1].data.push(res[i].average);
                        this.bar_option.datasets[2].data.push(res[i].minScore);
                        this.bar_option.datasets[3].data.push(res[i].variance);
                    }
                    console.log(this.bar_option)
                })
            }
        }
    }
};
</script>

<style scoped>
.schart-box {
    text-align: center;
    display: inline-block;
}
.schart {
    width: 600px;
    height: 400px;
}

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