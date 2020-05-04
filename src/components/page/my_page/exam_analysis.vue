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
                <el-select v-model="table_select.paperid" placeholder="考试场次" class="handle-select mr10">
                    <el-option key="1" label="C++ | 2019-上" value="教师"></el-option>
                    <el-option key="2" label="Python | 2019-下" value="学生"></el-option>
					<el-option key="3" label="Java | 2019-下" value="班级"></el-option>
                </el-select>
				<el-select v-model="table_select.classid" placeholder="班级" class="handle-select mr10">
					<el-option key="1" label="全年级" value="班级"></el-option>
				    <el-option key="2" label="RB软工网161" value="教师"></el-option>
				    <el-option key="3" label="RB软工网162" value="学生"></el-option>
					<el-option key="4" label="RB软工移163" value="班级"></el-option>
				</el-select>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="content" label="题目"></el-table-column>
                <el-table-column prop="maxnum" label="最高分" align="center"></el-table-column>
                <el-table-column prop="minnum" label="最低分" align="center"></el-table-column>
                <el-table-column prop="avgnum" label="平均分" align="center"></el-table-column>
                <el-table-column prop="k" label="得分率" align="center"></el-table-column>v
            </el-table>
        </div>

        <el-col :span="12" :offset="6">
            <div class="schart-box">
                <el-select v-model="bar_select.paperid" placeholder="请选择试卷">
                    <el-option
                        v-for="item in paper_list"
                        :key="item.paperid"
                        :label="item.paperid"
                        :value="item.paperid">
                    </el-option>
                </el-select>
                <el-select v-model="bar_select.classid" multiple placeholder="请选择班级">
                    <el-option label="RB软工网161" value="1"></el-option>
                    <el-option label="RB软工网162" value="2"></el-option>
                </el-select>
                <schart class="schart" canvasId="bar" :options="bar_option"></schart>
            </div>
        </el-col>
		
        <el-col :span="12" :offset="6">
            <div class="schart-box">
                <el-select v-model="pie_select.paperid" placeholder="请选择试卷">
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
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-button @click="getPieData">查询</el-button>
                <schart class="schart" canvasId="pie" :options="pie_option"></schart>
            </div>
        </el-col>
        
        <el-col :span="12" :offset="6">
            <div class="schart-box">
                <el-select v-model="line_select.courseid" placeholder="请选择课程" class="handle-select mr10">
                    <el-option label="RB软工网161" value="1"></el-option>
                    <el-option label="RB软工网162" value="2"></el-option>
                </el-select>
                <el-select v-model="line_select.classid" placeholder="请选择班级" class="handle-select mr10">
                    <el-option label="RB软工网161" value="1"></el-option>
                    <el-option label="RB软工网162" value="2"></el-option>
                </el-select>
                <el-date-picker
                    v-model="line_select.line_time"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>
                <schart class="schart" canvasId="line" :options="line_option"></schart>
            </div>
        </el-col>

    </div>
</template>

<script>
import Schart from 'vue-schart';
import { selectClassByPaper, selectSpread, getAllPaper } from '../../../api/ChartAPI'
export default {
    name: 'user',
    components: {
        Schart
    },
    data() {
        return {
            tableData: [{
                id: 10,
                content: 'Java有几种基本数据类型？',
                average: 60,
                rate: '60%',
                variance: '1.1'
            }],
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
                classid: ''
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
                        label: '最低分',
                        data: [10, 11, 15, 31, 25]
                    },
                    {
                        label: '平均分',
                        data: [68, 78, 69, 81, 73]
                    },
                    {
                        label: '最高分',
                        data: [88, 98, 89, 99, 100]
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
            paper_list: ''
        };
    },
    created() {
        getAllPaper().then(res=>{ this.paper_list = res })
    },
    methods: {
        getClassList(){
            selectClassByPaper({paperid: this.paperid}).then(res=>{ this.class_list = res })
        },
        getPieData() {
            if (this.pie_select.paperid === ''){
                this.$message.error('请选择试卷')
            } else {
                selectSpread(this.pie_select).then(res=>{
                    this.pie_option.datasets[0].data[0] = res.num1;
                    this.pie_option.datasets[0].data[1] = res.num2;
                    this.pie_option.datasets[0].data[2] = res.num3;
                    this.pie_option.datasets[0].data[3] = res.num4;
                    this.pie_option.datasets[0].data[4] = res.num5;
                })
            }
        },
        getLineData() {
            selectSpread(this.pie_select).then(res=>{
                
            })
        },
        getTableData() {
            selectSpread(this.pie_select).then(res=>{
                
            })    
        },
        getBarData() {
            selectSpread(this.pie_select).then(res=>{
                
            })
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