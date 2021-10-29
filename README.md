
# MeEdu PC站前台程序

### 常用链接

- [MeEdu 官网](https://meedu.vip)
- [MeEdu 开源程序](https://github.com/Qsnh/meedu)
- [MeEdu 付费解决方案](https://meedu.vip/price.html)
- [MeEdu 付费版本演示站](https://meedu.vip/cases.html)
- [MeEdu 功能概览](https://www.yuque.com/meedu/fvvkbf/gpx5ed)
- [MeEdu 使用手册](https://www.yuque.com/meedu/fvvkbf)
- [MeEdu API文档](https://meedu-v2-xiaoteng.doc.coding.io/)

### 使用限制

[**使用限制条款**](https://www.yuque.com/meedu/fvvkbf/amfw7z)

### 快速上手

安装依赖：

```
yarn
```

修改配置：

```
cp .env.example .env
```

将 .env 文件中的 `VUE_APP_URL` 改为您的 meedu 网站地址（后面不要加 `/`）

编译：

```
yarn build
```

编译好，将会生成 `dist` 目录。将 `dist` 目录下的文件部署到新的站点。
