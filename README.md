# R2 file explorer

File explorer interface for an R2 bucket. Meant to be hosted on a cloudflare worker on the index of a custom bucket url.

## Setup

1. Create a cloudflare R2 bucket. Connect it to a custom domain.
2. Adjust `wrangler.toml` to point to your bucket.
   1. Replace the r2.eepy.ca & zone name with your custom domain.
   2. Replace `bucket_name` with your bucket name.
   3. Rename `name` (if you want to).
   4. Replace `account_id` with your cloudflare account id, which you can find in the cloudflare dashboard.
3. Install cloudflare wrangler if you haven't already: `npm install -g wrangler`
4. Run `wrangler login` and `wrangler deploy` to deploy the worker to cloudflare.
5. Visit your custom domain and you should see the file explorer.
