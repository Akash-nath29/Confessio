import { Redirect } from 'expo-router';

// Catch-all for any unmatched route. Redirect gracefully to the Write tab.
export default function NotFound() {
  return <Redirect href="/write" />;
}
