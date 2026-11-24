'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  CampusProduct,
  Bounty,
  AlumSpotlight,
  DealRoomAction,
  RoastAnnotation,
  VouchEndorsement,
  StudentCohort,
} from '../types';
import {
  PRESET_USERS,
  INITIAL_PRODUCTS,
  INITIAL_BOUNTIES,
  INITIAL_SPOTLIGHTS,
  INITIAL_DEAL_ROOMS,
} from '../data/seedData';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  allPresetUsers: UserProfile[];
  products: CampusProduct[];
  bounties: Bounty[];
  spotlights: AlumSpotlight[];
  dealRooms: DealRoomAction[];
  activeTab: 'feed' | 'radar' | 'roasts' | 'bounties' | 'spotlights' | 'tp_admin' | 'journey_map';
  setActiveTab: (tab: 'feed' | 'radar' | 'roasts' | 'bounties' | 'spotlights' | 'tp_admin' | 'journey_map') => void;
  feedFilter: 'all' | 'products' | 'bounties' | 'spotlights';
  setFeedFilter: (filter: 'all' | 'products' | 'bounties' | 'spotlights') => void;
  selectedCohortFilter: StudentCohort | 'all';
  setSelectedCohortFilter: (cohort: StudentCohort | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Modals & Active State
  activeModal: null | 'onboarding' | 'roast' | 'vouch' | 'deal_room' | 'live_demo' | 'vouch_card_view';
  activeProductForModal: CampusProduct | null;
  activeVouchCardForView: VouchEndorsement | null;
  dealRoomInitialType: 'acqui_hire' | 'paid_gig' | 'fast_track_interview' | 'campus_shortlist';
  
  openOnboardingModal: () => void;
  openRoastModal: (product: CampusProduct) => void;
  openVouchModal: (product: CampusProduct) => void;
  openDealRoomModal: (
    product: CampusProduct,
    initialType?: 'acqui_hire' | 'paid_gig' | 'fast_track_interview' | 'campus_shortlist'
  ) => void;
  openLiveDemoModal: (product: CampusProduct) => void;
  openVouchCardViewModal: (vouch: VouchEndorsement, product: CampusProduct) => void;
  closeModal: () => void;

  // Actions
  addRoast: (productId: string, roast: { category: RoastAnnotation['category']; feedback: string; rating: number }) => void;
  toggleRoastResolved: (productId: string, roastId: string) => void;
  addVouch: (productId: string, vouch: { quote: string; certifiedSkills: string[] }) => VouchEndorsement;
  submitDealRoomAction: (action: {
    productId: string;
    productTitle: string;
    actionType: DealRoomAction['actionType'];
    message: string;
    proposedCompensation?: string;
  }) => void;
  applyToBounty: (bountyId: string) => boolean;
  addBounty: (bounty: {
    title: string;
    stipend: string;
    duration: string;
    targetCohort: StudentCohort | 'All';
    description: string;
    deliverables: string[];
    skillsRequired: string[];
    deadline: string;
  }) => void;
  addNewProductShip: (newProduct: Partial<CampusProduct>) => void;
  endorseUserSkill: (userId: string, skillName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(PRESET_USERS[0]);
  const [allPresetUsers] = useState<UserProfile[]>(PRESET_USERS);
  const [products, setProducts] = useState<CampusProduct[]>(INITIAL_PRODUCTS);
  const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
  const [spotlights] = useState<AlumSpotlight[]>(INITIAL_SPOTLIGHTS);
  const [dealRooms, setDealRooms] = useState<DealRoomAction[]>(INITIAL_DEAL_ROOMS);

  const [activeTab, setActiveTab] = useState<'feed' | 'radar' | 'roasts' | 'bounties' | 'spotlights' | 'tp_admin' | 'journey_map'>('feed');

  // Hydrate state from persistent local JSON databases (.local-db/*.json)
  useEffect(() => {
    fetch('/api/gateway?full=true')
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === 'ok') {
          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
          if (Array.isArray(data.bounties) && data.bounties.length > 0) {
            setBounties(data.bounties);
          }
          if (Array.isArray(data.dealRooms) && data.dealRooms.length > 0) {
            setDealRooms(data.dealRooms);
          }
        }
      })
      .catch(() => {
        // Keep initial seed fallback if offline
      });
  }, []);

  const persistToGateway = (action: string, payload: Record<string, unknown>) => {
    fetch('/api/gateway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    }).catch(() => {
      // Non-blocking persistence
    });
  };

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
    if (user.role === 'tp_admin') {
      setActiveTab('tp_admin');
    } else {
      setActiveTab((prev) => (prev === 'tp_admin' ? 'feed' : prev));
    }
  };
  const [feedFilter, setFeedFilter] = useState<'all' | 'products' | 'bounties' | 'spotlights'>('all');
  const [selectedCohortFilter, setSelectedCohortFilter] = useState<StudentCohort | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeModal, setActiveModal] = useState<null | 'onboarding' | 'roast' | 'vouch' | 'deal_room' | 'live_demo' | 'vouch_card_view'>(null);
  const [activeProductForModal, setActiveProductForModal] = useState<CampusProduct | null>(null);
  const [activeVouchCardForView, setActiveVouchCardForView] = useState<VouchEndorsement | null>(null);
  const [dealRoomInitialType, setDealRoomInitialType] = useState<'acqui_hire' | 'paid_gig' | 'fast_track_interview' | 'campus_shortlist'>('acqui_hire');

  const openOnboardingModal = () => {
    setActiveModal('onboarding');
  };

  const openRoastModal = (product: CampusProduct) => {
    setActiveProductForModal(product);
    setActiveModal('roast');
  };

  const openVouchModal = (product: CampusProduct) => {
    setActiveProductForModal(product);
    setActiveModal('vouch');
  };

  const openDealRoomModal = (
    product: CampusProduct,
    initialType: 'acqui_hire' | 'paid_gig' | 'fast_track_interview' | 'campus_shortlist' = 'acqui_hire'
  ) => {
    setActiveProductForModal(product);
    setDealRoomInitialType(initialType);
    setActiveModal('deal_room');
  };

  const openLiveDemoModal = (product: CampusProduct) => {
    setActiveProductForModal(product);
    setActiveModal('live_demo');
  };

  const openVouchCardViewModal = (vouch: VouchEndorsement, product: CampusProduct) => {
    setActiveProductForModal(product);
    setActiveVouchCardForView(vouch);
    setActiveModal('vouch_card_view');
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveProductForModal(null);
    setActiveVouchCardForView(null);
  };

  // Add async roast annotation
  const addRoast = (
    productId: string,
    roastData: { category: RoastAnnotation['category']; feedback: string; rating: number }
  ) => {
    const newRoast: RoastAnnotation = {
      id: `roast_${Date.now()}`,
      alumName: currentUser.name,
      alumRole: currentUser.designation || 'Alumni Reviewer',
      alumCompany: currentUser.company || 'Industry Partner',
      alumBatch: currentUser.batchYear || 2018,
      alumAvatar: currentUser.avatar,
      category: roastData.category,
      feedback: roastData.feedback,
      rating: roastData.rating,
      resolved: false,
      timestamp: 'Just now',
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            roasts: [newRoast, ...p.roasts],
          };
        }
        return p;
      })
    );
    persistToGateway('add_roast', { productId, roast: newRoast });
  };

  // Toggle roast resolved
  const toggleRoastResolved = (productId: string, roastId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            roasts: p.roasts.map((r) => (r.id === roastId ? { ...r, resolved: !r.resolved } : r)),
          };
        }
        return p;
      })
    );
    persistToGateway('resolve_roast', { productId, roastId });
  };

  // Add Verified Vouch
  const addVouch = (
    productId: string,
    vouchData: { quote: string; certifiedSkills: string[] }
  ): VouchEndorsement => {
    const newCode = `SOA-VOUCH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVouch: VouchEndorsement = {
      id: `vouch_${Date.now()}`,
      vouchCode: newCode,
      alumName: currentUser.name,
      alumRole: currentUser.designation || 'Alumni Reviewer',
      alumCompany: currentUser.company || 'Industry Partner',
      alumBatch: currentUser.batchYear || 2018,
      alumAvatar: currentUser.avatar,
      quote: vouchData.quote,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      certifiedSkills: vouchData.certifiedSkills,
      publicUrl: `https://alumconnect.soa.ac.in/vouch/${newCode.toLowerCase()}`,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            status: 'verified',
            vouches: [newVouch, ...p.vouches],
          };
        }
        return p;
      })
    );
    persistToGateway('add_vouch', { productId, vouch: newVouch });

    return newVouch;
  };

  // Submit Deal Room Action
  const submitDealRoomAction = (actionData: {
    productId: string;
    productTitle: string;
    actionType: DealRoomAction['actionType'];
    message: string;
    proposedCompensation?: string;
  }) => {
    const newDeal: DealRoomAction = {
      id: `deal_${Date.now()}`,
      productId: actionData.productId,
      productTitle: actionData.productTitle,
      senderName: currentUser.name,
      senderRole: currentUser.designation || 'Hiring Lead',
      senderCompany: currentUser.company || 'Enterprise',
      actionType: actionData.actionType,
      message: actionData.message,
      proposedCompensation: actionData.proposedCompensation,
      timestamp: 'Just now',
      status: 'Pending Review',
    };

    setDealRooms((prev) => [newDeal, ...prev]);
    persistToGateway('submit_deal_room', { deal: newDeal });
  };

  // Apply to Bounty
  const applyToBounty = (bountyId: string): boolean => {
    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === bountyId) {
          return {
            ...b,
            appliedSquadsCount: b.appliedSquadsCount + 1,
          };
        }
        return b;
      })
    );
    persistToGateway('apply_bounty', { bountyId });
    return true;
  };

  // Post a new Bounty from Alumni Marketplace
  const addBounty = (bountyData: {
    title: string;
    stipend: string;
    duration: string;
    targetCohort: StudentCohort | 'All';
    description: string;
    deliverables: string[];
    skillsRequired: string[];
    deadline: string;
  }) => {
    const newBounty: Bounty = {
      id: `bounty_${Date.now()}`,
      title: bountyData.title,
      company: currentUser.company || 'Alumni Partner',
      alumName: currentUser.name,
      alumBatch: currentUser.batchYear || 2018,
      alumAvatar: currentUser.avatar,
      stipend: bountyData.stipend,
      duration: bountyData.duration,
      targetCohort: bountyData.targetCohort,
      description: bountyData.description,
      deliverables: bountyData.deliverables,
      skillsRequired: bountyData.skillsRequired,
      appliedSquadsCount: 0,
      status: 'Open',
      deadline: bountyData.deadline,
    };

    setBounties((prev) => [newBounty, ...prev]);
    persistToGateway('create_bounty', { bounty: newBounty });
  };

  // Add new Product Ship
  const addNewProductShip = (newProduct: Partial<CampusProduct>) => {
    const fullProduct: CampusProduct = {
      id: `prod_${Date.now()}`,
      title: newProduct.title || 'Untitled Project',
      tagline: newProduct.tagline || 'Student build from SOA ITER',
      description: newProduct.description || 'Shipped on ITER Alum Connect',
      category: newProduct.category || 'web_app',
      status: 'beta',
      userTraction: newProduct.userTraction || 10,
      tractionLabel: `${newProduct.userTraction || 10}+ Campus Beta Testers`,
      githubUrl: newProduct.githubUrl || 'https://github.com/iter-builders',
      commitsCount: newProduct.commitsCount || 12,
      recentCommits: [
        { hash: 'a1b2c3d', message: 'feat: initial production launch on SOA Alum Connect', author: currentUser.name, timeAgo: 'Just now' },
      ],
      liveDemoUrl: newProduct.liveDemoUrl || 'https://demo.soa.ac.in',
      previewImage: newProduct.previewImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      squadMembers: [
        {
          name: currentUser.name,
          year: currentUser.studentYearLabel || '2nd Year',
          cohort: currentUser.cohort || '2nd_year',
          role: currentUser.squadRole || 'Squad Lead',
          avatar: currentUser.avatar,
          branch: currentUser.branch || 'CSE',
        },
      ],
      vouches: [],
      roasts: [],
      tags: newProduct.tags || ['Next.js', 'React', 'Tailwind', 'PostgreSQL'],
      problemStatement: newProduct.problemStatement,
      rolesNeeded: newProduct.rolesNeeded,
      hiringStatus: newProduct.hiringStatus || 'Open for Internships',
      publishedAt: 'Just now',
      viewsCount: 42,
    };

    setProducts((prev) => [fullProduct, ...prev]);
    persistToGateway('ship_product', { product: fullProduct });
  };

  const endorseUserSkill = (userId: string, skillName: string) => {
    // Endorse logic
    console.log(`Endorsed skill ${skillName} for user ${userId}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allPresetUsers,
        products,
        bounties,
        spotlights,
        dealRooms,
        activeTab,
        setActiveTab,
        feedFilter,
        setFeedFilter,
        selectedCohortFilter,
        setSelectedCohortFilter,
        searchQuery,
        setSearchQuery,
        activeModal,
        activeProductForModal,
        activeVouchCardForView,
        dealRoomInitialType,
        openOnboardingModal,
        openRoastModal,
        openVouchModal,
        openDealRoomModal,
        openLiveDemoModal,
        openVouchCardViewModal,
        closeModal,
        addRoast,
        toggleRoastResolved,
        addVouch,
        submitDealRoomAction,
        applyToBounty,
        addBounty,
        addNewProductShip,
        endorseUserSkill,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
