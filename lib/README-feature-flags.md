# Feature Flags Setup

This project uses [Hypertune](https://www.hypertune.com/) and [Vercel Flags](https://vercel.com/docs/workflow-collaboration/flags) for feature flag management. 

## Setup Instructions

### 1. Configure Environment Variables

Create or modify your `.env.local` file to include:

```env
# Add your actual Hypertune token here
HYPERTUNE_TOKEN=YOUR_HYPERTUNE_TOKEN_HERE

# Configuration for Hypertune code generation
HYPERTUNE_OUTPUT_DIRECTORY_PATH=generated
HYPERTUNE_INCLUDE_INIT_DATA=true

# Add your FLAGS_SECRET here (Vercel flags)
# Generate with: node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
FLAGS_SECRET=YOUR_FLAGS_SECRET_HERE
```

### 2. Generate Hypertune Client

Run the Hypertune CLI to generate a type-safe client:

```bash
npx hypertune
```

This will create client files in the `generated` directory based on your Hypertune project configuration.

### 3. Using Feature Flags

#### With Hypertune:

```typescript
import { getHypertune } from 'lib/hypertune';

// In a component or API route
async function example() {
  const hypertuneClient = await getHypertune({
    userId: 'user-123',
    userInfo: { role: 'admin' }
  });
  
  // Use a feature flag (depends on your Hypertune schema)
  if (hypertuneClient?.yourFeatureFlag({ fallback: false })) {
    // Feature is enabled
  }
}
```

#### With Vercel Flags:

```typescript
import { createFeatureFlag } from 'lib/hypertune';

// Define a feature flag
export const newCheckoutFlow = createFeatureFlag('new-checkout-flow', false);

// Using the flag in a component
export default async function Page() {
  const isNewCheckoutEnabled = await newCheckoutFlow();
  
  return (
    <div>
      {isNewCheckoutEnabled ? (
        <NewCheckoutComponent />
      ) : (
        <OldCheckoutComponent />
      )}
    </div>
  );
}
```

## Troubleshooting

If you encounter issues with Hypertune token authentication, ensure you're using the correct token from your Hypertune project settings.

For more information, refer to:
- [Hypertune Documentation](https://docs.hypertune.com/)
- [Vercel Flags Documentation](https://vercel.com/docs/workflow-collaboration/flags) 