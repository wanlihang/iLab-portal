import { get, post, put, destroy } from "./http";

const Api = {
  Home: {
    Announcement() {
      return get(`/api/v2/announcement/latest`);
    },
    AnnouncementList() {
      return get(`/api/v2/announcements`);
    },
    AnnouncementDetail(id) {
      return get(`/api/v2/announcement/${id}`);
    },
    FooterLink() {
      return get(`/api/v2/links`);
    },
    HeaderNav() {
      return get(`/api/v2/navs`);
    },
  },
  Search: {
    Index(params) {
      return get(`/api/v3/search`, params);
    },
  },
  Role: {
    List() {
      return get("/api/v2/roles");
    },
  },
  ViewBlock: {
    PageBlocks(params) {
      return get(`/api/v2/viewBlock/page/blocks`, params);
    },
    Sliders(params) {
      return get(`/api/v2/sliders`, params);
    },
  },
  Other: {
    Captcha() {
      return get("/api/v2/captcha/image");
    },
    SendSms(params) {
      return post("/api/v2/captcha/sms", params);
    },
    Config() {
      return get("/api/v2/other/config");
    },
  },
  Auth: {
    SmsLogin(params) {
      return post(`/api/v2/login/mobile`, params);
    },
    SmsRegister(params) {
      return post(`/api/v2/register/sms`, params);
    },
    PasswordForget(params) {
      return post("/api/v2/password/reset", params);
    },
    PasswordLogin(params) {
      return post(`/api/v2/login/password`, params);
    },
    WechatMiniLogin(params) {
      return post(`/api/v2/wechat/mini/login`, params);
    },
    WechatMiniLoginState(params) {
      return post(`/api/v2/login/wechatMini`, params);
    },
    WechatMiniLoginMobile(params) {
      return post(`/api/v2/login/wechatMiniMobile`, params);
    },
    Logout(params) {
      return post(`/api/v2/logout`, params);
    },
  },
  Sign: {
    User() {
      return get("/addons/DaySignIn/api/v1/user");
    },
    SignIn(params) {
      return post(`/addons/DaySignIn/api/v1/signIn`, params);
    },
  },
  CreditMall: {
    List(params) {
      return get(`/addons/Credit1Mall/api/v1/goods`, params);
    },
    Detail(id) {
      return get(`/addons/Credit1Mall/api/v1/goods/${id}`);
    },
    Exchange(id, params) {
      return post(`/addons/Credit1Mall/api/v1/goods/${id}/exchange`, params);
    },
    Address() {
      return get(`/addons/Credit1Mall/api/v1/user/address`);
    },
    Orders(params) {
      return get(`/addons/Credit1Mall/api/v1/user/orders`, params);
    },
  },
  User: {
    Detail() {
      return get(`/api/v2/member/detail`);
    },
  },
  TemplateOne: {
    LikeStatus(params) {
      return get(`/addons/templateOne/api/v1/like/status`, params);
    },
    LikeHit(params) {
      return get(`/addons/templateOne/api/v1/like/hit`, params);
    },
    LikeCourses(params) {
      return get(`/addons/templateOne/api/v1/like/courses`, params);
    },
    User: {
      Courses(params) {
        return get(`/addons/templateOne/api/v1/user/courses`, params);
      },
    },
    History: {
      Record(type, id, title) {
        return post("/addons/templateOne/api/v1/history/record", {
          type: type,
          id: id,
          title: title,
        });
      },
      Records(params) {
        return get("/addons/templateOne/api/v1/history/records", params);
      },
    },
  },
  Course: {
    List(params) {
      return get("/api/v2/courses", params);
    },
    Detail(id) {
      return get("/api/v2/course/" + id);
    },
    Comments(id) {
      return get("/api/v2/course/" + id + "/comments");
    },
    Collect(id) {
      return get("/api/v2/course/" + id + "/like");
    },
    SubmitComment(id, params) {
      return post("/api/v2/course/" + id + "/comment", params);
    },
    Video(id) {
      return get("/api/v2/video/" + id);
    },
    VideoComments(id) {
      return get("/api/v2/video/" + id + "/comments");
    },
    SubmitVideoComment(id, params) {
      return post("/api/v2/video/" + id + "/comment", params);
    },
    PlayInfo(id, params) {
      return get("/api/v2/video/" + id + "/playinfo", params);
    },
    VideoRecord(id, params) {
      return post("/api/v2/video/" + id + "/record", params);
    },
    Categories() {
      return get("/api/v2/course_categories");
    },
    Download(id, params) {
      return get(`/api/v2/course/attach/${id}/download`, params);
    },
  },
  K12: {
    List(params) {
      return get("/addons/ke/api/v1/courses", params);
    },
    Detail(id) {
      return get("/addons/ke/api/v1/course/" + id);
    },
    CreateOrder(id, params) {
      return post("/addons/ke/api/v1/course/" + id + "/paid", params);
    },
    UserCourses(params) {
      return get("/addons/ke/api/v1/user/courses", params);
    },
  },
  Live: {
    List(params) {
      return get("/addons/zhibo/api/v1/courses", params);
    },
    Detail(id) {
      return get("/addons/zhibo/api/v1/course/" + id);
    },
    Comments(id, params) {
      return get("/addons/zhibo/api/v1/course/" + id + "/comments", params);
    },
    SubmitComment(id, params) {
      return post("/addons/zhibo/api/v1/course/" + id + "/comment", params);
    },
    Play(id) {
      return get("/addons/zhibo/api/v1/course/" + id + "/play");
    },
    Record(courseId, videoId) {
      return get(
        "/addons/zhibo/api/v1/course/" +
          courseId +
          "/video/" +
          videoId +
          "/watch/record"
      );
    },
    CreateOrder(id, params) {
      return post("/addons/zhibo/api/v1/course/" + id + "/paid", params);
    },
    User(params) {
      return get("/addons/zhibo/api/v1/member/courses", params);
    },
    ChatRecords(courseId, videoId, params) {
      return get(
        `/addons/zhibo/api/v1/course/${courseId}/video/${videoId}/chat/records`,
        params
      );
    },
    SendMessage(courseId, videoId, params) {
      return post(
        `/addons/zhibo/api/v1/course/${courseId}/video/${videoId}/chat/send`,
        params
      );
    },
  },

  Member: {
    Detail() {
      return get("/api/v2/member/detail");
    },
    NicknameChange(params) {
      return post("/api/v2/member/detail/nickname", params);
    },
    AvatarChange(params) {
      return post("/api/v2/member/avatar", params);
    },
    MobileVerify(params) {
      return post("/api/v2/member/verify", params);
    },
    MobileChange(params) {
      return put("/api/v2/member/mobile", params);
    },
    NewMobile(params) {
      return post("/api/v2/member/detail/mobile", params);
    },
    PasswordChange(params) {
      return post("/api/v2/member/detail/password", params);
    },
    WechatLogin() {
      return get("/api/v2/login/wechatScan");
    },
    WechatBind() {
      return get("/api/v2/member/wechatScan/bind");
    },
    CheckWechatLogin(params) {
      return get("/api/v2/login/wechatScan/query", params);
    },
    CancelBind(app) {
      return destroy(`/api/v2/member/socialite/${app}`);
    },
    Profile() {
      return get("/api/v2/member/profile");
    },
    ProfileSave(params) {
      return post("/api/v2/member/profile", params);
    },
    Credit1Records(params) {
      return get("/api/v2/member/credit1Records", params);
    },
    PromoCode() {
      return get("/api/v2/member/promoCode");
    },
    PromoCodeCreate() {
      return post("/api/v2/member/promoCode");
    },
    Withdraw(params) {
      return post("/api/v2/member/withdraw", params);
    },
    InviteUsers(params) {
      return get("/api/v2/member/inviteUsers", params);
    },
    WithdrawRecords(params) {
      return get("/api/v2/member/withdrawRecords", params);
    },
    InviteBalanceRecords(params) {
      return get("/api/v2/member/inviteBalanceRecords", params);
    },
    Messages(params) {
      return get("/api/v2/member/messages", params);
    },
    ReadMessage(id) {
      return get("/api/v2/member/notificationMarkAsRead/" + id);
    },
    ReadMessageAll() {
      return get("/api/v2/member/notificationMarkAllAsRead");
    },
    UnReadNum() {
      return get("/api/v2/member/unreadNotificationCount");
    },
    Orders(params) {
      return get("/api/v2/member/orders", params);
    },
    Courses(params) {
      return get("/api/v2/member/courses", params);
    },
    Videos(params) {
      return get("/api/v2/member/videos", params);
    },
    Collects(params) {
      return get("/api/v2/member/courses/like", params);
    },
    Miaosha(params) {
      return get("/addons/MiaoSha/api/v1/m/user/orders", params);
    },
  },
  MultiLevelShare: {
    Config() {
      return get("/addons/MultiLevelShare/api/v1/config");
    },
    PosterList() {
      return get("/addons/MultiLevelShare/api/v1/poster/list");
    },
    User() {
      return get("/addons/MultiLevelShare/api/v1/user");
    },
    Goods(params) {
      return get("/addons/MultiLevelShare/api/v1/user/goods", params);
    },
    Reward(params) {
      return get("/addons/MultiLevelShare/api/v1/user/goods/reward", params);
    },
    Bind(params) {
      return post("/addons/MultiLevelShare/api/v1/user/bind", params);
    },
  },
  Book: {
    List(params) {
      return get("/addons/MeeduBooks/api/v1/books", params);
    },
    HotList() {
      return get("/addons/MeeduBooks/api/v1/config/pcListPageRec");
    },
    Detail(id) {
      return get("/addons/MeeduBooks/api/v1/book/" + id);
    },
    BookComments(id, params) {
      return get("/addons/MeeduBooks/api/v1/book/" + id + "/comments", params);
    },
    SubmitBookComment(id, params) {
      return post("/addons/MeeduBooks/api/v1/book/" + id + "/comment", params);
    },
    Comments(id, params) {
      return get(
        `/addons/MeeduBooks/api/v2/book/article/${id}/comments`,
        params
      );
    },
    SubmitComment(id, params) {
      return post(
        `/addons/MeeduBooks/api/v1/book/article/${id}/comment`,
        params
      );
    },
    AnswerComments(id, params) {
      return get(
        `/addons/MeeduBooks/api/v2/book/article/${id}/comments`,
        params
      );
    },
    CreateOrder(id, params) {
      return post("/addons/MeeduBooks/api/v1/book/" + id + "/buy", params);
    },
    ArticleRead(id) {
      return get("/addons/MeeduBooks/api/v1/book/" + id + "/read");
    },
    ArticleComments(id, params) {
      return get(
        "/addons/MeeduBooks/api/v1/book/article/" + id + "/comments",
        params
      );
    },
    SubmitArticleComment(id, params) {
      return post(
        "/addons/MeeduBooks/api/v1/book/article/" + id + "/comment",
        params
      );
    },
    UserBooks(params) {
      return get("/addons/MeeduBooks/api/v1/user/books", params);
    },
  },
  Exam: {
    UploadPaperImages(params) {
      return post("/addons/Paper/api/v1/upload/image", params);
    },
    PaperList(params) {
      return get("/addons/Paper/api/v1/papers", params);
    },
    PaperDetail(id) {
      return get("/addons/Paper/api/v1/paper/" + id);
    },
    CreatePaperOrder(id, params) {
      return post("/addons/Paper/api/v1/paper/buy", params);
    },
    PaperJoin(id, params) {
      return get("/addons/Paper/api/v1/paper/" + id + "/join", params);
    },
    PaperJoinRecord(paperId, recordId) {
      return get("/addons/Paper/api/v1/paper/" + paperId + "/join/" + recordId);
    },
    PaperJoinRecords(id, params) {
      return get("/addons/Paper/api/v1/paper/" + id + "/joinRecords", params);
    },
    PaperSubmitSingle(id, params) {
      return post(
        "/addons/Paper/api/v1/paper/" + id + "/submit/single",
        params
      );
    },
    PaperSubmit(id, params) {
      return post("/addons/Paper/api/v1/paper/" + id + "/submit/all", params);
    },
    PracticesList(params) {
      return get("/addons/Paper/api/v1/practices", params);
    },
    PracticeDetail(id) {
      return get("/addons/Paper/api/v1/practice/" + id);
    },
    CreatePracticeOrder(id, params) {
      return post("/addons/Paper/api/v1/practice/buy", params);
    },
    CreateMockpaperOrder(id, params) {
      return post("/addons/Paper/api/v1/mock_paper/buy", params);
    },
    PracticeDayPlay(id) {
      return get("/addons/Paper/api/v1/practice/" + id + "/day");
    },
    PracticePlay(id, chapterId) {
      return get("/addons/Paper/api/v1/practice/" + id + "/join/" + chapterId);
    },
    PracticeQuestion(id, questionId) {
      return get(
        "/addons/Paper/api/v1/practice/" + id + "/join/question/" + questionId
      );
    },
    PracticeQuestionAnswerFill(id, questionId, params) {
      return post(
        "/addons/Paper/api/v1/practice/" +
          id +
          "/join/question/" +
          questionId +
          "/answer",
        params
      );
    },
    UserPaper(params) {
      return get("/addons/Paper/api/v1/user/papers", params);
    },
    UserPractice(params) {
      return get("/addons/Paper/api/v1/user/practices", params);
    },
    UserMockPaper(params) {
      return get("/addons/Paper/api/v1/user/mockPapers", params);
    },
    Practice: {
      CollectStatus(params) {
        return post(`/addons/Paper/api/v1/collection/status`, params);
      },
      CollectionStatus(params) {
        return post(`/addons/Paper/api/v1/collection/status/multi`, params);
      },
      Collect(params) {
        return post(`/addons/Paper/api/v1/collection/action`, params);
      },
    },
    WrongBook: {
      Detail() {
        return get(`/addons/Paper/api/v1/wrongbook`);
      },
      OrderMode(params) {
        return get("/addons/Paper/api/v1/wrongbook/start", params);
      },
      RandomMode(params) {
        return get("/addons/Paper/api/v1/wrongbook/random", params);
      },
      RemoveQuestion(id) {
        return destroy("/addons/Paper/api/v1/wrongbook/" + id);
      },
    },
    Collection: {
      Detail(params) {
        return get(`/addons/Paper/api/v1/collection/questions`, params);
      },
      Practice(params) {
        return post("/addons/Paper/api/v1/questions/practice", params);
      },
      OrderMode(params) {
        return post("/addons/Paper/api/v1/collection/play", params);
      },
    },
    QuestionBank: {
      Detail() {
        return get(`/addons/Paper/api/v1/questions/categories`);
      },
      Practice(params) {
        return post("/addons/Paper/api/v1/questions/practice", params);
      },
    },
    MockPaper: {
      List(params) {
        return get("/addons/Paper/api/v1/mock_papers", params);
      },
      Detail(id) {
        return get("/addons/Paper/api/v1/mock_paper/" + id);
      },
      Join(id) {
        return post("/addons/Paper/api/v1/mock_paper/" + id);
      },
      JoinDetail(recordId) {
        return get("/addons/Paper/api/v1/mock_paper/record/" + recordId);
      },
      Records(id, params) {
        return get(
          "/addons/Paper/api/v1/mock_paper/" + id + "/records",
          params
        );
      },
      SubmitSingle(recordId, params) {
        return post(
          "/addons/Paper/api/v1/mock_paper/record/" +
            recordId +
            "/submit/single",
          params
        );
      },
      SubmitAll(recordId, params) {
        return post(
          "/addons/Paper/api/v1/mock_paper/record/" + recordId + "/submit",
          params
        );
      },
    },
  },
  Order: {
    Payments(params) {
      return get("/api/v2/order/payments", params);
    },
    PromoCodeCheck(code) {
      return get("/api/v2/promoCode/" + code + "/check");
    },
    CreateCourseOrder(params) {
      return post("/api/v2/order/course", params);
    },
    CreateVideoOrder(params) {
      return post("/api/v2/order/video", params);
    },
    CreateRoleOrder(params) {
      return post("/api/v2/order/role", params);
    },
    PayWechatScan(params) {
      return post("/api/v2/order/pay/wechatScan", params);
    },
    CheckOrderStatus(params) {
      return get("/api/v2/order/status", params);
    },
    HandPay(params) {
      return post("/api/v3/order/pay/handPay", params);
    },
  },
  Wenda: {
    List(params) {
      return get("/addons/Wenda/api/v1/questions", params);
    },
    Detail(id) {
      return get("/addons/Wenda/api/v1/question/" + id + "/detail");
    },
    Create() {
      return get("/addons/Wenda/api/v1/question/create");
    },
    Store(params) {
      return post("/addons/Wenda/api/v1/question/create", params);
    },
    Edit(id) {
      return get("/addons/Wenda/api/v1/question/" + id + "/edit");
    },
    Update(id, params) {
      return put("/addons/Wenda/api/v1/question/" + id + "/edit", params);
    },
    ChoiceAnswer(id, params) {
      return post("/addons/Wenda/api/v1/question/" + id + "/correct", params);
    },
    SubmitAnswer(id, params) {
      return post("/addons/Wenda/api/v1/question/" + id + "/answer", params);
    },
    Vote(params) {
      return post("/addons/Wenda/api/v1/vote", params);
    },
    SubmitComment(answerId, params) {
      return post(
        "/addons/Wenda/api/v1/question/answer/" + answerId + "/comment",
        params
      );
    },
    UserQuestions(params) {
      return get("/addons/Wenda/api/v1/member/questions", params);
    },
    UserAnswers(params) {
      return get("/addons/Wenda/api/v1/member/answers", params);
    },
    UserVoteQuestions(params) {
      return get("/addons/Wenda/api/v1/question/member/vote/questions", params);
    },
    AnswerComments(answerId, params) {
      return get(
        "/addons/Wenda/api/v1/question/answer/" + answerId + "/comments",
        params
      );
    },
  },
  CodeExchanger: {
    Exchange(params) {
      return post("/addons/CodeExchanger/api/v1/exchange", params);
    },
    Records(params) {
      return get("/addons/CodeExchanger/api/v1/records", params);
    },
  },
  LearnPath: {
    List(params) {
      return get("/addons/LearnPaths/api/v1/all", params);
    },
    Create(params) {
      return get("/addons/LearnPaths/api/v1/categories", params);
    },
    Detail(id) {
      return get("/addons/LearnPaths/api/v1/path/" + id);
    },
    CreateOrder(id, params) {
      return post("/addons/LearnPaths/api/v1/path/" + id + "/buy", params);
    },
  },
  Topic: {
    List(params) {
      return get("/addons/MeeduTopics/api/v1/topics", params);
    },
    HotList() {
      return get("/addons/MeeduTopics/api/v1/config/pcListPageRec");
    },
    Detail(id) {
      return get("/addons/MeeduTopics/api/v1/topic/" + id);
    },
    Comments(id, params) {
      return get(`/addons/MeeduTopics/api/v2/topic/${id}/comments`, params);
    },
    AllComments(id, params) {
      return get(`/addons/MeeduTopics/api/v2/topic/${id}/comments`, params);
    },
    ReleaseComments(id, params) {
      return post(`/addons/MeeduTopics/api/v1/topic/${id}/comment`, params);
    },
    Vote(id, params) {
      return post("/addons/MeeduTopics/api/v1/topic/" + id + "/vote", params);
    },
    Collect(id, params) {
      return post(
        "/addons/MeeduTopics/api/v1/topic/" + id + "/collect",
        params
      );
    },
    CreateOrder(id, params) {
      return post("/addons/MeeduTopics/api/v1/topic/" + id + "/buy", params);
    },
    SubmitComment(id, params) {
      return post(
        "/addons/MeeduTopics/api/v1/topic/" + id + "/comment",
        params
      );
    },
    UserTopic(params) {
      return get("/addons/MeeduTopics/api/v1/user/topics", params);
    },
    UserVoteTopics(params) {
      return get("/addons/MeeduTopics/api/v1/user/vote", params);
    },
    UserBuyTopics(params) {
      return get("/addons/MeeduTopics/api/v1/user/buyTopics", params);
    },
    LikeCourses(params) {
      return get("/addons/MeeduTopics/api/v1/user/collect", params);
    },
  },
  TuanGou: {
    List(params) {
      return get("/addons/TuanGou/api/v1/t", params);
    },
    Detail(id, params) {
      return get("/addons/TuanGou/api/v1/t/" + id, params);
    },
    CreateOrder(id, params) {
      return post("/addons/TuanGou/api/v1/t/" + id + "/buy", params);
    },
  },
  MiaoSha: {
    List(params) {
      return get("/addons/MiaoSha/api/v1/m", params);
    },
    Detail(id, params) {
      return get("/addons/MiaoSha/api/v1/m/" + id, params);
    },
    Join(id, params) {
      return post("/addons/MiaoSha/api/v1/m/" + id + "/join", params);
    },
    CreateOrder(id, params) {
      return post("/addons/MiaoSha/api/v1/m/order/" + id + "/buy", params);
    },
  },
  Snapshot: {
    Config() {
      return get("/addons/Snapshot/api/v1/config");
    },
    ImagesList(params) {
      return get("/addons/Snapshot/api/v1/resource/images", params);
    },
    Query(params) {
      return get("/addons/Snapshot/api/v1/resource/query", params);
    },
    DestroyImages(id) {
      return destroy(`/addons/Snapshot/api/v1/resource/image/${id}`);
    },
    UploadImages(params) {
      return post("/addons/Snapshot/api/v1/upload/image", params);
    },
  },
  iLab: {
    getEnvPath(params) {
      return post(`/ilab/iLabEnv/getEnvPath`, params);
    },
    saveEditorCode(params) {
      return post(`/ilab/iLabEnv/saveEditorCode`, params);
    },
    runEditorCode(params) {
      return post(`/ilab/iLabEnv/runEditorCode`, params);
    },
  },
};

export default Api;
