export async function GET() {
    const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
    const options = {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': '67231b0e-73de-42df-89ca-fb97f156feb4',
      },
      params: {
        start: '1',
        limit: '100',  // Fetch top 100 coins, adjust as needed
        convert: 'USD',
        sort: 'market_cap',
        sort_dir: 'desc',
      }
    };
  
    try {
      // Convert params to URL search parameters
      const queryString = new URLSearchParams({
        start: '1',
        limit: '100',
        convert: 'USD',
        sort: 'market_cap',
        sort_dir: 'desc',
      }).toString();
  
      const response = await fetch(`${url}?${queryString}`, {
        headers: options.headers,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
  }