# Svelte 4 Documentation

A compile-time UI framework that shifts work from browser to build step for highly optimized applications.

## Installation & Setup

### With SvelteKit (Recommended)
```bash
npm create svelte@latest myapp
cd myapp
npm install
npm run dev
```

### Standalone with Vite
```bash
npm create vite@latest myapp -- --template svelte
cd myapp
npm install
npm run dev
```

## Component Structure

Components are `.svelte` files with three optional sections:

```svelte
<script>
  // JavaScript logic
</script>

<!-- HTML markup with Svelte enhancements -->

<style>
  /* Scoped CSS styles */
</style>
```

## Props & Data Flow

### Declaring Props
```svelte
<script>
  export let name;
  export let age = 25; // Default value
  export let items = []; // Default array
</script>

<h1>Hello {name}, you are {age} years old</h1>
```

### Using Components
```svelte
<script>
import Child from './Child.svelte';
</script>

<Child name="Alice" age={30} />
<Child name="Bob" /> <!-- Uses default age -->
```

### Readonly Props
```svelte
<script>
  export const version = '1.0.0';
  export function greet(name) {
    return `Hello ${name}!`;
  }
</script>
```

## Reactivity

### Reactive Assignments
```svelte
<script>
  let count = 0;
  let doubled = count * 2; // Not reactive
  
  // This triggers updates
  function increment() {
    count += 1; // or count = count + 1
  }
</script>

<button on:click={increment}>{count}</button>
```

### Reactive Statements
```svelte
<script>
  let firstName = '';
  let lastName = '';
  
  // Reactive declaration
  $: fullName = `${firstName} ${lastName}`;
  
  // Reactive block
  $: {
    console.log('Name changed:', fullName);
    document.title = fullName;
  }
  
  // Reactive with side effects
  $: if (count > 10) {
    alert('Count is high!');
  }
</script>
```

### Array/Object Updates
```svelte
<script>
  let items = [1, 2, 3];
  
  function addItem() {
    // This won't trigger reactivity
    items.push(items.length + 1);
    
    // Do this instead
    items = [...items, items.length + 1];
    // or
    items = items.concat(items.length + 1);
  }
  
  function removeFirst() {
    items = items.slice(1);
  }
</script>
```

## Template Syntax

### Text Interpolation
```svelte
<script>
  let name = 'World';
  let user = { name: 'Alice', age: 25 };
</script>

<h1>Hello {name}!</h1>
<p>User: {user.name} ({user.age})</p>
<p>Math: {2 + 3}</p>
<p>Function: {name.toUpperCase()}</p>
```

### HTML Content
```svelte
<script>
  let htmlString = '<strong>Bold text</strong>';
</script>

<!-- Renders as text -->
<p>{htmlString}</p>

<!-- Renders as HTML -->
<p>{@html htmlString}</p>
```

### Attributes
```svelte
<script>
  let src = 'image.jpg';
  let alt = 'Description';
  let disabled = true;
</script>

<!-- Dynamic attributes -->
<img {src} {alt} />
<img src={src} alt={alt} />

<!-- Boolean attributes -->
<button {disabled}>Click me</button>
<button disabled={disabled}>Click me</button>

<!-- Conditional classes -->
<div class:active={isActive} class:large={size === 'lg'}>Content</div>
```

## Control Flow

### Conditionals
```svelte
<script>
  let user = null;
  let count = 5;
</script>

{#if user}
  <h1>Hello {user.name}!</h1>
{:else if count > 10}
  <h1>High count: {count}</h1>
{:else}
  <h1>Please log in</h1>
{/if}
```

### Loops
```svelte
<script>
  let items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' }
  ];
</script>

<!-- Basic each -->
{#each items as item}
  <p>{item.name}</p>
{/each}

<!-- With index -->
{#each items as item, i}
  <p>{i}: {item.name}</p>
{/each}

<!-- With key for performance -->
{#each items as item (item.id)}
  <p>{item.name}</p>
{/each}

<!-- With else block -->
{#each items as item}
  <p>{item.name}</p>
{:else}
  <p>No items found</p>
{/each}
```

