'use client'
import { useUserStats } from '@/hooks/useUserStats'
import { useEffect, useState } from 'react'

export default function TestPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }, []);

    const { stakes, 
        topups, 
        balances, 
        totalBalanceUSDT, 
        totalStakedUSDT, 
        isLoading, 
        error } = useUserStats(user?.id);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>Please log in</div>;

    return <div>{topups.length} topups found</div>;
}