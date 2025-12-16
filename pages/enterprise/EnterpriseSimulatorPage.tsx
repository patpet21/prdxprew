
import React, { useState, useEffect } from 'react';
import { EnterpriseSidebar } from '../../components/enterprise/EnterpriseSidebar';
import { supabase } from '../../lib/supabase';
import { Project, UserProfile, Investment, SecondaryListing } from '../../types';

// Platform Components
import { DashboardPage } from '../DashboardPage';
import { ProjectsPage } from '../ProjectsPage';
import { SecondaryMarketPage } from '../SecondaryMarketPage';

// Enterprise Modules
import { 
    ClientProjects,
    SpvBuilder,
    ValuationEngine,
    TokenBlueprintGenerator,
    AuditModule,
    DocumentGeneration,
    InvestorPackageBuilder,
    BusinessPlanView,
    DeploymentsConnector,
    SharedResources,
    Ent_StandardWorkflow 
} from '../../components/enterprise/steps';

interface EnterpriseSimulatorPageProps {
  onBack: () => void;
}

// Initial Mock Data for Enterprise (if DB is empty)
const MOCK_PROJECTS: Project[] = [
  { 
    id: '1', title: 'Skyline Tower A', category: 'Real Estate', total_value: 15000000, valuation: 15000000, status: 'active', progress: 85, imageColor: 'bg-indigo-500', lastUpdated: '2h ago', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', description: 'Premium Grade-A office tower.', location: 'New York, NY', annual_yield: 8.2, apy: 8.2, min_invest_tokens: 10, minTicket: 500, raise_amount: 15000000, targetRaise: 15000000, irr: 14.5, gross_profit: 1200000, token_price: 50, total_tokens: 300000, available_tokens: 45000, occupancy_rate: 98, construction_year: 2018, total_units: 120, interior_size_sqm: 15000, asset_type: 'Commercial Office', property_type: 'Commercial', risk_score: 2.5, sponsor: 'Skyline Developers LLC', property_manager: 'JLL Management', payout_type: 'Quarterly Net Rent', distribution_frequency: 'Quarterly', lockup_months: 12, exit_strategy: 'Refinance', visibility: 'public', featured: true, is_user_created: false
  }
];

