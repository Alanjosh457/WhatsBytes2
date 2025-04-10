const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const register = async (data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.status === 200 || response.status === 400) {
        return response.json();
    }
    throw new Error('Something went wrong');
};

export const login = async (data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.status === 200 || response.status === 400) {
        return response.json();
    }
    throw new Error('Something went wrong');
};


export const saveTable = async (tableData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/save-table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tableData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save table');
      }
  
      const result = await response.json();
      return result; // Return the result or success message
    } catch (error) {
      console.error('Error saving table:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  };

  export const getTable = async (tableId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/get-table/${tableId}`);
  
      if (!response.ok) {
        throw new Error('Table not found');
      }
  
      const data = await response.json();
      return data; // Return the table data
    } catch (error) {
      console.error('Error fetching table:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  };

  export const fetchGoogleSheetData = async (spreadsheetId, range) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/sheets/${spreadsheetId}/${range}`, { 
        credentials: 'include' // Ensures cookies (Google token) are sent
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.data; // The sheet values
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
    }
  };



  export const getGoogleOAuthURL = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/auth/url`);
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error fetching Google OAuth URL:", error);
    }
  };
  


  export const getStoredGoogleToken = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/get-token`, {
        method: "GET",
        credentials: "include", // Ensure cookies are sent with the request
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch access token");
      }
  
      const data = await response.json();
      return data.accessToken; // Return the token
    } catch (error) {
      console.error("Error fetching stored Google token:", error);
      return null;
    }
  };
  