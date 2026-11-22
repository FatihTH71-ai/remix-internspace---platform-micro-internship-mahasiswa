import React from 'react';
import { useApp } from '../../context/AppContext';

import overviewIcon from '../../assets/figma-admin/nav/overview.svg';
import validationsIcon from '../../assets/figma-admin/nav/validations.svg';
import studentsIcon from '../../assets/figma-admin/nav/students.svg';
import companiesIcon from '../../assets/figma-admin/nav/companies.svg';
import signOutIcon from '../../assets/figma-admin/nav/sign-out.svg';

type AdminView =
  | 'admin_dashboard'
  | 'admin_control'
  | 'students_directory'
  | 'partner_companies';

type AdminSidebarProps = {
  activeView: AdminView;
  onNavigate?: (view: AdminView) => void;
};

const navigation = [
  {
    label: 'Overview',
    view: 'admin_dashboard' as AdminView,
    icon: overviewIcon,
    gap: 16,
    width: 18,
    height: 18,
  },
  {
    label: 'Validations',
    view: 'admin_control' as AdminView,
    icon: validationsIcon,
    gap: 18,
    width: 16,
    height: 20,
  },
  {
    label: 'Students',
    view: 'students_directory' as AdminView,
    icon: studentsIcon,
    gap: 12,
    width: 22,
    height: 16,
  },
  {
    label: 'Companies',
    view: 'partner_companies' as AdminView,
    icon: companiesIcon,
    gap: 14,
    width: 20,
    height: 18,
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeView,
  onNavigate,
}) => {
  const { setCurrentView, logout } = useApp();

  const navigate = (view: AdminView) => {
    if (onNavigate) {
      onNavigate(view);
      return;
    }
    setCurrentView(view);
  };

  const handleSignOut = () => {
    logout();
    setCurrentView('login_admin');
  };

  return (
    <aside className="fixed bottom-0 left-0 top-20 z-20 flex w-64 flex-col justify-between bg-[#f3f3f6] px-4 py-8 max-[1100px]:w-[204px]">
      <div>
        <p className="px-4 pb-8 text-xs uppercase leading-3 tracking-[0.05em] text-[#707882]">
          Main Menu
        </p>
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = item.view === activeView;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.view)}
                style={{ gap: item.gap }}
                className={`flex w-full items-center rounded-[48px] px-4 py-3 text-left text-xs font-bold leading-3 tracking-[0.05em] transition-colors ${
                  isActive
                    ? 'bg-[#0078c7] text-white'
                    : 'text-[#404751] hover:bg-[#e4e6eb]'
                }`}
              >
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: item.width, height: item.height }}
                  className={`shrink-0 object-contain ${
                    isActive ? 'brightness-0 invert' : 'opacity-75'
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-3 rounded-[48px] px-4 py-3 text-xs leading-3 tracking-[0.05em] text-[#ba1a1a]"
      >
        <img src={signOutIcon} alt="" className="h-[18px] w-[18px]" />
        Sign Out
      </button>
    </aside>
  );
};
