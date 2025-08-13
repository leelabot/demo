<script>
    import { onMount, onDestroy } from "svelte";
    import { router, meta } from "tinro";
    import { loadChat } from "./loadChat.js";

    $: route = meta();
    let chatScriptElement = null;

    onMount(async () => {
        console.log("mounting chat");
        if (route.params.domainId) {
            chatScriptElement = await loadChat(route.params.domainId);
            console.log(route.params.domainId);
        }
    });

    onDestroy(() => {
        console.log("Destroying Site component, cleaning up chat...");

        if (chatScriptElement && chatScriptElement.parentNode) {
            chatScriptElement.parentNode.removeChild(chatScriptElement);
            console.log("Chat script removed from head.");
        }

        const chatWidgetContainer = document.getElementById(
            "chat-widget-container",
        );
        if (chatWidgetContainer) {
            chatWidgetContainer.remove();
            console.log(
                "Chat widget container (#chat-widget-container) removed from DOM.",
            );
        } else {
            console.log(
                "Chat widget container (#chat-widget-container) not found in DOM.",
            );
        }
    });
</script>

<main class=" min-vh-100 d-flex justify-content-center align-items-center">
    <img
        src="https://cube.leelabot.net/mirrors/{route.params
            .domainId}/screenshot.png"
    />
</main>

<style>
    img {
        width: 100vw;
        max-width: 1000px;
    }
</style>
