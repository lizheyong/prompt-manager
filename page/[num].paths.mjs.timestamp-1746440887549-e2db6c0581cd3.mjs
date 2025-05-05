// .vitepress/theme/utils/commonTools.mjs
import { load } from "cheerio";
var generateId = (fileName) => {
  let hash = 0;
  for (let i = 0; i < fileName.length; i++) {
    hash = (hash << 5) - hash + fileName.charCodeAt(i);
  }
  const numericId = Math.abs(hash % 1e10);
  return numericId;
};

// .vitepress/theme/utils/getPostData.mjs
import { globby } from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
var getPostMDFilePaths = async () => {
  try {
    let paths = await globby(["**.md"], {
      ignore: ["node_modules", "pages", ".vitepress", "README.md"]
    });
    return paths.filter((item) => item.includes("posts/"));
  } catch (error) {
    console.error("\u83B7\u53D6\u6587\u7AE0\u8DEF\u5F84\u65F6\u51FA\u9519:", error);
    throw error;
  }
};
var compareDate = (obj1, obj2) => {
  return obj1.date < obj2.date ? 1 : -1;
};
var comparePostPriority = (a, b) => {
  if (a.top && !b.top) {
    return -1;
  }
  if (!a.top && b.top) {
    return 1;
  }
  return compareDate(a, b);
};
var getAllPosts = async () => {
  try {
    let paths = await getPostMDFilePaths();
    let posts = await Promise.all(
      paths.map(async (item) => {
        try {
          const content = await fs.readFile(item, "utf-8");
          const stat = await fs.stat(item);
          const { birthtimeMs, mtimeMs } = stat;
          const { data } = matter(content);
          const { title, date, categories, description, tags, top, cover } = data;
          const expired = Math.floor(
            ((/* @__PURE__ */ new Date()).getTime() - new Date(date).getTime()) / (1e3 * 60 * 60 * 24)
          );
          return {
            id: generateId(item),
            title: title || "\u672A\u547D\u540D\u6587\u7AE0",
            date: date ? new Date(date).getTime() : birthtimeMs,
            lastModified: mtimeMs,
            expired,
            tags,
            categories,
            description,
            regularPath: `/${item.replace(".md", ".html")}`,
            top,
            cover
          };
        } catch (error) {
          console.error(`\u5904\u7406\u6587\u7AE0\u6587\u4EF6 '${item}' \u65F6\u51FA\u9519:`, error);
          throw error;
        }
      })
    );
    posts.sort(comparePostPriority);
    return posts;
  } catch (error) {
    console.error("\u83B7\u53D6\u6240\u6709\u6587\u7AE0\u65F6\u51FA\u9519:", error);
    throw error;
  }
};

// .vitepress/theme/assets/themeConfig.mjs
var themeConfig = {
  // 站点信息
  siteMeta: {
    // 站点标题
    title: "Curve",
    // 站点描述
    description: "Hello World",
    // 站点logo
    logo: "/images/logo/logo.webp",
    // 站点地址
    site: "https://blog.imsyy.top",
    // 语言
    lang: "zh-CN",
    // 作者
    author: {
      name: "Admin",
      cover: "/images/logo/logo.webp",
      email: "114514@gmail.com",
      link: "https://www.imsyy.top"
    }
  },
  // 备案信息
  icp: "\u840CICP\u5907114514\u53F7",
  // 建站日期
  since: "2020-07-28",
  // 每页文章数据
  postSize: 8,
  // inject
  inject: {
    // 头部
    // https://vitepress.dev/zh/reference/site-config#head
    header: [
      // favicon
      ["link", { rel: "icon", href: "/favicon.ico" }],
      // RSS
      [
        "link",
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "RSS",
          href: "https://blog.imsyy.top/rss.xml"
        }
      ],
      // 预载 CDN
      [
        "link",
        {
          crossorigin: "",
          rel: "preconnect",
          href: "https://s1.hdslb.com"
        }
      ],
      [
        "link",
        {
          crossorigin: "",
          rel: "preconnect",
          href: "https://mirrors.sustech.edu.cn"
        }
      ],
      // HarmonyOS font
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css"
        }
      ],
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/lxgw-wenkai-screen-webfont/1.7.0/style.css"
        }
      ],
      // iconfont
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://cdn2.codesign.qq.com/icons/g5ZpEgx3z4VO6j2/latest/iconfont.css"
        }
      ],
      // Embed code
      ["link", { rel: "preconnect", href: "https://use.sevencdn.com" }],
      ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
      [
        "link",
        {
          crossorigin: "anonymous",
          href: "https://use.sevencdn.com/css2?family=Fira+Code:wght@300..700&display=swap",
          rel: "stylesheet"
        }
      ],
      // 预载 DocSearch
      [
        "link",
        {
          href: "https://X5EBEZB53I-dsn.algolia.net",
          rel: "preconnect",
          crossorigin: ""
        }
      ]
    ]
  },
  // 导航栏菜单
  nav: [
    {
      text: "\u6587\u5E93",
      items: [
        { text: "\u6587\u7AE0\u5217\u8868", link: "/pages/archives", icon: "article" },
        { text: "\u5168\u90E8\u5206\u7C7B", link: "/pages/categories", icon: "folder" },
        { text: "\u5168\u90E8\u6807\u7B7E", link: "/pages/tags", icon: "hashtag" }
      ]
    },
    {
      text: "\u4E13\u680F",
      items: [
        { text: "\u6280\u672F\u5206\u4EAB", link: "/pages/categories/\u6280\u672F\u5206\u4EAB", icon: "technical" },
        { text: "\u6211\u7684\u9879\u76EE", link: "/pages/project", icon: "code" },
        { text: "\u6548\u7387\u5DE5\u5177", link: "/pages/tools", icon: "tools" }
      ]
    },
    {
      text: "\u53CB\u94FE",
      items: [
        { text: "\u53CB\u94FE\u9C7C\u5858", link: "/pages/friends", icon: "fish" },
        { text: "\u53CB\u60C5\u94FE\u63A5", link: "/pages/link", icon: "people" }
      ]
    },
    {
      text: "\u6211\u7684",
      items: [
        { text: "\u7545\u6240\u6B32\u8A00", link: "/pages/message", icon: "chat" },
        { text: "\u81F4\u8C22\u540D\u5355", link: "/pages/thanks", icon: "reward" },
        { text: "\u5173\u4E8E\u672C\u7AD9", link: "/pages/about", icon: "contacts" }
      ]
    }
  ],
  // 导航栏菜单 - 左侧
  navMore: [
    {
      name: "\u535A\u5BA2",
      list: [
        {
          icon: "/images/logo/logo.webp",
          name: "\u4E3B\u7AD9",
          url: "/"
        },
        {
          icon: "/images/logo/logo.webp",
          name: "\u535A\u5BA2\u955C\u50CF\u7AD9",
          url: "https://blog-backup.imsyy.top/"
        }
      ]
    },
    {
      name: "\u670D\u52A1",
      list: [
        {
          icon: "https://pic.efefee.cn/uploads/2024/04/08/6613465358077.png",
          name: "\u8D77\u59CB\u9875",
          url: "https://nav.imsyy.top/"
        },
        {
          icon: "https://pic.efefee.cn/uploads/2024/04/08/661346d418ad7.png",
          name: "\u4ECA\u65E5\u70ED\u699C",
          url: "https://hot.imsyy.top/"
        },
        {
          icon: "https://pic.efefee.cn/uploads/2024/04/08/66134722586fa.png",
          name: "\u7AD9\u70B9\u76D1\u6D4B",
          url: "https://status.imsyy.top/"
        }
      ]
    },
    {
      name: "\u9879\u76EE",
      list: [
        {
          icon: "/images/logo/logo.webp",
          name: "Curve",
          url: "https://github.com/imsyy/vitepress-theme-curve"
        },
        {
          icon: "https://pic.efefee.cn/uploads/2024/04/07/66124f5fc63c8.png",
          name: "SPlayer",
          url: "https://github.com/imsyy/SPlayer"
        },
        {
          icon: "https://pic.efefee.cn/uploads/2024/04/08/6613465358077.png",
          name: "Snavigation",
          url: "https://github.com/imsyy/SPlayer"
        },
        {
          icon: "/images/logo/logo.webp",
          name: "Home",
          url: "https://github.com/imsyy/home"
        },
        {
          icon: "https://pic.efefee.cn/uploads/2024/04/08/661346d418ad7.png",
          name: "DailyHotApi",
          url: "https://github.com/imsyy/DailyHotApi"
        },
        {
          icon: "https://pic.efefee.cn/uploads/2024/04/08/66134722586fa.png",
          name: "site-status",
          url: "https://github.com/imsyy/site-status"
        }
      ]
    }
  ],
  // 封面配置
  cover: {
    // 是否开启双栏布局
    twoColumns: false,
    // 是否开启封面显示
    showCover: {
      // 是否开启封面显示 文章不设置cover封面会显示异常，可以设置下方默认封面
      enable: true,
      // 封面布局方式: left | right | both
      coverLayout: "both",
      // 默认封面(随机展示)
      defaultCover: [
        "https://example.com/1.avif",
        "https://example.com/2.avif",
        "https://example.com/3.avif"
      ]
    }
  },
  // 页脚信息
  footer: {
    // 社交链接（请确保为偶数个）
    social: [
      {
        icon: "email",
        link: "mailto:one@imsyy.top"
      },
      {
        icon: "github",
        link: "https://www.github.com/imsyy/"
      },
      {
        icon: "telegram",
        link: "https://t.me/bottom_user"
      },
      {
        icon: "bilibili",
        link: "https://space.bilibili.com/98544142"
      },
      {
        icon: "qq",
        link: "https://res.abeim.cn/api/qq/?qq=1539250352"
      },
      {
        icon: "twitter-x",
        link: "https://twitter.com/iimmsyy"
      }
    ],
    // sitemap
    sitemap: [
      {
        text: "\u535A\u5BA2",
        items: [
          { text: "\u8FD1\u671F\u6587\u7AE0", link: "/" },
          { text: "\u5168\u90E8\u5206\u7C7B", link: "/pages/categories" },
          { text: "\u5168\u90E8\u6807\u7B7E", link: "/pages/tags" },
          { text: "\u6587\u7AE0\u5F52\u6863", link: "/pages/archives", newTab: true }
        ]
      },
      {
        text: "\u9879\u76EE",
        items: [
          { text: "Home", link: "https://github.com/imsyy/home/", newTab: true },
          { text: "SPlayer", link: "https://github.com/imsyy/SPlayer/", newTab: true },
          { text: "DailyHotApi", link: "https://github.com/imsyy/DailyHotApi/", newTab: true },
          { text: "Snavigation", link: "https://github.com/imsyy/Snavigation/", newTab: true }
        ]
      },
      {
        text: "\u4E13\u680F",
        items: [
          { text: "\u6280\u672F\u5206\u4EAB", link: "/pages/categories/\u6280\u672F\u5206\u4EAB" },
          { text: "\u6211\u7684\u9879\u76EE", link: "/pages/project" },
          { text: "\u6548\u7387\u5DE5\u5177", link: "/pages/tools" }
        ]
      },
      {
        text: "\u9875\u9762",
        items: [
          { text: "\u7545\u6240\u6B32\u8A00", link: "/pages/message" },
          { text: "\u5173\u4E8E\u672C\u7AD9", link: "/pages/about" },
          { text: "\u9690\u79C1\u653F\u7B56", link: "/pages/privacy" },
          { text: "\u7248\u6743\u534F\u8BAE", link: "/pages/cc" }
        ]
      },
      {
        text: "\u670D\u52A1",
        items: [
          { text: "\u7AD9\u70B9\u72B6\u6001", link: "https://status.imsyy.top/", newTab: true },
          { text: "\u4E00\u4E2A\u5BFC\u822A", link: "https://nav.imsyy.top/", newTab: true },
          { text: "\u7AD9\u70B9\u8BA2\u9605", link: "https://blog.imsyy.top/rss.xml", newTab: true },
          {
            text: "\u53CD\u9988\u6295\u8BC9",
            link: "https://eqnxweimkr5.feishu.cn/share/base/form/shrcnCXCPmxCKKJYI3RKUfefJre",
            newTab: true
          }
        ]
      }
    ]
  },
  // 评论
  comment: {
    enable: false,
    // 评论系统选择
    // artalk / twikoo
    type: "artalk",
    // artalk
    // https://artalk.js.org/
    artalk: {
      site: "",
      server: ""
    },
    // twikoo
    // https://twikoo.js.org/
    twikoo: {
      // 必填，若不想使用 CDN，可以使用 pnpm add twikoo 安装并引入
      js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/twikoo/1.6.39/twikoo.all.min.js",
      envId: "",
      // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
      region: "ap-shanghai",
      lang: "zh-CN"
    }
  },
  // 侧边栏
  aside: {
    // 站点简介
    hello: {
      enable: true,
      text: "\u8FD9\u91CC\u6709\u5173\u4E8E<strong>\u5F00\u53D1</strong>\u76F8\u5173\u7684\u95EE\u9898\u548C\u770B\u6CD5\uFF0C\u4E5F\u4F1A\u6709\u4E00\u4E9B<strong>\u5947\u6280\u6DEB\u5DE7</strong>\u7684\u5206\u4EAB\uFF0C\u5176\u4E2D\u5927\u90E8\u5206\u5185\u5BB9\u4F1A\u4FA7\u91CD\u4E8E<strong>\u524D\u7AEF\u5F00\u53D1</strong>\u3002\u5E0C\u671B\u4F60\u53EF\u4EE5\u5728\u8FD9\u91CC\u627E\u5230\u5BF9\u4F60\u6709\u7528\u7684\u77E5\u8BC6\u548C\u6559\u7A0B\u3002"
    },
    // 目录
    toc: {
      enable: true
    },
    // 标签
    tags: {
      enable: true
    },
    // 倒计时
    countDown: {
      enable: true,
      // 倒计时日期
      data: {
        name: "\u6625\u8282",
        date: "2025-01-29"
      }
    },
    // 站点数据
    siteData: {
      enable: true
    }
  },
  // 友链
  friends: {
    // 友链朋友圈
    circleOfFriends: "",
    // 动态友链
    dynamicLink: {
      server: "",
      app_token: "",
      table_id: ""
    }
  },
  // 音乐播放器
  // https://github.com/imsyy/Meting-API
  music: {
    enable: false,
    // url
    url: "https://api-meting.example.com",
    // id
    id: 9379831714,
    // netease / tencent / kugou
    server: "netease",
    // playlist / album / song
    type: "playlist"
  },
  // 搜索
  // https://www.algolia.com/
  search: {
    enable: false,
    appId: "",
    apiKey: ""
  },
  // 打赏
  rewardData: {
    enable: true,
    // 微信二维码
    wechat: "https://pic.efefee.cn/uploads/2024/04/07/66121049d1e80.webp",
    // 支付宝二维码
    alipay: "https://pic.efefee.cn/uploads/2024/04/07/661206631d3b5.webp"
  },
  // 图片灯箱
  fancybox: {
    enable: true,
    js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js",
    css: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.min.css"
  },
  // 外链中转
  jumpRedirect: {
    enable: true,
    // 排除类名
    exclude: [
      "cf-friends-link",
      "upyun",
      "icp",
      "author",
      "rss",
      "cc",
      "power",
      "social-link",
      "link-text",
      "travellings",
      "post-link",
      "report",
      "more-link",
      "skills-item",
      "right-menu-link",
      "link-card"
    ]
  },
  // 站点统计
  tongji: {
    "51la": ""
  }
};

