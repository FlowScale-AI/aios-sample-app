# FlowScale SDK Guide

This repository contains a simple standalone AIOS sample app. To build fully customized apps integrating with FlowScale AIOS, we recommend using the standard `@flowscale/sdk` via Node.js backend. 

Here is how to use the core SDK functions.

## 1. Installation

```bash
npm install @flowscale/sdk
```

## 2. Authentication

First, you need to sign in using `login` and obtain a session token.

```typescript
import { login, createClient } from '@flowscale/sdk'

// Authenticate and get a session token
const sessionToken = await login({
  baseUrl: 'http://localhost:14173',
  username: 'admin',
  password: 'your-password'
})

// Initialize the client
const client = createClient({
  baseUrl: 'http://localhost:14173',
  sessionToken
})
```

## 3. Listing Tools

Fetch all tools currently available in your FlowScale instance. 

```typescript
// Get tools that are ready to run
const tools = await client.tools.list({ status: 'production' })

for (const tool of tools) {
  console.log('Found tool:', tool.name, 'with ID:', tool.id)
  console.log('Inputs required:', JSON.stringify(tool.schemaJson))
}
```

Every tool has a `schemaJson` object that specifies the exact inputs required. An input key format is always `nodeId__paramName` (e.g. `6__text`).

## 4. Running a Tool

To run a tool, you provide the `toolId` and a map of inputs matching the schema. The `run` command will execute the tool and automatically poll for completion.

```typescript
const result = await client.tools.run('demo-image-tool-id', {
  '6__text': 'A serene landscape with mountains and lake',
  '5__width': 1024,
  '5__height': 768
})

if (result.status === 'completed') {
  console.log('Outputs:', result.outputs)
  
  for (const output of result.outputs) {
    // Outputs provide the relative URL to access the generated media 
    console.log(`URL to fetch: http://localhost:14173${output.path}`)
  }
} else {
  console.error('Execution failed:', result.error)
}
```

## 5. Streaming Progress Updates

Some tools (like ComfyUI workflows) return progress events as they run. You can hook into this by providing an `onProgress` callback.

```typescript
await client.tools.run('demo-image-tool-id', {
  '6__text': 'A futuristic city'
}, {
  onProgress: (progress) => {
    if (progress.status === 'failed') {
      console.log('Task failed:', progress.error);
    } else if (progress.status === 'completed') {
      console.log('Task completed! Results:', progress.outputs);
    } else {
      console.log(`Progress: ${progress.progress}%`);
    }
  }
})
```

## 6. Calling the Raw API

If you need endpoints not wrapped by the SDK, you can issue authenticated HTTP requests via your HTTP client to `http://localhost:14173/api/*`, setting the session token you generated:

```typescript
const res = await fetch('http://localhost:14173/api/tools', {
  headers: {
    'Cookie': `fs_session=${sessionToken}`
  }
})
const data = await res.json()
```
