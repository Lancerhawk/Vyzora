import { create } from 'zustand';

interface ModalStore {
    isChangelogOpen: boolean;
    isPrivacyOpen: boolean;
    isTermsOpen: boolean;
    openChangelog: () => void;
    closeChangelog: () => void;
    openPrivacy: () => void;
    closePrivacy: () => void;
    openTerms: () => void;
    closeTerms: () => void;
}

export const useStore = create<ModalStore>((set) => ({
    isChangelogOpen: false,
    isPrivacyOpen: false,
    isTermsOpen: false,
    openChangelog: () => set({ isChangelogOpen: true }),
    closeChangelog: () => set({ isChangelogOpen: false }),
    openPrivacy: () => set({ isPrivacyOpen: true }),
    closePrivacy: () => set({ isPrivacyOpen: false }),
    openTerms: () => set({ isTermsOpen: true }),
    closeTerms: () => set({ isTermsOpen: false }),
}));
