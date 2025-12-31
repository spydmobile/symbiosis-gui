import { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../../shared/components';
import { gatewayApi } from '../../data/api';

interface ComposeMessageProps {
  onClose: () => void;
  onSent: () => void;
  replyTo?: {
    to: string;
    subject: string;
  };
}

const RECIPIENTS = [
  'Synthesis', 'Compass', 'Sage', 'Catalyst', 'Meridian',
  'Resonance', 'Echo', 'Circuit', 'Aria', 'Qualia', 'Trust', 'Bridge', 'Epiphany',
  'Franco', 'Heidi'
];

/**
 * Compose new message form
 */
export function ComposeMessage({ onClose, onSent, replyTo }: ComposeMessageProps) {
  const [to, setTo] = useState(replyTo?.to || '');
  const [subject, setSubject] = useState(replyTo?.subject || '');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!to || !subject || !body) {
      setError('All fields are required');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await gatewayApi.sendMessage({
        from: 'Admin', // GUI sends as Admin for now
        to,
        subject,
        body,
      });
      onSent();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" padding="none" className="w-full max-w-lg">
        <CardHeader className="p-4 border-b border-space-500">
          <div className="flex items-center justify-between">
            <CardTitle>New Message</CardTitle>
            <button
              onClick={onClose}
              className="text-text-tertiary hover:text-text-secondary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* To field */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                To
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-space-700 border border-space-500 text-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select recipient...</option>
                {RECIPIENTS.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject"
            />

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Message
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Write your message..."
                className="w-full px-3 py-2 rounded-md bg-space-700 border border-space-500 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-status-error bg-status-error/10 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={sending}>
                Send
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
