Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
npm install
npm run dev
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `npm install @tailwindcss/vite tailwindcss -D`

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

## T3Env

- You can use T3Env to add type safety to your environment variables.
- Add Environment variables to the `src/env.mjs` file.
- Use the environment variables in your code.

### Usage

```ts
import { env } from '#/env'

console.log(env.VITE_APP_TITLE)
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')

  useEffect(() => {
    getServerTime().then(setTime)
  }, [])

  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

## TanStack Query

This project uses [TanStack Query](https://tanstack.com/query) for efficient server state management, data fetching, and caching.

### Basic Usage

```tsx
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('/api/todos')
      return response.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

For more information, visit the [TanStack Query documentation](https://tanstack.com/query/latest).

## TanStack Forms

This project uses [TanStack Forms](https://tanstack.com/form) for robust form state management with built-in validation support via [Zod](https://zod.dev/).

### Basic Usage

```tsx
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

function MyForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      console.log('Form submitted:', value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <input
        name="name"
        value={form.getFieldValue('name')}
        onChange={(e) => form.setFieldValue('name', e.target.value)}
      />
      <input
        name="email"
        type="email"
        value={form.getFieldValue('email')}
        onChange={(e) => form.setFieldValue('email', e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

For more information, visit the [TanStack Forms documentation](https://tanstack.com/form/latest).

## TanStack Table

This project includes [TanStack Table](https://tanstack.com/table) (React Table) for headless, powerful table component development with features like sorting, filtering, pagination, and row selection.

### Basic Usage

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

function MyTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder ? null : header.renderHeader()}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{cell.renderCell()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

For more information, visit the [TanStack Table documentation](https://tanstack.com/table/latest).

## TanStack Store

This project uses [TanStack Store](https://tanstack.com/store) for lightweight client-side state management.

### Basic Usage

```tsx
import { RootStore } from '@tanstack/react-store'

// Create a store
const store = new RootStore({
  count: 0,
  user: null,
})

// Use in a component
import { useStore } from '@tanstack/react-store'

function MyComponent() {
  const count = useStore(store, (state) => state.count)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => store.setState((s) => ({ count: s.count + 1 }))}>
        Increment
      </button>
    </div>
  )
}
```

For more information, visit the [TanStack Store documentation](https://tanstack.com/store/latest).

## Sentry Error Tracking

This project integrates [Sentry](https://sentry.io/) for comprehensive error tracking, performance monitoring, and session replay capabilities in production environments.

### Features

- **Error Tracking**: Automatically captures and reports unhandled exceptions
- **Performance Monitoring**: Monitors application performance and identifies bottlenecks
- **Session Replay**: Records user sessions to help debug issues
- **Release Tracking**: Tracks errors across different app versions

### Configuration

Sentry is configured through environment variables. Make sure to set `SENTRY_DSN` in your `.env.local` file:

```bash
VITE_SENTRY_DSN=your-sentry-dsn-here
```

### Usage

```tsx
import * as Sentry from '@sentry/tanstackstart-react'

// Manually capture an exception
try {
  // some code
} catch (error) {
  Sentry.captureException(error)
}

// Capture a message
Sentry.captureMessage('Something interesting happened')

// Set user context
Sentry.setUser({ id: '123', email: 'user@example.com' })
```

For more information, visit the [Sentry documentation](https://docs.sentry.io/).

## Storybook

This project uses [Storybook](https://storybook.js.org/) for developing, documenting, and testing UI components in isolation.

### Running Storybook

```bash
npm run storybook
```

This will start the Storybook development server on `http://localhost:6006`.

### Building Storybook

```bash
npm run build-storybook
```

Components are located in `src/components/storybook/` and include stories for buttons, inputs, dialogs, sliders, and radio groups.

## Development Tools

### TanStack Query Devtools

Provides a visual interface for debugging TanStack Query. The devtools are automatically included in development mode and can be toggled with a button in the bottom corner of your application.

### TanStack Router Devtools

Helps visualize and debug your application's routing structure. Available in development mode.

### React Devtools

Browser extension for inspecting React component hierarchy and state.

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
