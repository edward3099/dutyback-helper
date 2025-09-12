import Link from 'next/link';
import { FileText, Mail, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Dutyback Helper</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Reclaim overpaid import VAT and duty from UK couriers with our guided process.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Success Stats
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  HMRC Guidance
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.gov.uk/guidance/import-vat-and-duty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  Import VAT Rules
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.gov.uk/guidance/check-if-you-need-to-register-for-vat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  VAT Registration
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="mailto:support@dutyback-helper.com" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  support@dutyback-helper.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>© 2024 Dutyback Helper. All rights reserved.</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Last checked GOV.UK guidance: {currentDate}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