// .vitepress/init.mjs
import { existsSync } from "fs";
import path from "path";
var __vite_injected_original_dirname = "/Users/lijinchao/Developer/prompt-manager/.vitepress";
var getThemeConfig = async () => {
  try {
    const configPath = path.resolve(__vite_injected_original_dirname, "../themeConfig.mjs");
    if (existsSync(configPath)) {
      const userConfig = await import("../themeConfig.mjs");
      return Object.assign(themeConfig, userConfig?.themeConfig || {});
    } else {
      console.warn("User configuration file not found, using default themeConfig.");
      return themeConfig;
    }
  } catch (error) {
    console.error("An error occurred while loading the configuration:", error);
    return themeConfig;
  }
};

// page/[num].paths.mjs
var postData = await getAllPosts();
var themeConfig2 = await getThemeConfig();
var postsPerPage = themeConfig2.postSize;
var totalPages = Math.ceil(postData.length / postsPerPage);
var num_paths_default = {
  paths() {
    const pages = [];
    for (let pageNum = 2; pageNum <= totalPages; pageNum += 1) {
      pages.push({ params: { num: pageNum.toString() } });
    }
    console.info("\u6587\u7AE0\u5206\u9875\u52A8\u6001\u8DEF\u7531\uFF1A", pages);
    return pages;
  }
};
export {
  num_paths_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy90aGVtZS91dGlscy9jb21tb25Ub29scy5tanMiLCAiLnZpdGVwcmVzcy90aGVtZS91dGlscy9nZXRQb3N0RGF0YS5tanMiLCAiLnZpdGVwcmVzcy90aGVtZS9hc3NldHMvdGhlbWVDb25maWcubWpzIiwgIi52aXRlcHJlc3MvaW5pdC5tanMiLCAicGFnZS9bbnVtXS5wYXRocy5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGlqaW5jaGFvL0RldmVsb3Blci9wcm9tcHQtbWFuYWdlci8udml0ZXByZXNzL3RoZW1lL3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbGlqaW5jaGFvL0RldmVsb3Blci9wcm9tcHQtbWFuYWdlci8udml0ZXByZXNzL3RoZW1lL3V0aWxzL2NvbW1vblRvb2xzLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbGlqaW5jaGFvL0RldmVsb3Blci9wcm9tcHQtbWFuYWdlci8udml0ZXByZXNzL3RoZW1lL3V0aWxzL2NvbW1vblRvb2xzLm1qc1wiO2ltcG9ydCB7IGxvYWQgfSBmcm9tIFwiY2hlZXJpb1wiO1xuXG4vKipcbiAqIFx1NEVDRVx1NjU4N1x1NEVGNlx1NTQwRFx1NzUxRlx1NjIxMFx1NjU3MFx1NUI1NyBJRFxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lIC0gXHU2NTg3XHU0RUY2XHU1NDBEXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFx1NzUxRlx1NjIxMFx1NzY4NFx1NjU3MFx1NUI1N0lEXG4gKi9cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZUlkID0gKGZpbGVOYW1lKSA9PiB7XG4gIC8vIFx1NUMwNlx1NjU4N1x1NEVGNlx1NTQwRFx1OEY2Q1x1NjM2Mlx1NEUzQVx1NTRDOFx1NUUwQ1x1NTAzQ1xuICBsZXQgaGFzaCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZU5hbWUubGVuZ3RoOyBpKyspIHtcbiAgICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgZmlsZU5hbWUuY2hhckNvZGVBdChpKTtcbiAgfVxuICAvLyBcdTVDMDZcdTU0QzhcdTVFMENcdTUwM0NcdThGNkNcdTYzNjJcdTRFM0FcdTZCNjNcdTY1NzRcdTY1NzBcbiAgY29uc3QgbnVtZXJpY0lkID0gTWF0aC5hYnMoaGFzaCAlIDEwMDAwMDAwMDAwKTtcbiAgcmV0dXJuIG51bWVyaWNJZDtcbn07XG5cbi8qKlxuICogXHU1MkE4XHU2MDAxXHU1MkEwXHU4RjdEXHU4MTFBXHU2NzJDXG4gKiBAcGFyYW0ge3N0cmluZ30gc3JjIC0gXHU4MTFBXHU2NzJDIFVSTFxuICogKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uIC0gXHU5MTREXHU3RjZFXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkU2NyaXB0ID0gKHNyYywgb3B0aW9uID0ge30pID0+IHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhc3JjKSByZXR1cm4gZmFsc2U7XG4gIC8vIFx1ODNCN1x1NTNENlx1OTE0RFx1N0Y2RVxuICBjb25zdCB7IGFzeW5jID0gZmFsc2UsIHJlbG9hZCA9IGZhbHNlLCBjYWxsYmFjayB9ID0gb3B0aW9uO1xuICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVERjJcdTdFQ0ZcdTUyQTBcdThGN0RcdThGQzdcdTZCNjRcdTgxMUFcdTY3MkNcbiAgY29uc3QgZXhpc3RpbmdTY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzY3JpcHRbc3JjPVwiJHtzcmN9XCJdYCk7XG4gIGlmIChleGlzdGluZ1NjcmlwdCkge1xuICAgIGNvbnNvbGUubG9nKFwiXHU1REYyXHU2NzA5XHU5MUNEXHU1OTBEXHU4MTFBXHU2NzJDXCIpO1xuICAgIGlmICghcmVsb2FkKSB7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsLCBleGlzdGluZ1NjcmlwdCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGV4aXN0aW5nU2NyaXB0LnJlbW92ZSgpO1xuICB9XG4gIC8vIFx1NTIxQlx1NUVGQVx1NEUwMFx1NEUyQVx1NjVCMFx1NzY4NHNjcmlwdFx1NjgwN1x1N0I3RVx1NUU3Nlx1NTJBMFx1OEY3RFxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgc2NyaXB0LnNyYyA9IHNyYztcbiAgICBpZiAoYXN5bmMpIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHJlc29sdmUoc2NyaXB0KTtcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwsIHNjcmlwdCk7XG4gICAgfTtcbiAgICBzY3JpcHQub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9O1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIFx1NTJBOFx1NjAwMVx1NTJBMFx1OEY3RFx1NjgzN1x1NUYwRlx1ODg2OFxuICogQHBhcmFtIHtzdHJpbmd9IGhyZWYgLSBcdTY4MzdcdTVGMEZcdTg4NjggVVJMXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uIC0gXHU5MTREXHU3RjZFXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkQ1NTID0gKGhyZWYsIG9wdGlvbiA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIgfHwgIWhyZWYpIHJldHVybiBmYWxzZTtcbiAgLy8gXHU4M0I3XHU1M0Q2XHU5MTREXHU3RjZFXG4gIGNvbnN0IHsgcmVsb2FkID0gZmFsc2UsIGNhbGxiYWNrIH0gPSBvcHRpb247XG4gIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NURGMlx1N0VDRlx1NTJBMFx1OEY3RFx1OEZDN1x1NkI2NFx1NjgzN1x1NUYwRlx1ODg2OFxuICBjb25zdCBleGlzdGluZ0xpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsaW5rW2hyZWY9XCIke2hyZWZ9XCJdYCk7XG4gIGlmIChleGlzdGluZ0xpbmspIHtcbiAgICBjb25zb2xlLmxvZyhcIlx1NURGMlx1NjcwOVx1OTFDRFx1NTkwRFx1NjgzN1x1NUYwRlwiKTtcbiAgICBpZiAoIXJlbG9hZCkge1xuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbCwgZXhpc3RpbmdMaW5rKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZXhpc3RpbmdMaW5rLnJlbW92ZSgpO1xuICB9XG4gIC8vIFx1NTIxQlx1NUVGQVx1NjVCMFx1NzY4NGxpbmtcdTY4MDdcdTdCN0VcdTVFNzZcdThCQkVcdTdGNkVcdTVDNUVcdTYwMjdcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gICAgbGluay5ocmVmID0gaHJlZjtcbiAgICBsaW5rLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuICAgIGxpbmsudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICBsaW5rLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIHJlc29sdmUobGluayk7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsLCBsaW5rKTtcbiAgICB9O1xuICAgIGxpbmsub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9O1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBcdThERjNcdThGNkNcdTRFMkRcdThGNkNcdTk4NzVcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sIC0gXHU5ODc1XHU5NzYyXHU1MTg1XHU1QkI5XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRG9tIC0gXHU2NjJGXHU1NDI2XHU0RTNBIERPTSBcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGNvbnN0IGp1bXBSZWRpcmVjdCA9IChodG1sLCB0aGVtZUNvbmZpZywgaXNEb20gPSBmYWxzZSkgPT4ge1xuICB0cnkge1xuICAgIC8vIFx1NjYyRlx1NTQyNlx1NEUzQVx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1xuICAgIGNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIjtcbiAgICBpZiAoaXNEZXYpIHJldHVybiBmYWxzZTtcbiAgICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjhcbiAgICBpZiAoIXRoZW1lQ29uZmlnLmp1bXBSZWRpcmVjdC5lbmFibGUpIHJldHVybiBodG1sO1xuICAgIC8vIFx1NEUyRFx1OEY2Q1x1OTg3NVx1NTczMFx1NTc0MFxuICAgIGNvbnN0IHJlZGlyZWN0UGFnZSA9IFwiL3JlZGlyZWN0XCI7XG4gICAgLy8gXHU2MzkyXHU5NjY0XHU3Njg0IGNsYXNzTmFtZVxuICAgIGNvbnN0IGV4Y2x1ZGVDbGFzcyA9IHRoZW1lQ29uZmlnLmp1bXBSZWRpcmVjdC5leGNsdWRlO1xuICAgIGlmIChpc0RvbSkge1xuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBcdTYyNDBcdTY3MDlcdTk0RkVcdTYzQTVcbiAgICAgIGNvbnN0IGFsbExpbmtzID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKV07XG4gICAgICBpZiAoYWxsTGlua3M/Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgYWxsTGlua3MuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgICAvLyBcdTY4QzBcdTY3RTVcdTk0RkVcdTYzQTVcdTY2MkZcdTU0MjZcdTUzMDVcdTU0MkIgdGFyZ2V0PVwiX2JsYW5rXCIgXHU1QzVFXHU2MDI3XG4gICAgICAgIGlmIChsaW5rLmdldEF0dHJpYnV0ZShcInRhcmdldFwiKSA9PT0gXCJfYmxhbmtcIikge1xuICAgICAgICAgIC8vIFx1NjhDMFx1NjdFNVx1OTRGRVx1NjNBNVx1NjYyRlx1NTQyNlx1NTMwNVx1NTQyQlx1NjM5Mlx1OTY2NFx1NzY4NFx1N0M3QlxuICAgICAgICAgIGlmIChleGNsdWRlQ2xhc3Muc29tZSgoY2xhc3NOYW1lKSA9PiBsaW5rLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBsaW5rSHJlZiA9IGxpbmsuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcbiAgICAgICAgICAvLyBcdTVCNThcdTU3MjhcdTk0RkVcdTYzQTVcdTRFMTRcdTk3NUVcdTRFMkRcdThGNkNcdTk4NzVcbiAgICAgICAgICBpZiAobGlua0hyZWYgJiYgIWxpbmtIcmVmLmluY2x1ZGVzKHJlZGlyZWN0UGFnZSkpIHtcbiAgICAgICAgICAgIC8vIEJhc2U2NFxuICAgICAgICAgICAgY29uc3QgZW5jb2RlZEhyZWYgPSBidG9hKGxpbmtIcmVmKTtcbiAgICAgICAgICAgIGNvbnN0IHJlZGlyZWN0TGluayA9IGAke3JlZGlyZWN0UGFnZX0/dXJsPSR7ZW5jb2RlZEhyZWZ9YDtcbiAgICAgICAgICAgIC8vIFx1NEZERFx1NUI1OFx1NTM5Rlx1NTlDQlx1OTRGRVx1NjNBNVxuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoXCJvcmlnaW5hbC1ocmVmXCIsIGxpbmtIcmVmKTtcbiAgICAgICAgICAgIC8vIFx1ODk4Nlx1NzZENiBocmVmXG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgcmVkaXJlY3RMaW5rKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCAkID0gbG9hZChodG1sKTtcbiAgICAgIC8vIFx1NjZGRlx1NjM2Mlx1N0IyNlx1NTQwOFx1Njc2MVx1NEVGNlx1NzY4NFx1NjgwN1x1N0I3RVxuICAgICAgJChcImFbdGFyZ2V0PSdfYmxhbmsnXVwiKS5lYWNoKChfLCBlbCkgPT4ge1xuICAgICAgICBjb25zdCAkYSA9ICQoZWwpO1xuICAgICAgICBjb25zdCBocmVmID0gJGEuYXR0cihcImhyZWZcIik7XG4gICAgICAgIGNvbnN0IGNsYXNzZXNTdHIgPSAkYS5hdHRyKFwiY2xhc3NcIik7XG4gICAgICAgIGNvbnN0IGlubmVyVGV4dCA9ICRhLnRleHQoKTtcbiAgICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1MzA1XHU1NDJCXHU2MzkyXHU5NjY0XHU3Njg0XHU3QzdCXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBjbGFzc2VzU3RyID8gY2xhc3Nlc1N0ci50cmltKCkuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIGlmIChleGNsdWRlQ2xhc3Muc29tZSgoY2xhc3NOYW1lKSA9PiBjbGFzc2VzLmluY2x1ZGVzKGNsYXNzTmFtZSkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFx1NUI1OFx1NTcyOFx1OTRGRVx1NjNBNVx1NEUxNFx1OTc1RVx1NEUyRFx1OEY2Q1x1OTg3NVxuICAgICAgICBpZiAoaHJlZiAmJiAhaHJlZi5pbmNsdWRlcyhyZWRpcmVjdFBhZ2UpKSB7XG4gICAgICAgICAgLy8gQmFzZTY0IFx1N0YxNlx1NzgwMSBocmVmXG4gICAgICAgICAgY29uc3QgZW5jb2RlZEhyZWYgPSBCdWZmZXIuZnJvbShocmVmLCBcInV0Zi04XCIpLnRvU3RyaW5nKFwiYmFzZTY0XCIpO1xuICAgICAgICAgIC8vIFx1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NUM1RVx1NjAyN1xuICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbC5hdHRyaWJzO1xuICAgICAgICAgIC8vIFx1OTFDRFx1Njc4NFx1NUM1RVx1NjAyN1x1NUI1N1x1N0IyNlx1NEUzMlx1RkYwQ1x1NEZERFx1NzU1OVx1NTM5Rlx1NjcwOVx1NUM1RVx1NjAyN1xuICAgICAgICAgIGxldCBhdHRyaWJ1dGVzU3RyID0gXCJcIjtcbiAgICAgICAgICBmb3IgKGxldCBhdHRyIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXR0cmlidXRlcywgYXR0cikpIHtcbiAgICAgICAgICAgICAgYXR0cmlidXRlc1N0ciArPSBgICR7YXR0cn09XCIke2F0dHJpYnV0ZXNbYXR0cl19XCJgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBcdTY3ODRcdTkwMjBcdTY1QjBcdTY4MDdcdTdCN0VcbiAgICAgICAgICBjb25zdCBuZXdMaW5rID0gYDxhIGhyZWY9XCIke3JlZGlyZWN0UGFnZX0/dXJsPSR7ZW5jb2RlZEhyZWZ9XCIgb3JpZ2luYWwtaHJlZj1cIiR7aHJlZn1cIiAke2F0dHJpYnV0ZXNTdHJ9PiR7aW5uZXJUZXh0fTwvYT5gO1xuICAgICAgICAgIC8vIFx1NjZGRlx1NjM2Mlx1NTM5Rlx1NjcwOVx1NjgwN1x1N0I3RVxuICAgICAgICAgICRhLnJlcGxhY2VXaXRoKG5ld0xpbmspO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAkLmh0bWwoKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlx1NTkwNFx1NzQwNlx1OTRGRVx1NjNBNVx1NjVGNlx1NTFGQVx1OTUxOVx1RkYxQVwiLCBlcnJvcik7XG4gIH1cbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9saWppbmNoYW8vRGV2ZWxvcGVyL3Byb21wdC1tYW5hZ2VyLy52aXRlcHJlc3MvdGhlbWUvdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9saWppbmNoYW8vRGV2ZWxvcGVyL3Byb21wdC1tYW5hZ2VyLy52aXRlcHJlc3MvdGhlbWUvdXRpbHMvZ2V0UG9zdERhdGEubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9saWppbmNoYW8vRGV2ZWxvcGVyL3Byb21wdC1tYW5hZ2VyLy52aXRlcHJlc3MvdGhlbWUvdXRpbHMvZ2V0UG9zdERhdGEubWpzXCI7aW1wb3J0IHsgZ2VuZXJhdGVJZCB9IGZyb20gXCIuL2NvbW1vblRvb2xzLm1qc1wiO1xuaW1wb3J0IHsgZ2xvYmJ5IH0gZnJvbSBcImdsb2JieVwiO1xuaW1wb3J0IG1hdHRlciBmcm9tIFwiZ3JheS1tYXR0ZXJcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnMtZXh0cmFcIjtcblxuLyoqXG4gKiBcdTgzQjdcdTUzRDYgcG9zdHMgXHU3NkVFXHU1RjU1XHU0RTBCXHU2MjQwXHU2NzA5IE1hcmtkb3duIFx1NjU4N1x1NEVGNlx1NzY4NFx1OERFRlx1NUY4NFxuICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nW10+fSAtIFx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NFx1NjU3MFx1N0VDNFxuICovXG5jb25zdCBnZXRQb3N0TURGaWxlUGF0aHMgPSBhc3luYyAoKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gXHU4M0I3XHU1M0Q2XHU2MjQwXHU2NzA5IG1kIFx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NFxuICAgIGxldCBwYXRocyA9IGF3YWl0IGdsb2JieShbXCIqKi5tZFwiXSwge1xuICAgICAgaWdub3JlOiBbXCJub2RlX21vZHVsZXNcIiwgXCJwYWdlc1wiLCBcIi52aXRlcHJlc3NcIiwgXCJSRUFETUUubWRcIl0sXG4gICAgfSk7XG4gICAgLy8gXHU4RkM3XHU2RUU0XHU4REVGXHU1Rjg0XHVGRjBDXHU1M0VBXHU1MzA1XHU2MkVDICdwb3N0cycgXHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0XHU2NTg3XHU0RUY2XG4gICAgcmV0dXJuIHBhdGhzLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5pbmNsdWRlcyhcInBvc3RzL1wiKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlx1ODNCN1x1NTNENlx1NjU4N1x1N0FFMFx1OERFRlx1NUY4NFx1NjVGNlx1NTFGQVx1OTUxOTpcIiwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG4vKipcbiAqIFx1NTdGQVx1NEU4RSBmcm9udE1hdHRlciBcdTY1RTVcdTY3MUZcdTk2NERcdTVFOEZcdTYzOTJcdTVFOEZcdTY1ODdcdTdBRTBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIC0gXHU3QjJDXHU0RTAwXHU3QkM3XHU2NTg3XHU3QUUwXHU1QkY5XHU4QzYxXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMiAtIFx1N0IyQ1x1NEU4Q1x1N0JDN1x1NjU4N1x1N0FFMFx1NUJGOVx1OEM2MVxuICogQHJldHVybnMge251bWJlcn0gLSBcdTZCRDRcdThGODNcdTdFRDNcdTY3OUNcbiAqL1xuY29uc3QgY29tcGFyZURhdGUgPSAob2JqMSwgb2JqMikgPT4ge1xuICByZXR1cm4gb2JqMS5kYXRlIDwgb2JqMi5kYXRlID8gMSA6IC0xO1xufTtcbmNvbnN0IGNvbXBhcmVQb3N0UHJpb3JpdHkgPSAoYSwgYikgPT4ge1xuICBpZiAoYS50b3AgJiYgIWIudG9wKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmICghYS50b3AgJiYgYi50b3ApIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gY29tcGFyZURhdGUoYSwgYik7XG59O1xuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NjU4N1x1N0FFMFx1RkYwQ1x1OEJGQlx1NTNENlx1NTE3Nlx1NTE4NVx1NUJCOVx1NUU3Nlx1ODlFM1x1Njc5MCBmcm9udCBtYXR0ZXJcbiAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdFtdPn0gLSBcdTY1ODdcdTdBRTBcdTVCRjlcdThDNjFcdTY1NzBcdTdFQzRcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEFsbFBvc3RzID0gYXN5bmMgKCkgPT4ge1xuICB0cnkge1xuICAgIC8vIFx1ODNCN1x1NTNENlx1NjI0MFx1NjcwOSBNYXJrZG93biBcdTY1ODdcdTRFRjZcdTc2ODRcdThERUZcdTVGODRcbiAgICBsZXQgcGF0aHMgPSBhd2FpdCBnZXRQb3N0TURGaWxlUGF0aHMoKTtcbiAgICAvLyBcdThCRkJcdTUzRDZcdTU0OENcdTU5MDRcdTc0MDZcdTZCQ0ZcdTRFMkEgTWFya2Rvd24gXHU2NTg3XHU0RUY2XHU3Njg0XHU1MTg1XHU1QkI5XG4gICAgbGV0IHBvc3RzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBwYXRocy5tYXAoYXN5bmMgKGl0ZW0pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBcdThCRkJcdTUzRDZcdTY1ODdcdTRFRjZcdTUxODVcdTVCQjlcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgZnMucmVhZEZpbGUoaXRlbSwgXCJ1dGYtOFwiKTtcbiAgICAgICAgICAvLyBcdTY1ODdcdTRFRjZcdTc2ODRcdTUxNDNcdTY1NzBcdTYzNkVcbiAgICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgZnMuc3RhdChpdGVtKTtcbiAgICAgICAgICAvLyBcdTgzQjdcdTUzRDZcdTY1ODdcdTRFRjZcdTUyMUJcdTVFRkFcdTY1RjZcdTk1RjRcdTU0OENcdTY3MDBcdTU0MEVcdTRGRUVcdTY1MzlcdTY1RjZcdTk1RjRcbiAgICAgICAgICBjb25zdCB7IGJpcnRodGltZU1zLCBtdGltZU1zIH0gPSBzdGF0O1xuICAgICAgICAgIC8vIFx1ODlFM1x1Njc5MCBmcm9udCBtYXR0ZXJcbiAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IG1hdHRlcihjb250ZW50KTtcbiAgICAgICAgICBjb25zdCB7IHRpdGxlLCBkYXRlLCBjYXRlZ29yaWVzLCBkZXNjcmlwdGlvbiwgdGFncywgdG9wLCBjb3ZlciB9ID0gZGF0YTtcbiAgICAgICAgICAvLyBcdThCQTFcdTdCOTdcdTY1ODdcdTdBRTBcdTc2ODRcdThGQzdcdTY3MUZcdTU5MjlcdTY1NzBcbiAgICAgICAgICBjb25zdCBleHBpcmVkID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGRhdGUpLmdldFRpbWUoKSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCksXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBcdThGRDRcdTU2REVcdTY1ODdcdTdBRTBcdTVCRjlcdThDNjFcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IGdlbmVyYXRlSWQoaXRlbSksXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUgfHwgXCJcdTY3MkFcdTU0N0RcdTU0MERcdTY1ODdcdTdBRTBcIixcbiAgICAgICAgICAgIGRhdGU6IGRhdGUgPyBuZXcgRGF0ZShkYXRlKS5nZXRUaW1lKCkgOiBiaXJ0aHRpbWVNcyxcbiAgICAgICAgICAgIGxhc3RNb2RpZmllZDogbXRpbWVNcyxcbiAgICAgICAgICAgIGV4cGlyZWQsXG4gICAgICAgICAgICB0YWdzLFxuICAgICAgICAgICAgY2F0ZWdvcmllcyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgcmVndWxhclBhdGg6IGAvJHtpdGVtLnJlcGxhY2UoXCIubWRcIiwgXCIuaHRtbFwiKX1gLFxuICAgICAgICAgICAgdG9wLFxuICAgICAgICAgICAgY292ZXIsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBcdTU5MDRcdTc0MDZcdTY1ODdcdTdBRTBcdTY1ODdcdTRFRjYgJyR7aXRlbX0nIFx1NjVGNlx1NTFGQVx1OTUxOTpgLCBlcnJvcik7XG4gICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG4gICAgLy8gXHU2ODM5XHU2MzZFXHU2NUU1XHU2NzFGXHU2MzkyXHU1RThGXHU2NTg3XHU3QUUwXG4gICAgcG9zdHMuc29ydChjb21wYXJlUG9zdFByaW9yaXR5KTtcbiAgICByZXR1cm4gcG9zdHM7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlx1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NjU4N1x1N0FFMFx1NjVGNlx1NTFGQVx1OTUxOTpcIiwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1NjgwN1x1N0I3RVx1NTNDQVx1NTE3Nlx1NzZGOFx1NTE3M1x1NjU4N1x1N0FFMFx1NzY4NFx1N0VERlx1OEJBMVx1NEZFMVx1NjA2RlxuICogQHBhcmFtIHtPYmplY3RbXX0gcG9zdERhdGEgLSBcdTUzMDVcdTU0MkJcdTY1ODdcdTdBRTBcdTRGRTFcdTYwNkZcdTc2ODRcdTY1NzBcdTdFQzRcbiAqIEByZXR1cm5zIHtPYmplY3R9IC0gXHU1MzA1XHU1NDJCXHU2ODA3XHU3QjdFXHU3RURGXHU4QkExXHU0RkUxXHU2MDZGXHU3Njg0XHU1QkY5XHU4QzYxXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRBbGxUeXBlID0gKHBvc3REYXRhKSA9PiB7XG4gIGNvbnN0IHRhZ0RhdGEgPSB7fTtcbiAgLy8gXHU5MDREXHU1Mzg2XHU2NTcwXHU2MzZFXG4gIHBvc3REYXRhLm1hcCgoaXRlbSkgPT4ge1xuICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NjcwOSB0YWdzIFx1NUM1RVx1NjAyN1xuICAgIGlmICghaXRlbS50YWdzIHx8IGl0ZW0udGFncy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAvLyBcdTU5MDRcdTc0MDZcdTY4MDdcdTdCN0VcbiAgICBpZiAodHlwZW9mIGl0ZW0udGFncyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgLy8gXHU0RUU1XHU5MDE3XHU1M0Y3XHU1MjA2XHU5Njk0XG4gICAgICBpdGVtLnRhZ3MgPSBpdGVtLnRhZ3Muc3BsaXQoXCIsXCIpO1xuICAgIH1cbiAgICAvLyBcdTkwNERcdTUzODZcdTY1ODdcdTdBRTBcdTc2ODRcdTZCQ0ZcdTRFMkFcdTY4MDdcdTdCN0VcbiAgICBpdGVtLnRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAvLyBcdTUyMURcdTU5Q0JcdTUzMTZcdTY4MDdcdTdCN0VcdTc2ODRcdTdFREZcdThCQTFcdTRGRTFcdTYwNkZcdUZGMENcdTU5ODJcdTY3OUNcdTRFMERcdTVCNThcdTU3MjhcbiAgICAgIGlmICghdGFnRGF0YVt0YWddKSB7XG4gICAgICAgIHRhZ0RhdGFbdGFnXSA9IHtcbiAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICBhcnRpY2xlczogW2l0ZW1dLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2ODA3XHU3QjdFXHU1REYyXHU1QjU4XHU1NzI4XHVGRjBDXHU1MjE5XHU1ODlFXHU1MkEwXHU4QkExXHU2NTcwXHU1NDhDXHU4QkIwXHU1RjU1XHU2MjQwXHU1QzVFXHU2NTg3XHU3QUUwXG4gICAgICAgIHRhZ0RhdGFbdGFnXS5jb3VudCsrO1xuICAgICAgICB0YWdEYXRhW3RhZ10uYXJ0aWNsZXMucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiB0YWdEYXRhO1xufTtcblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTYyNDBcdTY3MDlcdTUyMDZcdTdDN0JcdTUzQ0FcdTUxNzZcdTc2RjhcdTUxNzNcdTY1ODdcdTdBRTBcdTc2ODRcdTdFREZcdThCQTFcdTRGRTFcdTYwNkZcbiAqIEBwYXJhbSB7T2JqZWN0W119IHBvc3REYXRhIC0gXHU1MzA1XHU1NDJCXHU2NTg3XHU3QUUwXHU0RkUxXHU2MDZGXHU3Njg0XHU2NTcwXHU3RUM0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSAtIFx1NTMwNVx1NTQyQlx1NjgwN1x1N0I3RVx1N0VERlx1OEJBMVx1NEZFMVx1NjA2Rlx1NzY4NFx1NUJGOVx1OEM2MVxuICovXG5leHBvcnQgY29uc3QgZ2V0QWxsQ2F0ZWdvcmllcyA9IChwb3N0RGF0YSkgPT4ge1xuICBjb25zdCBjYXREYXRhID0ge307XG4gIC8vIFx1OTA0RFx1NTM4Nlx1NjU3MFx1NjM2RVxuICBwb3N0RGF0YS5tYXAoKGl0ZW0pID0+IHtcbiAgICBpZiAoIWl0ZW0uY2F0ZWdvcmllcyB8fCBpdGVtLmNhdGVnb3JpZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgLy8gXHU1OTA0XHU3NDA2XHU2ODA3XHU3QjdFXG4gICAgaWYgKHR5cGVvZiBpdGVtLmNhdGVnb3JpZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIC8vIFx1NEVFNVx1OTAxN1x1NTNGN1x1NTIwNlx1OTY5NFxuICAgICAgaXRlbS5jYXRlZ29yaWVzID0gaXRlbS5jYXRlZ29yaWVzLnNwbGl0KFwiLFwiKTtcbiAgICB9XG4gICAgLy8gXHU5MDREXHU1Mzg2XHU2NTg3XHU3QUUwXHU3Njg0XHU2QkNGXHU0RTJBXHU2ODA3XHU3QjdFXG4gICAgaXRlbS5jYXRlZ29yaWVzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU2ODA3XHU3QjdFXHU3Njg0XHU3RURGXHU4QkExXHU0RkUxXHU2MDZGXHVGRjBDXHU1OTgyXHU2NzlDXHU0RTBEXHU1QjU4XHU1NzI4XG4gICAgICBpZiAoIWNhdERhdGFbdGFnXSkge1xuICAgICAgICBjYXREYXRhW3RhZ10gPSB7XG4gICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgYXJ0aWNsZXM6IFtpdGVtXSxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NjgwN1x1N0I3RVx1NURGMlx1NUI1OFx1NTcyOFx1RkYwQ1x1NTIxOVx1NTg5RVx1NTJBMFx1OEJBMVx1NjU3MFx1NTQ4Q1x1OEJCMFx1NUY1NVx1NjI0MFx1NUM1RVx1NjU4N1x1N0FFMFxuICAgICAgICBjYXREYXRhW3RhZ10uY291bnQrKztcbiAgICAgICAgY2F0RGF0YVt0YWddLmFydGljbGVzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gY2F0RGF0YTtcbn07XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU2MjQwXHU2NzA5XHU1RTc0XHU0RUZEXHU1M0NBXHU1MTc2XHU3NkY4XHU1MTczXHU2NTg3XHU3QUUwXHU3Njg0XHU3RURGXHU4QkExXHU0RkUxXHU2MDZGXG4gKiBAcGFyYW0ge09iamVjdFtdfSBwb3N0RGF0YSAtIFx1NTMwNVx1NTQyQlx1NjU4N1x1N0FFMFx1NEZFMVx1NjA2Rlx1NzY4NFx1NjU3MFx1N0VDNFxuICogQHJldHVybnMge09iamVjdH0gLSBcdTUzMDVcdTU0MkJcdTVGNTJcdTY4NjNcdTdFREZcdThCQTFcdTRGRTFcdTYwNkZcdTc2ODRcdTVCRjlcdThDNjFcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEFsbEFyY2hpdmVzID0gKHBvc3REYXRhKSA9PiB7XG4gIGNvbnN0IGFyY2hpdmVEYXRhID0ge307XG4gIC8vIFx1OTA0RFx1NTM4Nlx1NjU3MFx1NjM2RVxuICBwb3N0RGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU2NzA5IGRhdGUgXHU1QzVFXHU2MDI3XG4gICAgaWYgKGl0ZW0uZGF0ZSkge1xuICAgICAgLy8gXHU1QzA2XHU2NUY2XHU5NUY0XHU2MjMzXHU4RjZDXHU2MzYyXHU0RTNBXHU2NUU1XHU2NzFGXHU1QkY5XHU4QzYxXG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoaXRlbS5kYXRlKTtcbiAgICAgIC8vIFx1ODNCN1x1NTNENlx1NUU3NFx1NEVGRFxuICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpO1xuICAgICAgLy8gXHU1MjFEXHU1OUNCXHU1MzE2XHU4QkU1XHU1RTc0XHU0RUZEXHU3Njg0XHU3RURGXHU4QkExXHU0RkUxXHU2MDZGXHVGRjBDXHU1OTgyXHU2NzlDXHU0RTBEXHU1QjU4XHU1NzI4XG4gICAgICBpZiAoIWFyY2hpdmVEYXRhW3llYXJdKSB7XG4gICAgICAgIGFyY2hpdmVEYXRhW3llYXJdID0ge1xuICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgIGFydGljbGVzOiBbaXRlbV0sXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBcdTU5ODJcdTY3OUNcdTVFNzRcdTRFRkRcdTVERjJcdTVCNThcdTU3MjhcdUZGMENcdTUyMTlcdTU4OUVcdTUyQTBcdThCQTFcdTY1NzBcdTU0OENcdThCQjBcdTVGNTVcdTYyNDBcdTVDNUVcdTY1ODdcdTdBRTBcbiAgICAgICAgYXJjaGl2ZURhdGFbeWVhcl0uY291bnQrKztcbiAgICAgICAgYXJjaGl2ZURhdGFbeWVhcl0uYXJ0aWNsZXMucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAvLyBcdTYzRDBcdTUzRDZcdTVFNzRcdTRFRkRcdTVFNzZcdTYzMDlcdTk2NERcdTVFOEZcdTYzOTJcdTVFOEZcbiAgY29uc3Qgc29ydGVkWWVhcnMgPSBPYmplY3Qua2V5cyhhcmNoaXZlRGF0YSkuc29ydCgoYSwgYikgPT4gcGFyc2VJbnQoYikgLSBwYXJzZUludChhKSk7XG4gIHJldHVybiB7IGRhdGE6IGFyY2hpdmVEYXRhLCB5ZWFyOiBzb3J0ZWRZZWFycyB9O1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2xpamluY2hhby9EZXZlbG9wZXIvcHJvbXB0LW1hbmFnZXIvLnZpdGVwcmVzcy90aGVtZS9hc3NldHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9saWppbmNoYW8vRGV2ZWxvcGVyL3Byb21wdC1tYW5hZ2VyLy52aXRlcHJlc3MvdGhlbWUvYXNzZXRzL3RoZW1lQ29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbGlqaW5jaGFvL0RldmVsb3Blci9wcm9tcHQtbWFuYWdlci8udml0ZXByZXNzL3RoZW1lL2Fzc2V0cy90aGVtZUNvbmZpZy5tanNcIjsvLyBcdTRFM0JcdTk4OThcdTkxNERcdTdGNkVcbmV4cG9ydCBjb25zdCB0aGVtZUNvbmZpZyA9IHtcbiAgLy8gXHU3QUQ5XHU3MEI5XHU0RkUxXHU2MDZGXG4gIHNpdGVNZXRhOiB7XG4gICAgLy8gXHU3QUQ5XHU3MEI5XHU2ODA3XHU5ODk4XG4gICAgdGl0bGU6IFwiQ3VydmVcIixcbiAgICAvLyBcdTdBRDlcdTcwQjlcdTYzQ0ZcdThGRjBcbiAgICBkZXNjcmlwdGlvbjogXCJIZWxsbyBXb3JsZFwiLFxuICAgIC8vIFx1N0FEOVx1NzBCOWxvZ29cbiAgICBsb2dvOiBcIi9pbWFnZXMvbG9nby9sb2dvLndlYnBcIixcbiAgICAvLyBcdTdBRDlcdTcwQjlcdTU3MzBcdTU3NDBcbiAgICBzaXRlOiBcImh0dHBzOi8vYmxvZy5pbXN5eS50b3BcIixcbiAgICAvLyBcdThCRURcdThBMDBcbiAgICBsYW5nOiBcInpoLUNOXCIsXG4gICAgLy8gXHU0RjVDXHU4MDA1XG4gICAgYXV0aG9yOiB7XG4gICAgICBuYW1lOiBcIkFkbWluXCIsXG4gICAgICBjb3ZlcjogXCIvaW1hZ2VzL2xvZ28vbG9nby53ZWJwXCIsXG4gICAgICBlbWFpbDogXCIxMTQ1MTRAZ21haWwuY29tXCIsXG4gICAgICBsaW5rOiBcImh0dHBzOi8vd3d3Lmltc3l5LnRvcFwiLFxuICAgIH0sXG4gIH0sXG4gIC8vIFx1NTkwN1x1Njg0OFx1NEZFMVx1NjA2RlxuICBpY3A6IFwiXHU4NDBDSUNQXHU1OTA3MTE0NTE0XHU1M0Y3XCIsXG4gIC8vIFx1NUVGQVx1N0FEOVx1NjVFNVx1NjcxRlxuICBzaW5jZTogXCIyMDIwLTA3LTI4XCIsXG4gIC8vIFx1NkJDRlx1OTg3NVx1NjU4N1x1N0FFMFx1NjU3MFx1NjM2RVxuICBwb3N0U2l6ZTogOCxcbiAgLy8gaW5qZWN0XG4gIGluamVjdDoge1xuICAgIC8vIFx1NTkzNFx1OTBFOFxuICAgIC8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi96aC9yZWZlcmVuY2Uvc2l0ZS1jb25maWcjaGVhZFxuICAgIGhlYWRlcjogW1xuICAgICAgLy8gZmF2aWNvblxuICAgICAgW1wibGlua1wiLCB7IHJlbDogXCJpY29uXCIsIGhyZWY6IFwiL2Zhdmljb24uaWNvXCIgfV0sXG4gICAgICAvLyBSU1NcbiAgICAgIFtcbiAgICAgICAgXCJsaW5rXCIsXG4gICAgICAgIHtcbiAgICAgICAgICByZWw6IFwiYWx0ZXJuYXRlXCIsXG4gICAgICAgICAgdHlwZTogXCJhcHBsaWNhdGlvbi9yc3MreG1sXCIsXG4gICAgICAgICAgdGl0bGU6IFwiUlNTXCIsXG4gICAgICAgICAgaHJlZjogXCJodHRwczovL2Jsb2cuaW1zeXkudG9wL3Jzcy54bWxcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICAvLyBcdTk4ODRcdThGN0QgQ0ROXG4gICAgICBbXG4gICAgICAgIFwibGlua1wiLFxuICAgICAgICB7XG4gICAgICAgICAgY3Jvc3NvcmlnaW46IFwiXCIsXG4gICAgICAgICAgcmVsOiBcInByZWNvbm5lY3RcIixcbiAgICAgICAgICBocmVmOiBcImh0dHBzOi8vczEuaGRzbGIuY29tXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBcImxpbmtcIixcbiAgICAgICAge1xuICAgICAgICAgIGNyb3Nzb3JpZ2luOiBcIlwiLFxuICAgICAgICAgIHJlbDogXCJwcmVjb25uZWN0XCIsXG4gICAgICAgICAgaHJlZjogXCJodHRwczovL21pcnJvcnMuc3VzdGVjaC5lZHUuY25cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICAvLyBIYXJtb255T1MgZm9udFxuICAgICAgW1xuICAgICAgICBcImxpbmtcIixcbiAgICAgICAge1xuICAgICAgICAgIGNyb3Nzb3JpZ2luOiBcImFub255bW91c1wiLFxuICAgICAgICAgIHJlbDogXCJzdHlsZXNoZWV0XCIsXG4gICAgICAgICAgaHJlZjogXCJodHRwczovL3MxLmhkc2xiLmNvbS9iZnMvc3RhdGljL2ppbmtlbGEvbG9uZy9mb250L3JlZ3VsYXIuY3NzXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBcImxpbmtcIixcbiAgICAgICAge1xuICAgICAgICAgIGNyb3Nzb3JpZ2luOiBcImFub255bW91c1wiLFxuICAgICAgICAgIHJlbDogXCJzdHlsZXNoZWV0XCIsXG4gICAgICAgICAgaHJlZjogXCJodHRwczovL21pcnJvcnMuc3VzdGVjaC5lZHUuY24vY2RuanMvYWpheC9saWJzL2x4Z3ctd2Vua2FpLXNjcmVlbi13ZWJmb250LzEuNy4wL3N0eWxlLmNzc1wiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIC8vIGljb25mb250XG4gICAgICBbXG4gICAgICAgIFwibGlua1wiLFxuICAgICAgICB7XG4gICAgICAgICAgY3Jvc3NvcmlnaW46IFwiYW5vbnltb3VzXCIsXG4gICAgICAgICAgcmVsOiBcInN0eWxlc2hlZXRcIixcbiAgICAgICAgICBocmVmOiBcImh0dHBzOi8vY2RuMi5jb2Rlc2lnbi5xcS5jb20vaWNvbnMvZzVacEVneDN6NFZPNmoyL2xhdGVzdC9pY29uZm9udC5jc3NcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICAvLyBFbWJlZCBjb2RlXG4gICAgICBbXCJsaW5rXCIsIHsgcmVsOiBcInByZWNvbm5lY3RcIiwgaHJlZjogXCJodHRwczovL3VzZS5zZXZlbmNkbi5jb21cIiB9XSxcbiAgICAgIFtcImxpbmtcIiwgeyByZWw6IFwicHJlY29ubmVjdFwiLCBocmVmOiBcImh0dHBzOi8vZm9udHMuZ3N0YXRpYy5jb21cIiwgY3Jvc3NvcmlnaW46IFwiXCIgfV0sXG4gICAgICBbXG4gICAgICAgIFwibGlua1wiLFxuICAgICAgICB7XG4gICAgICAgICAgY3Jvc3NvcmlnaW46IFwiYW5vbnltb3VzXCIsXG4gICAgICAgICAgaHJlZjogXCJodHRwczovL3VzZS5zZXZlbmNkbi5jb20vY3NzMj9mYW1pbHk9RmlyYStDb2RlOndnaHRAMzAwLi43MDAmZGlzcGxheT1zd2FwXCIsXG4gICAgICAgICAgcmVsOiBcInN0eWxlc2hlZXRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICAvLyBcdTk4ODRcdThGN0QgRG9jU2VhcmNoXG4gICAgICBbXG4gICAgICAgIFwibGlua1wiLFxuICAgICAgICB7XG4gICAgICAgICAgaHJlZjogXCJodHRwczovL1g1RUJFWkI1M0ktZHNuLmFsZ29saWEubmV0XCIsXG4gICAgICAgICAgcmVsOiBcInByZWNvbm5lY3RcIixcbiAgICAgICAgICBjcm9zc29yaWdpbjogXCJcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgXSxcbiAgfSxcbiAgLy8gXHU1QkZDXHU4MjJBXHU2ODBGXHU4M0RDXHU1MzU1XG4gIG5hdjogW1xuICAgIHtcbiAgICAgIHRleHQ6IFwiXHU2NTg3XHU1RTkzXCIsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6IFwiXHU2NTg3XHU3QUUwXHU1MjE3XHU4ODY4XCIsIGxpbms6IFwiL3BhZ2VzL2FyY2hpdmVzXCIsIGljb246IFwiYXJ0aWNsZVwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJcdTUxNjhcdTkwRThcdTUyMDZcdTdDN0JcIiwgbGluazogXCIvcGFnZXMvY2F0ZWdvcmllc1wiLCBpY29uOiBcImZvbGRlclwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJcdTUxNjhcdTkwRThcdTY4MDdcdTdCN0VcIiwgbGluazogXCIvcGFnZXMvdGFnc1wiLCBpY29uOiBcImhhc2h0YWdcIiB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiXHU0RTEzXHU2ODBGXCIsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6IFwiXHU2MjgwXHU2NzJGXHU1MjA2XHU0RUFCXCIsIGxpbms6IFwiL3BhZ2VzL2NhdGVnb3JpZXMvXHU2MjgwXHU2NzJGXHU1MjA2XHU0RUFCXCIsIGljb246IFwidGVjaG5pY2FsXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIlx1NjIxMVx1NzY4NFx1OTg3OVx1NzZFRVwiLCBsaW5rOiBcIi9wYWdlcy9wcm9qZWN0XCIsIGljb246IFwiY29kZVwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJcdTY1NDhcdTczODdcdTVERTVcdTUxNzdcIiwgbGluazogXCIvcGFnZXMvdG9vbHNcIiwgaWNvbjogXCJ0b29sc1wiIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogXCJcdTUzQ0JcdTk0RkVcIixcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogXCJcdTUzQ0JcdTk0RkVcdTlDN0NcdTU4NThcIiwgbGluazogXCIvcGFnZXMvZnJpZW5kc1wiLCBpY29uOiBcImZpc2hcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiXHU1M0NCXHU2MEM1XHU5NEZFXHU2M0E1XCIsIGxpbms6IFwiL3BhZ2VzL2xpbmtcIiwgaWNvbjogXCJwZW9wbGVcIiB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiXHU2MjExXHU3Njg0XCIsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6IFwiXHU3NTQ1XHU2MjQwXHU2QjMyXHU4QTAwXCIsIGxpbms6IFwiL3BhZ2VzL21lc3NhZ2VcIiwgaWNvbjogXCJjaGF0XCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIlx1ODFGNFx1OEMyMlx1NTQwRFx1NTM1NVwiLCBsaW5rOiBcIi9wYWdlcy90aGFua3NcIiwgaWNvbjogXCJyZXdhcmRcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiXHU1MTczXHU0RThFXHU2NzJDXHU3QUQ5XCIsIGxpbms6IFwiL3BhZ2VzL2Fib3V0XCIsIGljb246IFwiY29udGFjdHNcIiB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxuICAvLyBcdTVCRkNcdTgyMkFcdTY4MEZcdTgzRENcdTUzNTUgLSBcdTVERTZcdTRGQTdcbiAgbmF2TW9yZTogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiXHU1MzVBXHU1QkEyXCIsXG4gICAgICBsaXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpY29uOiBcIi9pbWFnZXMvbG9nby9sb2dvLndlYnBcIixcbiAgICAgICAgICBuYW1lOiBcIlx1NEUzQlx1N0FEOVwiLFxuICAgICAgICAgIHVybDogXCIvXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpY29uOiBcIi9pbWFnZXMvbG9nby9sb2dvLndlYnBcIixcbiAgICAgICAgICBuYW1lOiBcIlx1NTM1QVx1NUJBMlx1OTU1Q1x1NTBDRlx1N0FEOVwiLFxuICAgICAgICAgIHVybDogXCJodHRwczovL2Jsb2ctYmFja3VwLmltc3l5LnRvcC9cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiBcIlx1NjcwRFx1NTJBMVwiLFxuICAgICAgbGlzdDogW1xuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogXCJodHRwczovL3BpYy5lZmVmZWUuY24vdXBsb2Fkcy8yMDI0LzA0LzA4LzY2MTM0NjUzNTgwNzcucG5nXCIsXG4gICAgICAgICAgbmFtZTogXCJcdThENzdcdTU5Q0JcdTk4NzVcIixcbiAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9uYXYuaW1zeXkudG9wL1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogXCJodHRwczovL3BpYy5lZmVmZWUuY24vdXBsb2Fkcy8yMDI0LzA0LzA4LzY2MTM0NmQ0MThhZDcucG5nXCIsXG4gICAgICAgICAgbmFtZTogXCJcdTRFQ0FcdTY1RTVcdTcwRURcdTY5OUNcIixcbiAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9ob3QuaW1zeXkudG9wL1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogXCJodHRwczovL3BpYy5lZmVmZWUuY24vdXBsb2Fkcy8yMDI0LzA0LzA4LzY2MTM0NzIyNTg2ZmEucG5nXCIsXG4gICAgICAgICAgbmFtZTogXCJcdTdBRDlcdTcwQjlcdTc2RDFcdTZENEJcIixcbiAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9zdGF0dXMuaW1zeXkudG9wL1wiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwiXHU5ODc5XHU3NkVFXCIsXG4gICAgICBsaXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpY29uOiBcIi9pbWFnZXMvbG9nby9sb2dvLndlYnBcIixcbiAgICAgICAgICBuYW1lOiBcIkN1cnZlXCIsXG4gICAgICAgICAgdXJsOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pbXN5eS92aXRlcHJlc3MtdGhlbWUtY3VydmVcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGljb246IFwiaHR0cHM6Ly9waWMuZWZlZmVlLmNuL3VwbG9hZHMvMjAyNC8wNC8wNy82NjEyNGY1ZmM2M2M4LnBuZ1wiLFxuICAgICAgICAgIG5hbWU6IFwiU1BsYXllclwiLFxuICAgICAgICAgIHVybDogXCJodHRwczovL2dpdGh1Yi5jb20vaW1zeXkvU1BsYXllclwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogXCJodHRwczovL3BpYy5lZmVmZWUuY24vdXBsb2Fkcy8yMDI0LzA0LzA4LzY2MTM0NjUzNTgwNzcucG5nXCIsXG4gICAgICAgICAgbmFtZTogXCJTbmF2aWdhdGlvblwiLFxuICAgICAgICAgIHVybDogXCJodHRwczovL2dpdGh1Yi5jb20vaW1zeXkvU1BsYXllclwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogXCIvaW1hZ2VzL2xvZ28vbG9nby53ZWJwXCIsXG4gICAgICAgICAgbmFtZTogXCJIb21lXCIsXG4gICAgICAgICAgdXJsOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pbXN5eS9ob21lXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpY29uOiBcImh0dHBzOi8vcGljLmVmZWZlZS5jbi91cGxvYWRzLzIwMjQvMDQvMDgvNjYxMzQ2ZDQxOGFkNy5wbmdcIixcbiAgICAgICAgICBuYW1lOiBcIkRhaWx5SG90QXBpXCIsXG4gICAgICAgICAgdXJsOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pbXN5eS9EYWlseUhvdEFwaVwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogXCJodHRwczovL3BpYy5lZmVmZWUuY24vdXBsb2Fkcy8yMDI0LzA0LzA4LzY2MTM0NzIyNTg2ZmEucG5nXCIsXG4gICAgICAgICAgbmFtZTogXCJzaXRlLXN0YXR1c1wiLFxuICAgICAgICAgIHVybDogXCJodHRwczovL2dpdGh1Yi5jb20vaW1zeXkvc2l0ZS1zdGF0dXNcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgLy8gXHU1QzAxXHU5NzYyXHU5MTREXHU3RjZFXG4gIGNvdmVyOiB7XG4gICAgLy8gXHU2NjJGXHU1NDI2XHU1RjAwXHU1NDJGXHU1M0NDXHU2ODBGXHU1RTAzXHU1QzQwXG4gICAgdHdvQ29sdW1uczogZmFsc2UsXG4gICAgLy8gXHU2NjJGXHU1NDI2XHU1RjAwXHU1NDJGXHU1QzAxXHU5NzYyXHU2NjNFXHU3OTNBXG4gICAgc2hvd0NvdmVyOiB7XG4gICAgICAvLyBcdTY2MkZcdTU0MjZcdTVGMDBcdTU0MkZcdTVDMDFcdTk3NjJcdTY2M0VcdTc5M0EgXHU2NTg3XHU3QUUwXHU0RTBEXHU4QkJFXHU3RjZFY292ZXJcdTVDMDFcdTk3NjJcdTRGMUFcdTY2M0VcdTc5M0FcdTVGMDJcdTVFMzhcdUZGMENcdTUzRUZcdTRFRTVcdThCQkVcdTdGNkVcdTRFMEJcdTY1QjlcdTlFRDhcdThCQTRcdTVDMDFcdTk3NjJcbiAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgIC8vIFx1NUMwMVx1OTc2Mlx1NUUwM1x1NUM0MFx1NjVCOVx1NUYwRjogbGVmdCB8IHJpZ2h0IHwgYm90aFxuICAgICAgY292ZXJMYXlvdXQ6ICdib3RoJyxcbiAgICAgIC8vIFx1OUVEOFx1OEJBNFx1NUMwMVx1OTc2MihcdTk2OEZcdTY3M0FcdTVDNTVcdTc5M0EpXG4gICAgICBkZWZhdWx0Q292ZXI6IFtcbiAgICAgICAgJ2h0dHBzOi8vZXhhbXBsZS5jb20vMS5hdmlmJyxcbiAgICAgICAgJ2h0dHBzOi8vZXhhbXBsZS5jb20vMi5hdmlmJyxcbiAgICAgICAgJ2h0dHBzOi8vZXhhbXBsZS5jb20vMy5hdmlmJ1xuICAgICAgXVxuICAgIH1cbiAgfSxcbiAgLy8gXHU5ODc1XHU4MTFBXHU0RkUxXHU2MDZGXG4gIGZvb3Rlcjoge1xuICAgIC8vIFx1NzkzRVx1NEVBNFx1OTRGRVx1NjNBNVx1RkYwOFx1OEJGN1x1Nzg2RVx1NEZERFx1NEUzQVx1NTA3Nlx1NjU3MFx1NEUyQVx1RkYwOVxuICAgIHNvY2lhbDogW1xuICAgICAge1xuICAgICAgICBpY29uOiBcImVtYWlsXCIsXG4gICAgICAgIGxpbms6IFwibWFpbHRvOm9uZUBpbXN5eS50b3BcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwiZ2l0aHViXCIsXG4gICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZ2l0aHViLmNvbS9pbXN5eS9cIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwidGVsZWdyYW1cIixcbiAgICAgICAgbGluazogXCJodHRwczovL3QubWUvYm90dG9tX3VzZXJcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb246IFwiYmlsaWJpbGlcIixcbiAgICAgICAgbGluazogXCJodHRwczovL3NwYWNlLmJpbGliaWxpLmNvbS85ODU0NDE0MlwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJxcVwiLFxuICAgICAgICBsaW5rOiBcImh0dHBzOi8vcmVzLmFiZWltLmNuL2FwaS9xcS8/cXE9MTUzOTI1MDM1MlwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjogXCJ0d2l0dGVyLXhcIixcbiAgICAgICAgbGluazogXCJodHRwczovL3R3aXR0ZXIuY29tL2lpbW1zeXlcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICAvLyBzaXRlbWFwXG4gICAgc2l0ZW1hcDogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiBcIlx1NTM1QVx1NUJBMlwiLFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHsgdGV4dDogXCJcdThGRDFcdTY3MUZcdTY1ODdcdTdBRTBcIiwgbGluazogXCIvXCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiXHU1MTY4XHU5MEU4XHU1MjA2XHU3QzdCXCIsIGxpbms6IFwiL3BhZ2VzL2NhdGVnb3JpZXNcIiB9LFxuICAgICAgICAgIHsgdGV4dDogXCJcdTUxNjhcdTkwRThcdTY4MDdcdTdCN0VcIiwgbGluazogXCIvcGFnZXMvdGFnc1wiIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcIlx1NjU4N1x1N0FFMFx1NUY1Mlx1Njg2M1wiLCBsaW5rOiBcIi9wYWdlcy9hcmNoaXZlc1wiLCBuZXdUYWI6IHRydWUgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6IFwiXHU5ODc5XHU3NkVFXCIsXG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgeyB0ZXh0OiBcIkhvbWVcIiwgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vaW1zeXkvaG9tZS9cIiwgbmV3VGFiOiB0cnVlIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcIlNQbGF5ZXJcIiwgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vaW1zeXkvU1BsYXllci9cIiwgbmV3VGFiOiB0cnVlIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcIkRhaWx5SG90QXBpXCIsIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2ltc3l5L0RhaWx5SG90QXBpL1wiLCBuZXdUYWI6IHRydWUgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiU25hdmlnYXRpb25cIiwgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vaW1zeXkvU25hdmlnYXRpb24vXCIsIG5ld1RhYjogdHJ1ZSB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJcdTRFMTNcdTY4MEZcIixcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7IHRleHQ6IFwiXHU2MjgwXHU2NzJGXHU1MjA2XHU0RUFCXCIsIGxpbms6IFwiL3BhZ2VzL2NhdGVnb3JpZXMvXHU2MjgwXHU2NzJGXHU1MjA2XHU0RUFCXCIgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiXHU2MjExXHU3Njg0XHU5ODc5XHU3NkVFXCIsIGxpbms6IFwiL3BhZ2VzL3Byb2plY3RcIiB9LFxuICAgICAgICAgIHsgdGV4dDogXCJcdTY1NDhcdTczODdcdTVERTVcdTUxNzdcIiwgbGluazogXCIvcGFnZXMvdG9vbHNcIiB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJcdTk4NzVcdTk3NjJcIixcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7IHRleHQ6IFwiXHU3NTQ1XHU2MjQwXHU2QjMyXHU4QTAwXCIsIGxpbms6IFwiL3BhZ2VzL21lc3NhZ2VcIiB9LFxuICAgICAgICAgIHsgdGV4dDogXCJcdTUxNzNcdTRFOEVcdTY3MkNcdTdBRDlcIiwgbGluazogXCIvcGFnZXMvYWJvdXRcIiB9LFxuICAgICAgICAgIHsgdGV4dDogXCJcdTk2OTBcdTc5QzFcdTY1M0ZcdTdCNTZcIiwgbGluazogXCIvcGFnZXMvcHJpdmFjeVwiIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcIlx1NzI0OFx1Njc0M1x1NTM0Rlx1OEJBRVwiLCBsaW5rOiBcIi9wYWdlcy9jY1wiIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiBcIlx1NjcwRFx1NTJBMVwiLFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHsgdGV4dDogXCJcdTdBRDlcdTcwQjlcdTcyQjZcdTYwMDFcIiwgbGluazogXCJodHRwczovL3N0YXR1cy5pbXN5eS50b3AvXCIsIG5ld1RhYjogdHJ1ZSB9LFxuICAgICAgICAgIHsgdGV4dDogXCJcdTRFMDBcdTRFMkFcdTVCRkNcdTgyMkFcIiwgbGluazogXCJodHRwczovL25hdi5pbXN5eS50b3AvXCIsIG5ld1RhYjogdHJ1ZSB9LFxuICAgICAgICAgIHsgdGV4dDogXCJcdTdBRDlcdTcwQjlcdThCQTJcdTk2MDVcIiwgbGluazogXCJodHRwczovL2Jsb2cuaW1zeXkudG9wL3Jzcy54bWxcIiwgbmV3VGFiOiB0cnVlIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJcdTUzQ0RcdTk5ODhcdTYyOTVcdThCQzlcIixcbiAgICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9lcW54d2VpbWtyNS5mZWlzaHUuY24vc2hhcmUvYmFzZS9mb3JtL3NocmNuQ1hDUG14Q0tLSllJM1JLVWZlZkpyZVwiLFxuICAgICAgICAgICAgbmV3VGFiOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIC8vIFx1OEJDNFx1OEJCQVxuICBjb21tZW50OiB7XG4gICAgZW5hYmxlOiBmYWxzZSxcbiAgICAvLyBcdThCQzRcdThCQkFcdTdDRkJcdTdFREZcdTkwMDlcdTYyRTlcbiAgICAvLyBhcnRhbGsgLyB0d2lrb29cbiAgICB0eXBlOiBcImFydGFsa1wiLFxuICAgIC8vIGFydGFsa1xuICAgIC8vIGh0dHBzOi8vYXJ0YWxrLmpzLm9yZy9cbiAgICBhcnRhbGs6IHtcbiAgICAgIHNpdGU6IFwiXCIsXG4gICAgICBzZXJ2ZXI6IFwiXCIsXG4gICAgfSxcbiAgICAvLyB0d2lrb29cbiAgICAvLyBodHRwczovL3R3aWtvby5qcy5vcmcvXG4gICAgdHdpa29vOiB7XG4gICAgICAvLyBcdTVGQzVcdTU4NkJcdUZGMENcdTgyRTVcdTRFMERcdTYwRjNcdTRGN0ZcdTc1MjggQ0ROXHVGRjBDXHU1M0VGXHU0RUU1XHU0RjdGXHU3NTI4IHBucG0gYWRkIHR3aWtvbyBcdTVCODlcdTg4QzVcdTVFNzZcdTVGMTVcdTUxNjVcbiAgICAgIGpzOiBcImh0dHBzOi8vbWlycm9ycy5zdXN0ZWNoLmVkdS5jbi9jZG5qcy9hamF4L2xpYnMvdHdpa29vLzEuNi4zOS90d2lrb28uYWxsLm1pbi5qc1wiLFxuICAgICAgZW52SWQ6IFwiXCIsXG4gICAgICAvLyBcdTczQUZcdTU4ODNcdTU3MzBcdTU3REZcdUZGMENcdTlFRDhcdThCQTRcdTRFM0EgYXAtc2hhbmdoYWlcdUZGMENcdTgxN0VcdThCQUZcdTRFOTFcdTczQUZcdTU4ODNcdTU4NkIgYXAtc2hhbmdoYWkgXHU2MjE2IGFwLWd1YW5nemhvdVx1RkYxQlZlcmNlbCBcdTczQUZcdTU4ODNcdTRFMERcdTU4NkJcbiAgICAgIHJlZ2lvbjogXCJhcC1zaGFuZ2hhaVwiLFxuICAgICAgbGFuZzogXCJ6aC1DTlwiLFxuICAgIH0sXG4gIH0sXG4gIC8vIFx1NEZBN1x1OEZCOVx1NjgwRlxuICBhc2lkZToge1xuICAgIC8vIFx1N0FEOVx1NzBCOVx1N0I4MFx1NEVDQlxuICAgIGhlbGxvOiB7XG4gICAgICBlbmFibGU6IHRydWUsXG4gICAgICB0ZXh0OiBcIlx1OEZEOVx1OTFDQ1x1NjcwOVx1NTE3M1x1NEU4RTxzdHJvbmc+XHU1RjAwXHU1M0QxPC9zdHJvbmc+XHU3NkY4XHU1MTczXHU3Njg0XHU5NUVFXHU5ODk4XHU1NDhDXHU3NzBCXHU2Q0Q1XHVGRjBDXHU0RTVGXHU0RjFBXHU2NzA5XHU0RTAwXHU0RTlCPHN0cm9uZz5cdTU5NDdcdTYyODBcdTZERUJcdTVERTc8L3N0cm9uZz5cdTc2ODRcdTUyMDZcdTRFQUJcdUZGMENcdTUxNzZcdTRFMkRcdTU5MjdcdTkwRThcdTUyMDZcdTUxODVcdTVCQjlcdTRGMUFcdTRGQTdcdTkxQ0RcdTRFOEU8c3Ryb25nPlx1NTI0RFx1N0FFRlx1NUYwMFx1NTNEMTwvc3Ryb25nPlx1MzAwMlx1NUUwQ1x1NjcxQlx1NEY2MFx1NTNFRlx1NEVFNVx1NTcyOFx1OEZEOVx1OTFDQ1x1NjI3RVx1NTIzMFx1NUJGOVx1NEY2MFx1NjcwOVx1NzUyOFx1NzY4NFx1NzdFNVx1OEJDNlx1NTQ4Q1x1NjU1OVx1N0EwQlx1MzAwMlwiLFxuICAgIH0sXG4gICAgLy8gXHU3NkVFXHU1RjU1XG4gICAgdG9jOiB7XG4gICAgICBlbmFibGU6IHRydWUsXG4gICAgfSxcbiAgICAvLyBcdTY4MDdcdTdCN0VcbiAgICB0YWdzOiB7XG4gICAgICBlbmFibGU6IHRydWUsXG4gICAgfSxcbiAgICAvLyBcdTUwMTJcdThCQTFcdTY1RjZcbiAgICBjb3VudERvd246IHtcbiAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgIC8vIFx1NTAxMlx1OEJBMVx1NjVGNlx1NjVFNVx1NjcxRlxuICAgICAgZGF0YToge1xuICAgICAgICBuYW1lOiBcIlx1NjYyNVx1ODI4MlwiLFxuICAgICAgICBkYXRlOiBcIjIwMjUtMDEtMjlcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBcdTdBRDlcdTcwQjlcdTY1NzBcdTYzNkVcbiAgICBzaXRlRGF0YToge1xuICAgICAgZW5hYmxlOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIC8vIFx1NTNDQlx1OTRGRVxuICBmcmllbmRzOiB7XG4gICAgLy8gXHU1M0NCXHU5NEZFXHU2NzBCXHU1M0NCXHU1NzA4XG4gICAgY2lyY2xlT2ZGcmllbmRzOiBcIlwiLFxuICAgIC8vIFx1NTJBOFx1NjAwMVx1NTNDQlx1OTRGRVxuICAgIGR5bmFtaWNMaW5rOiB7XG4gICAgICBzZXJ2ZXI6IFwiXCIsXG4gICAgICBhcHBfdG9rZW46IFwiXCIsXG4gICAgICB0YWJsZV9pZDogXCJcIixcbiAgICB9LFxuICB9LFxuICAvLyBcdTk3RjNcdTRFNTBcdTY0QURcdTY1M0VcdTU2NjhcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ltc3l5L01ldGluZy1BUElcbiAgbXVzaWM6IHtcbiAgICBlbmFibGU6IGZhbHNlLFxuICAgIC8vIHVybFxuICAgIHVybDogXCJodHRwczovL2FwaS1tZXRpbmcuZXhhbXBsZS5jb21cIixcbiAgICAvLyBpZFxuICAgIGlkOiA5Mzc5ODMxNzE0LFxuICAgIC8vIG5ldGVhc2UgLyB0ZW5jZW50IC8ga3Vnb3VcbiAgICBzZXJ2ZXI6IFwibmV0ZWFzZVwiLFxuICAgIC8vIHBsYXlsaXN0IC8gYWxidW0gLyBzb25nXG4gICAgdHlwZTogXCJwbGF5bGlzdFwiLFxuICB9LFxuICAvLyBcdTY0MUNcdTdEMjJcbiAgLy8gaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vXG4gIHNlYXJjaDoge1xuICAgIGVuYWJsZTogZmFsc2UsXG4gICAgYXBwSWQ6IFwiXCIsXG4gICAgYXBpS2V5OiBcIlwiLFxuICB9LFxuICAvLyBcdTYyNTNcdThENEZcbiAgcmV3YXJkRGF0YToge1xuICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAvLyBcdTVGQUVcdTRGRTFcdTRFOENcdTdFRjRcdTc4MDFcbiAgICB3ZWNoYXQ6IFwiaHR0cHM6Ly9waWMuZWZlZmVlLmNuL3VwbG9hZHMvMjAyNC8wNC8wNy82NjEyMTA0OWQxZTgwLndlYnBcIixcbiAgICAvLyBcdTY1MkZcdTRFRDhcdTVCOURcdTRFOENcdTdFRjRcdTc4MDFcbiAgICBhbGlwYXk6IFwiaHR0cHM6Ly9waWMuZWZlZmVlLmNuL3VwbG9hZHMvMjAyNC8wNC8wNy82NjEyMDY2MzFkM2I1LndlYnBcIixcbiAgfSxcbiAgLy8gXHU1NkZFXHU3MjQ3XHU3MDZGXHU3QkIxXG4gIGZhbmN5Ym94OiB7XG4gICAgZW5hYmxlOiB0cnVlLFxuICAgIGpzOiBcImh0dHBzOi8vbWlycm9ycy5zdXN0ZWNoLmVkdS5jbi9jZG5qcy9hamF4L2xpYnMvZmFuY3lhcHBzLXVpLzUuMC4zNi9mYW5jeWJveC9mYW5jeWJveC51bWQubWluLmpzXCIsXG4gICAgY3NzOiBcImh0dHBzOi8vbWlycm9ycy5zdXN0ZWNoLmVkdS5jbi9jZG5qcy9hamF4L2xpYnMvZmFuY3lhcHBzLXVpLzUuMC4zNi9mYW5jeWJveC9mYW5jeWJveC5taW4uY3NzXCIsXG4gIH0sXG4gIC8vIFx1NTkxNlx1OTRGRVx1NEUyRFx1OEY2Q1xuICBqdW1wUmVkaXJlY3Q6IHtcbiAgICBlbmFibGU6IHRydWUsXG4gICAgLy8gXHU2MzkyXHU5NjY0XHU3QzdCXHU1NDBEXG4gICAgZXhjbHVkZTogW1xuICAgICAgXCJjZi1mcmllbmRzLWxpbmtcIixcbiAgICAgIFwidXB5dW5cIixcbiAgICAgIFwiaWNwXCIsXG4gICAgICBcImF1dGhvclwiLFxuICAgICAgXCJyc3NcIixcbiAgICAgIFwiY2NcIixcbiAgICAgIFwicG93ZXJcIixcbiAgICAgIFwic29jaWFsLWxpbmtcIixcbiAgICAgIFwibGluay10ZXh0XCIsXG4gICAgICBcInRyYXZlbGxpbmdzXCIsXG4gICAgICBcInBvc3QtbGlua1wiLFxuICAgICAgXCJyZXBvcnRcIixcbiAgICAgIFwibW9yZS1saW5rXCIsXG4gICAgICBcInNraWxscy1pdGVtXCIsXG4gICAgICBcInJpZ2h0LW1lbnUtbGlua1wiLFxuICAgICAgXCJsaW5rLWNhcmRcIixcbiAgICBdLFxuICB9LFxuICAvLyBcdTdBRDlcdTcwQjlcdTdFREZcdThCQTFcbiAgdG9uZ2ppOiB7XG4gICAgXCI1MWxhXCI6IFwiXCIsXG4gIH0sXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGlqaW5jaGFvL0RldmVsb3Blci9wcm9tcHQtbWFuYWdlci8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbGlqaW5jaGFvL0RldmVsb3Blci9wcm9tcHQtbWFuYWdlci8udml0ZXByZXNzL2luaXQubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9saWppbmNoYW8vRGV2ZWxvcGVyL3Byb21wdC1tYW5hZ2VyLy52aXRlcHJlc3MvaW5pdC5tanNcIjtpbXBvcnQgeyB0aGVtZUNvbmZpZyB9IGZyb20gXCIuL3RoZW1lL2Fzc2V0cy90aGVtZUNvbmZpZy5tanNcIjtcbmltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU1RTc2XHU1NDA4XHU1RTc2XHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUaGVtZUNvbmZpZyA9IGFzeW5jICgpID0+IHtcbiAgdHJ5IHtcbiAgICAvLyBcdTkxNERcdTdGNkVcdTY1ODdcdTRFRjZcdTdFRERcdTVCRjlcdThERUZcdTVGODRcbiAgICBjb25zdCBjb25maWdQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi90aGVtZUNvbmZpZy5tanNcIik7XG4gICAgaWYgKGV4aXN0c1N5bmMoY29uZmlnUGF0aCkpIHtcbiAgICAgIC8vIFx1NjU4N1x1NEVGNlx1NUI1OFx1NTcyOFx1NjVGNlx1OEZEQlx1ODg0Q1x1NTJBOFx1NjAwMVx1NUJGQ1x1NTE2NVxuICAgICAgY29uc3QgdXNlckNvbmZpZyA9IGF3YWl0IGltcG9ydChcIi4uL3RoZW1lQ29uZmlnLm1qc1wiKTtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRoZW1lQ29uZmlnLCB1c2VyQ29uZmlnPy50aGVtZUNvbmZpZyB8fCB7fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFx1NjU4N1x1NEVGNlx1NEUwRFx1NUI1OFx1NTcyOFx1NjVGNlx1OEZENFx1NTZERVx1OUVEOFx1OEJBNFx1OTE0RFx1N0Y2RVxuICAgICAgY29uc29sZS53YXJuKFwiVXNlciBjb25maWd1cmF0aW9uIGZpbGUgbm90IGZvdW5kLCB1c2luZyBkZWZhdWx0IHRoZW1lQ29uZmlnLlwiKTtcbiAgICAgIHJldHVybiB0aGVtZUNvbmZpZztcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGxvYWRpbmcgdGhlIGNvbmZpZ3VyYXRpb246XCIsIGVycm9yKTtcbiAgICByZXR1cm4gdGhlbWVDb25maWc7XG4gIH1cbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9saWppbmNoYW8vRGV2ZWxvcGVyL3Byb21wdC1tYW5hZ2VyL3BhZ2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9saWppbmNoYW8vRGV2ZWxvcGVyL3Byb21wdC1tYW5hZ2VyL3BhZ2UvW251bV0ucGF0aHMubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9saWppbmNoYW8vRGV2ZWxvcGVyL3Byb21wdC1tYW5hZ2VyL3BhZ2UvW251bV0ucGF0aHMubWpzXCI7aW1wb3J0IHsgZ2V0QWxsUG9zdHMgfSBmcm9tIFwiLi4vLnZpdGVwcmVzcy90aGVtZS91dGlscy9nZXRQb3N0RGF0YS5tanNcIjtcbmltcG9ydCB7IGdldFRoZW1lQ29uZmlnIH0gZnJvbSBcIi4uLy52aXRlcHJlc3MvaW5pdC5tanNcIjtcblxuY29uc3QgcG9zdERhdGEgPSBhd2FpdCBnZXRBbGxQb3N0cygpO1xuY29uc3QgdGhlbWVDb25maWcgPSBhd2FpdCBnZXRUaGVtZUNvbmZpZygpO1xuXG4vLyBcdTZCQ0ZcdTk4NzVcdTY1ODdcdTdBRTBcdTY1NzBcbmNvbnN0IHBvc3RzUGVyUGFnZSA9IHRoZW1lQ29uZmlnLnBvc3RTaXplO1xuXG4vLyBcdThCQTFcdTdCOTdcdTYwM0JcdTk4NzVcdTY1NzBcbmNvbnN0IHRvdGFsUGFnZXMgPSBNYXRoLmNlaWwocG9zdERhdGEubGVuZ3RoIC8gcG9zdHNQZXJQYWdlKTtcblxuLy8gXHU2NTg3XHU3QUUwXHU1MjA2XHU5ODc1XHU1MkE4XHU2MDAxXHU4REVGXHU3NTMxXG5leHBvcnQgZGVmYXVsdCB7XG4gIHBhdGhzKCkge1xuICAgIGNvbnN0IHBhZ2VzID0gW107XG4gICAgLy8gXHU3NTFGXHU2MjEwXHU2QkNGXHU0RTAwXHU5ODc1XHU3Njg0XHU4REVGXHU3NTMxXHU1M0MyXHU2NTcwXG4gICAgZm9yIChsZXQgcGFnZU51bSA9IDI7IHBhZ2VOdW0gPD0gdG90YWxQYWdlczsgcGFnZU51bSArPSAxKSB7XG4gICAgICBwYWdlcy5wdXNoKHsgcGFyYW1zOiB7IG51bTogcGFnZU51bS50b1N0cmluZygpIH0gfSk7XG4gICAgfVxuICAgIGNvbnNvbGUuaW5mbyhcIlx1NjU4N1x1N0FFMFx1NTIwNlx1OTg3NVx1NTJBOFx1NjAwMVx1OERFRlx1NzUzMVx1RkYxQVwiLCBwYWdlcyk7XG4gICAgcmV0dXJuIHBhZ2VzO1xuICB9LFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1gsU0FBUyxZQUFZO0FBT2xZLElBQU0sYUFBYSxDQUFDLGFBQWE7QUFFdEMsTUFBSSxPQUFPO0FBQ1gsV0FBUyxJQUFJLEdBQUcsSUFBSSxTQUFTLFFBQVEsS0FBSztBQUN4QyxZQUFRLFFBQVEsS0FBSyxPQUFPLFNBQVMsV0FBVyxDQUFDO0FBQUEsRUFDbkQ7QUFFQSxRQUFNLFlBQVksS0FBSyxJQUFJLE9BQU8sSUFBVztBQUM3QyxTQUFPO0FBQ1Q7OztBQ2ZBLFNBQVMsY0FBYztBQUN2QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxRQUFRO0FBTWYsSUFBTSxxQkFBcUIsWUFBWTtBQUNyQyxNQUFJO0FBRUYsUUFBSSxRQUFRLE1BQU0sT0FBTyxDQUFDLE9BQU8sR0FBRztBQUFBLE1BQ2xDLFFBQVEsQ0FBQyxnQkFBZ0IsU0FBUyxjQUFjLFdBQVc7QUFBQSxJQUM3RCxDQUFDO0FBRUQs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QSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxRQUNKO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsVUFDTixLQUFLO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLEtBQUs7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxRQUNKO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsVUFDTixLQUFLO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLEtBQUs7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sS0FBSztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsVUFDTixLQUFLO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLEtBQUs7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsT0FBTztBQUFBO0FBQUEsSUFFTCxZQUFZO0FBQUE7QUFBQSxJQUVaLFdBQVc7QUFBQTtBQUFBLE1BRVQsUUFBUTtBQUFBO0FBQUEsTUFFUixhQUFhO0FBQUE7QUFBQSxNQUViLGNBQWM7QUFBQSxRQUNaO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFD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
