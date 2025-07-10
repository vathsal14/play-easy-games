
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  signUp: (email: string, password: string, displayName?: string, referralCode?: string) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<any | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile after auth state change
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Fetched profile data:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  };

  // Function to add spins to a user's account
  const addSpins = async (userId: string, spinCount: number) => {
    try {
      console.log(`Attempting to add ${spinCount} spin(s) to user ${userId}`);
      
      // First get the current spins
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('spins')
        .eq('id', userId)
        .single();

      if (fetchError || !currentProfile) {
        console.error('Error fetching current spins:', fetchError);
        return { error: fetchError || new Error('Profile not found') };
      }

      const currentSpins = currentProfile.spins || 0;
      const newSpins = currentSpins + spinCount;

      console.log(`Updating spins for user ${userId}: ${currentSpins} -> ${newSpins}`);

      // Update the spins
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          spins: newSpins,
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating spins:', updateError);
        return { error: updateError };
      }

      console.log('Successfully updated spins:', updatedProfile);
      
      // If the updated profile is for the current user, update the local state
      if (user?.id === userId) {
        await refreshProfile();
      }

      return { data: updatedProfile };
    } catch (error) {
      console.error('Error in addSpins:', error);
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('Refreshing profile for user:', user.id);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error refreshing profile:', error);
          throw error;
        }
        
        console.log('Refreshed profile data:', data);
        setProfile(data);
        return data;
      } catch (error) {
        console.error('Error in refreshProfile:', error);
        throw error;
      }
    }
    return null;
  };

  const signUp = async (email: string, password: string, displayName?: string, referralCode?: string) => {
    try {
      console.log('Signing up user:', email, 'with referral:', referralCode);
      
      // Normalize referral code to uppercase if provided
      const normalizedReferralCode = referralCode?.trim().toUpperCase();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            referral_code: normalizedReferralCode
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      console.log('Sign up successful:', data);

      // Process referral after successful signup if referral code was provided
      if (normalizedReferralCode && data?.user) {
        console.log('Processing referral for new user:', data.user.id);
        
        // Use a shorter delay and better error handling
        setTimeout(async () => {
          await processReferral(data.user.id, normalizedReferralCode);
        }, 2000); // Reduced to 2 seconds
      }

      return { error: null, data };
    } catch (error) {
      console.error('Sign up catch error:', error);
      return { error };
    }
  };

  const processReferral = async (newUserId: string, referralCode: string) => {
    try {
      console.log('Processing referral:', { newUserId, referralCode });
      
      // Find the referrer by their referral code (case-insensitive search)
      const { data: referrerData, error: referrerError } = await supabase
        .from('profiles')
        .select('id, referral_code, spins')
        .ilike('referral_code', referralCode)
        .maybeSingle();

      if (referrerError) {
        console.error('Error finding referrer:', referrerError);
        return { error: referrerError };
      }

      if (!referrerData) {
        const error = new Error('No referrer found with the provided code');
        console.error(error.message, { referralCode });
        return { error };
      }

      console.log('Found referrer:', referrerData);

      // Check if this referral already exists to avoid duplicates
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', referrerData.id)
        .eq('referred_id', newUserId)
        .maybeSingle();

      if (existingReferral) {
        console.log('Referral already exists, skipping');
        return { error: 'Referral already exists' };
      }

      // Check how many referrals this referrer already has
      const { data: referralCount, error: countError } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', referrerData.id);

      if (countError) {
        console.error('Error checking referral count:', countError);
        return { error: countError };
      }

      if (referralCount && referralCount.length >= 3) {
        const error = 'Referrer has reached maximum referrals (3)';
        console.log(error);
        return { error };
      }

      // Start a transaction to ensure both operations complete successfully
      const { data: referralData, error: referralInsertError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerData.id,
          referred_id: newUserId,
          referral_code: referralCode.toUpperCase(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (referralInsertError) {
        console.error('Error inserting referral:', referralInsertError);
        return { error: referralInsertError };
      }

      console.log('Referral record created successfully:', referralData);

      // Add 1 spin to the referrer's account
      const { error: spinError } = await addSpins(referrerData.id, 1);
      
      if (spinError) {
        console.error('Failed to add spin to referrer:', spinError);
        return { error: spinError };
      }

      console.log('Successfully processed referral and awarded spin');
      return { success: true };

    } catch (error) {
      console.error('Error processing referral:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    addSpins,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
