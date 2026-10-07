// =============================================================================
// IG GrowthOS: Meta OAuth & Instagram Professional Account Linking
// =============================================================================

export interface OAuthExchangeResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface InstagramBusinessAccountOption {
  pageId: string;
  pageName: string;
  instagramBusinessAccountId: string;
  instagramUsername: string;
}

export class MetaOAuthManager {
  private static clientId = process.env.META_APP_ID || '';
  private static clientSecret = process.env.META_APP_SECRET || '';
  private static redirectUri = process.env.META_REDIRECT_URI || 'http://localhost:3000/api/auth/instagram/callback';
  private static apiVersion = 'v20.0';

  /**
   * Generates the official Meta OAuth authorization URL requesting all required Instagram permissions.
   */
  static getAuthorizationUrl(state = 'ig_growthos_state'): string {
    const scopes = [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_insights',
      'instagram_manage_comments',
      'pages_show_list',
      'pages_read_engagement',
    ].join(',');

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes,
      response_type: 'code',
      state,
    });

    return `https://www.facebook.com/${this.apiVersion}/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for short-lived user access token.
   */
  static async exchangeCodeForToken(code: string): Promise<OAuthExchangeResult> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
    });

    const res = await fetch(`https://graph.facebook.com/${this.apiVersion}/oauth/access_token?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Failed to exchange Meta authorization code: ${err.error?.message || res.statusText}`);
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Exchanges a short-lived token for a 60-day long-lived User Access Token.
   */
  static async getLongLivedToken(shortLivedToken: string): Promise<OAuthExchangeResult> {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      fb_exchange_token: shortLivedToken,
    });

    const res = await fetch(`https://graph.facebook.com/${this.apiVersion}/oauth/access_token?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve 60-day long-lived token from Meta Graph API.');
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Queries connected Facebook Pages to discover attached Instagram Professional / Business Accounts.
   */
  static async getConnectedInstagramAccounts(userAccessToken: string): Promise<InstagramBusinessAccountOption[]> {
    const res = await fetch(
      `https://graph.facebook.com/${this.apiVersion}/me/accounts?fields=id,name,instagram_business_account{id,username}&access_token=${userAccessToken}`
    );
    if (!res.ok) {
      throw new Error('Failed to discover connected Facebook Pages and Instagram accounts.');
    }

    const data = await res.json();
    const results: InstagramBusinessAccountOption[] = [];

    if (Array.isArray(data.data)) {
      for (const page of data.data) {
        if (page.instagram_business_account) {
          results.push({
            pageId: page.id,
            pageName: page.name,
            instagramBusinessAccountId: page.instagram_business_account.id,
            instagramUsername: page.instagram_business_account.username,
          });
        }
      }
    }

    return results;
  }
}
