async function verify() {
  const [analyticsRes, pagesRes] = await Promise.all([
    fetch('http://localhost:3001/api/social/analytics?refresh=true'),
    fetch('http://localhost:3001/api/social/pages')
  ]);
  const a = await analyticsRes.json();
  const p = await pagesRes.json();

  console.log('=== SOCIAL INTELLIGENCE OS VERIFICATION ===');
  console.log('Analytics Success:', a.success);
  console.log('Overview:', a.data.overview);
  console.log('Accounts Registered:', a.data.accounts.length);
  a.data.accounts.forEach(acc => {
    const aud = acc.metrics.followers?.value || acc.metrics.subscribers?.value;
    console.log(` - [${acc.platform.toUpperCase()}] ${acc.displayName} (@${acc.username}): ${aud} audience (${acc.connectionStatus})`);
  });
  console.log('Pages Discovered API Count:', p.pages.length);
  p.pages.forEach(pg => {
    console.log(` - Page: ${pg.name} (ID: ${pg.id}, Followers: ${pg.followersCount}, Connected: ${pg.isConnected})`);
  });
}
verify();

