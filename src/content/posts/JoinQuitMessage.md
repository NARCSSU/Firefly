---
title: JoinQuitMessage
published: 2025-12-24
description: '一个轻量级的 PaperSpigot 插件，使用 Adventure MiniMessage 实现玩家加入与退出服务器时的自定义消息。'
image: ''
tags: ['Java', 'Minecraft', 'Plugin', 'Server']
category: 'Java Projects'
draft: false 
lang: 'zh_CN'
---
# Minecraft 服务器玩家加入/退出消息系统
这是一个用于 Minecraft 服务器的插件，可以自定义玩家加入和退出时显示的消息格式，让服务器更具个性化和专
业感。
## 项目地址
::github{repo="NaturalCodeClub/JoinQuitMessage"}
**Acknowledgements!** </br> [NatJerry](https://github.com/NatJerry)
没有这位爷就没有这个项目🙏🙏🙏
* * *

## 项目概述
这个插件通过监听 Minecraft 服务器的玩家事件，实现了对玩家加入和退出消息的完全自定义控制。
> ### 核心功能
> * 自定义玩家加入消息格式
> * 自定义玩家退出消息格式
> * 支持消息颜色代码
> * 可配置的消息内容
> * 热加载配置文件
### 项目结构
```
JoinQuitMessage/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── naturalcodeclub/
│       │           └── joinquitmessage/
│       │               ├── ConfigManager.java     # 配置管理器
│       │               └── JoinQuitMessage.java   # 插件主类
│       │               └── PlayerJoin.java        # 玩家加入事件监听器
│       │               └── PlayerQuit.java        # 玩家退出事件监听器
│       └── resources/
│           └── plugin.yml                            # 插件配置文件
└── pom.xml                                          # Maven 依赖管理
```
## 部分文件及核心代码
### ConfigManager.java
```java
public class ConfigManager {
    private static final File configFile = new File(JoinQuitMessage.instance.getDataFolder(), "config.yml");
    private static List<String> defaultJoinMessage = List.of("<yellow>{player} 加入了游戏");
    private static List<String> defaultQuitMessage = List.of("<yellow>{player} 退出了游戏");

    public static List<String> joinMessage;
    public static List<String> quitMessage;

    // 初始化配置文件（不存在则创建 + 写入默认值）
    public static void initConfig() {
        if (!configFile.exists()) {
            configFile.getParentFile().mkdirs();
            try { configFile.createNewFile(); } catch (IOException e) { /* log */ }
        }
        FileConfiguration config = YamlConfiguration.loadConfiguration(configFile);
        if (config.get("join-message") == null) config.set("join-message", defaultJoinMessage);
        if (config.get("quit-message") == null) config.set("quit-message", defaultQuitMessage);
        try { config.save(configFile); } catch (IOException e) { /* log */ }
    }

    // 从 config.yml 加载消息到内存
    public static void loadConfig() {
        FileConfiguration config = YamlConfiguration.loadConfiguration(configFile);
        joinMessage = config.getStringList("join-message").isEmpty() ? defaultJoinMessage : config.getStringList("join-message");
        quitMessage = config.getStringList("quit-message").isEmpty() ? defaultQuitMessage : config.getStringList("quit-message");
    }

    // 重载配置（先初始化，再加载）
    public static void reloadConfig() {
        initConfig();
        loadConfig();
    }
}
```
> #### 核心功能：
> * 自动生成`config.yml`并设置默认值；
> * 将配置中的`join-message` / `quit-message` 读入 `joinMessage` 和 `quitMessage` 静态列表；
> * 支持运行时重载（通过指令 `/jqm reload` 调用 `reloadConfig`）
### JoinQuitMessage.java
```java
public final class JoinQuitMessage extends JavaPlugin implements Listener {
    public static JavaPlugin instance;

    @Override
    public void onEnable() {
        instance = this;
        Bukkit.getPluginManager().registerEvents(new PlayerJoin(), this);
        Bukkit.getPluginManager().registerEvents(new PlayerQuit(), this);
        ConfigManager.initConfig();
        ConfigManager.loadConfig();

        if (!Bukkit.getPluginManager().isPluginEnabled("PlaceholderAPI")) {
            getLogger().warning("PlaceHolderAPI is needed for further features.");
        }
        getLogger().info("JoinQuitMessage插件已成功启用！");
    }

    // 指令：/joinquitmessage → 重载配置
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (sender.hasPermission("joinquitmessage.admin")) {
            ConfigManager.reloadConfig();
            sender.sendMessage("JoinQuitMessage配置文件已成功重新加载！");
            return true;
        }
        return false;
    }
}
```
> #### 核心功能：
> * 插件启用时注册事件并加载配置；
> * 支持通过指令重载配置（需权限`joinquitmessage.admin`）；
> * 可选依赖 PlaceholderAPI（用于高级占位符如`{player_name}`）
### PlayerJoin.java

```java
public class PlayerJoin implements Listener {

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        event.setJoinMessage(null); // 隐藏原版加入消息

        // 从配置的 join-message 列表中随机选一条
        String rawMessage = ConfigManager.joinMessage.get(
            ThreadLocalRandom.current().nextInt(ConfigManager.joinMessage.size())
        );

        // 替换 PlaceholderAPI 占位符（如 %player_world%）
        rawMessage = PlaceholderAPI.setPlaceholders(event.getPlayer(), rawMessage);

        // 替换 {player} 为玩家名，并解析 MiniMessage
        Component message = MiniMessage.miniMessage().deserialize(
            rawMessage.replace("{player}", event.getPlayer().getName())
        );

        // 广播（Paper/Adventure API）
        Bukkit.broadcast(message);
    }
}
```
> #### 核心功能：
> * 支持多条欢迎语句，**随机发送**；
> * 使用 **MiniMessage** 实现富文本（颜色、加粗、渐变等）；
> * 集成 **PlaceholderAPI**，可使用 `%xxx%` 占位符；
> * 完全隐藏原版加入提示，由插件统一控制。
### PlayerQuit.java


```java
public class PlayerQuit implements Listener {

    @EventHandler
    public void onPlayerQuitEvent(PlayerQuitEvent event) {
        event.quitMessage(null); // 显式关闭原版退出消息（实际无效果，但保持一致性）

        // 随机选取一条退出消息
        String rawMessage = ConfigManager.quitMessage.get(
            ThreadLocalRandom.current().nextInt(ConfigManager.quitMessage.size())
        );

        // 替换 PlaceholderAPI 占位符
        rawMessage = PlaceholderAPI.setPlaceholders(event.getPlayer(), rawMessage);

        // 替换 {player} 并解析 MiniMessage
        Component message = MiniMessage.miniMessage().deserialize(
            rawMessage.replace("{player}", event.getPlayer().getName())
        );

        // 全局广播（Paper + Adventure）
        Bukkit.broadcast(message);
    }
}
```
> ##### 核心功能：
> * 支持多条欢迎语句，**随机发送**；
> * 使用 **MiniMessage** 实现富文本（颜色、加粗、渐变等）；
> * 集成 **PlaceholderAPI**，支持动态占位符；
> * 与 `PlayerJoin` 逻辑对称