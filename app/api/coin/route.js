import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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
    
    // Convert logo file to base64
    if (logo && logo instanceof File) {
      try {
        const logoBuffer = await logo.arrayBuffer();
        const base64Logo = Buffer.from(logoBuffer).toString('base64');
        logoUrl = `data:${logo.type};base64,${base64Logo}`;
      } catch (logoError) {
        console.error('Error processing logo:', logoError);
        return NextResponse.json(
          { error: `Failed to process logo image: ${logoError.message}` },
          { status: 500 }
        );
      }
    }

    // Convert QR code file to base64
    if (qrcode && qrcode instanceof File) {
      try {
        const qrcodeBuffer = await qrcode.arrayBuffer();
        const base64Qrcode = Buffer.from(qrcodeBuffer).toString('base64');
        qrcodeUrl = `data:${qrcode.type};base64,${base64Qrcode}`;
      } catch (qrError) {
        console.error('Error processing QR code:', qrError);
        return NextResponse.json(
          { error: `Failed to process QR code image: ${qrError.message}` },
          { status: 500 }
        );
      }
    }

    console.log('Creating coin with data:', {
      name: data.name,
      symbol: data.symbol,
      walletAddress: data.walletAddress,
      logoUrl,
      qrcodeUrl,
      durationDays: data.durationDays,
      apy: data.apy,
      durations: data.durations
    });

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

    console.log('Coin created successfully:', coin);

    return NextResponse.json({
      message: 'Coin created successfully',
      data: coin
    }, { status: 200 });

  } catch (error) {
    console.error('Detailed error creating coin:', error);
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

    let logoUrl = data.logoUrl;
    let qrcodeUrl = data.qrcode;
    
    // Convert new logo file to base64 if provided
    if (logo && logo instanceof File) {
      try {
        const logoBuffer = await logo.arrayBuffer();
        const base64Logo = Buffer.from(logoBuffer).toString('base64');
        logoUrl = `data:${logo.type};base64,${base64Logo}`;
      } catch (logoError) {
        console.error('Error processing logo:', logoError);
        return NextResponse.json(
          { error: `Failed to process logo image: ${logoError.message}` },
          { status: 500 }
        );
      }
    }

    // Convert new QR code file to base64 if provided
    if (qrcode && qrcode instanceof File) {
      try {
        const qrcodeBuffer = await qrcode.arrayBuffer();
        const base64Qrcode = Buffer.from(qrcodeBuffer).toString('base64');
        qrcodeUrl = `data:${qrcode.type};base64,${base64Qrcode}`;
      } catch (qrError) {
        console.error('Error processing QR code:', qrError);
        return NextResponse.json(
          { error: `Failed to process QR code image: ${qrError.message}` },
          { status: 500 }
        );
      }
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