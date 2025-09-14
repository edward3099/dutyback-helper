import * as cheerio from 'cheerio';
import { supabase } from './supabase';

export interface PolicyDocument {
  id: string;
  title: string;
  url: string;
  lastModified: string;
  content: string;
  checksum: string;
  version: string;
  category: 'import_vat' | 'duty_refund' | 'courier_guidance' | 'hmrc_forms';
  status: 'active' | 'archived' | 'updated';
  createdAt: string;
  updatedAt: string;
}

export interface PolicyChange {
  id: string;
  policyId: string;
  changeType: 'content_update' | 'url_change' | 'status_change' | 'new_document';
  oldValue?: string;
  newValue?: string;
  description: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectsUsers: boolean;
}

export interface MonitoringConfig {
  urls: {
    importVatGuidance: string;
    dutyRefundGuidance: string;
    courierGuidance: string;
    hmrcForms: string;
  };
  checkInterval: number; // minutes
  enabled: boolean;
}

export class PolicyMonitor {
  private config: MonitoringConfig;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(config: MonitoringConfig) {
    this.config = config;
  }

  /**
   * Start monitoring for policy changes
   */
  async startMonitoring(): Promise<void> {
    if (this.isRunning) {
      console.log('Policy monitoring is already running');
      return;
    }

    if (!this.config.enabled) {
      console.log('Policy monitoring is disabled');
      return;
    }

    this.isRunning = true;
    console.log('Starting policy monitoring...');

    // Run initial check
    await this.checkAllPolicies();

    // Set up interval
    this.intervalId = setInterval(async () => {
      await this.checkAllPolicies();
    }, this.config.checkInterval * 60 * 1000);

    console.log(`Policy monitoring started. Checking every ${this.config.checkInterval} minutes.`);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Policy monitoring stopped');
  }

  /**
   * Check all monitored policies
   */
  async checkAllPolicies(): Promise<void> {
    try {
      console.log('Checking all policies for changes...');
      
      const policies = await this.getAllMonitoredPolicies();
      
      for (const policy of policies) {
        await this.checkPolicyForChanges(policy);
      }

      console.log('Policy check completed');
    } catch (error) {
      console.error('Error during policy check:', error);
    }
  }

  /**
   * Get all policies being monitored
   */
  private async getAllMonitoredPolicies(): Promise<PolicyDocument[]> {
    try {
      const { data, error } = await supabase
        .from('policy_documents')
        .select('*')
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching policies:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching policies:', error);
      return [];
    }
  }

  /**
   * Check a specific policy for changes
   */
  private async checkPolicyForChanges(policy: PolicyDocument): Promise<void> {
    try {
      console.log(`Checking policy: ${policy.title}`);
      
      const currentContent = await this.fetchPolicyContent(policy.url);
      if (!currentContent) {
        console.log(`Failed to fetch content for: ${policy.title}`);
        return;
      }

      const currentChecksum = this.generateChecksum(currentContent.content);
      const currentLastModified = currentContent.lastModified;

      // Check if content has changed
      if (currentChecksum !== policy.checksum) {
        console.log(`Content change detected for: ${policy.title}`);
        await this.recordPolicyChange(policy, 'content_update', policy.checksum, currentChecksum, 'Content has been updated');
        
        // Update the policy document
        await this.updatePolicyDocument(policy.id, {
          content: currentContent.content,
          checksum: currentChecksum,
          lastModified: currentLastModified,
          updatedAt: new Date().toISOString()
        });
      }

      // Check if last modified date has changed
      if (currentLastModified !== policy.lastModified) {
        console.log(`Last modified date changed for: ${policy.title}`);
        await this.recordPolicyChange(policy, 'content_update', policy.lastModified, currentLastModified, 'Last modified date has changed');
      }

    } catch (error) {
      console.error(`Error checking policy ${policy.title}:`, error);
    }
  }

