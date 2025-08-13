<script>
    let domain = "bluedogsf.com";
    import { router } from "tinro";

    function handleLoad() {
        if (!domain) {
            alert("Please enter a domain.");
            return;
        }

        const sanitizedDomain = domain.replace(/\./g, "_");
        router.goto(`/site/${sanitizedDomain}`);
    }
</script>

<div class="text-center">
    <input type="text" bind:value={domain} placeholder="www.example.com" />
    <button on:click={handleLoad}> Load Chatbot </button>
</div>
