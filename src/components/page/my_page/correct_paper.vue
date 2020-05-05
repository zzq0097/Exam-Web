<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 批改试卷
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.courseid" placeholder="课程" class="handle-select mr10">
                    <el-option
                    	v-for="item in course_list"
                    	:key="item.id"
                    	:label="item.name"
                    	:value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="query.classid" placeholder="班级" class="handle-select mr10">
                    <el-option
                    	v-for="item in class_list"
                    	:key="item.id"
                    	:label="item.name"
                    	:value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="学生姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="recordId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="学生姓名" align="center"></el-table-column>
				<el-table-column prop="className" label="班级" align="center"></el-table-column>
                <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
                <el-table-column prop="startTime" label="考试时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >批改</el-button>
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
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="批改" :visible.sync="editVisible" width="80%">
            <hr/>
		    <el-form ref="form" :model="form" v-for="(item,index) in test_list" :key="index" label-width="90px">
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
                <el-form-item label="考生答案："> {{ item.stuAnswer }} </el-form-item>
                <el-form-item label="题目分值："> {{ item.score }} </el-form-item>
                <el-form-item label="学生得分：" v-if="item.type === '选择' || item.type === '判断'">
                    <el-col :span="4">
                        <el-input placeholder="请输入得分" v-model="stu_score[index]" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="学生得分：" v-else>
                    <el-col :span="4">
                        <el-input placeholder="请输入得分" v-model="stu_score[index]"></el-input>
                    </el-col>
                </el-form-item>
                <hr/>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="detailInfo = false">取 消</el-button>
		        <el-button type="primary" @click="saveEdit">确 定</el-button>
		    </span>
        </el-dialog>
    </div>
</template>

<script>
import { getRecordList, getTestsByRecordId } from '../../../api/RecordAPI.js';
import { courseOption, getClassList } from '../../../api/index.js';
import { submitScore } from '../../../api/ExamAPI.js';
export default {
    name: 'user',
    data() {
        return {
            query: {
                courseid: '',
                classid: '',
                status: '未批改',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            course_list: '',
            class_list: '',
            test_list: '',
            stu_score: [],
            answerid_list: [],
            answerscore_list: []
        };
    },
    created() {
        this.getData();
        courseOption().then(res=>{ this.course_list = res });
        getClassList().then(res=>{ this.class_list = res });
    },
    computed: {
        
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            getRecordList(this.query).then(res => {
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
        // 编辑操作
        handleEdit(index, row) {
            getTestsByRecordId({recordid: row.recordId}).then(res=>{
                this.test_list = res.data
            })
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            console.log(this.stu_score);
            submitScore({score: this.stu_score}).then(res=>{
                this.$message.success('批改提交成功');
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