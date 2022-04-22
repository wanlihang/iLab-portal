import Vue from "vue";
import moment from "moment";
import { format } from "timeago.js";

Vue.prototype.moment = moment;
Vue.filter("changeTime", function (dateStr) {
  return format(dateStr, "zh_CN").replace("片刻后", "刚刚");
});
Vue.filter("dateFormat", function (dateStr, pattern = "YYYY-MM-DD HH:mm") {
  if (!dateStr) {
    return dateStr;
  }
  return moment(dateStr).format(pattern);
});

Vue.directive("code", function (el) {
  let blocks = el.querySelectorAll("pre code");
  blocks.forEach((block) => {
    window.hljs.highlightBlock(block);
  });
});

Vue.directive("latex", function (el) {
  window.renderMathInElement(el, {
    tex: {
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]],
      processEnvironments: true,
      processRefs: true,
    },
    options: {
      skipHtmlTags: ["noscript", "style", "textarea", "pre", "code"],
      // 跳过mathjax处理的元素的类名，任何元素指定一个类 tex2jax_ignore 将被跳过，多个累=类名'class1|class2'
      ignoreHtmlClass: "tex2jax_ignore",
    },
    svg: {
      fontCache: "global",
    },
  });
});
