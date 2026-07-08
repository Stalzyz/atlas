"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import MagneticLink from "../ui/MagneticLink";
import { useAuth } from "@/components/providers/AuthProvider";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: any[];
}

export default function MobileNav({ isOpen, onClose, menuItems }: MobileNavProps) {
  const { isAuthenticated, logout } = useAuth();
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xl z-[10001]"
          />

          {/* Nav Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-4/5 bg-theme-bg z-[10002] shadow-2xl flex flex-col p-8 overflow-hidden"
          >

            <div className="flex justify-between items-center mb-16">
              <span className="font-serif text-xl tracking-widest text-theme-text">ATLAS</span>
              <button onClick={onClose} className="p-2 bg-theme-text/5 rounded-full text-theme-text">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-8 overflow-y-auto">
              {menuItems.filter((item: any) => item.label.toLowerCase() !== 'wholesale' && item.label.toLowerCase() !== 'our story').map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.children?.length > 0 ? (
                    <div>
                      <button
                        onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                        className="w-full flex justify-between items-center text-2xl font-serif text-theme-text hover:text-wine transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          size={18}
                          className={`transition-transform duration-300 ${openItem === item.id ? 'rotate-90' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {openItem === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 border-l border-theme-border mt-3 space-y-3">
                              {item.children.map((child: any) => (
                                <Link
                                  key={child.id || child.url}
                                  href={child.url}
                                  onClick={onClose}
                                  className="block text-base font-serif text-theme-text-muted hover:text-wine transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <MagneticLink>
                      <Link
                        href={item.url}
                        onClick={onClose}
                        className="group flex justify-between items-center text-2xl font-serif text-theme-text hover:text-wine transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                    </MagneticLink>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-6 pt-12 border-t border-theme-border">
              <div className="flex gap-6 text-[10px] uppercase font-bold tracking-[0.2em] text-theme-text-muted">
                <Link href="/account">Account</Link>
                <Link href="/support">Support</Link>
                <Link href="/wholesale/register">Wholesale</Link>
                {isAuthenticated && (
                  <button onClick={() => { logout(); onClose(); }} className="hover:text-red-500 transition-colors uppercase">Logout</button>
                )}
              </div>
              <p className="text-[10px] text-theme-text/30">Bespoke Luxury Wear • Salem, India</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
