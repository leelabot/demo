<script>
    import { onMount, onDestroy } from "svelte";
    import { router, meta } from "tinro";
    import { loadChat } from "./loadChat.js";

    $: route = meta();
    let chatScriptElement = null;
    let chatError = false;
    let imageError = false;

    onMount(async () => {
        console.log("mounting chat");
        if (route.params.domainId) {
            try {
                chatScriptElement = await loadChat(route.params.domainId);
                console.log(route.params.domainId);

                // Check if chat loading failed
                if (!chatScriptElement) {
                    chatError = true;
                }
            } catch (error) {
                console.error("Chat loading failed:", error);
                chatError = true;
            }
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

    function handleImageError() {
        imageError = true;
    }
</script>

<main
    class="min-vh-100 d-flex flex-column justify-content-center align-items-center"
>
    {#if chatError}
        <div class="error-message text-center mb-4">
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error Loading Chat</h4>
                <p>
                    Unable to load the chat for domain: {route.params.domainId}
                </p>
                <hr />
                <p class="mb-0">
                    Please check the domain name and try again later.
                </p>
                <div class="mt-3">
                    <a
                        href="/?domainId={route.params.domainId}"
                        class="btn btn-outline-danger">Try Again</a
                    >
                </div>
            </div>
        </div>
    {/if}

    {#if !imageError}
        <img
            src="https://cube.leelabot.net/mirrors/{route.params
                .domainId}/screenshot.jpeg"
            on:error={handleImageError}
            alt="Screenshot for {route.params.domainId}"
            class="p-4"
        />
    {/if}
</main>

<style>
    img {
        width: 100vw;
        max-width: 1000px;
    }
</style>
