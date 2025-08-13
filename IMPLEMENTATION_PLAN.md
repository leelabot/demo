# Implementation Plan: Chatbot Demo Site

## 1. Objective
Create a Svelte-based demo page where a user can enter their domain, click a "Load" button, and have the corresponding Leelabot chatbot script dynamically loaded and executed on the page.

## 2. Core Logic
*   The user enters a domain (e.g., `thepolitedog.com`) into an input field.
*   On clicking "Load":
    1.  The domain is sanitized by replacing `.` with `_` to be used as the `id` parameter (e.g., `thepolitedog_com`).
    2.  The script URL is constructed: `https://dev.leelabot.net/embed.js?id={sanitizedDomain}&theme=light`.
    3.  A new `<script>` element is created programmatically.
    4.  The `src` attribute of the script element is set to the constructed URL.
    5.  The script element is appended to the document `<head>`, triggering its download and execution.
    6.  The UI is updated to hide the input form and indicate that the chatbot is loading/loaded.
*   The external Leelabot script will then render the chatbot interface onto the page.

## 3. Files to be Modified

### `src/app.css`
*   **Purpose:** To provide basic styling for the demo page.
*   **Actions:**
    *   Add styles to center the main content vertically and horizontally.
    *   Style the input field and the "Load" button for better user experience.
    *   Add a container for the chatbot, if necessary, or ensure the body can accommodate it.

### `src/App.svelte`
*   **Purpose:** The main component for the demo application.
*   **Actions:**
    *   **`<script>` section:**
        *   Define reactive variables:
            *   `domain`: `string` (initially empty) to store user input.
            *   `isLoaded`: `boolean` (initially `false`) to track chatbot load status.
        *   Implement `handleLoad()` function:
            *   Validate `domain` is not empty.
            *   Sanitize `domain`: `const sanitizedDomain = domain.replace(/\./g, '_');`
            *   Construct `scriptUrl`: `` const scriptUrl = `https://dev.leelabot.net/embed.js?id=${sanitizedDomain}&theme=light`; ``
            *   Create script element: `const script = document.createElement('script');`
            *   Set attributes: `script.src = scriptUrl; script.async = true;`
            *   Append to head: `document.head.appendChild(script);`
            *   Update state: `isLoaded = true;`
    *   **`<main>` HTML section:**
        *   Conditionally render the input form:
            ```svelte
            {#if !isLoaded}
                <div class="container">
                    <input type="text" bind:value={domain} placeholder="Enter your domain (e.g., yourdomain.com)" />
                    <button on:click={handleLoad}>Load Chatbot</button>
                </div>
            {:else}
                <div class="container">
                    <p>Chatbot loaded for domain: {domain}</p>
                    <!-- The Leelabot script should render the chatbot here or attach to the body -->
                </div>
            {/if}
            ```
        *   The Leelabot script is expected to inject its own UI, so we might not need a specific container for it unless its documentation specifies one. For now, we'll just show a confirmation message.

## 4. Testing Procedure
1.  Start the development server: `npm run dev`.
2.  Open the application in a web browser (usually `http://localhost:5173` or similar).
3.  Verify the initial state: An input field and a "Load Chatbot" button should be visible.
4.  Enter a domain name (e.g., `thepolitedog.com`) into the input field.
5.  Click the "Load Chatbot" button.
6.  **Expected Behavior:**
    *   The input form should disappear.
    *   The message "Chatbot loaded for domain: thepolitedog.com" should appear.
    *   Using browser developer tools (Network tab), verify that a request is made to `https://dev.leelabot.net/embed.js?id=thepolitedog_com&theme=light`.
    *   The Leelabot chatbot interface should become visible on the page.
7.  **Edge Case:** Test with an empty input. The "Load" button should either be disabled or the `handleLoad` function should prevent script injection.

## 5. Considerations & Future Enhancements
*   **Error Handling:** Implement error handling for script loading failures (e.g., using `script.onerror`).
*   **Loading Indicator:** Show a loading spinner or message after clicking "Load" and before the chatbot fully renders.
*   **Reset Functionality:** Add a "Reset" or "Load Different Domain" button to remove the injected script and show the input form again. This would involve `document.head.removeChild(script)` and resetting `isLoaded`.
*   **Theme Selection:** Allow the user to choose between 'light' and 'dark' themes for the chatbot.
*   **Tinro Router:** If the demo site expands to include multiple pages (e.g., documentation, examples), integrate Tinro for routing.
