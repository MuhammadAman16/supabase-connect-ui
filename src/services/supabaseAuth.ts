
// This is a simplified service for handling the Supabase OAuth flow
// In a real application, you would need to implement proper token storage and refresh logic

export interface SupabaseAuthConfig {
  clientId: string;
  redirectUri: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
}

export class SupabaseAuth {
  private config: SupabaseAuthConfig;
  private codeVerifier: string | null = null;
  private state: string | null = null;

  constructor(config: SupabaseAuthConfig) {
    this.config = config;
  }

  // Generate a random string for PKCE and state
  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint8Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  }

  // Hash the code verifier to create a code challenge
  private async createCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    
    // Convert digest to base64url encoding
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Initiate the authorization flow
  public async startAuthFlow(): Promise<void> {
    this.codeVerifier = this.generateRandomString(64);
    this.state = this.generateRandomString(32);
    
    // Store these values for later validation
    localStorage.setItem('supabase_code_verifier', this.codeVerifier);
    localStorage.setItem('supabase_state', this.state);
    
    const codeChallenge = await this.createCodeChallenge(this.codeVerifier);
    
    const authUrl = new URL(this.config.authorizeEndpoint);
    authUrl.searchParams.append('client_id', this.config.clientId);
    authUrl.searchParams.append('redirect_uri', this.config.redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('state', this.state);
    
    // Redirect to authorization page
    window.location.href = authUrl.toString();
  }

  // Handle the redirect callback
  public async handleCallback(code: string, state: string): Promise<any> {
    // Verify state to prevent CSRF attacks
    const storedState = localStorage.getItem('supabase_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }
    
    // Get the stored code verifier
    const storedCodeVerifier = localStorage.getItem('supabase_code_verifier');
    if (!storedCodeVerifier) {
      throw new Error('No code verifier found');
    }
    
    // Clean up storage
    localStorage.removeItem('supabase_state');
    localStorage.removeItem('supabase_code_verifier');
    
    // Exchange the authorization code for tokens
    // In a real application, you would make a server-side request to protect your client secret
    
    try {
      // This is a simplified example - in production, you would need to handle this server-side
      // to protect your client secret
      const formData = new URLSearchParams();
      formData.append('grant_type', 'authorization_code');
      formData.append('code', code);
      formData.append('redirect_uri', this.config.redirectUri);
      formData.append('code_verifier', storedCodeVerifier);
      
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // In production, the Authorization header would be created server-side
          // Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`)
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }
      
      const data = await response.json();
      
      // Store tokens securely - in a real app, this should be done server-side
      localStorage.setItem('supabase_access_token', data.access_token);
      localStorage.setItem('supabase_refresh_token', data.refresh_token);
      
      return data;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }
}

export const supabaseAuth = new SupabaseAuth({
  clientId: process.env.SUPABASE_CLIENT_ID || 'YOUR_CLIENT_ID', // Replace with your client ID
  redirectUri: `${window.location.origin}/callback`,
  authorizeEndpoint: 'https://api.supabase.com/v1/oauth/authorize',
  tokenEndpoint: 'https://api.supabase.com/v1/oauth/token'
});

export default supabaseAuth;