### Await Blocks
```svelte
<script>
  let promise = fetchData();
  
  async function fetchData() {
    const response = await fetch('/api/data');
    return response.json();
  }
</script>

{#await promise}
  <p>Loading...</p>
{:then data}
  <p>Data: {JSON.stringify(data)}</p>
{:catch error}
  <p>Error: {error.message}</p>
{/await}

<!-- Shorter syntax -->
{#await promise then data}
  <p>Data: {JSON.stringify(data)}</p>
{/await}
```

## Event Handling

### DOM Events
```svelte
<script>
  let count = 0;
  
  function handleClick(event) {
    console.log('Clicked!', event);
    count++;
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      console.log('Enter pressed');
    }
  }
</script>

<button on:click={handleClick}>
  Clicked {count} times
</button>

<!-- Inline handlers -->
<button on:click={() => count++}>
  Increment
</button>

<!-- Event modifiers -->
<button on:click|once={handleClick}>Click once</button>
<button on:click|preventDefault={handleClick}>No default</button>
<form on:submit|preventDefault={handleSubmit}>
  <button type="submit">Submit</button>
</form>

<input on:keydown={handleKeydown} />
```

### Custom Events
```svelte
<!-- Child.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  function sayHello() {
    dispatch('message', {
      text: 'Hello from child!'
    });
  }
</script>

<button on:click={sayHello}>Say Hello</button>

<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
  
  function handleMessage(event) {
    console.log(event.detail.text);
  }
</script>

<Child on:message={handleMessage} />
```

## Bindings

### Form Inputs
```svelte
<script>
  let name = '';
  let email = '';
  let message = '';
  let agreed = false;
  let color = 'red';
  let size = 'medium';
  let flavors = [];
</script>

<!-- Text inputs -->
<input bind:value={name} placeholder="Name" />
<textarea bind:value={message}></textarea>

<!-- Checkboxes -->
<input type="checkbox" bind:checked={agreed} />
<label>I agree to terms</label>

<!-- Radio buttons -->
<input type="radio" bind:group={size} value="small" />
<input type="radio" bind:group={size} value="medium" />
<input type="radio" bind:group={size} value="large" />

<!-- Select -->
<select bind:value={color}>
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="blue">Blue</option>
</select>

<!-- Multiple select -->
<select multiple bind:value={flavors}>
  <option value="vanilla">Vanilla</option>
  <option value="chocolate">Chocolate</option>
  <option value="strawberry">Strawberry</option>
</select>
```

### Component Bindings
```svelte
<!-- Child.svelte -->
<script>
  export let value = '';
  
  let input;
  
  export function focus() {
    input.focus();
  }
</script>

<input bind:this={input} bind:value />

<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
  
  let childValue = '';
  let childComponent;
  
  function focusChild() {
    childComponent.focus();
  }
</script>

<Child bind:value={childValue} bind:this={childComponent} />
<button on:click={focusChild}>Focus Child</button>
<p>Child value: {childValue}</p>
```

## Lifecycle Functions

```svelte
<script>
  import { 
    onMount, 
    onDestroy, 
    beforeUpdate, 
    afterUpdate,
    tick 
  } from 'svelte';
  
  let count = 0;
  
  onMount(() => {
    console.log('Component mounted');
    
    const interval = setInterval(() => {
      count++;
    }, 1000);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  });
  
  onDestroy(() => {
    console.log('Component will be destroyed');
  });
  
  beforeUpdate(() => {
    console.log('About to update');
  });
  
  afterUpdate(() => {
    console.log('Just updated');
  });
  
  async function handleClick() {
    count++;
    await tick(); // Wait for DOM update
    console.log('DOM updated');
  }
</script>

<button on:click={handleClick}>
  Count: {count}
</button>
```

## Stores

