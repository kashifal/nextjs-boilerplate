import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staking from '@/models/staking';

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { amount, daysLeft } = await request.json();

        // Get the current staking
        const staking = await Staking.findById(id);
        if (!staking) {
            return NextResponse.json(
                { error: 'Staking not found' },
                { status: 404 }
            );
        }

        // Calculate new end date based on days left
        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + daysLeft);

        // Update staking
        const updatedStaking = await Staking.findByIdAndUpdate(
            id,
            {
                amount: amount,
                endDate: newEndDate,
                coinName: staking.coinName,
                // Recalculate daily profits if needed
                // You might want to adjust this based on your business logic
            },
            { new: true }
        ).populate('coin');

        return NextResponse.json({
            success: true,
            staking: updatedStaking
        });

    } catch (error) {
        console.error('Error updating staking:', error);
        return NextResponse.json(
            { error: 'Failed to update staking' },
            { status: 500 }
        );
    }
} 