  /**
   * Fetch policy content from URL
   */
  private async fetchPolicyContent(url: string): Promise<{ content: string; lastModified: string } | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Dutyback Helper Policy Monitor 1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch ${url}: ${response.status}`);
        return null;
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract main content (adjust selectors based on GOV.UK structure)
      const mainContent = $('#main-content, .govuk-main-wrapper, main').html() || '';
      const lastModified = response.headers.get('last-modified') || new Date().toISOString();

      return {
        content: mainContent,
        lastModified: new Date(lastModified).toISOString()
      };
    } catch (error) {
      console.error(`Error fetching content from ${url}:`, error);
      return null;
    }
  }

  /**
   * Generate checksum for content
   */
  private generateChecksum(content: string): string {
    // Simple hash function for content comparison
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Record a policy change
   */
  private async recordPolicyChange(
    policy: PolicyDocument,
    changeType: PolicyChange['changeType'],
    oldValue: string,
    newValue: string,
    description: string
  ): Promise<void> {
    try {
      const change: Omit<PolicyChange, 'id'> = {
        policyId: policy.id,
        changeType,
        oldValue,
        newValue,
        description,
        detectedAt: new Date().toISOString(),
        severity: this.determineSeverity(changeType, policy.category),
        affectsUsers: this.determineUserImpact(changeType, policy.category)
      };

      const { error } = await supabase
        .from('policy_changes')
        .insert(change);

      if (error) {
        console.error('Error recording policy change:', error);
      } else {
        console.log(`Policy change recorded: ${description}`);
        
        // Send notification if it affects users
        if (change.affectsUsers) {
          await this.notifyUsersOfPolicyChange(policy, change);
        }
      }
    } catch (error) {
      console.error('Error recording policy change:', error);
    }
  }

  /**
   * Update policy document
   */
  private async updatePolicyDocument(
    policyId: string,
    updates: Partial<PolicyDocument>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('policy_documents')
        .update(updates)
        .eq('id', policyId);

      if (error) {
        console.error('Error updating policy document:', error);
      }
    } catch (error) {
      console.error('Error updating policy document:', error);
    }
  }

  /**
   * Determine severity of change
   */
  private determineSeverity(changeType: PolicyChange['changeType'], category: PolicyDocument['category']): PolicyChange['severity'] {
    if (changeType === 'status_change') return 'critical';
    if (changeType === 'url_change') return 'high';
    if (category === 'hmrc_forms') return 'high';
    if (category === 'import_vat') return 'medium';
    return 'low';
  }

  /**
   * Determine if change affects users
   */
  private determineUserImpact(changeType: PolicyChange['changeType'], category: PolicyDocument['category']): boolean {
    if (changeType === 'status_change') return true;
    if (changeType === 'url_change') return true;
    if (category === 'hmrc_forms') return true;
    if (category === 'import_vat') return true;
    if (category === 'duty_refund') return true;
    return false;
  }

  /**
   * Notify users of policy changes
   */
  private async notifyUsersOfPolicyChange(policy: PolicyDocument, change: Omit<PolicyChange, 'id'>): Promise<void> {
    try {
      // Get all active users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('status', 'active');

      if (usersError || !users) {
        console.error('Error fetching users for notification:', usersError);
        return;
      }

      // Send notification to each user
      for (const user of users) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            type: 'reminder',
            title: 'Policy Update Alert',
            message: `Important policy change detected: ${policy.title}. ${change.description}`,
            data: {
              policyId: policy.id,
              changeId: change.id,
              severity: change.severity
            }
          });
      }

      console.log(`Policy change notifications sent to ${users.length} users`);
    } catch (error) {
      console.error('Error notifying users of policy change:', error);
    }
  }

  /**
   * Initialize monitoring with default policies
   */
  async initializeDefaultPolicies(): Promise<void> {
    const defaultPolicies: Omit<PolicyDocument, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Import VAT and Duty Guidance',
        url: 'https://www.gov.uk/guidance/import-vat-and-duty',
        lastModified: new Date().toISOString(),
        content: '',
        checksum: '',
        version: '1.0.0',
        category: 'import_vat',
        status: 'active'
      },
      {
        title: 'Claim a Refund of Import VAT and Duty',
        url: 'https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty',
        lastModified: new Date().toISOString(),
        content: '',
        checksum: '',
        version: '1.0.0',
        category: 'duty_refund',
        status: 'active'
      },
      {
        title: 'Courier and Postal Operator Guidance',
        url: 'https://www.gov.uk/guidance/courier-and-postal-operator-guidance',
        lastModified: new Date().toISOString(),
        content: '',
        checksum: '',
        version: '1.0.0',
        category: 'courier_guidance',
        status: 'active'
      },
      {
        title: 'HMRC Forms and Guidance',
        url: 'https://www.gov.uk/government/collections/hmrc-forms-and-leaflets',
        lastModified: new Date().toISOString(),
        content: '',
        checksum: '',
        version: '1.0.0',
        category: 'hmrc_forms',
        status: 'active'
      }
    ];

    for (const policy of defaultPolicies) {
      try {
        // Check if policy already exists
        const { data: existing } = await supabase
          .from('policy_documents')
          .select('id')
          .eq('url', policy.url)
          .single();

        if (!existing) {
          // Fetch initial content
          const content = await this.fetchPolicyContent(policy.url);
          if (content) {
            const checksum = this.generateChecksum(content.content);
            
            await supabase
              .from('policy_documents')
              .insert({
                ...policy,
                content: content.content,
                checksum,
                lastModified: content.lastModified,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
          }
        }
      } catch (error) {
        console.error(`Error initializing policy ${policy.title}:`, error);
      }
    }
  }

  /**
   * Get recent policy changes
   */
  async getRecentChanges(limit: number = 10): Promise<PolicyChange[]> {
    try {
      const { data, error } = await supabase
        .from('policy_changes')
        .select(`
          *,
          policy_documents (
            title,
            url,
            category
          )
        `)
        .order('detected_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent changes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent changes:', error);
      return [];
    }
  }

  /**
   * Get monitoring status
   */
  getStatus(): { isRunning: boolean; config: MonitoringConfig } {
    return {
      isRunning: this.isRunning,
      config: this.config
    };
  }
}

// Default configuration
export const defaultMonitoringConfig: MonitoringConfig = {
  urls: {
    importVatGuidance: 'https://www.gov.uk/guidance/import-vat-and-duty',
    dutyRefundGuidance: 'https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty',
    courierGuidance: 'https://www.gov.uk/guidance/courier-and-postal-operator-guidance',
    hmrcForms: 'https://www.gov.uk/government/collections/hmrc-forms-and-leaflets'
  },
  checkInterval: 60, // 1 hour
  enabled: true
};

// Export singleton instance
export const policyMonitor = new PolicyMonitor(defaultMonitoringConfig);
