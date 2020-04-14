<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 考试记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.courseid" placeholder="课程" class="handle-select mr10">
                    <el-option
                    	v-for="item in course_list"
                    	:key="item.courseid"
                    	:label="item.coursename"
                    	:value="item.courseid">
                    </el-option>
                </el-select>
                <el-select v-model="query.classid" placeholder="班级" class="handle-select mr10">
                    <el-option
                    	v-for="item in class_list"
                    	:key="item.classid"
                    	:label="item.classname"
                    	:value="item.classid">
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
				<el-table-column label="批改状态" align="center">
					<template slot-scope="scope">
					    <el-tag
					        :type="scope.row.status==='已批改'?'success':(scope.row.status==='未批改'?'danger':'')"
					    >{{scope.row.status}}</el-tag>
					</template>
				</el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >查看记录</el-button>
						<el-button
						    type="text"
						    icon="el-icon-edit"
						    @click="playVideo(scope.$index, scope.row)"
						>查看监控</el-button>
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
        <el-dialog title="查看记录" :visible.sync="editVisible" width="80%">
            <hr/>
            <el-form ref="form" :model="form" v-for="item in this.test_list" :key="item.id" label-width="90px">
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
                <el-form-item label="分值："> {{ item.score }} </el-form-item>
                <el-form-item label="得分："> {{ item.stuScore }} </el-form-item>
                <el-form-item v-if="item.type==='选择'" label="参考答案："> {{ item.answer }} </el-form-item>
                <el-form-item label="学生答案："> {{ item.stuAnswer }} </el-form-item>
                <hr/>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 视频播放窗口 -->
        <el-dialog title="监控视频" :visible.sync="videoVisible" width="60%" height="60%">
            <a :href="form.monitor">{{ form.monitor }}</a>
            <span slot="footer" class="dialog-footer">
                <el-button @click="videoVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getRecordList, getTestsByRecordId } from '../../../api/RecordAPI.js';
import { getCourseList, getClassList } from '../../../api/index.js';
export default {
    name: 'user',
    data() {
        return {
            query: {
                courseid: '',
                classid: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            editVisible: false,
            videoVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            course_list: '',
            class_list: '',
            test_list: '',
            stu_scors: []
        };
    },
    created() {
        this.getData();
        getCourseList().then(res=>{ this.course_list = res });
        getClassList().then(res=>{ this.class_list = res });
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
        playVideo(index, row){
            this.idx = index;
            this.form = row;
            this.videoVisible = true;
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