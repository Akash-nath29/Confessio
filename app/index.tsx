import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root to Write tab
  return <Redirect href="/write" />;
}