export const EnterpriseSimulatorPage: React.FC<EnterpriseSimulatorPageProps> = ({ onBack }) => {
  const [activeModule, setActiveModule] = useState('client_projects'); // Default to Project List
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Global State for Platform Components
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [listings, setListings] = useState<SecondaryListing[]>([]);

  // Fetch Data on Mount to power the OS
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Projects
      const { data: dbProjects, error } = await supabase
        .from('properties')
        .select('*')
        .or('visibility.eq.public,status.in.(active,funding,funded,completed)');

      if (!error && dbProjects && dbProjects.length > 0) {
        const mappedProjects: Project[] = dbProjects.map((p: any) => ({
          ...p,
          id: p.id,
          imageUrl: p.image_url,
          valuation: Number(p.total_value),
          targetRaise: Number(p.raise_amount),
          apy: Number(p.annual_yield),
          minTicket: (Number(p.min_invest_tokens) || 1) * Number(p.token_price),
          irr: Number(p.roi_target),
          progress: p.raise_amount ? ((Number(p.raise_amount) - (Number(p.available_tokens) * Number(p.token_price))) / Number(p.raise_amount)) * 100 : 0,
          imageColor: 'bg-brand-500', 
          lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Recently'
        }));
        setProjects(mappedProjects);
      }

      // 2. Fetch User & Investments
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) setUserProfile(profile);

        const { data: userInv } = await supabase.from('investments').select('*').eq('user_id', session.user.id);
        if (userInv) setInvestments(userInv);
      } else {
        // Mock Admin Profile for Enterprise View
        setUserProfile({
            id: 'admin',
            full_name: 'Enterprise Admin',
            email: 'admin@propertydex.os',
            country: 'Global',
            kyc_verified: true,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_pro_member: true
        });
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
      switch (activeModule) {
          // --- PLATFORM ---
          case 'platform_dashboard': 
              return <DashboardPage 
                  projects={projects} 
                  onCreateNew={() => setActiveModule('standard_workflow')} 
                  onLogout={onBack} 
                  onGoHome={onBack} 
                  onGoToTrading={() => setActiveModule('platform_trading')}
                  isEmbedded={true} 
              />;
          case 'platform_market': 
              return <ProjectsPage 
                  projects={projects} 
                  onBack={() => setActiveModule('platform_dashboard')} 
                  onLogin={() => {}} 
                  onNavigate={(p) => console.log("Nav", p)} 
                  onSelectProject={(p) => console.log("Selected", p)}
                  isEmbedded={true} 
              />;
          case 'platform_trading': 
              return <div className="h-full rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
                 <SecondaryMarketPage 
                    listings={listings} 
                    onBack={() => setActiveModule('platform_dashboard')} 
                    onLogin={() => {}} 
                    onNavigate={() => {}} 
                    onListToken={(l) => setListings([l, ...listings])}
                    isEmbedded={true} 
                 />
              </div>;

          // --- SIMULATORS ---
          case 'standard_workflow': 
              return (
                  <div className="h-full flex flex-col space-y-4">
                       <div className="flex items-center justify-between shrink-0 bg-slate-900 p-4 rounded-xl border border-slate-800">
                           <button onClick={() => setActiveModule('client_projects')} className="text-slate-400 hover:text-white text-sm flex items-center gap-2 font-bold">
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                               Close Simulator
                           </button>
                           <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Standard Mode Active</span>
                       </div>
                       <Ent_StandardWorkflow />
                  </div>
              );
              
          case 'client_projects': return <ClientProjects onNavigate={setActiveModule} />;
          
          // Case for direct Sidebar click on "Enterprise Architect" -> Goes to Project List first
          case 'create_enterprise': return <ClientProjects onNavigate={setActiveModule} />;

          // --- MODULES ---
          case 'spv_builder': return <SpvBuilder />;
          case 'valuation_engine': return <ValuationEngine />;
          case 'token_blueprint_generator': return <TokenBlueprintGenerator />;
          case 'audit_module': return <AuditModule />;
          case 'document_generation': return <DocumentGeneration />;
          case 'investor_package_builder': return <InvestorPackageBuilder />;
          case 'business_plan': return <BusinessPlanView />;
          case 'deployments_connector': return <DeploymentsConnector />;
          case 'shared_resources': return <SharedResources />;
          
          default: return <ClientProjects onNavigate={setActiveModule} />;
      }
  };

  const getModuleTitle = () => {
      const titles: Record<string, string> = {
          'platform_dashboard': 'Operating System',
          'platform_market': 'Global Marketplace',
          'platform_trading': 'Secondary Market',
          'client_projects': 'Project Manager',
          'standard_workflow': 'Standard Simulator',
          'create_enterprise': 'Enterprise Architect',
          'spv_builder': 'SPV Structuring',
          'valuation_engine': 'Valuation Engine',
          'token_blueprint_generator': 'Token Blueprint',
          'audit_module': 'Compliance Audit',
          'document_generation': 'Legal Engineering',
          'investor_package_builder': 'Data Room',
          'business_plan': 'Business Plan',
          'deployments_connector': 'Chain Deployments',
          'shared_resources': 'System Resources'
      };
      return titles[activeModule] || 'Enterprise';
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200 overflow-hidden selection:bg-amber-500/30">
        
        {/* Enterprise Sidebar */}
        <EnterpriseSidebar 
            activeModule={activeModule}
            onSelect={setActiveModule}
            onLogout={onBack}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
            
            {/* Header */}
            <header className="h-16 lg:h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg active:bg-slate-800 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-4">
                        <h1 className="text-lg font-bold text-white font-display tracking-tight">{getModuleTitle()}</h1>
                        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            OS Active
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 lg:gap-4">
                    <div className="hidden md:block text-right">
                         <div className="text-xs font-bold text-white">{userProfile?.full_name || 'Enterprise Admin'}</div>
                         <div className="text-[10px] text-amber-500 uppercase tracking-wider">Super User</div>
                    </div>
                    <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs shadow-lg shadow-amber-500/20 ring-2 ring-slate-900">
                        {userProfile?.full_name?.charAt(0) || 'A'}
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar bg-slate-950 scroll-smooth ${activeModule.startsWith('platform_') ? 'p-4 lg:p-6' : 'p-4 lg:p-8'}`}>
                <div className="max-w-[1600px] mx-auto h-full">
                    {renderContent()}
                </div>
            </div>
        </main>

    </div>
  );
};
