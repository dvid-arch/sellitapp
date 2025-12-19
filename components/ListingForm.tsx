
import React, { useState, useRef } from 'react';
import { 
  X, Sparkles, Loader2, Upload, Trash2, 
  ChevronLeft, ChevronRight, Edit3, Check,
  MapPin, CheckCircle2
} from 'lucide-react';
import { geminiService } from '../services/gemini';
import { useToast } from '../context/ToastContext';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf';
  preview?: string;
}

interface ListingFormProps {
  onClose: () => void;
  onSubmit: (listing: any) => void;
}

export const ListingForm: React.FC<ListingFormProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState<'details' | 'preview'>('details');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentPreviewIdx, setCurrentPreviewIdx] = useState(0);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: 'Fairly used',
    category: 'Home and furniture',
    price: '',
    isNegotiable: true,
    campus: 'University of Lagos',
    location: '',
    isUrgent: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        preview: file.type.includes('image') ? URL.createObjectURL(file) : undefined
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMagicFill = async () => {
    if (!formData.title || step === 'preview') return;
    setLoading(true);
    try {
      const [description, suggestedPrice] = await Promise.all([
        geminiService.generateDescription(formData.title, formData.condition),
        geminiService.suggestPrice(formData.title, formData.condition)
      ]);
      setFormData(prev => ({
        ...prev,
        description,
        price: Math.round(suggestedPrice).toLocaleString()
      }));
      showToast('Magic Description Created!', 'Gemini AI has optimized your product details.', 'success');
    } catch (err) {
      console.error(err);
      showToast('AI Failure', 'Unable to generate details. Please try manually.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 'details') {
      setStep('preview');
    } else {
      setShowPremiumModal(true);
    }
  };

  const finalSubmit = () => {
    onSubmit({
      ...formData,
      price: parseFloat(formData.price.replace(/[^0-9.]/g, '')) || 0,
      imageUrl: files.find(f => f.type === 'image')?.preview || ''
    });
    showToast('Product Published!', 'Your product has been successfully published on Sellit', 'success');
  };

  const isPreview = step === 'preview';

  return (
    <div className="flex flex-col h-full bg-[#F8FAFB] animate-in fade-in duration-500">
      <div className="px-12 pt-10 pb-6 shrink-0">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Add Product</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-12 pb-12 scrollbar-hide">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col lg:flex-row gap-12">
          {/* LEFT PANEL */}
          <div className="flex-1 space-y-8 min-h-[500px]">
            {!isPreview ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-sellit/30 rounded-[2rem] p-12 text-center bg-[#F9FBFC] hover:bg-white hover:border-sellit transition-all group cursor-pointer"
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-sellit transition-colors">
                      <Upload size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Drop files here</h3>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">Product images, receipt, warranty card or proof of purchase</p>
                    </div>
                    <button className="mt-2 px-10 py-3 bg-white border border-sellit text-sellit rounded-xl font-bold text-sm hover:bg-sellit hover:text-white transition-all shadow-sm">Upload Files</button>
                    <p className="text-gray-400 text-xs font-medium">Only PNG and JPEG formats are supported</p>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <h4 className="text-lg font-bold text-gray-800">Uploaded Files</h4>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl group hover:border-sellit/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-50 flex items-center justify-center">
                            {file.type === 'pdf' ? <div className="bg-[#00687F]/10 text-sellit px-2 py-1 rounded font-bold text-xs font-mono">PDF</div> : <img src={file.preview} className="w-full h-full object-cover" alt={file.name} />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{file.size}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFile(file.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                      </div>
                    ))}
                    {files.length === 0 && <div className="py-12 text-center text-gray-400 font-medium bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">No files uploaded yet</div>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <h2 className="text-3xl font-bold text-gray-900">Preview</h2>
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-gray-100 group shadow-sm">
                  {files.filter(f => f.type === 'image').length > 0 ? <img src={files.filter(f => f.type === 'image')[currentPreviewIdx]?.preview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 italic font-medium">No images uploaded</div>}
                  {files.filter(f => f.type === 'image').length > 1 && (
                    <><div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setCurrentPreviewIdx(prev => Math.max(0, prev - 1))} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-black/40 transition-all"><ChevronLeft size={24} /></button><button onClick={() => setCurrentPreviewIdx(prev => Math.min(files.filter(f => f.type === 'image').length - 1, prev + 1))} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-black/40 transition-all"><ChevronRight size={24} /></button></div><div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">{files.filter(f => f.type === 'image').map((_, i) => <div key={i} className={`h-1.5 rounded-full bg-white transition-all shadow-sm ${i === currentPreviewIdx ? 'w-8' : 'w-1.5 opacity-50'}`} />)}</div></>
                  )}
                </div>
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                  <div><h2 className="text-3xl font-bold text-gray-900">{formData.title || 'Product Title'}</h2><div className="flex items-center gap-2 text-gray-400 font-medium mt-1"><MapPin size={16} /><span className="text-sm">{formData.campus}, {formData.location || 'Specific Location'}</span></div></div>
                  <div className="flex items-center justify-between"><span className="text-2xl font-bold text-gray-900">₦{formData.price || '0'}</span>{formData.isNegotiable && <span className="bg-[#E5F6F9] text-sellit px-4 py-1.5 rounded-full text-xs font-bold">Negotiable</span>}</div>
                  <div className="h-px bg-gray-100" />
                  <div><h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h4><p className="text-gray-500 font-medium leading-relaxed">{formData.description || 'No description provided yet.'}</p></div>
                  <div className="flex items-center justify-between pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Seller" /></div><span className="font-bold text-gray-900">John Darwin</span></div><div className="flex items-center gap-1.5 text-[#00A36C] font-bold text-sm"><CheckCircle2 size={16} fill="currentColor" className="text-white" />Verified</div></div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full lg:w-[480px] shrink-0">
            <div className="flex items-center justify-between mb-8 h-10"><h2 className="text-2xl font-bold text-gray-900">Product Details</h2>{isPreview && <button onClick={() => setStep('details')} className="flex items-center gap-2 px-4 py-2 border border-sellit text-sellit rounded-xl font-bold text-sm hover:bg-sellit/5 transition-all animate-in fade-in zoom-in-95 duration-300"><Edit3 size={16} />Edit Details</button>}</div>
            <div className={`space-y-6 ${isPreview ? 'opacity-70 pointer-events-none' : ''}`}>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Title</label><input type="text" disabled={isPreview} placeholder="e.g. iPhone 13 pro max 256 GB" className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-medium text-gray-900 placeholder:text-gray-400" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Description</label><textarea rows={3} disabled={isPreview} placeholder="Describe your item details..." className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-medium resize-none text-gray-900 placeholder:text-gray-400" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Condition</label><select disabled={isPreview} className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-bold appearance-none text-gray-900" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}><option>Brand New</option><option>Like New</option><option>Fairly used</option></select></div><div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Category</label><select disabled={isPreview} className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-bold appearance-none text-gray-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option>Electronics</option><option>Home and furniture</option><option>Books</option><option>Fashion</option></select></div></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Price</label><div className="relative"><input type="text" disabled={isPreview} placeholder="Enter price in Naira" className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-bold text-gray-900" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />{!isPreview && <button onClick={handleMagicFill} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-sellit hover:bg-sellit/5 rounded-lg transition-all">{loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}</button>}</div></div>
              <div className="flex items-center justify-between py-2 px-1"><span className="font-bold text-gray-700">Price Negotiable</span><button disabled={isPreview} onClick={() => setFormData({...formData, isNegotiable: !formData.isNegotiable})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isNegotiable ? 'bg-sellit' : 'bg-gray-200'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isNegotiable ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Campus</label><select disabled={isPreview} className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-bold appearance-none text-gray-900" value={formData.campus} onChange={e => setFormData({...formData, campus: e.target.value})}><option>University of Lagos</option><option>University of Ibadan</option><option>University of Nigeria</option></select></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Specific Location</label><input type="text" disabled={isPreview} placeholder="e.g. Moremi Hall, Room 4" className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-medium text-gray-900" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
              <div className="flex items-center justify-between py-2 px-1"><span className="font-bold text-gray-700">Mark as urgent</span><button disabled={isPreview} onClick={() => setFormData({...formData, isUrgent: !formData.isUrgent})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isUrgent ? 'bg-sellit' : 'bg-gray-200'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isUrgent ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-start"><button onClick={handleNext} className="px-16 py-4 bg-sellit text-white rounded-2xl font-bold text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98] disabled:opacity-50" disabled={!formData.title}>{isPreview ? 'Publish Listing' : 'Next'}</button></div>
      </div>

      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowPremiumModal(false)} />
          <div className="relative w-full max-w-[500px] bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            <div className="space-y-8">
              <div className="text-center md:text-left"><h2 className="text-4xl font-bold text-gray-900 mb-3">Premium Listing</h2><p className="text-gray-500 font-medium leading-relaxed">Stand out and sell faster to students on your campus.</p></div>
              <div className="text-3xl font-bold text-gray-900 text-center md:text-left">N500 <span className="text-lg text-gray-400 font-medium">/item</span></div>
              <div className="space-y-5 py-4">{['Featured Placement', 'Boost visibility', 'Reach more students', 'Premium tags'].map((feature, i) => <div key={i} className="flex items-start gap-4"><div className="mt-1"><Check size={18} className="text-gray-900 stroke-[3]" /></div><p className="text-gray-700 font-medium">{feature}</p></div>)}</div>
              <button onClick={finalSubmit} className="w-full bg-sellit text-white py-4.5 rounded-[1.5rem] font-extrabold text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98]">Subscribe</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
