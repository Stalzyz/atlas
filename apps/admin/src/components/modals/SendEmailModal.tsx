"use client";

import { useState } from "react";
import { X, Send, Loader2, Paperclip, Type, User, MessageSquare, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  attachmentName?: string;
  onSend: (data: { subject: string; body: string; signature: string }) => Promise<void>;
}

export function SendEmailModal({
  isOpen,
  onClose,
  recipientEmail,
  recipientName,
  subject: initialSubject,
  body: initialBody,
  attachmentName,
  onSend
}: SendEmailModalProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [signature, setSignature] = useState("Best regards,\nAtlas Team");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend({ subject, body, signature });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to send email. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-wine text-white rounded-2xl shadow-lg shadow-wine/20">
                <Send size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal">Send Document</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Module</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-charcoal border border-transparent hover:border-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  <User size={12} /> Recipient
                </label>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-sm font-bold text-charcoal">{recipientName}</p>
                  <p className="text-xs text-gray-400">{recipientEmail}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  <Paperclip size={12} /> Attachment
                </label>
                <div className="p-4 bg-wine/5 border border-wine/10 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-wine/10 text-wine rounded-lg">
                    <Paperclip size={14} />
                  </div>
                  <p className="text-xs font-bold text-wine truncate">{attachmentName || "Document.pdf"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                <Type size={12} /> Email Subject
              </label>
              <input 
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-charcoal focus:bg-white focus:border-wine outline-none transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                <MessageSquare size={12} /> Message Body
              </label>
              <textarea 
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compose your message..."
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm leading-relaxed text-charcoal focus:bg-white focus:border-wine outline-none transition-all shadow-inner resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                <PenTool size={12} /> Professional Signature
              </label>
              <textarea 
                rows={3}
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-medium text-gray-500 italic focus:bg-white focus:border-wine outline-none transition-all shadow-inner resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSend}
              disabled={isSending}
              className="px-8 py-3 bg-wine text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-wine/20 hover:bg-charcoal transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={14} /> Send Now
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
