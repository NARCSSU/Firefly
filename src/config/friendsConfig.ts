import type { FriendLink, FriendsPageConfig } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链页面配置
export const friendsPageConfig: FriendsPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 是否显示底部自定义内容（friends.mdx 中的内容）
	showCustomContent: true,

	// 是否开启随机排序配置，如果开启，就会忽略权重，构建时进行一次随机排序
	randomizeSort: false,
};

// 友链配置
export const friendsConfig: FriendLink[] = [
	{
		title: "NaT_Jerry",
		imgurl: "https://q1.qlogo.cn/g?b=qq&nk=1638465997&s=640",
		desc: "请给我钱",
		siteurl: "https://github.com/NatJerry",
		tags: ["Github"],
		weight: 10, // 权重，数字越大排序越靠前
		enabled: true, // 是否启用
	},
	{
		title: "Firefly Docs",
		imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
		desc: "Firefly主题模板文档",
		siteurl: "https://docs-firefly.cuteleaf.cn",
		tags: ["Docs"],
		weight: 9,
		enabled: false,
	},
	{
		title: "Astro",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "The web framework for content-driven websites. ⭐️ Star to support our work!",
		siteurl: "https://github.com/withastro/astro",
		tags: ["Framework"],
		weight: 8,
		enabled: false,
	},
	{
		title: "LuminolMC",
		imgurl: "https://avatars.githubusercontent.com/u/152063829??v=4&s=640",
		desc: "Lighten everything with passion",
		siteurl: "https://github.com/LuminolMC",
		tags: ["Framework"],
		weight: 7,
		enabled: true,
	},
	{
		title: "LuminolCraft",
		imgurl: "https://imagehosting-ez2.pages.dev/images/4483d29a-1797-4817-a73d-2f44ed464a2e.webp",
		desc: "LuminolCraft, a Minecraft Server built collaboratively with passionate administrators and players.",
		siteurl: "https://github.com/LuminolCraft",
		tags: ["Server"],
		weight: 6,
		enabled: true,
	},
];

// 获取启用的友链并进行排序
export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return friends.sort(() => Math.random() - 0.5);
	}

	return friends.sort((a, b) => b.weight - a.weight);
};
