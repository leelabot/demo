<script>
    import { Route, router } from "tinro";
    import Home from "./lib/Home.svelte";
    import Site from "./lib/Site.svelte";

    // Log the domainId whenever the route changes and it's available using the router store
</script>

<main class=" min-vh-100 d-flex justify-content-center align-items-center">
    <!-- Route for the home page (domain input) -->
    <Route let path="/">
        <Home />
    </Route>

    <!-- Route for the site-specific chatbot page -->
    <Route let:meta path="/site/:domainId">
        <Site />
    </Route>
</main>
