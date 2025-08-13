# Tinro Router

Highly declarative, tiny, dependency-free router for Svelte applications.

## Installation

```bash
npm i -D tinro
```

## Basic Usage

```svelte
<script>
import {Route} from 'tinro';
</script>

<!-- Navigation -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<!-- Routes -->
<Route path="/">Home page content</Route>
<Route path="/about">About page content</Route>
<Route path="/contact">Contact page content</Route>
```

## Route Types

### Exact Routes
Show content only when path matches exactly:
```svelte
<Route path="/">Home</Route>
<Route path="/about">About</Route>
```

### Non-Exact Routes
Show content when URL starts with path (allows nesting):
```svelte
<Route path="/products/*">
  <Route path="/">Product list</Route>
  <Route path="/electronics">Electronics</Route>
  <Route path="/books">Books</Route>
</Route>
```

## Route Parameters

```svelte
<Route path="/user/:id" let:meta>
  User ID: {meta.params.id}
</Route>

<Route path="/blog/:category/:slug" let:meta>
  Category: {meta.params.category}
  Post: {meta.params.slug}
</Route>
```

## Navigation

### Links
Use regular `<a>` elements - internal links automatically handled:
```svelte
<a href="/page">Internal link</a>
<a href="https://external.com">External link</a>
<a href="/api" tinro-ignore>Ignored by router</a>
```

### Active Links
```svelte
<script>
import {active} from 'tinro';
</script>

<a href="/page" use:active>Link with active class</a>
<a href="/page" use:active exact>Exact match only</a>
<a href="/page" use:active active-class="current">Custom class</a>
```

### Programmatic Navigation
```svelte
<script>
import {router} from 'tinro';

function navigate() {
  router.goto('/new-page');
}
</script>
```

## Route Meta Data

### Using let:meta
```svelte
<Route path="/posts/:id" let:meta>
  <h1>URL: {meta.url}</h1>
  <p>Pattern: {meta.pattern}</p>
  <p>Match: {meta.match}</p>
  <p>From: {meta.from}</p>
  <p>Query: {JSON.stringify(meta.query)}</p>
  <p>Params: {JSON.stringify(meta.params)}</p>
</Route>
```

### Using meta() function
```svelte
<script>
import {meta} from 'tinro';
const route = meta();
</script>

<h1>Current URL: {route.url}</h1>
<!-- Reactive: -->
<h1>Current URL: {$route.url}</h1>
```

## Redirects

```svelte
<!-- Exact redirect -->
<Route path="/old-page" redirect="/new-page"/>

<!-- Non-exact redirect -->
<Route path="/old/*" redirect="/new"/>

<!-- Relative redirect -->
<Route path="/section/*">
  <Route path="/old" redirect="new"/>
</Route>
```

## Fallbacks

```svelte
<Route path="/*">
  <Route path="/">Home</Route>
  <Route path="/about">About</Route>
  <Route path="/products/*">
    <Route path="/phones">Phones</Route>
    <Route path="/laptops">Laptops</Route>
    <Route fallback>Product not found</Route>
  </Route>
  <Route fallback>Page not found</Route>
</Route>
```

## Navigation Modes

```svelte
<script>
import {router} from 'tinro';

// Hash-based routing
router.mode.hash();

// Memory routing (for testing)
router.mode.memory();

// History API (default)
router.mode.history();
</script>
```

## Base Path

For apps deployed in subdirectories:
```svelte
<script>
import {router} from 'tinro';
router.base('/my-app');
</script>
```

## Query & Hash Management

```javascript
import {router} from 'tinro';

// Query parameters
router.location.query.set('page', 1);
router.location.query.get('search');
router.location.query.delete('old');
router.location.query.replace({new: 'params'});
router.location.query.clear();

// Hash
router.location.hash.set('section');
router.location.hash.get();
router.location.hash.clear();
```

## Router Store

```svelte
<script>
import {router} from 'tinro';

// Subscribe to route changes
router.subscribe(route => {
  console.log('Current:', route.url);
  console.log('From:', route.from);
  console.log('Query:', route.query);
});
</script>

<!-- Auto-subscription -->
Current: {$router.path}
Query: {JSON.stringify($router.query)}
```

## Advanced Features

### First Match
Show only the first matching nested route:
```svelte
<Route path="/user/*" firstmatch>
  <Route path="/add">Add User</Route>
  <Route path="/:id">View User {meta.params.id}</Route>
</Route>
```

### Breadcrumbs
```svelte
<Route path="/*" breadcrumb="Home">
  <Route path="/products/*" breadcrumb="Products">
    <Route path="/phones" breadcrumb="Phones" let:meta>
      <nav>
        {#each meta.breadcrumbs as bc}
          <a href={bc.path}>{bc.name}</a>
        {/each}
      </nav>
    </Route>
  </Route>
</Route>
```

## Common Recipes

### Route Guards
```svelte
{#if user.authenticated}
  <Route path="/dashboard">Protected content</Route>
{:else}
  <Route path="/dashboard" redirect="/login"/>
{/if}
```

### Lazy Loading
```svelte
<!-- Lazy.svelte -->
<script>
export let component;
</script>

{#await component}
  Loading...
{:then Cmp}
  <svelte:component this={Cmp.default} />
{/await}

<!-- Usage -->
<Route path="/heavy">
  <Lazy component={import('./HeavyComponent.svelte')}/>
</Route>
```

### Route Transitions
```svelte
<script>
import {router} from 'tinro';
import {fade} from 'svelte/transition';
</script>

{#key $router.path}
  <div in:fade>
    <Route path="/">Home</Route>
    <Route path="/about">About</Route>
  </div>
{/key}
```