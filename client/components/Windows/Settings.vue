<template>
	<div id="settings" class="window" role="tabpanel" aria-label="Settings">
		<div class="header">
			<SidebarToggle />
		</div>
		<form ref="settingsForm" class="container" @change="onChange" @submit.prevent>
			<h1 class="title">Settings</h1>

			<div class="row">
				<div class="col-sm-6">
					<label class="opt">
						<input
							:checked="$store.state.settings.advanced"
							type="checkbox"
							name="advanced"
						/>
						Advanced settings
					</label>
				</div>
			</div>

			<div class="row">
				<div v-if="canRegisterProtocol || hasInstallPromptEvent" class="col-sm-12">
					<h2>Native app</h2>
					<button
						v-if="hasInstallPromptEvent"
						type="button"
						class="btn"
						@click.prevent="nativeInstallPrompt"
					>
						Add The Lounge to Home screen
					</button>
					<button
						v-if="canRegisterProtocol"
						type="button"
						class="btn"
						@click.prevent="registerProtocol"
					>
						Open irc:// URLs with The Lounge
					</button>
				</div>

				<div
					v-if="
						!$store.state.serverConfiguration.public && $store.state.settings.advanced
					"
					class="col-sm-12"
				>
					<h2>
						Settings synchronisation
						<span
							class="tooltipped tooltipped-n tooltipped-no-delay"
							aria-label="Note: This is an experimental feature and may change in future releases."
						>
							<button
								class="extra-experimental"
								aria-label="Note: This is an experimental feature and may change in future releases."
							/>
						</span>
					</h2>
					<label class="opt">
						<input
							:checked="$store.state.settings.syncSettings"
							type="checkbox"
							name="syncSettings"
						/>
						Synchronize settings with other clients
					</label>
					<template v-if="!$store.state.settings.syncSettings">
						<div v-if="$store.state.serverHasSettings" class="settings-sync-panel">
							<p>
								<strong>Warning:</strong> Checking this box will override the
								settings of this client with those stored on the server.
							</p>
							<p>
								Use the button below to enable synchronization, and override any
								settings already synced to the server.
							</p>
							<button type="button" class="btn btn-small" @click="onForceSyncClick">
								Sync settings and enable
							</button>
						</div>
						<div v-else class="settings-sync-panel">
							<p>
								<strong>Warning:</strong> No settings have been synced before.
								Enabling this will sync all settings of this client as the base for
								other clients.
							</p>
						</div>
					</template>
				</div>

				<div class="col-sm-12">
					<h2>Messages</h2>
				</div>
				<div class="col-sm-6">
					<label class="opt">
						<input :checked="$store.state.settings.motd" type="checkbox" name="motd" />
						Show <abbr title="Message Of The Day">MOTD</abbr>
					</label>
				</div>
				<div class="col-sm-6">
					<label class="opt">
						<input
							:checked="$store.state.settings.showSeconds"
							type="checkbox"
							name="showSeconds"
						/>
						Show seconds in timestamp
					</label>
				</div>
				<div class="col-sm-12">
					<h2>
						Status messages
						<span
							class="tooltipped tooltipped-n tooltipped-no-delay"
							aria-label="Joins, parts, kicks, nick changes, away changes, and mode changes"
						>
							<button
								class="extra-help"
								aria-label="Joins, parts, kicks, nick changes, away changes, and mode changes"
							/>
						</span>
					</h2>
				</div>
				<div class="col-sm-12">
					<label class="opt">
						<input
							:checked="$store.state.settings.statusMessages === 'shown'"
							type="radio"
							name="statusMessages"
							value="shown"
						/>
						Show all status messages individually
					</label>
					<label class="opt">
						<input
							:checked="$store.state.settings.statusMessages === 'condensed'"
							type="radio"
							name="statusMessages"
							value="condensed"
						/>
						Condense status messages together
					</label>
					<label class="opt">
						<input
							:checked="$store.state.settings.statusMessages === 'hidden'"
							type="radio"
							name="statusMessages"
							value="hidden"
						/>
						Hide all status messages
					</label>
				</div>
				<div class="col-sm-12">
					<h2>Visual Aids</h2>
				</div>
				<div class="col-sm-12">
					<label class="opt">
						<input
							:checked="$store.state.settings.coloredNicks"
							type="checkbox"
							name="coloredNicks"
						/>
						Enable colored nicknames
					</label>
					<label class="opt">
						<input
							:checked="$store.state.settings.autocomplete"
							type="checkbox"
							name="autocomplete"
						/>
						Enable autocomplete
					</label>
				</div>
				<div v-if="$store.state.settings.advanced" class="col-sm-12">
					<label class="opt">
						<label for="nickPostfix" class="sr-only">
							Nick autocomplete postfix (e.g. <code>, </code>)
						</label>
						<input
							id="nickPostfix"
							:value="$store.state.settings.nickPostfix"
							type="text"
							name="nickPostfix"
							class="input"
							placeholder="Nick autocomplete postfix (e.g. ', ')"
						/>
					</label>
				</div>

				<div class="col-sm-12">
					<h2>Theme</h2>
				</div>
				<div class="col-sm-12">
					<label for="theme-select" class="sr-only">Theme</label>
					<select
						id="theme-select"
						:value="$store.state.settings.theme"
						name="theme"
						class="input"
					>
						<option
							v-for="theme in $store.state.serverConfiguration.themes"
							:key="theme.name"
							:value="theme.name"
						>
							{{ theme.displayName }}
						</option>
					</select>
				</div>

				<template v-if="$store.state.settings.prefetch">
					<div class="col-sm-12">
						<h2>Link previews</h2>
					</div>
					<div class="col-sm-6">
						<label class="opt">
							<input
								:checked="$store.state.settings.media"
								type="checkbox"
								name="media"
							/>
							Auto-expand media
						</label>
					</div>
					<div class="col-sm-6">
						<label class="opt">
							<input
								:checked="$store.state.settings.links"
								type="checkbox"
								name="links"
							/>
							Auto-expand websites
						</label>
					</div>
				</template>

				<template v-if="!$store.state.serverConfiguration.public">
					<div class="col-sm-12">
						<h2>Push Notifications</h2>
					</div>
					<div class="col-sm-12">
						<button
							id="pushNotifications"
							type="button"
							class="btn"
							:disabled="
								$store.state.pushNotificationState !== 'supported' &&
									$store.state.pushNotificationState !== 'subscribed'
							"
							@click="onPushButtonClick"
						>
							<template v-if="$store.state.pushNotificationState === 'subscribed'">
								Unsubscribe from push notifications
							</template>
							<template v-else-if="$store.state.pushNotificationState === 'loading'">
								Loading…
							</template>
							<template v-else>
								Subscribe to push notifications
							</template>
						</button>
						<div v-if="$store.state.pushNotificationState === 'nohttps'" class="error">
							<strong>Warning</strong>: Push notifications are only supported over
							HTTPS connections.
						</div>
						<div
							v-if="$store.state.pushNotificationState === 'unsupported'"
							class="error"
						>
							<strong>Warning</strong>:
							<span>Push notifications are not supported by your browser.</span>
						</div>
					</div>
				</template>

				<div class="col-sm-12">
					<h2>Browser Notifications</h2>
				</div>
				<div class="col-sm-12">
					<label class="opt">
						<input
							id="desktopNotifications"
							:checked="$store.state.settings.desktopNotifications"
							type="checkbox"
							name="desktopNotifications"
						/>
						Enable browser notifications<br />
						<div
							v-if="$store.state.desktopNotificationState === 'unsupported'"
							class="error"
						>
							<strong>Warning</strong>: Notifications are not supported by your
							browser.
						</div>
						<div
							v-if="$store.state.desktopNotificationState === 'blocked'"
							id="warnBlockedDesktopNotifications"
							class="error"
						>
							<strong>Warning</strong>: Notifications are blocked by your browser.
						</div>
					</label>
				</div>
				<div class="col-sm-12">
					<label class="opt">
						<input
							:checked="$store.state.settings.notification"
							type="checkbox"
							name="notification"
						/>
						Enable notification sound
					</label>
				</div>
				<div class="col-sm-12">
					<div class="opt">
						<button id="play" @click.prevent="playNotification">Play sound</button>
					</div>
				</div>

				<div v-if="$store.state.settings.advanced" class="col-sm-12">
					<label class="opt">
						<input
							:checked="$store.state.settings.notifyAllMessages"
							type="checkbox"
							name="notifyAllMessages"
						/>
						Enable notification for all messages
					</label>
				</div>

				<div v-if="$store.state.settings.advanced" class="col-sm-12">
					<label class="opt">
						<label for="highlights" class="sr-only">
							Custom highlights (comma-separated keywords)
						</label>
						<input
							id="highlights"
							:value="$store.state.settings.highlights"
							type="text"
							name="highlights"
							class="input"
							placeholder="Custom highlights (comma-separated keywords)"
						/>
					</label>
				</div>

				<div
					v-if="
						!$store.state.serverConfiguration.public &&
							!$store.state.serverConfiguration.ldapEnabled
					"
					id="change-password"
				>
					<div class="col-sm-12">
						<h2>Change password</h2>
					</div>
					<div class="col-sm-12 password-container">
						<label for="old_password_input" class="sr-only">
							Enter current password
						</label>
						<RevealPassword v-slot:default="slotProps">
							<input
								id="old_password_input"
								:type="slotProps.isVisible ? 'text' : 'password'"
								name="old_password"
								class="input"
								placeholder="Enter current password"
							/>
						</RevealPassword>
					</div>
					<div class="col-sm-12 password-container">
						<label for="new_password_input" class="sr-only">
							Enter desired new password
						</label>
						<RevealPassword v-slot:default="slotProps">
							<input
								id="new_password_input"
								:type="slotProps.isVisible ? 'text' : 'password'"
								name="new_password"
								class="input"
								placeholder="Enter desired new password"
							/>
						</RevealPassword>
					</div>
					<div class="col-sm-12 password-container">
						<label for="verify_password_input" class="sr-only">
							Repeat new password
						</label>
						<RevealPassword v-slot:default="slotProps">
							<input
								id="verify_password_input"
								:type="slotProps.isVisible ? 'text' : 'password'"
								name="verify_password"
								class="input"
								placeholder="Repeat new password"
							/>
						</RevealPassword>
					</div>
					<div
						v-if="passwordChangeStatus && passwordChangeStatus.success"
						class="col-sm-12 feedback success"
					>
						Successfully updated your password
					</div>
					<div
						v-else-if="passwordChangeStatus && passwordChangeStatus.error"
						class="col-sm-12 feedback error"
					>
						{{ passwordErrors[passwordChangeStatus.error] }}
					</div>
					<div class="col-sm-12">
						<button type="submit" class="btn" @click.prevent="changePassword">
							Change password
						</button>
					</div>
				</div>

				<div v-if="$store.state.settings.advanced" class="col-sm-12">
					<h2>Custom Stylesheet</h2>
				</div>
				<div v-if="$store.state.settings.advanced" class="col-sm-12">
					<label for="user-specified-css-input" class="sr-only">
						Custom stylesheet. You can override any style with CSS here.
					</label>
					<textarea
						id="user-specified-css-input"
						:value="$store.state.settings.userStyles"
						class="input"
						name="userStyles"
						placeholder="/* You can override any style with CSS here */"
					/>
				</div>
			</div>

			<div v-if="!$store.state.serverConfiguration.public" class="session-list">
				<h2>Sessions</h2>

				<h3>Current session</h3>
				<div v-if="$store.getters.currentSession" id="session-current">
					<Session :session="$store.getters.currentSession" />
				</div>

				<h3>Other sessions</h3>
				<div id="session-list">
					<p v-if="$store.state.sessions.length == 0">Loading…</p>
					<p v-else-if="$store.getters.otherSessions.length == 0">
						<em>You are not currently logged in to any other device.</em>
					</p>
					<template v-else>
						<Session
							v-for="session in $store.getters.otherSessions"
							:key="session.token"
							:session="session"
						/>
					</template>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import socket from "../../js/socket";
