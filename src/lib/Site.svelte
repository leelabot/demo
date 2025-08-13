<script>
    import { onMount } from "svelte";
    import { router, meta } from "tinro";
    import { loadChat } from "./loadChat.js";

    $: route = meta();

    onMount(() => {
        console.log("mounting chat");
        if (route.params.domainId) {
            loadChat(route.params.domainId);
            console.log(route.params.domainId);
        }
    });
</script>

<main class=" min-vh-100 d-flex justify-content-center align-items-center">
    <img
        src="https://cube.leelabot.net/mirrors/{route.params
            .domainId}/screenshot.png"
    />
</main>
