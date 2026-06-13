import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CreditCard, ShieldCheck, Mail, Info, Smartphone, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const CheckoutModal = ({ isOpen, onClose, userEmail }: CheckoutModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'verifying' | 'waiting' | 'success'>('idle');

  const validateUpi = (id: string) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(id);
  };

  const handlePayment = async () => {
    if (paymentMethod === 'upi') {
      if (!validateUpi(upiId)) {
        toast.error("Please enter a valid UPI ID (e.g. name@bank)");
        return;
      }
      
      setIsProcessing(true);
      setPaymentStatus('verifying');
      
      // Simulate verification
      await new Promise(r => setTimeout(r, 1500));
      setPaymentStatus('waiting');
      
      // Simulate waiting for approval
      await new Promise(r => setTimeout(r, 3000));
      setPaymentStatus('success');
      
      await new Promise(r => setTimeout(r, 1500));
      toast.success("Subscription active! Welcome to Pro.");
      onClose();
      setIsProcessing(false);
      setPaymentStatus('idle');
    } else {
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 2000));
      setPaymentStatus('success');
      await new Promise(r => setTimeout(r, 1000));
      onClose();
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 border-none shadow-2xl rounded-3xl bg-white text-slate-900 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex flex-col md:flex-row h-full min-h-[500px]">
          
          {/* Left Side: Order Summary */}
          <div className="w-full md:w-[45%] bg-[#f6f9fc] p-8 md:p-12 border-r border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 mb-8 cursor-pointer hover:text-slate-800 transition-colors" onClick={onClose}>
              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-[2px]" />
              </div>
              <span className="text-sm font-bold">Checkout</span>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Subscribe to Monthly Premium Subscription</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$35.00</span>
                  <span className="text-slate-500 text-sm">per month</span>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Monthly Premium Subscription</span>
                  <span className="font-bold">$35.00</span>
                </div>
                <p className="text-[11px] text-slate-400">Billed monthly</p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold">$35.00</span>
              </div>

              {showPromo ? (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Button size="sm" className="bg-slate-900 text-white hover:bg-black rounded-lg">Apply</Button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowPromo(true)}
                  className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1"
                >
                  Add promotion code
                </button>
              )}

              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span className="flex items-center gap-1">Tax <Info size={14} className="opacity-50" /></span>
                  <span>Enter address to calculate</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-lg">Total due today</span>
                  <span className="font-bold text-lg">$35.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Payment Form */}
          <div className="w-full md:w-[55%] bg-white p-8 md:p-12 relative flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {paymentStatus === 'idle' ? (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto w-full space-y-8"
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-slate-900 font-bold mb-4">Contact information</h3>
                      <div className="relative">
                        <div className="absolute top-0 left-0 px-3 py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</div>
                        <input 
                          type="email" 
                          defaultValue={userEmail || "agakshat112005@gmail.com"}
                          className="w-full pt-6 pb-2 px-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-slate-900 font-bold mb-4">Payment method</h3>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex border-b border-slate-200 bg-slate-50/30">
                          <button 
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 p-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${paymentMethod === 'card' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <CreditCard className="w-4 h-4" />
                            Card
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('upi')}
                            className={`flex-1 p-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${paymentMethod === 'upi' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <Smartphone className="w-4 h-4" />
                            UPI
                          </button>
                        </div>
                        
                        <div className="p-6">
                          {paymentMethod === 'card' ? (
                            <div className="space-y-4">
                              <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Card information</div>
                                <input placeholder="1234 1234 1234 1234" className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                                <div className="flex gap-2 mt-2">
                                  <input placeholder="MM / YY" className="w-1/2 p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                                  <input placeholder="CVC" className="w-1/2 p-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">UPI ID</div>
                                <div className="relative">
                                  <input 
                                    placeholder="username@bank" 
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full p-4 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium pr-16"
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                    <div className="w-8 h-5 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-[8px] font-bold">UPI</div>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-4 pt-2">
                                {[
                                  { name: 'GPay', icon: 'https://img.icons8.com/color/48/google-pay.png' },
                                  { name: 'PhonePe', icon: 'https://img.icons8.com/color/48/phone-pe.png' },
                                  { name: 'Paytm', icon: 'https://img.icons8.com/color/48/paytm.png' },
                                  { name: 'Others', icon: null }
                                ].map(app => (
                                  <div key={app.name} className="flex flex-col items-center gap-1 group/app cursor-pointer" onClick={() => setUpiId(prev => prev || "user@upi")}>
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-sm group-hover/app:border-blue-500 transition-all">
                                      {app.icon ? <img src={app.icon} alt={app.name} className="w-full h-full object-contain" /> : <Smartphone className="w-6 h-6 text-slate-400" />}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 group-hover/app:text-blue-600">{app.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Secure encrypted payment</span>
                    </div>

                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl text-lg shadow-xl shadow-slate-900/10"
                    >
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : paymentMethod === 'card' ? 'Subscribe' : 'Verify & Pay'}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="status"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  {paymentStatus === 'verifying' && (
                    <>
                      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                      </div>
                      <h2 className="text-2xl font-bold">Verifying UPI ID</h2>
                      <p className="text-slate-500">Please wait while we validate your payment address...</p>
                    </>
                  )}
                  {paymentStatus === 'waiting' && (
                    <>
                      <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                        <Smartphone className="w-10 h-10 text-orange-500 animate-bounce" />
                      </div>
                      <h2 className="text-2xl font-bold text-orange-600">Request Sent!</h2>
                      <p className="text-slate-500">Please open your UPI app and approve the payment request of <span className="font-bold">$35.00</span></p>
                      <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waiting for approval...</p>
                      </div>
                    </>
                  )}
                  {paymentStatus === 'success' && (
                    <>
                      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                        <CheckCircle className="w-12 h-12 text-emerald-500 animate-in zoom-in duration-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-emerald-600">Payment Successful!</h2>
                      <p className="text-slate-500">Your pro subscription has been activated successfully.</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
