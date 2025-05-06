"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useUserStore } from '@/lib/stores/useUser';
import { Button } from './button';

export default function Header() {
  const userId = useUserStore((state) => state.userId);
  const [isReady, setIsReady] = useState(false);
  const logout = useUserStore((state) => state.logout)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReady(true);
    }
  }, []);

  const isConnected = !!userId && isReady;

  return (
    <header className="w-full px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent className="p-4">
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/rush" passHref legacyBehavior>
                      <NavigationMenuLink className="hover:underline">Rush</NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/scorecard" passHref legacyBehavior>
                      <NavigationMenuLink className="hover:underline">Scorecard</NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/planning" passHref legacyBehavior>
                      <NavigationMenuLink className="hover:underline">Planning</NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Button */}
        {isConnected ? (
          <div>
          <Link href={`/auth/${userId}/dashboard`} className="text-sm text-[#8F2412] font-medium hover:underline">
            Mon Espace
          </Link>
          <Button onClick={logout}>
            Se déconnecter
          </Button>
          </div>
        ) : (
          <Link href="/auth/login" className="text-sm text-gray-600 hover:text-black hover:underline">
            Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}
