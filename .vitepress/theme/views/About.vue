<template>
  <div class="about">
    <h1 class="title">关于我</h1>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <!-- 介绍 -->
      <div class="about-item hello">
        <span class="text1">你好，很高兴认识你👋</span>
        <span class="text2 title2">我是 李哲雍</span>
        <span class="text3">是一名 算法工程师，助理工程师</span>
      </div>
      <!-- 追求 -->
      <div class="about-item pursuit">
        <span class="tip">追求</span>
        <span class="title2">质量为本</span>
        <span class="title2">保密就是保安全</span>
        <span class="title2">闭环</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 2fr 3fr">
      <!-- 技能 -->
      <div class="about-item skills">
        <span class="tip">技能</span>
        <span class="title2">开启创造力</span>
        <div class="skills-list">
          <a
            v-for="(item, index) in skillsData"
            :key="index"
            :style="{ '--color': item.color }"
            :href="item.link"
            class="skills-item"
            target="_blank"
          >
            <div class="skills-logo">
              <i :class="`iconfont icon-${item.icon}`"></i>
            </div>
            <span class="skills-name">{{ item.name }}</span>
          </a>
        </div>
      </div>
      <!-- 生涯 -->
      <div class="about-item career">
        <span class="tip">生涯</span>
        <span class="title2">
          <i>無限進步</i>
        </span>
        <div class="list">
          <span class="list-item" style="--color: green">工作 · 航天科技集团· ********</span>
          <span class="list-item" style="--color: #eb372a">硕士 · 西北工业大学· 信息与通信工程</span>
          <span class="list-item" style="--color: #357ef5">本科 · 西北工业大学· 电子信息工程</span>
        </div>
        <img
          class="career-img"
          src="https://pic.efefee.cn/uploads/2024/02/22/65d71db18bcf9.png"
          alt="career"
        />
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <!-- 性格 -->
      <div class="about-item character" style="--color: #4298b4">
        <span class="tip">性格</span>
        <span class="title2">调停者</span>
        <span class="title2" style="color: var(--color)">INFP-A / INFP-T</span>
        <span class="more">
          在
          <a href="https://www.16personalities.com/ch/" target="_blank">16personalities</a>
          了解更多关于
          <a href="https://www.16personalities.com/ch/infp-%E4%BA%BA%E6%A0%BC" target="_blank">
            调停者
          </a>
        </span>
        <img
          src="https://pic.efefee.cn/uploads/2024/02/22/65d6bc7ae72ae.png"
          alt="male"
          class="male"
        />
      </div>
      <!-- 座右铭 -->
      <div class="about-item">
        <span class="tip">座右铭</span>
        <span class="title1" style="margin-top: 20px">脚踏实地，</span>
        <span class="title2">一丝不苟。</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 1fr 1fr">
      <div
        class="about-item like image"
        style="
          --color: #0c0e20;
          background-image: url(https://pic.efefee.cn/uploads/2024/02/27/65dd812567723.webp);
        "
      >
        <div class="image-content">
          <span class="tip">关注偏好</span>
          <span class="title2">数码科技</span>
          <div class="image-desc">
            <span class="left">手机、电脑及软硬件</span>
          </div>
        </div>
      </div>
      <div
        class="about-item like image"
        style="
          --color: #7b3c25;
          background-image: url(https://pic.efefee.cn/uploads/2024/02/27/65dd836099d16.webp);
        "
      >
        <div class="image-content">
          <span class="tip">音乐偏好</span>
          <span class="title2">欧美、华语流行、纯音乐、ACG</span>
          <div class="image-desc">
            <span class="left">一起欣赏更多音乐</span>
          </div>
        </div>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 2fr 3fr">
      <!-- 数据 -->
      <div
        class="about-item static image"
        style="
          --color: #0f1114;
          background-image: url(https://pic.efefee.cn/uploads/2024/04/15/661c8fbf226d3.webp);
        "
      >
        <div class="image-content">
          <span class="tip">数据</span>
          <span class="title2">访问统计</span>
          <div class="static-data">
            <div v-for="(item, key, index) in statisticsData" :key="index" class="static-item">
              <span class="static-name">{{ key }}</span>
              <span class="static-num">{{ item }}</span>
            </div>
          </div>
          <div class="image-desc opacity">
            <span class="left">
              统计信息来自 <a href="https://v6.51.la/" target="_blank">51la</a>
            </span>
          </div>
        </div>
      </div>
      <!-- 信息 -->
      <div class="about-item child">
        <div
          class="about-item map image"
          style="background-image: url(https://pic.efefee.cn/uploads/2024/04/15/661cbccc56af5.webp)"
        >
          <span class="position">我现在住在 <strong>中国，西安市</strong></span>
        </div>
        <div class="about-item info">
          <div class="info-item">
            <span class="info-name">生于</span>
            <span class="info-num" style="--color: #43a6c6">1998</span>
          </div>
          <div class="info-item">
            <span class="info-name">现在职业</span>
            <span class="info-num" style="--color: #dfac46">助理工程师</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 心路历程 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <span class="tip">心路历程</span>
        <span class="title2">为什么建站？</span>
        <p class="text">
          创建这个站，是希望能更系统地整理我平时写的提示词和工具笔记，也能方便他人复用。
        </p>
        <p class="text">
          平时也会关注一些 AI 相关订阅和工具的优惠信息，也整理进来当作收藏。
        </p>
        <p class="text">
          希望它能成为一个提示词、工具、经验、福利的聚合站点，有用、有趣、有价值。
        </p>
      </div>
    </div>
    <!-- 写给访问者 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <span class="tip">写给访问者</span>
        <span class="title2">致你</span>
        <p class="text">
          感谢你来到这个页面。如果你也在学习 AI、探索工具、寻找高效工作方式，欢迎交流。
        </p>
        <p class="text">
          本站持续整理我亲测好用的提示词、工具、技巧、订阅方式，目标是让 AI 更实用、更省钱、更好用。
        </p>
        <p class="text">
          如果你有想法，或者觉得某些内容有价值，欢迎通过 GitHub Issue 与我联系，也欢迎 PR 分享你自己的内容。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStatistics } from "@/api";

const { theme } = useData();

// 技能数据
const skillsData = [
  {
    name: "Python",
    color: "#3776AB",
    icon: "python",
    link: "https://www.python.org/",
  },
  {
    name: "Vue 3",
    color: "#42b883",
    icon: "vue",
    link: "https://vuejs.org/",
  },
  {
    name: "TypeScript",
    color: "#3178c6",
    icon: "typescript",
    link: "https://www.typescriptlang.org/",
  },
  {
    name: "Node.js",
    color: "#026E00",
    icon: "nodejs",
    link: "https://nodejs.org/",
  },
  {
    name: "Vite",
    color: "#646cff",
    icon: "vite",
    link: "https://vitejs.dev/",
  },
  {
    name: "Git",
    color: "#F05032",
    icon: "git",
    link: "https://git-scm.com/",
  },
  {
    name: "Docker",
    color: "#2496f2",
    icon: "docker",
    link: "https://www.docker.com/",
  },
  {
    name: "ChatGPT",
    color: "#4AA181",
    icon: "chatgpt",
    link: "https://chat.openai.com/",
  },
];

// 站点统计数据
const statisticsData = ref(null);

// 获取站点统计数据
const getStatisticsData = async () => {
  const result = await getStatistics(theme.value.tongji["51la"]);
  statisticsData.value = result;
};

onMounted(() => {
  getStatisticsData();
});
</script>

<style lang="scss" scoped>
.about {
  .title {
    font-size: 2.4rem;
    text-align: center;
    border: none;
  }
  .about-content {
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    margin-bottom: 20px;
    .about-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 1.2rem 2rem;
      border-radius: 12px;
      background-color: var(--main-card-background);
      border: 1px solid var(--main-card-border);
      box-shadow: 0 8px 12px -4px var(--main-border-shadow);
      overflow: hidden;
      .tip {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 12px;
      }
      .title1 {
        font-size: 36px;
        font-weight: bold;
        opacity: 0.6;
      }
      .title2 {
        font-size: 36px;
        font-weight: bold;
        margin-right: 4rem;
      }
      .text {
        font-size: 18px;
        margin: 0.6rem 0;
      }
      &.child {
        background-color: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
        gap: 20px;
        .about-item {
          height: 100%;
        }
      }
      &.hello {
        justify-content: center;
        padding: 2rem;
        color: #fff;
        background-image: linear-gradient(120deg, #5b27ff 0%, #00d4ff 100%);
        background-size: 200% 200%;
        animation: gradientFlow 6s ease infinite;
        .title2 {
          line-height: 2;
        }
      }
      &.pursuit {
        .title2 {
          line-height: 1.2;
          &:last-child {
            display: inline-block;
            background-size: 100% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-repeat: no-repeat;
            background-image: linear-gradient(45deg, #fa7671 50%, #f45f7f);
          }
        }
      }
      &.character {
        min-height: 220px;
        cursor: pointer;
        .more {
          margin-top: auto;
          font-size: 14px;
          color: var(--main-color-gray);
          a {
            color: var(--main-color-gray);
            &:hover {
              color: var(--color);
            }
          }
        }
        .male {
          position: absolute;
          top: 20px;
          right: -10px;
          height: 140%;
          width: auto;
          transition: transform 0.5s;
          transform-origin: top center;
          @media (max-width: 768px) {
            height: 80%;
          }
        }
        &:hover {
          .male {
            transform: scale(1.2);
          }
        }
      }
      &.skills {
        .skills-list {
          margin-top: 12px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .skills-item {
            display: flex;
            align-items: center;
            margin-right: 10px;
            margin-top: 10px;
            padding: 8px 12px 8px 8px;
            border-radius: 40px;
            background-color: var(--main-site-background);
            border: 1px solid var(--main-card-border);
            box-shadow: 0 8px 12px -4px var(--main-border-shadow);
            transition: background-color 0.3s;
            cursor: pointer;
            .skills-logo {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              margin-right: 8px;
              border-radius: 50%;
              background-color: var(--color);
              .iconfont {
                color: #fff;
              }
            }
            .skills-name {
              font-weight: bold;
              transition: color 0.3s;
            }
            &:hover {
              background-color: var(--main-card-background);
            }
          }
        }
      }
      &.career {
        .title2 {
          letter-spacing: 0.2rem;
          font-size: 40px;
        }
        .list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          .list-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 12px;
            color: var(--main-font-second-color);
            &::before {
              content: "";
              display: block;
              width: 16px;
              height: 16px;
              background-color: var(--color);
              border-radius: 50%;
              margin-right: 8px;
            }
          }
        }
        .career-img {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
          @media (max-width: 768px) {
            position: static;
          }
        }
      }
      &.game {
        min-height: 300px;
        @media (max-width: 768px) {
          min-height: 240px;
        }
      }
      &.like {
        min-height: 400px;
        @media (max-width: 768px) {
          min-height: 300px;
        }
      }
      &.image {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        .image-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          z-index: 2;
          color: #fff;
          .image-desc {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
            &.opacity {
              font-size: 14px;
              color: #eee;
              opacity: 0.8;
              a {
                color: #eee;
                &:hover {
                  color: var(--main-color);
                }
              }
            }
          }
        }
        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          box-shadow: inset 0 -70px 204px 10px var(--color);
          z-index: 0;
        }
      }
      &.static {
        .static-data {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr 1fr;
          margin: 20px 0;
          .static-item {
            display: flex;
            flex-direction: column;
            .static-name {
              font-size: 15px;
              opacity: 0.8;
            }
            .static-num {
              font-size: 34px;
              font-weight: bold;
            }
          }
        }
      }
      &.map {
        min-height: 170px;
        background-size: 100%;
        transition: background 1.5s ease-in-out;
        cursor: pointer;
        @media (max-width: 768px) {
          background-size: cover;
          pointer-events: none;
        }
        .position {
          display: block;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          padding: 20px 30px;
          color: #fff;
          background-color: #636352;
          font-size: 20px;
          transition: bottom 1s;
        }
        &:hover {
          background-size: 120%;
          background-position-x: 0;
          background-position-y: 36%;
          .position {
            bottom: -80px;
          }
        }
      }
      &.info {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .info-item {
          display: flex;
          flex-direction: column;
          margin-right: 32px;
          .info-name {
            font-size: 14px;
            margin-bottom: 8px;
            color: var(--main-font-second-color);
          }
          .info-num {
            font-size: 34px;
            font-weight: bold;
            color: var(--color);
          }
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
