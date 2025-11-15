import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

const {
  data: { user },
} = await supabase.auth.getUser();

  if (!user) redirect('/login-01');

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  if (!profile || profile.subscription_status !== 'active') {
    redirect('/checkout');
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Willkommen im Dashboard</h1>
      <p>Dein Abo ist aktiv 🎉</p>
    </div>
  );
}