### Writable Stores
```svelte
<!-- stores.js -->
import { writable } from 'svelte/store';

export const count = writable(0);
export const name = writable('World');

<!-- Component.svelte -->
<script>
  import { count, name } from './stores.js';
  
  // Manual subscription
  let countValue;
  const unsubscribe = count.subscribe(value => {
    countValue = value;
  });
  
  // Auto-subscription (preferred)
  $: console.log('Count:', $count);
  
  function increment() {
    count.update(n => n + 1);
  }
  
  function reset() {
    count.set(0);
  }
</script>

<h1>Hello {$name}!</h1>
<p>Count: {$count}</p>
<button on:click={increment}>+</button>
<button on:click={reset}>Reset</button>
```

### Readable Stores
```svelte
<!-- stores.js -->
import { readable } from 'svelte/store';

export const time = readable(new Date(), set => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);
  
  return () => clearInterval(interval);
});

<!-- Component.svelte -->
<script>
  import { time } from './stores.js';
</script>

<p>Current time: {$time.toLocaleTimeString()}</p>
```

### Derived Stores
```svelte
<!-- stores.js -->
import { writable, derived } from 'svelte/store';

export const firstName = writable('');
export const lastName = writable('');

export const fullName = derived(
  [firstName, lastName],
  ([first, last]) => `${first} ${last}`
);

<!-- Component.svelte -->
<script>
  import { firstName, lastName, fullName } from './stores.js';
</script>

<input bind:value={$firstName} placeholder="First name" />
<input bind:value={$lastName} placeholder="Last name" />
<p>Full name: {$fullName}</p>
```

## Slots & Composition

### Basic Slots
```svelte
<!-- Modal.svelte -->
<div class="modal">
  <div class="modal-content">
    <slot>
      <!-- Fallback content -->
      <p>No content provided</p>
    </slot>
  </div>
</div>

<!-- App.svelte -->
<script>
  import Modal from './Modal.svelte';
</script>

<Modal>
  <h2>Modal Title</h2>
  <p>Modal content here</p>
</Modal>
```

### Named Slots
```svelte
<!-- Card.svelte -->
<div class="card">
  <header>
    <slot name="header">Default header</slot>
  </header>
  <main>
    <slot></slot> <!-- Default slot -->
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

<!-- App.svelte -->
<Card>
  <h1 slot="header">Card Title</h1>
  <p>This goes in the default slot</p>
  <small slot="footer">Card footer</small>
</Card>
```

### Slot Props
```svelte
<!-- List.svelte -->
<script>
  export let items = [];
</script>

<ul>
  {#each items as item, index}
    <li>
      <slot {item} {index}>
        <!-- Default item rendering -->
        {item}
      </slot>
    </li>
  {/each}
</ul>

<!-- App.svelte -->
<script>
  import List from './List.svelte';
  
  const items = [
    { id: 1, name: 'Apple', color: 'red' },
    { id: 2, name: 'Banana', color: 'yellow' }
  ];
</script>

<List {items} let:item let:index>
  <strong>{index + 1}:</strong>
  <span style="color: {item.color}">{item.name}</span>
</List>
```

## Context API

```svelte
<!-- Parent.svelte -->
<script>
  import { setContext } from 'svelte';
  import Child from './Child.svelte';
  
  setContext('theme', {
    color: 'blue',
    size: 'large'
  });
</script>

<Child />

<!-- Child.svelte -->
<script>
  import { getContext } from 'svelte';
  
  const theme = getContext('theme');
</script>

<div style="color: {theme.color}">
  Themed content
</div>
```

## Actions

```svelte
<script>
  function tooltip(node, text) {
    const tooltip = document.createElement('div');
    tooltip.textContent = text;
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'black';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.display = 'none';
    
    function handleMouseenter() {
      document.body.appendChild(tooltip);
      tooltip.style.display = 'block';
    }
    
    function handleMouseleave() {
      tooltip.remove();
    }
    
    node.addEventListener('mouseenter', handleMouseenter);
    node.addEventListener('mouseleave', handleMouseleave);
    
    return {
      update(newText) {
        tooltip.textContent = newText;
      },
      destroy() {
        node.removeEventListener('mouseenter', handleMouseenter);
        node.removeEventListener('mouseleave', handleMouseleave);
        tooltip.remove();
      }
    };
  }
</script>

<button use:tooltip="Hover for info">
  Hover me
</button>
```

## Transitions & Animation

