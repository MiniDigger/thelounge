<template>
	<span class="content">
		<Username :user="message.from" :quit="quit" />
		<i class="hostmask"> ({{ message.hostmask }})</i>
		has joined the channel
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeJoin",
	components: {
		Username,
	},
	props: {
		network: Object,
		message: Object,
		quit: Boolean,
	},
};
</script>
