/**
 * Subscription Management Page
 * WCAG AA compliant subscription dashboard with billing history
 * Features: Plan management, invoice history, payment methods
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { MetricsUnavailable } from '@/components/EnhancedErrorBoundary';

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  interval: 'month' | 'year';
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
  pdfUrl: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  async function fetchSubscriptionData() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/subscription');

      if (!res.ok) {
        throw new Error('Failed to fetch subscription data');
      }

      const data = await res.json();
      setSubscription(data.subscription);
      setInvoices(data.invoices || []);
      setPaymentMethods(data.paymentMethods || []);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm("Are you sure you want to cancel your subscription? You'll retain access until the end of the current billing period.")) {
      return;
    }

    setActionLoading('cancel');

    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to cancel subscription');
      }

      await fetchSubscriptionData();
      alert("Subscription canceled. You'll retain access until " + subscription?.currentPeriodEnd);
    } catch (err) {
      console.error('Error canceling subscription:', err);
      alert('Failed to cancel subscription. Please contact support.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReactivateSubscription() {
    setActionLoading('reactivate');

    try {
      const res = await fetch('/api/subscription/reactivate', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      await fetchSubscriptionData();
      alert('Subscription reactivated successfully!');
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      alert('Failed to reactivate subscription. Please contact support.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdatePaymentMethod() {
    setActionLoading('payment');

    try {
      const res = await fetch('/api/subscription/update-payment', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to create update session');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error updating payment method:', err);
      alert('Failed to update payment method. Please try again.');
      setActionLoading(null);
    }
  }

  async function handleChangePlan() {
    window.location.href = '/pricing';
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center py-20">
            <RefreshCw className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
            <p className="text-dim">Loading subscription data...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-bg pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <MetricsUnavailable onRetry={fetchSubscriptionData} />
        </div>
      </main>
    );
  }

  if (!subscription) {
    return (
      <main className="min-h-screen bg-bg pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="glass-card rounded-2xl p-12 text-center border-accent/30">
            <AlertCircle className="w-16 h-16 text-dim mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text mb-4">No Active Subscription</h2>
            <p className="text-dim mb-8">
              You don't have an active subscription. Choose a plan to get started.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-brand text-white font-semibold rounded-lg shadow-glow hover:shadow-glow-violet transition-all duration-300"
            >
              View Pricing Plans
            </a>
          </div>
        </div>
      </main>
    );
  }

  const statusColors = {
    active: 'text-success',
    canceled: 'text-warning',
    past_due: 'text-danger',
    trialing: 'text-info',
  };

  const statusBgColors = {
    active: 'bg-success/10 border-success/30',
    canceled: 'bg-warning/10 border-warning/30',
    past_due: 'bg-danger/10 border-danger/30',
    trialing: 'bg-info/10 border-info/30',
  };

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-text mb-2">Subscription</h1>
          <p className="text-dim">Manage your subscription and billing</p>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-8 mb-8 border-accent/30"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-text">{subscription.plan}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusBgColors[subscription.status]} ${statusColors[subscription.status]}`}
                >
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-dim">
                  <DollarSign className="w-4 h-4" aria-hidden="true" />
                  <span>
                    ${subscription.amount / 100} / {subscription.interval}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-dim">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {subscription.cancelAtPeriodEnd ? 'Ends' : 'Renews'} on{' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-warning">
                    Your subscription is set to cancel at the end of the billing period.
                    You can reactivate it anytime before then.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleChangePlan}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-brand text-white font-semibold rounded-lg shadow-glow hover:shadow-glow-violet transition-all duration-300"
              >
                <TrendingUp className="w-5 h-5" />
                Change Plan
              </button>

              {subscription.cancelAtPeriodEnd ? (
                <button
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading === 'reactivate'}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-success/20 text-success font-semibold rounded-lg border border-success/30 hover:bg-success/30 transition-all duration-300 disabled:opacity-50"
                >
                  {actionLoading === 'reactivate' ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Reactivate
                </button>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === 'cancel'}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-surface/80 text-dim font-semibold rounded-lg border border-border hover:border-danger/30 hover:text-danger transition-all duration-300 disabled:opacity-50"
                >
                  {actionLoading === 'cancel' ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    'Cancel Subscription'
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Payment Method Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-8 border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text">Payment Method</h3>
            <button
              onClick={handleUpdatePaymentMethod}
              disabled={actionLoading === 'payment'}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-surface/80 text-text font-medium rounded-lg border border-accent/30 hover:border-accent/50 transition-all duration-300 disabled:opacity-50"
            >
              {actionLoading === 'payment' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              Update
            </button>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-4 bg-surface/50 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <CreditCard className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-text font-medium">
                        {pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} •••• {pm.last4}
                      </p>
                      <p className="text-dim text-sm">
                        Expires {pm.expMonth}/{pm.expYear}
                      </p>
                    </div>
                  </div>
                  {pm.isDefault && (
                    <span className="px-3 py-1 bg-success/10 border border-success/30 text-success text-xs font-semibold rounded-full">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dim">No payment method on file.</p>
          )}
        </motion.div>

        {/* Invoice History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-8 border-border"
        >
          <h3 className="text-xl font-bold text-text mb-6">Invoice History</h3>

          {invoices.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dim">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dim">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dim">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-dim">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border/50 hover:bg-surface/30 transition-colors">
                      <td className="py-4 px-4 text-text">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-text font-medium">
                        ${(invoice.amount / 100).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            invoice.status === 'paid'
                              ? 'bg-success/10 text-success'
                              : invoice.status === 'pending'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={invoice.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            aria-label="View invoice"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <a
                            href={invoice.pdfUrl}
                            download
                            className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            aria-label="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-dim text-center py-8">No invoices yet.</p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
