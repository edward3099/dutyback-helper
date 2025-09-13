'use client';

import PillNav from '@/components/ui/PillNav';

export function Navigation() {
  const navItems = [
    { label: 'Home', href: '/', ariaLabel: 'Home' },
    { label: 'Wizard', href: '/wizard', ariaLabel: 'Start Claim Wizard' },
    { label: 'Dashboard', href: '/dashboard', ariaLabel: 'View Claims Dashboard' },
    { label: 'Stats', href: '/stats', ariaLabel: 'View Detailed Statistics' },
    { label: 'Support', href: '/support', ariaLabel: 'Support & Updates' },
  ];

  return (
    <PillNav
      logo="/logo.svg"
      logoAlt="Dutyback Helper Logo"
      items={navItems}
      activeHref="/"
      className="custom-nav"
      ease="power2.easeOut"
      baseColor="#000000"
      pillColor="#ffffff"
      hoveredPillTextColor="#ffffff"
      pillTextColor="#000000"
      initialLoadAnimation={true}
    />
  );
}
