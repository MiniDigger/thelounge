import socket from "./socket";

const defaultSettingConfig = {
	apply() {},
	default: null,
	sync: null,
};

export const config = normalizeConfig({
	syncSettings: {
		default: true,
		sync: "never",
		apply(store, value) {
			if (value) {
				socket.emit("setting:get");
			}
		},
	},
	advanced: {
		default: false,
	},
	autocomplete: {
		default: true,
	},
	nickPostfix: {
		default: "",
	},
	coloredNicks: {
		default: true,
	},
	desktopNotifications: {
		default: false,
		apply(store, value) {
			store.commit("refreshDesktopNotificationState", null, {root: true});

			if ("Notification" in window && value && Notification.permission !== "granted") {
				Notification.requestPermission(() =>
					store.commit("refreshDesktopNotificationState", null, {root: true})
				);
			}
		},
	},
	highlights: {
		default: "",
		sync: "always",
	},
	links: {
		default: true,
	},
	motd: {
		default: true,
	},
	notification: {
		default: true,
	},
	notifyAllMessages: {
		default: false,
	},
	showSeconds: {
		default: false,
	},
	statusMessages: {
		default: "condensed",
	},
	theme: {
		default: document.getElementById("theme").dataset.serverTheme,
		apply(store, value) {
			const themeEl = document.getElementById("theme");
			const themeUrl = `themes/${value}.css`;

			if (themeEl.attributes.href.value === themeUrl) {
				return;
			}

			themeEl.attributes.href.value = themeUrl;
			const newTheme = store.state.serverConfiguration.themes.filter(
				(theme) => theme.name === value
			)[0];
			const themeColor =
				newTheme.themeColor || document.querySelector('meta[name="theme-color"]').content;
			document.querySelector('meta[name="theme-color"]').content = themeColor;
		},
	},
	media: {
		default: true,
	},
	userStyles: {
		default: "",
		apply(store, value) {
			if (!/[?&]nocss/.test(window.location.search)) {
				document.getElementById("user-specified-css").innerHTML = value;
			}
		},
	},
});

export function createState() {
	const state = {};

	for (const settingName in config) {
		state[settingName] = config[settingName].default;
	}

	return state;
}

function normalizeConfig(obj) {
	const newConfig = {};

	for (const settingName in obj) {
		newConfig[settingName] = {...defaultSettingConfig, ...obj[settingName]};
	}

	return newConfig;
}
