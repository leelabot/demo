


export async function loadChat(domain) {
    const apiUrl = `https://dashboard.leelabot.net/api/domain/${domain}`;
    let siteId;

    try {
        // First, fetch the siteId from the API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        siteId = data.siteId;

        if (!siteId) {
            throw new Error("siteId not found in API response.");
        }

        // Only create and embed the script if we have a valid siteId
        const scriptUrl = `https://dashboard.leelabot.net/embed.js?id=${siteId}&theme=light`;
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;

        // Return a promise that resolves when script loads or rejects when it fails
        return new Promise((resolve, reject) => {
            script.onload = () => {
                console.log("Chat script loaded successfully.");
                document.head.appendChild(script);
                resolve(script);
            };

            script.onerror = () => {
                console.error("Failed to load the chatbot script.");
                console.log("Failed to load the chatbot. Please check the domain and try again.");
                // Don't embed the script if it fails to load
                reject(new Error("Failed to load chatbot script"));
            };

            // Start loading the script
            script.src = scriptUrl;
        });

    } catch (error) {
        console.error("Failed to fetch siteId or load chat:", error);
        console.log(`Failed to initialize chat: ${error.message}. Please check the domain and try again.`);
        // Don't embed the script if there's an error - just return null
        return null;
    }
}
