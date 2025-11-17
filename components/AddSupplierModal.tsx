import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';

interface AddSupplierModalProps {
  allSuppliers: Supplier[];
  onClose: () => void;
  onSave: (supplierData: Omit<Supplier, 'id' | 'logoUrl' | 'contractIds'>) => void;
  // Fix: Add optional supplierToEdit prop to handle both add and edit modes.
  supplierToEdit?: Supplier | null;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ allSuppliers, onClose, onSave, supplierToEdit }) => {
  const isEditMode = !!supplierToEdit;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [cageCode, setCageCode] = useState('');
  const [ueid, setUeid] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  
  useEffect(() => {
    if (isEditMode && supplierToEdit) {
      setName(supplierToEdit.name);
      setCategory(supplierToEdit.category);
      setCountryCode(supplierToEdit.countryCode);
      setCageCode(supplierToEdit.cageCode);
      setUeid(supplierToEdit.ueid);
      setDescription(supplierToEdit.description);
      setParentId(supplierToEdit.parentId || '');

      // Attempt to parse the full address back into its components
      const addressParts = supplierToEdit.fullAddress.split(', ');
      if (addressParts.length >= 3) {
        setStreetAddress(addressParts[0] || '');
        setCity(addressParts[1] || '');
        const stateAndZip = addressParts[2].split(' ');
        setProvince(stateAndZip[0] || '');
        setZipCode(stateAndZip.slice(1).join(' ') || '');
      } else {
        setStreetAddress(supplierToEdit.fullAddress);
      }
    }
  }, [isEditMode, supplierToEdit]);

  const isFormValid = name && category && streetAddress && city && province && countryCode.length === 3 && description && cageCode.length === 5 && ueid.length === 12;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const location = `${city}, ${province}`;
    const fullAddress = `${streetAddress}, ${city}, ${province} ${zipCode}`;

    onSave({ 
      name, 
      category, 
      location, 
      fullAddress,
      countryCode, 
      cageCode, 
      ueid, 
      description, 
      parentId: parentId || undefined 
    });
  };

  return (
    <div 
      // Fix: Renamed animation class to avoid global scope conflicts.
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center animate-modal-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        // Fix: Renamed animation class to avoid global scope conflicts.
        className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg m-4 border border-gray-700 animate-modal-slide-in-up overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-white">{isEditMode ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Supplier Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
             <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-300 mb-1">Parent Supplier</label>
              <select 
                id="parentId" 
                value={parentId} 
                onChange={(e) => setParentId(e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                  <option value="">None (Top-Level)</option>
                  {allSuppliers.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
             <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-300 mb-1">Street Address</label>
              <input type="text" id="streetAddress" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-300 mb-1">Province / State</label>
                <input type="text" id="province" value={province} onChange={(e) => setProvince(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">Zip / Postal Code</label>
                <input type="text" id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="countryCode" className="block text-sm font-medium text-gray-300 mb-1">Country Code</label>
                <input type="text" id="countryCode" placeholder="USA" value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase())} required maxLength={3} minLength={3} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cageCode" className="block text-sm font-medium text-gray-300 mb-1">CAGE Code</label>
                  <input type="text" id="cageCode" value={cageCode} onChange={(e) => setCageCode(e.target.value.toUpperCase())} required maxLength={5} minLength={5} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="ueid" className="block text-sm font-medium text-gray-300 mb-1">UEID</label>
                  <input type="text" id="ueid" value={ueid} onChange={(e) => setUeid(e.target.value.toUpperCase())} required maxLength={12} minLength={12} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">{isEditMode ? 'Save Changes' : 'Save Supplier'}</button>
          </div>
        </form>
      </div>
      {/* Fix: Replaced unsupported <style jsx> with a standard <style> tag and renamed animations to be component-specific. */}
      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-modal-fade-in {
          animation: modal-fade-in 0.3s ease-out forwards;
        }
        @keyframes modal-slide-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-modal-slide-in-up {
          animation: modal-slide-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddSupplierModal;