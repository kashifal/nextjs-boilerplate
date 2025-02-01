import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

import connectDB from '@/lib/db';
import Coin from '@/models/coin';
import Staking from '@/models/staking';


export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const logo = formData.get('logo');
    const qrcode = formData.get('qrcode');
    const data = JSON.parse(formData.get('data'));

    let logoUrl = null;
    let qrcodeUrl = null;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    
    // Handle logo upload
    if (logo && logo instanceof File) {
      try {
        await writeFile(`${uploadsDir}/${logo.name}`, Buffer.from(await logo.arrayBuffer()));
        logoUrl = `/uploads/${logo.name}`;
      } catch (error) {
        console.error('Error saving logo:', error);
        return NextResponse.json(
          { error: 'Failed to save logo image' },
          { status: 500 }
        );
      }
    }

    // Handle QR code upload
    if (qrcode && qrcode instanceof File) {
      try {
        await writeFile(`${uploadsDir}/${qrcode.name}`, Buffer.from(await qrcode.arrayBuffer()));
        qrcodeUrl = `/uploads/${qrcode.name}`;
      } catch (error) {
        console.error('Error saving QR code:', error);
        return NextResponse.json(
          { error: 'Failed to save QR code image' },
          { status: 500 }
        );
      }
    }

    // Create new coin document
    const coin = await Coin.create({
      name: data.name,
      symbol: data.symbol,
      walletAddress: data.walletAddress,
      logoUrl: logoUrl,
      qrcode: qrcodeUrl,
      durationDays: data.durationDays,
      apy: data.apy,
      durations: data.durations
    });

    return NextResponse.json({
      message: 'Coin created successfully',
      data: coin
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating coin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create coin' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // Get all stakings grouped by coin
    const stakingTotals = await Staking.aggregate([
      {
        $group: {
          _id: '$coin',
          totalStaked: { $sum: '$amount' }
        }
      }
    ]);

    // Create a map of coin IDs to their staked amounts
    const stakingMap = stakingTotals.reduce((acc, item) => {
      acc[item._id.toString()] = item.totalStaked;
      return acc;
    }, {});
    
    // Get all coins and add their staked amounts
    const coins = await Coin.find({})
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    // Add staked amount to each coin
    const coinsWithStaking = coins.map(coin => ({
      ...coin,
      amount: stakingMap[coin._id.toString()] || 0
    }));

    return NextResponse.json({ coins: coinsWithStaking });
  } catch (error) {
    console.error('Error fetching coins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coins' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Coin ID is required' },
        { status: 400 }
      );
    }

    const deletedCoin = await Coin.findByIdAndDelete(id);
    
    if (!deletedCoin) {
      return NextResponse.json(
        { error: 'Coin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Coin deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting coin:', error);
    return NextResponse.json(
      { error: 'Failed to delete coin' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const logo = formData.get('logo');
    const qrcode = formData.get('qrcode');
    const data = JSON.parse(formData.get('data'));
    const id = data.id;

    let logoUrl = data.logoUrl; // Keep existing logo if no new one
    let qrcodeUrl = data.qrcode; // Keep existing QR if no new one
    
    // Handle new logo upload if provided
    if (logo && logo instanceof File) {
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      await writeFile(`${uploadsDir}/${logo.name}`, Buffer.from(await logo.arrayBuffer()));
      logoUrl = `/uploads/${logo.name}`;
    }

    // Handle new QR code upload if provided
    if (qrcode && qrcode instanceof File) {
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      await writeFile(`${uploadsDir}/${qrcode.name}`, Buffer.from(await qrcode.arrayBuffer()));
      qrcodeUrl = `/uploads/${qrcode.name}`;
    }

    const updatedCoin = await Coin.findByIdAndUpdate(
      id,
      {
        name: data.name,
        symbol: data.symbol,
        walletAddress: data.walletAddress,
        logoUrl: logoUrl,
        qrcode: qrcodeUrl,
        durationDays: data.durationDays,
        apy: data.apy,
        durations: data.durations
      },
      { new: true }
    );

    if (!updatedCoin) {
      return NextResponse.json(
        { error: 'Coin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Coin updated successfully',
      data: updatedCoin
    });
  } catch (error) {
    console.error('Error updating coin:', error);
    return NextResponse.json(
      { error: 'Failed to update coin' },
      { status: 500 }
    );
  }
}