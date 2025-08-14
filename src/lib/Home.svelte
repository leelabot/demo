<script>
    let domain = "";
    import { router } from "tinro";

    // Check for domainId query parameter on component mount only
    import { onMount } from "svelte";

    // Flag to prevent multiple rapid submissions
    let isSubmitting = false;

    onMount(() => {
        // Get query parameters from URL on mount
        const urlParams = new URLSearchParams(window.location.search);
        const domainId = urlParams.get("domainId");

        if (domainId) {
            // Convert underscores back to dots for display
            domain = domainId.replace(/_/g, ".");
        }
    });

    async function handleLoad() {
        if (isSubmitting) {
            return; // Prevent multiple submissions
        }

        if (!domain || !domain.trim()) {
            alert("Please enter a domain.");
            return;
        }

        isSubmitting = true;

        try {
            let processedDomain = domain
                .trim()
                .toLowerCase()
                .replace(/^https?:\/\//, "") // Remove http:// or https://
                .replace(/^www\./, "") // Remove www.
                .replace(/\/$/, ""); // Remove trailing slash if any
            const sanitizedDomain = processedDomain.replace(/\./g, "_");
            await router.goto(`/site/${sanitizedDomain}`);
        } catch (error) {
            console.error("Navigation error:", error);
        } finally {
            // Reset submission flag after a short delay
            setTimeout(() => {
                isSubmitting = false;
            }, 100);
        }
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            handleLoad();
        }
    }
</script>

<div class="text-center">
    <form on:submit|preventDefault={handleLoad}>
        <input
            type="text"
            bind:value={domain}
            placeholder="www.yoursite.com"
            on:keypress={handleKeyPress}
            class="form-control"
        />
        <button type="submit" class="btn btn-primary mt-3">
            Load Chatbot
        </button>
    </form>
</div>

<style>
    form {
        max-width: 400px;
        margin: 0 auto;
    }

    input {
        margin-bottom: 1rem;
    }
</style>
