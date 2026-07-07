import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

const STORAGE_KEY = 'moodsync.profile';

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';

export type RingGradient = readonly [string, string];

export type UserProfile = {
  fullName: string;
  handle: string;
  email: string;
  phone: string;
  gender: Gender | null;
  avatarUri: string | null;
  bannerUri: string | null;
  ringGradient: RingGradient;
};

export const RING_GRADIENT_OPTIONS: { name: string; colors: RingGradient }[] = [
  { name: 'Sunset Blaze', colors: ['#FF5F6D', '#FFC371'] },
  { name: 'Violet Dream', colors: ['#8B5CF6', '#EC4899'] },
  { name: 'Ocean Breeze', colors: ['#3B82F6', '#22D3EE'] },
  { name: 'Emerald Glow', colors: ['#22C55E', '#A7F3D0'] },
  { name: 'Golden Hour', colors: ['#F59E0B', '#FDE68A'] },
  { name: 'Berry Punch', colors: ['#DB2777', '#F472B6'] },
  { name: 'Royal Indigo', colors: ['#4C1D95', '#8B5CF6'] },
  { name: 'Coral Reef', colors: ['#FB7185', '#FDBA74'] },
];

export const DEFAULT_RING_GRADIENT: RingGradient = RING_GRADIENT_OPTIONS[1].colors;

const EMPTY_PROFILE: UserProfile = {
  fullName: '',
  handle: '',
  email: '',
  phone: '',
  gender: null,
  avatarUri: null,
  bannerUri: null,
  ringGradient: DEFAULT_RING_GRADIENT,
};

type ProfileContextValue = {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function isValidProfile(value: unknown): value is Partial<UserProfile> {
  return typeof value === 'object' && value !== null;
}

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (!isValidProfile(parsed)) return;
        setProfile((previous) => ({ ...previous, ...parsed }));
      })
      .catch(() => {});
  }, []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((previous) => {
      const next = { ...previous, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, updateProfile }),
    [profile, updateProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