import webpush from "../../js/webpush";
import RevealPassword from "../RevealPassword.vue";
import Session from "../Session.vue";
import SidebarToggle from "../SidebarToggle.vue";

let installPromptEvent = null;

window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	installPromptEvent = e;
});

export default {
	name: "Settings",
	components: {
		RevealPassword,
		Session,
		SidebarToggle,
	},
	data() {
		return {
			canRegisterProtocol: false,
			passwordChangeStatus: null,
			passwordErrors: {
				missing_fields: "Please enter a new password",
				password_mismatch: "Both new password fields must match",
				password_incorrect:
					"The current password field does not match your account password",
				update_failed: "Failed to update your password",
			},
		};
	},
	computed: {
		hasInstallPromptEvent() {
			// TODO: This doesn't hide the button after clicking
			return installPromptEvent !== null;
		},
	},
	mounted() {
		socket.emit("sessions:get");

		// Enable protocol handler registration if supported
		if (window.navigator.registerProtocolHandler) {
			this.canRegisterProtocol = true;
		}
	},
	methods: {
		onChange(event) {
			const ignore = ["old_password", "new_password", "verify_password"];

			const name = event.target.name;

			if (ignore.includes(name)) {
				return;
			}

			let value;

			if (event.target.type === "checkbox") {
				value = event.target.checked;
			} else {
				value = event.target.value;
			}

			this.$store.dispatch("settings/update", {name, value, sync: true});
		},
		changePassword() {
			const allFields = new FormData(this.$refs.settingsForm);
			const data = {
				old_password: allFields.get("old_password"),
				new_password: allFields.get("new_password"),
				verify_password: allFields.get("verify_password"),
			};

			if (!data.old_password || !data.new_password || !data.verify_password) {
				this.passwordChangeStatus = {
					success: false,
					error: "missing_fields",
				};
				return;
			}

			if (data.new_password !== data.verify_password) {
				this.passwordChangeStatus = {
					success: false,
					error: "password_mismatch",
				};
				return;
			}

			socket.once("change-password", (response) => {
				this.passwordChangeStatus = response;
			});

			socket.emit("change-password", data);
		},
		onForceSyncClick() {
			this.$store.dispatch("settings/syncAll", true);
			this.$store.dispatch("settings/update", {
				name: "syncSettings",
				value: true,
				sync: true,
			});
		},
		registerProtocol() {
			const uri = document.location.origin + document.location.pathname + "?uri=%s";

			window.navigator.registerProtocolHandler("irc", uri, "The Lounge");
			window.navigator.registerProtocolHandler("ircs", uri, "The Lounge");
		},
		nativeInstallPrompt() {
			installPromptEvent.prompt();
			installPromptEvent = null;
		},
		playNotification() {
			const pop = new Audio();
			pop.src = "audio/pop.wav";
			pop.play();
		},
		onPushButtonClick() {
			webpush.togglePushSubscription();
		},
	},
};
</script>
