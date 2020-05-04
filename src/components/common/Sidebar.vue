<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-peoplefill',
                    index: 'user',
                    title: '用户管理',
                    subs: [
					    {
					        index: 'student_mgr',
					        title: '学生管理'
					    },
					    {
					        index: 'teacher_mgr',
					        title: '教师管理'
                        },
                        {
					        index: 'admin_mgr',
					        title: '管理员'
					    }
					]
                },
                {
                    icon: 'el-icon-lx-text',
                    index: '3',
                    title: '考试管理',
					subs: [
					    {
					        index: 'paper_mgr',
					        title: '查看考试信息'
					    },
					    {
					        index: 'add_paper',
					        title: '新增考试'
					    }
					]
                },
				{
				    icon: 'el-icon-lx-text',
				    index: '4',
				    title: '课程管理',
					subs: [
					    {
					        index: 'course_info_mgr',
					        title: '课程管理'
					    },
						{
						    index: 'chapter_mgr',
						    title: '章节管理'
                        },
                        {
						    index: 'teaching_info_mgr',
						    title: '授课管理'
                        },
                        {
						    index: 'attend_class_mgr',
						    title: '上课管理'
						},
					]
				},
				{
					icon: 'el-icon-lx-copy',
				    index: 'class_mgr',
				    title: '班级管理'
				},
				{
					icon: 'el-icon-lx-copy',
				    index: 'test_mgr',
				    title: '试题管理'
				},
				{
				    icon: 'el-icon-lx-copy',
				    index: 'correct_paper',
				    title: '批改试卷'
				},
				{
				    icon: 'el-icon-lx-copy',
				    index: 'exam_record',
				    title: '考试记录'
				},
				{
				    icon: 'el-icon-pie-chart',
				    index: 'exam_analysis',
				    title: '数据分析'
				},
				{
				    icon: 'el-icon-pie-chart',
				    index: 'blacklist_mgr',
				    title: '通讯黑名单管理'
				}
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
