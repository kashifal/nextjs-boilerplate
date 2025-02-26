import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    const { db } = await connectToDatabase();

    // Get current date
    const currentDate = new Date();

    // Find completed stakings
    const completedStakings = await db.collection('stakings').find({
      userId: userId,
      status: 'active',
      endDate: { $lte: currentDate }
    }).toArray();

    for (const staking of completedStakings) {
      // Start a session for transaction
      const session = client.startSession();
      
      try {
        await session.withTransaction(async () => {
          // Update user's balance
          await db.collection('users').updateOne(
            { _id: userId },
            { 
              $inc: {
                [`balances.byCoin.${staking.coinName}.amount`]: staking.totalProfit,
                'balances.totalUSDT': staking.totalProfitUSDT
              }
            },
            { session }
          );

          // Mark staking as completed
          await db.collection('stakings').updateOne(
            { _id: staking._id },
            { $set: { status: 'completed' } },
            { session }
          );
        });
      } finally {
        await session.endSession();
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Processed ${completedStakings.length} completed stakings`
    });

  } catch (error) {
    console.error('Error processing completed stakings:', error);
    return res.status(500).json({ error: 'Failed to process completed stakings' });
  }
}