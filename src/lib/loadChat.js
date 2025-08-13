


export async function loadChat(domain) {


    const apiUrl = `https://dev.leelabot.net/api/domain/${domain}`;
    let siteId;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();


        siteId = data.siteId;

        if (!siteId) {
            throw new Error("siteId not found in API response.");
        }

        const scriptUrl = `https://dev.leelabot.net/embed.js?id=${siteId}&theme=light`;
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;

        script.onerror = () => {
            console.error("Failed to load the chatbot script.");
            console.log("Failed to load the chatbot. Please check the domain and try again.");
        };

        document.head.appendChild(script);
        console.log("Chat script loaded successfully.");

    } catch (error) {
        console.error("Failed to fetch siteId or load chat:", error);
        console.log(`Failed to initialize chat: ${error.message}. Please check the domain and try again.`);
    }
}