### Basic Transitions
```svelte
<script>
  import { fade, slide, scale } from 'svelte/transition';
  
  let visible = true;
</script>

<button on:click={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <div transition:fade>Fades in and out</div>
  <div transition:slide>Slides in and out</div>
  <div transition:scale>Scales in and out</div>
{/if}
```

### Custom Transitions
```svelte
<script>
  function spin(node, { duration = 400 }) {
    return {
      duration,
      css: t => `
        transform: scale(${t}) rotate(${t * 360}deg);
        opacity: ${t};
      `
    };
  }
  
  let visible = true;
</script>

{#if visible}
  <div transition:spin="{{ duration: 600 }}">
    Custom transition
  </div>
{/if}
```

### Animations
```svelte
<script>
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  
  let items = [1, 2, 3, 4, 5];
  
  function shuffle() {
    items = items.sort(() => Math.random() - 0.5);
  }
</script>

<button on:click={shuffle}>Shuffle</button>

{#each items as item (item)}
  <div animate:flip="{{ duration: 300 }}">
    {item}
  </div>
{/each}
```

## Styling

### Scoped Styles
```svelte
<script>
  let important = false;
</script>

<p class:important>Styled text</p>

<style>
  p {
    color: blue;
    font-size: 16px;
  }
  
  .important {
    color: red;
    font-weight: bold;
  }
  
  /* Global styles */
  :global(body) {
    margin: 0;
    font-family: Arial;
  }
  
  /* Target children of this component */
  :global(.card p) {
    margin-bottom: 10px;
  }
</style>
```

### Dynamic Styles
```svelte
<script>
  let color = 'red';
  let size = 16;
</script>

<input bind:value={color} />
<input type="range" bind:value={size} min="12" max="48" />

<p style="color: {color}; font-size: {size}px;">
  Dynamic styling
</p>

<!-- CSS custom properties -->
<div class="box" style="--color: {color};">
  Custom property
</div>

<style>
  .box {
    background: var(--color, blue);
    padding: 20px;
  }
</style>
```

## TypeScript Support

```svelte
<script lang="ts">
  interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export let users: User[] = [];
  export let title: string;
  
  let selectedUser: User | null = null;
  
  function selectUser(user: User): void {
    selectedUser = user;
  }
</script>

<h1>{title}</h1>

{#each users as user (user.id)}
  <button on:click={() => selectUser(user)}>
    {user.name}
  </button>
{/each}

{#if selectedUser}
  <p>Selected: {selectedUser.name} ({selectedUser.email})</p>
{/if}
```

## Build & Deployment

### Build Configuration
```javascript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: 'es2017'
  }
});
```

### Environment Variables
```svelte
<script>
  import { PUBLIC_API_URL } from '$env/static/public';
  import { SECRET_KEY } from '$env/static/private';
</script>
```

## Common Patterns

### Loading States
```svelte
<script>
  let loading = false;
  let data = null;
  let error = null;
  
  async function fetchData() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/data');
      data = await response.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<button on:click={fetchData} disabled={loading}>
  {loading ? 'Loading...' : 'Fetch Data'}
</button>

{#if error}
  <p class="error">Error: {error}</p>
{:else if data}
  <pre>{JSON.stringify(data, null, 2)}</pre>
{/if}
```

### Form Validation
```svelte
<script>
  let email = '';
  let password = '';
  let errors = {};
  
  function validate() {
    errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  function handleSubmit() {
    if (validate()) {
      console.log('Form is valid');
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>
    <input 
      bind:value={email} 
      type="email" 
      placeholder="Email"
      class:invalid={errors.email}
    />
    {#if errors.email}
      <span class="error">{errors.email}</span>
    {/if}
  </div>
  
  <div>
    <input 
      bind:value={password} 
      type="password" 
      placeholder="Password"
      class:invalid={errors.password}
    />
    {#if errors.password}
      <span class="error">{errors.password}</span>
    {/if}
  </div>
  
  <button type="submit">Submit</button>
</form>

<style>
  .invalid {
    border: 1px solid red;
  }
  .error {
    color: red;
    font-size: 14px;
  }
</style>
```