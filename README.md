# Tekton Words

AI-powered copy generation for your business website. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 Clean, responsive dashboard with dark sidebar
- 📝 Two large textareas for business details and website structure
- 🔄 Async copy generation with real-time status updates
- 📊 History page with searchable request history
- 🔗 n8n integration for AI-powered content generation
- 🎯 Modern UI with gradient buttons and smooth animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Row Level Security)
- **Integration**: n8n workflow automation
- **Styling**: Custom gradient design system

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- n8n instance (optional for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tekton-words
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```
   NEXT_PUBLIC_APP_URL=https://your-app-url.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_INPUT_WEBHOOK_URL=your_n8n_webhook_url
   ```

4. **Set up Supabase database**
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the contents of `supabase-migration.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
tekton-words/
├── app/                    # Next.js App Router
│   ├── api/callback/      # n8n callback endpoint
│   ├── history/           # History page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Button.tsx         # Reusable button component
│   ├── HistoryList.tsx    # History table component
│   ├── NewCopyForm.tsx    # Main form component
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── Spinner.tsx        # Loading spinner
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client
│   └── time.ts            # Time formatting utilities
├── supabase-migration.sql # Database schema
├── SUPABASE.md           # Supabase setup guide
└── INTEGRATION.md        # n8n integration guide
```

## Usage

### Generating Copy

1. Navigate to the "New Copy" page
2. Fill in your business details
3. Specify your website structure/pages
4. Click "Generate Copy"
5. Wait for the AI to process your request
6. View the generated content via the provided link

### Viewing History

1. Navigate to the "History" page
2. Browse all past copy generation requests
3. Use the search to filter by business details or structure
4. Click on any row to view full details
5. Access generated content via the output links

## API Endpoints

### POST /api/callback

Receives results from the n8n workflow.

**Request Body:**
```json
{
  "id": "uuid",
  "outputLink": "https://drive.google.com/...",
  "error": "optional error message"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Styling

The project uses Tailwind CSS with custom gradient utilities:
- `.gradient-primary` - Cyan to blue gradient
- `.gradient-primary-hover` - Darker gradient for hover states

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
