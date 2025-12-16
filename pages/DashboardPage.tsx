
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { SettingsTab } from '../components/dashboard/SettingsTab';
import { WalletTab } from '../components/dashboard/WalletTab';
import { StakingPanel } from '../components/dashboard/StakingPanel';
import { TasksTab } from '../components/dashboard/TasksTab'; // Import TasksTab
import { ProjectDetailsPage } from './ProjectDetailsPage';
import { SecondaryMarketPage } from './SecondaryMarketPage';
import { ProjectCard } from '../components/ui/ProjectCard';
import { DashboardTab, Project, UserProfile, Investment } from '../types';
import { supabase } from '../lib/supabase';

interface DashboardPageProps {
  projects: Project[];
  onCreateNew: () => void;
  onLogout: () => void;
  onGoHome: () => void;
  onGoToTrading: () => void;
  isEmbedded?: boolean; // NEW: Controls layout for enterprise integration
  // New props for navigation
  onNavigate?: (page: string) => void;
}

type ViewState = DashboardTab | 'PROJECT_DETAILS';

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  projects, 
  onCreateNew, 
  onLogout, 
  onGoHome,
  onNavigate,
  isEmbedded = false 
}) => {
  const [activeTab, setActiveTab] = useState<ViewState>('OVERVIEW');
  const [previousTab, setPreviousTab] = useState<DashboardTab>('OVERVIEW');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Mock balance for staking demo in Free Dashboard
  const [userBalance, setUserBalance] = useState(2500);

  useEffect(() => {
    const fetchUserData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (profile) setUserProfile(profile);

            const { data: userInvestments } = await supabase.from('investments').select('*').eq('user_id', session.user.id);
            if (userInvestments) {
                setInvestments(userInvestments);
                const total = userInvestments.reduce((sum: number, inv: any) => sum + (inv.investment_amount || 0), 0);
                setTotalValue(total);
            }
        }
    };
    fetchUserData();
  }, []);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setPreviousTab(tab); 
    setSelectedProject(null);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setActiveTab('PROJECT_DETAILS');
  };

  const handleBackFromProject = () => {
    setActiveTab(previousTab);
    setSelectedProject(null);
  };

  // --- NEW HANDLERS FOR ENHANCED DASHBOARD ---
  const handleContinueSimulation = () => {
    if (onNavigate) onNavigate('SIM_INTRO');
    else onCreateNew();
  };

  const handleDownloadSnapshot = () => {
    alert("Downloading Project Snapshot PDF...");
  };

  const handleViewRoadmap = () => {
     if(onNavigate) onNavigate('SIM_WIZARD');
     else onCreateNew();
  };

  return (
    <div className={`bg-slate-50 font-sans transition-all h-screen flex overflow-hidden`}>
      
      {/* Sidebar - Only show if NOT embedded */}
      {!isEmbedded && (
        <Sidebar 
          activeTab={activeTab === 'PROJECT_DETAILS' ? 'ASSETS' : activeTab}
          onTabChange={handleTabChange} 
          onLogout={onLogout} 
          onGoHome={onGoHome}
          onGoToTrading={() => handleTabChange('TRADING')}
          onNavigateToSimulator={() => onNavigate && onNavigate('SIM_INTRO')}
          onNavigateToAcademy={() => onNavigate && onNavigate('PRO_ACADEMY')}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Header */}
          {!isEmbedded && (
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-30">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <h1 className="text-lg font-bold text-slate-800 font-display truncate">
                  {activeTab === 'OVERVIEW' && 'Command Center'}
                  {activeTab === 'ASSETS' && 'My Portfolio'}
                  {activeTab === 'TRADING' && 'Secondary Market'}
                  {activeTab === 'WALLET' && 'Web3 Wallet'}
                  {activeTab === 'STAKING' && 'Staking & Yield'}
                  {activeTab === 'DOCS' && 'Documents'}
                  {activeTab === 'SETTINGS' && 'Account Settings'}
                  {activeTab === 'TASKS' && 'Task Management'}
                  {activeTab === 'PROJECT_DETAILS' && (selectedProject?.title || 'Asset Details')}
                </h1>
              </div>

              <div className="flex items-center gap-3 pl-2 md:pl-4">
                <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-slate-900">{userProfile?.full_name || 'Investor'}</div>
                    <div className="text-xs text-slate-500 capitalize">{userProfile?.country || 'Global'}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                  <img src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.email || 'default'}`} className="w-full h-full object-cover" alt="User" />
                </div>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main 
            className={`
                flex-1 overflow-y-auto custom-scrollbar 
                ${isEmbedded ? 'w-full h-full p-0' : 'p-4 md:p-6 bg-slate-100/50'}
                ${activeTab === 'TRADING' ? 'p-0' : ''}
            `}
          >
            {/* OVERVIEW */}
            {activeTab === 'OVERVIEW' && (
              <OverviewTab 
                userProfile={userProfile}
                investments={investments}
                projects={projects}
                totalValue={totalValue}
                onViewAllAssets={() => handleTabChange('ASSETS')}
                onIssueNew={onCreateNew}
                onSelectProject={handleSelectProject}
                onContinueSimulation={handleContinueSimulation}
                onDownloadSnapshot={handleDownloadSnapshot}
                onViewRoadmap={handleViewRoadmap}
                onNavigateToAcademy={() => onNavigate && onNavigate('PRO_ACADEMY')}
              />
            )}

            {/* ASSETS */}
            {activeTab === 'ASSETS' && (
               <div className="space-y-6 animate-fadeIn max-w-[1600px] mx-auto">
                  <div className="flex justify-between items-center">
                     <h2 className="text-xl font-bold text-slate-900">Your Portfolio</h2>
                     <button onClick={onCreateNew} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 shadow-lg">
                        + Issue Asset
                     </button>
                  </div>
                  
                  {investments.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                         {investments.map(inv => {
                            const proj = projects.find(p => p.id === inv.property_id);
                            return proj ? (
                               <ProjectCard key={proj.id} project={proj} onClick={() => handleSelectProject(proj)} />
                            ) : null;
                         })}
                      </div>
                  ) : (
                      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                          <div className="text-4xl mb-4 opacity-50">💼</div>
                          <h3 className="text-lg font-bold text-slate-900">No Assets Found</h3>
                          <p className="text-slate-500 mb-6">Invest in the marketplace or tokenize your own asset.</p>
                          <button onClick={() => handleTabChange('TRADING')} className="text-brand-600 font-bold hover:underline">Go to Marketplace</button>
                      </div>
                  )}
               </div>
            )}

            {/* TRADING */}
            {activeTab === 'TRADING' && (
                <div className={`animate-fadeIn bg-slate-950 h-full w-full ${isEmbedded ? 'rounded-xl overflow-hidden' : ''}`}>
                    <SecondaryMarketPage 
                        listings={[]} 
                        onBack={() => handleTabChange('OVERVIEW')} 
                        onLogin={() => {}} 
                        onNavigate={() => {}}
                        isEmbedded={true}
                    />
                </div>
            )}

            {/* WALLET */}
            {activeTab === 'WALLET' && (
                <div className="max-w-5xl mx-auto"><WalletTab /></div>
            )}

            {/* STAKING */}
            {activeTab === 'STAKING' && (
                <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
                   <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm text-center">
                      <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">Liquidity Mining</h2>
                      <p className="text-slate-500 max-w-xl mx-auto mb-8">
                          Lock your asset tokens to provide liquidity to the secondary market. 
                          Earn APY in real-time.
                      </p>
                      <StakingPanel 
                        userBalance={userBalance} 
                        onUpdateBalance={(amt) => setUserBalance(prev => prev + amt)} 
                        isPro={false} 
                      />
                   </div>
                </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'SETTINGS' && (
                <div className="max-w-5xl mx-auto"><SettingsTab userProfile={userProfile} /></div>
            )}

            {/* TASKS */}
            {activeTab === 'TASKS' && (
                <div className="max-w-5xl mx-auto"><TasksTab /></div>
            )}

            {/* DOCS */}
            {activeTab === 'DOCS' && (
                 <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                     <div className="text-4xl mb-4 opacity-50">📂</div>
                     <h3 className="text-lg font-bold text-slate-900">Document Vault</h3>
                     <p className="text-slate-500 mb-6">Securely store your SPV formation documents here.</p>
                     <button onClick={onCreateNew} className="text-brand-600 font-bold hover:underline">Create Project</button>
                 </div>
            )}

            {/* DETAILS */}
            {activeTab === 'PROJECT_DETAILS' && selectedProject && (
                <ProjectDetailsPage 
                    project={selectedProject} 
                    onBack={handleBackFromProject}
                    onInvest={(amt) => console.log('Internal invest', amt)}
                    isEmbedded={true}
                />
            )}

          </main>
      </div>
    </div>
  );
};
