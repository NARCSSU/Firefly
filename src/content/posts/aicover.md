---
title: 初次体验AI翻唱
published: 2025-12-14
pinned: false
description: 记录第一次使用语音模型实现AI翻唱的全过程，从工具准备到最终合成的完整步骤
image: api
tags: [AI, Audio Processing]
category: Technical Practice
draft: false 
lang: 'zh_CN'

---

## 缘起

最初接触AI翻唱，源于在B站刷到的一则教程视频——[《【DDSP教程】教你做出千万播放的AI翻唱》](https://www.bilibili.com/video/BV1JU2LBZEt5/?spm_id_from=333.1007.top_right_bar_window_default_collection.content.click&vd_source=2a0031c6ffa66f0f8899bf2cee7e7cc0)。视频中提到的两个核心工具引起了我的兴趣：

两款工具均由 [@领航员未鸟](https://space.bilibili.com/2403955) 开发

- **[MSST-GUI](https://github.com/AliceNavigator/Music-Source-Separation-Training-GUI)**：基于Qt5的图形界面，主打便捷的人声与伴奏分离功能。

- **[DDSP](https://github.com/yxlllc/DDSP-SVC)**：开源的语音转换工具，可将输入的人声转换为目标声线。

简单来说，AI翻唱的核心逻辑并不复杂：先从原曲中分离出人声（干声）和伴奏（背景音），再通过语音模型将原干声转换为目标AI声线，最后将转换后的AI人声与伴奏混音，即可得到完整的翻唱作品。

## MSST-官方教程
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV197njzqExb&p=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## DDSP-官方教程
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1U39bYiEjk&p=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 具体实现步骤

### 一、工具准备

在开始前，需要提前安装并配置好以下工具：

1. **MSST-GUI**  
   从[GitHub仓库](https://github.com/AliceNavigator/Music-Source-Separation-Training-GUI)下载解压完成

2. **DDSP一键包**  

    从[GitHub仓库](https://github.com/yxlllc/DDSP-SVC)下载解压完成


:::tip
下载好后建议用专业的解压工具进行解压如：[7zip](https://www.7-zip.org/)
:::

| Core document     | Description                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `archive/`       | 归档后里有最主要的干声和背景音乐                                                                                                                                                                                      |
| `input/`   | 放要分离的歌曲                                                                                                                                                                           |
| `MSST_GUI_v1.4_zh.exe` | 主程序                                                                              |


1. **DDSP 6.2整合包** 
   下载整合包后，解压至本地目录。该工具已集成基础依赖，无需额外配置环境，但需提前准备目标声线的模型文件（.pth格式，可从社区分享或自行训练获取）。

2. **音频编辑软件**  
   用于最终混音，这里以Adobe Audition为例（也可使用Audacity等免费工具）。



### 二、分离人声与伴奏（基于MSST-GUI）

这一步的目标是从原曲中提取纯净的人声和伴奏，操作流程如下：

1. **导入原曲**  
   打开MSST-GUI，点击「文件小图标」按钮，选择需要处理的原曲文件（支持acc、wav等常见格式）。

2. **选择模型与配置**  
    [@领航员未鸟](https://space.bilibili.com/2403955) 介绍过每一个模型可以按需选择，如果什么都不懂默认选择第一个就好了
  ，`其他模块`可以不选择
   


3. **执行分离**  
   点击「开始处理」按钮，软件会自动运行分离算法。处理过程中，界面会显示进度条和实时日志（如“分离进度：30%”）。处理完成后，会在指定输出目录生成两个文件：
   - `vocals.wav`：提取出的人声（干声）
   - `instrumental.wav`：分离出的伴奏



### 三、AI声线转换（基于DDSP 6.2）

使用DDSP将分离出的人声转换为目标声线，步骤如下：

1. **导入干声**  
   打开解压过后的DDSP一键包，打开 [`raw/`] 文件夹放入从`MSST-GUI`里提取的干声
:::tip
建议将干声文件改个简单的名字，方便后续操作
:::
2. **加载模型**  
   [`epx`]文件夹就是推理模型，`exp\reflow-test\`里有模型`步数` <br> 例如：`model_30000.pt` 30000就是的模型步数

3. **开始推理**  
    返回到DDSP根目录双击`3.推理.bat`开始推理

4. **调整转换参数**  
   基础参数建议：
   - 音调偏移：根据原曲调性与目标声线特点调整
   - 推理步数：按照`exp\reflow-test\`里的模型步数选择，步数越多结果越细腻，但耗时更长
   - 降噪强度：若原干声有杂音，可适当提高（建议0.3-0.5）

:::tip
女生音高普遍是比男生高的，女生音高建议12
:::


### 四、混音合成（基于Adobe Audition）

将AI人声与伴奏合并，得到最终作品：

1. **导入素材**  
   打开Audition，新建多轨项目（快捷键Ctrl+N），将`ai_vocals.wav`（AI人声）和`instrumental.wav`（伴奏）分别拖入不同轨道（通常人声放轨道1，伴奏放轨道2）。


2. **对齐与平衡**  
   - 时间对齐：确保AI人声与伴奏的节奏同步。可通过放大波形（滚轮向上），目视对齐人声与伴奏的强拍位置；或右键点击人声轨道，选择「自动对齐」→「与轨道2对齐」。
   - 音量平衡：双击轨道旁的音量滑块，调整人声轨道音量（建议比伴奏低3-5dB，可通过「播放」按钮实时监听效果）。


3. **基础优化**  
   - 降噪处理：选中AI人声轨道，点击顶部菜单「效果」→「降噪/恢复」→「降噪器（处理）」，点击「捕捉噪声样本」后应用（适用于轻微杂音）。
   - 混响添加：点击「效果」→「混响」→「完全混响」。
   :spoiler[说点有点麻烦了如果你是默认工作区，可直接找到效果组窗口点击'>'这样的三角'添加'完全混响'、'FFT滤波器'、'人声增强器'即可，还可以保存为预设方便下次使用]


4. **导出成品**  
   选择「多轨混音」→「导出为」，格式选择mp3（比特率320kbps）或wav，设置保存路径后点击「导出」。


## 小结

这是我第一次玩ai翻唱，整个流程的技术门槛并不高，核心在于工具的熟练使用和参数的反复调试。

