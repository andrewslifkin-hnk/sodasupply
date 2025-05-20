# Setting Up Statsig Feature Gates

This guide will walk you through setting up Statsig feature gates for the SodaSupply application. The implementation already includes two feature flags:

1. `promo_banner` - Controls the promotional banner at the top of the product listing page
2. `product_discount_badge` - Controls the discount badges on product cards

## Prerequisites

1. A Statsig account (https://console.statsig.com/)
2. API keys from the Statsig console

## Step 1: Get the Statsig Client API Key

1. Log in to your Statsig console (https://console.statsig.com/)
2. Go to **Settings** > **Keys & Environments**
3. Under **API Keys**, click **Create new key**
4. Select **Client** from the dropdown menu
5. Copy the generated key (it should start with `client-`)

## Step 2: Configure Environment Variables

1. Add the client API key to your `.env.local` file:

```
NEXT_PUBLIC_STATSIG_CLIENT_KEY=client-your-key-from-statsig
```

2. For production, add this environment variable in your Vercel dashboard:
   - Go to your project in Vercel
   - Navigate to **Settings** > **Environment Variables**
   - Add the variable `NEXT_PUBLIC_STATSIG_CLIENT_KEY` with your client API key value
   - Select the environments where you want this variable to be available

## Step 3: Create Feature Gates in Statsig Console

### Create the "promo_banner" Feature Gate

1. In the Statsig console, go to **Feature Gates**
2. Click **Create** to create a new feature gate
3. Fill in the details:
   - **Name**: `promo_banner`
   - **Description**: "Controls the promotional banner on the product listing page"
4. Click **Create** to create the feature gate

### Create the "product_discount_badge" Feature Gate

1. Go to **Feature Gates** in the Statsig console
2. Click **Create** to create another feature gate
3. Fill in the details:
   - **Name**: `product_discount_badge`
   - **Description**: "Controls the discount badge on product cards"
4. Click **Create** to create the feature gate

## Step 4: Configure Targeting Rules

### Configure Rules for "promo_banner"

1. On the `promo_banner` feature gate page:
2. Click **Add Rule**
3. Set up the rule:
   - **Rule Name**: "Initial Rollout"
   - Choose targeting conditions (e.g., all users, specific user segments, etc.)
   - **Pass Percentage**: Set to desired percentage (e.g., 50% for initial testing)
4. Click **Add Rule** and then **Save**

### Configure Rules for "product_discount_badge"

1. On the `product_discount_badge` feature gate page:
2. Click **Add Rule**
3. Set up the rule:
   - **Rule Name**: "Initial Rollout"
   - Choose targeting conditions
   - **Pass Percentage**: Set to desired percentage
4. Click **Add Rule** and then **Save**

## Step 5: Test Your Feature Gates

1. In the Statsig console, go to each feature gate's page
2. Click on the **Test Gate** tab
3. Enter a test user ID to see if the feature gate would pass or fail for that user
4. You can also use override rules to specifically target certain users

## Troubleshooting

If your feature gates are not working as expected:

1. Check the browser console for Statsig-related error messages
2. Verify that the `NEXT_PUBLIC_STATSIG_CLIENT_KEY` environment variable is set correctly
3. Make sure the feature gate names in your code match exactly with the names in the Statsig console
4. Check that the user object contains the necessary attributes for your targeting rules

## Advanced Configuration

### Gradual Rollout

To gradually roll out a feature:

1. Navigate to the feature gate's page in the Statsig console
2. Click on your rule
3. Click **Create Schedule**
4. Set the start date, end date, and progression curve
5. Click **Save Changes**

### User Targeting

You can target users based on various attributes:

- **User ID**: Target specific users with known IDs
- **Email**: Target users with specific email domains
- **Country**: Target users from specific countries
- **Custom Attributes**: Target based on custom user properties

### Experiment Integration

If you want to measure the impact of your feature:

1. Create an experiment in the Statsig console
2. Link it to your feature gate
3. Define metrics to track
4. Analyze results in the Experiment dashboard

## Resources

- [Statsig Documentation](https://docs.statsig.com/)
- [Feature Gates Overview](https://docs.statsig.com/feature-flags/overview)
- [Statsig JavaScript Client SDK](https://docs.statsig.com/client/javascript-sdk) 