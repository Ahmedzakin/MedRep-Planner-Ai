import React from 'react';

interface WelcomePopupProps {
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 border border-slate-100">
        {/* Image Container */}
        {/* TODO: Replace the src below with the URL of the image you attached if you have a direct link, otherwise this is a generated placeholder */}
        <div className="mx-auto mb-5 w-28 h-28 relative group">
          <div className="absolute inset-0 bg-teal-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <img 
            src="https://avatar.iran.liara.run/public/boy?username=Ahmed" 
            alt="Developer Ahmed Zaki" 
            className="w-full h-full rounded-full object-cover shadow-md ring-4 ring-teal-50"
          />
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 mb-2">مرحباً بك</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed text-base font-medium">
          تم تطوير التطبيق بواسطة{' '}
          <a 
            href="https://AHMEDFAWAZ.ONLINE" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-colors"
          >
            أحمد ذكي
          </a>
        </p>
        
        <button
          onClick={onClose}
          className="w-full bg-teal-600 text-white font-medium py-2.5 rounded-xl hover:bg-teal-700 focus:ring-4 focus:ring-teal-500/20 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          ابدأ التخطيط
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;