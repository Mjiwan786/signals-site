'use client';

import { Shield, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * SafetyRiskNote Component
 *
 * Discreet but clear disclosure about paper trading mode and risks
 * Professional, transparent, no legal jargon
 */

interface SafetyRiskNoteProps {
  mode?: 'paper' | 'live';
}

export default function SafetyRiskNote({ mode = 'paper' }: SafetyRiskNoteProps) {
  const isPaperMode = mode === 'paper';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-6 ${
        isPaperMode
          ? 'bg-warning/5 border-warning/30'
          : 'bg-danger/5 border-danger/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          {isPaperMode ? (
            <Shield className="w-6 h-6 text-warning" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-danger" />
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-text mb-1">
            {isPaperMode ? 'Paper Trading Mode' : 'Live Trading Mode'}
          </h3>
          <p className="text-sm text-dim">
            {isPaperMode
              ? 'All signals are simulated. No real funds are at risk.'
              : 'Live trading is enabled. Real funds are at risk.'}
          </p>
        </div>
      </div>

      {/* Mode Details */}
      <div className="space-y-3 mb-4">
        {isPaperMode ? (
          <>
            <InfoRow
              icon={<Info className="w-4 h-4" />}
              text="Paper mode simulates trading with virtual funds to validate strategies"
            />
            <InfoRow
              icon={<Info className="w-4 h-4" />}
              text="Performance metrics reflect simulated trades, not actual execution"
            />
            <InfoRow
              icon={<Info className="w-4 h-4" />}
              text="No API keys or exchange accounts are accessed in paper mode"
            />
          </>
        ) : (
          <>
            <InfoRow
              icon={<AlertTriangle className="w-4 h-4" />}
              text="Live mode executes real trades on your connected exchange account"
              color="text-danger"
            />
            <InfoRow
              icon={<AlertTriangle className="w-4 h-4" />}
              text="Trading cryptocurrencies involves substantial risk of loss"
              color="text-danger"
            />
            <InfoRow
              icon={<AlertTriangle className="w-4 h-4" />}
              text="Past performance does not guarantee future results"
              color="text-danger"
            />
          </>
        )}
      </div>

      {/* Risk Disclaimer */}
      <div className="pt-4 border-t border-accent/20">
        <p className="text-xs text-dim leading-relaxed">
          <strong className="text-text">Risk Disclaimer:</strong> Cryptocurrency trading carries
          significant risk. This system provides informational signals based on technical
          analysis. Users are solely responsible for their trading decisions. Always conduct
          your own research and never invest more than you can afford to lose.
        </p>
      </div>

      {/* Mode Toggle Info */}
      {isPaperMode && (
        <div className="mt-4 pt-4 border-t border-accent/20">
          <p className="text-xs text-dim">
            <strong className="text-text">Note:</strong> Live trading requires explicit
            opt-in and exchange API configuration. Contact support to enable live mode.
          </p>
        </div>
      )}
    </motion.div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  text: string;
  color?: string;
}

function InfoRow({ icon, text, color = 'text-dim' }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2">
      <div className={`flex-shrink-0 ${color}`}>{icon}</div>
      <p className={`text-xs ${color}`}>{text}</p>
    </div>
  );
}
