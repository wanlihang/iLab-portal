import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    meta: {
      title: "首页",
      sign: true,
      keepAlive: true,
    },
    component: () => import("../views/index/index.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "密码登录",
    },
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/courses",
    name: "courses",
    meta: {
      title: "实验课",
      keepAlive: true,
    },
    component: () => import("../views/course/vod/index.vue"),
  },
  {
    path: "/courses/detail",
    name: "coursesDetail",
    component: () => import("../views/course/vod/detail.vue"),
  },
  {
    path: "/",
    name: "Lab",
    meta: {
      hideHeader: true,
    },
    component: () => import("../views/lab/index.vue"),
  },
  {
    path: "/courses/video",
    name: "coursesVideo",
    meta: {
      auth: true,
    },
    component: () => import("../views/course/vod/video.vue"),
  },
  {
    path: "/k12",
    name: "K12",
    meta: {
      title: "班课",
    },
    component: () => import("../views/course/k12/index.vue"),
  },
  {
    path: "/k12/detail",
    name: "K12Detail",
    component: () => import("../views/course/k12/detail.vue"),
  },
  {
    path: "/live",
    name: "live",
    meta: {
      title: "直播课",
      keepAlive: true,
    },
    component: () => import("../views/course/live/index.vue"),
  },
  {
    path: "/live/detail",
    name: "liveDetail",
    component: () => import("../views/course/live/detail.vue"),
  },
  {
    path: "/live/video",
    name: "liveVideo",
    meta: {
      hideHeader: true,
      auth: true,
    },
    component: () => import("../views/course/live/video.vue"),
  },
  {
    path: "/topic",
    name: "topic",
    meta: {
      title: "图文收费",
      keepAlive: true,
    },
    component: () => import("../views/topic/topic.vue"),
  },
  {
    path: "/topic/detail",
    name: "topicDetail",
    component: () => import("../views/topic/detail.vue"),
  },
  {
    path: "/book",
    name: "book",
    meta: {
      title: "电子书",
      keepAlive: true,
    },
    component: () => import("../views/book/index.vue"),
  },
  {
    path: "/book/detail",
    name: "bookDetail",
    component: () => import("../views/book/detail.vue"),
  },
  {
    path: "/book/read",
    name: "bookRead",
    meta: {
      hideHeader: true,
      auth: true,
    },
    component: () => import("../views/book/read.vue"),
  },
  {
    path: "/learnPath",
    name: "learnPath",
    meta: {
      title: "学习路径",
      keepAlive: true,
    },
    component: () => import("../views/learnPath/index.vue"),
  },
  {
    path: "/learnPath/detail",
    name: "learnPathDetail",
    component: () => import("../views/learnPath/detail.vue"),
  },
  {
    path: "/wenda",
    name: "wenda",
    meta: {
      title: "在线问答",
      keepAlive: true,
    },
    component: () => import("../views/wenda/index.vue"),
  },
  {
    path: "/wenda/detail",
    name: "wendaDetail",
    component: () => import("../views/wenda/detail.vue"),
  },
  {
    path: "/vip",
    name: "vip",
    meta: {
      title: "会员中心",
    },
    component: () => import("../views/role/index.vue"),
  },
  {
    path: "/credictmall",
    name: "Credictmall",
    meta: {
      title: "积分商城",
      auth: true,
    },
    component: () => import("../views/credictmall/index.vue"),
  },
  {
    path: "/credictmall/detail",
    name: "CredictmallDetail",
    meta: {
      auth: true,
    },
    component: () => import("../views/credictmall/detail.vue"),
  },
  {
    path: "/order/order",
    name: "order",
    meta: {
      title: "收银台",
      auth: true,
    },
    component: () => import("../views/order/order.vue"),
  },
  {
    path: "/order/pay",
    name: "orderPay",
    meta: {
      title: "支付中",
      auth: true,
    },
    component: () => import("../views/order/pay.vue"),
  },
  {
    path: "/order/success",
    name: "orderSuccess",
    meta: {
      title: "支付成功",
    },
    component: () => import("../views/order/success.vue"),
  },
  {
    path: "/member",
    name: "Member",
    meta: {
      title: "用户中心",
      sign: true,
      auth: true,
    },
    component: () => import("../views/member/index.vue"),
  },
  {
    path: "/member/mycourses",
    name: "MemberCourses",
    meta: {
      title: "我的录播课",
      auth: true,
    },
    component: () => import("../views/member/courses.vue"),
  },
  {
    path: "/member/myk12",
    name: "MemberK12",
    meta: {
      title: "我的班课",
      auth: true,
    },
    component: () => import("../views/member/k12.vue"),
  },
  {
    path: "/member/mylive",
    name: "MemberLive",
    meta: {
      title: "我的直播课",
      auth: true,
    },
    component: () => import("../views/member/live.vue"),
  },
  {
    path: "/member/mybooks",
    name: "MemberBooks",
    meta: {
      title: "已购电子书",
      auth: true,
    },
    component: () => import("../views/member/books.vue"),
  },
  {
    path: "/member/mytopic",
    name: "MemberTopic",
    meta: {
      title: "已购图文",
      auth: true,
    },
    component: () => import("../views/member/topic.vue"),
  },
  {
    path: "/member/history",
    name: "MemberHistory",
    meta: {
      title: "浏览历史",
      auth: true,
    },
    component: () => import("../views/member/history.vue"),
  },
  {
    path: "/member/paper",
    name: "MemberPaper",
    meta: {
      title: "我的考试",
      auth: true,
    },
    component: () => import("../views/member/paper.vue"),
  },
  {
    path: "/member/mockpaper",
    name: "MembermMckpaper",
    meta: {
      title: "我的模考",
      auth: true,
    },
    component: () => import("../views/member/mockpaper.vue"),
  },
  {
    path: "/member/practice",
    name: "MemberPractice",
    meta: {
      title: "我的练习",
      auth: true,
    },
    component: () => import("../views/member/practice.vue"),
  },
  {
    path: "/member/messages",
    name: "MemberMessages",
    meta: {
      title: "我的消息",
      auth: true,
    },
    component: () => import("../views/member/messages.vue"),
  },
  {
    path: "/member/profile",
    name: "MemberProfile",
    meta: {
      title: "我的资料",
      auth: true,
    },
    component: () => import("../views/member/profile.vue"),
  },
  {
    path: "/member/orders",
    name: "MemberOrders",
    meta: {
      title: "所有订单",
      auth: true,
    },
    component: () => import("../views/member/orders.vue"),
  },
  {
    path: "/member/questions",
    name: "MemberQuestions",
    meta: {
      title: "我的问答",
      auth: true,
    },
    component: () => import("../views/member/questions.vue"),
  },
  {
    path: "/member/share",
    name: "MemberShare",
    meta: {
      title: "邀请推广",
      auth: true,
    },
    component: () => import("../views/member/share.vue"),
  },
  {
    path: "/member/codeexchanger",
    name: "MemberCodeExchanger",
    meta: {
      title: "兑换课程",
      auth: true,
    },
    component: () => import("../views/member/codeexchanger.vue"),
  },
  {
    path: "/member/credit1_records",
    name: "MemberCredit1Records",
    meta: {
      title: "积分商城",
      auth: true,
    },
    component: () => import("../views/member/credit1_records.vue"),
  },
  {
    path: "/member/credit1_free",
    name: "MemberCredit1Free",
    meta: {
      title: "我的积分",
      auth: true,
    },
    component: () => import("../views/member/credit1_free.vue"),
  },
  {
    path: "/member/miaosha",
    name: "MemberMiaosha",
    meta: {
      title: "我的秒杀",
      auth: true,
    },
    component: () => import("../views/member/miaosha.vue"),
  },
  {
    path: "/exam",
    name: "Exam",
    meta: {
      title: "在线考试",
    },
    component: () => import("../views/exam/index.vue"),
  },

  {
    path: "/exam/papers",
    name: "ExamPapers",
    meta: {
      title: "考试中心",
    },
    component: () => import("../views/exam/paper/index.vue"),
  },
  {
    path: "/exam/papers/detail",
    name: "ExamPapersDetail",
    meta: {
      auth: true,
    },
    component: () => import("../views/exam/paper/detail.vue"),
  },
  {
    path: "/exam/papers/play",
    name: "ExamPapersPlay",
    meta: {
      hideHeader: true,
      auth: true,
    },
    component: () => import("../views/exam/paper/play.vue"),
  },
  {
    path: "/exam/mockpaper",
    name: "ExamMockPapers",
    meta: {
      title: "模拟考试",
    },
    component: () => import("../views/exam/mock/index.vue"),
  },
  {
    path: "/exam/mockpaper/detail",
    name: "ExamMockpaperDetail",
    meta: {
      auth: true,
    },
    component: () => import("../views/exam/mock/detail.vue"),
  },
  {
    path: "/exam/mockpaper/play",
    name: "ExamMockpaperPlay",
    meta: {
      hideHeader: true,
      auth: true,
    },
    component: () => import("../views/exam/mock/play.vue"),
  },
  {
    path: "/exam/practice",
    name: "ExamPractice",
    meta: {
      title: "练习模式",
    },
    component: () => import("../views/exam/practice/index.vue"),
  },
  {
    path: "/exam/practice/detail",
    name: "ExamPracticeDetail",
    meta: {
      auth: true,
    },
    component: () => import("../views/exam/practice/detail.vue"),
  },
  {
    path: "/exam/practice/play",
    name: "ExamPracticePlay",
    meta: {
      hideHeader: true,
      auth: true,
    },
    component: () => import("../views/exam/practice/play.vue"),
  },
  {
    path: "/exam/wrongbook",
    name: "ExamWrongBook",
    meta: {
      title: "考试错题本",
      auth: true,
    },
    component: () => import("../views/exam/wrongbook/index.vue"),
  },
  {
    path: "/exam/wrongbook/play",
    name: "ExamWrongBookPlay",
    meta: {
      title: "错题本练习",
      hideHeader: true,
      auth: true,
    },
    component: () => import("../views/exam/wrongbook/play.vue"),
  },
  {
    path: "/exam/collection",
    name: "ExamCollection",
    meta: {
      title: "收藏习题",
      auth: true,
    },
    component: () => import("../views/exam/collection/index.vue"),
  },
  {
    path: "/exam/collection/play",
    name: "ExamCollectionPlay",
    meta: {
      title: "收藏习题详情",
      hideHeader: true,
      auth: true,
    },
    component: () => import("../views/exam/collection/play.vue"),
  },
  {
    path: "/exam/questionbank",
    name: "ExamQuestionbank",
    meta: {
      title: "试题库",
      auth: true,
    },
    component: () => import("../views/exam/questionbank/index.vue"),
  },
  {
    path: "/exam/questionbank/play",
    name: "ExamQuestionbankPlay",
    meta: {
      title: "试题库练习",
      hideHeader: true,
      auth: true,
    },
    component: () => import("../views/exam/questionbank/play.vue"),
  },
  {
    path: "/ms",
    name: "ms",
    meta: {
      title: "秒杀",
    },
    component: () => import("../views/ms/index.vue"),
  },
  {
    path: "/ms/detail",
    name: "msDetail",
    meta: {
      auth: true,
    },
    component: () => import("../views/ms/detail.vue"),
  },
  {
    path: "/tg",
    name: "tg",
    meta: {
      title: "团购",
    },
    component: () => import("../views/tg/index.vue"),
  },
  {
    path: "/tg/detail",
    name: "tgDetail",
    meta: {
      auth: true,
    },
    component: () => import("../views/tg/detail.vue"),
  },
  {
    path: "/announcement",
    name: "announcement",
    component: () => import("../views/announcement/index.vue"),
  },
  {
    path: "/search",
    name: "Search",
    meta: {
      title: "全站搜索",
    },
    component: () => import("../views/search/index.vue"),
  },
  {
    path: "/share",
    name: "Share",
    meta: {
      title: "推广",
      auth: true,
    },
    component: () => import("../views/share/index.vue"),
  },
  {
    path: "/500",
    name: "Error500",
    meta: {
      title: "500",
      hideHeader: true,
    },
    component: () => import("../views/index/500.vue"),
  },
  {
    path: "/404",
    name: "Error404",
    meta: {
      title: "404",
      hideHeader: true,
    },
    component: () => import("../views/index/404.vue"),
  },
  {
    path: "/error",
    name: "Error",
    meta: {
      title: "错误",
      hideHeader: true,
    },
    component: () => import("../views/index/error.vue"),
  },
  {
    path: "*",
    meta: {
      title: "404错误",
      hideHeader: true,
    },
    component: () => import("../views/index/404.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
