import React, { useState, useEffect } from 'react';
// fix: Aliased SupplierAPI as Supplier to match the properties used in this component.
import { SupplierAPI as Supplier } from '../types';
import Modal from './Modal';
import Button from './Button';

interface SupplierDetailModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onSave: (updatedSupplier: Supplier) => void;
  onDelete: (supplierNo: string) => void;
  isCreating?: boolean;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 last:border-b-0">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="text-sm text-slate-800 col-span-2 break-words">{value}</dd>
        </div>
    );
};

const PairedDetailRow: React.FC<{
  label1: string;
  value1: React.ReactNode;
  label2: string;
  value2: React.ReactNode;
}> = ({ label1, value1, label2, value2 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 py-3 border-b border-slate-100 last:border-b-0">
      <div className="grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-slate-500">{label1}</dt>
        <dd className="text-sm text-slate-800 col-span-2 break-words">{value1}</dd>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-slate-500">{label2}</dt>
        <dd className="text-sm text-slate-800 col-span-2 break-words">{value2}</dd>
      </div>
    </div>
  );
};

const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({ supplier, onClose, onSave, onDelete, isCreating = false }) => {
  const [isEditing, setIsEditing] = useState(isCreating);
  const [formData, setFormData] = useState<Partial<Supplier> | null>(null);

  useEffect(() => {
    if (isCreating) {
      setIsEditing(true);
      // fix: The properties of this object are valid for the aliased Supplier (SupplierAPI) type.
      setFormData({
        SupplierNo: '',
        SupplierName: '',
        CAGECodeConcat: '',
        UEID: null,
        SupplierAddress: '',
        City: '',
        ZIPCodeConcat: null,
        PostalCode: null,
        StateProvince2: null,
        SupplierWebsite: null,
        StateProvince: null,
        Province: null,
        CountryList: { Caption: '' },
        CAGEStatus: null,
        Contracts: [],
        Projects: [],
      });
    } else if (supplier) {
      setFormData({ ...supplier });
      setIsEditing(false);
    }
  }, [supplier, isCreating]);

  if ((!supplier && !isCreating) || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };
  
  const handleSave = () => {
    if (formData) {
      onSave(formData as Supplier);
      onClose();
    }
  };
  
  const handleDelete = () => {
    // fix: SupplierName and SupplierNo are valid properties on the aliased Supplier (SupplierAPI) type.
    if (supplier && window.confirm(`Are you sure you want to delete ${supplier.SupplierName}? This action cannot be undone.`)) {
      onDelete(supplier.SupplierNo);
      onClose();
    }
  };

  const renderReadOnlyView = () => {
    if (!supplier) return null;
    // fix: All properties accessed here are valid on the aliased Supplier (SupplierAPI) type.
    const fullAddress = [
      supplier.SupplierAddress,
      supplier.City,
      supplier.StateProvince?.Caption || supplier.Province?.Caption || supplier.StateProvince2,
      supplier.ZIPCodeConcat || supplier.PostalCode,
      supplier.CountryList.Caption
    ].filter(Boolean).join(', ');
  
    const cageStatus = supplier.CAGEStatus ? supplier.CAGEStatus.Description : 'N/A';
    const hasContracts = supplier.Contracts && supplier.Contracts.length > 0;
    const hasProjects = supplier.Projects && supplier.Projects.length > 0;

    return (
        <>
            <dl>
                <PairedDetailRow 
                    label1="Supplier Number"
                    value1={supplier.SupplierNo}
                    label2="UEI"
                    value2={supplier.UEID || 'N/A'}
                />
                <PairedDetailRow 
                    label1="CAGE Code"
                    value1={supplier.CAGECodeConcat}
                    label2="CAGE Status"
                    value2={cageStatus}
                />
                <DetailRow label="Full Address" value={fullAddress} />
                {(hasContracts || hasProjects) && (
                    <div className="py-3 border-b border-slate-100 last:border-b-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <div>
                                <dt className="text-sm font-medium text-slate-500 mb-2">Contracts</dt>
                                <dd>
                                    {hasContracts ? (
                                        <ul className="list-disc list-inside bg-slate-50 p-3 rounded-md border border-slate-200 h-full text-sm text-slate-700">
                                            {supplier.Contracts.map((contract, index) => (
                                                <li key={index} className="py-1">{contract.ContractNo}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-md border border-slate-200 h-full">No contracts found.</div>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-slate-500 mb-2">Projects</dt>
                                <dd>
                                    {hasProjects ? (
                                        <ul className="list-disc list-inside bg-slate-50 p-3 rounded-md border border-slate-200 h-full text-sm text-slate-700">
                                            {supplier.Projects.map((project, index) => (
                                                <li key={index} className="py-1">{project.AcronymAbbrevia}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-md border border-slate-200 h-full">No projects found.</div>
                                    )}
                                </dd>
                            </div>
                        </div>
                    </div>
                )}<br />
                {supplier.SupplierWebsite && (
                    <DetailRow
                        label="Website"
                        value={
                            <a
                                href={supplier.SupplierWebsite.startsWith('http') ? supplier.SupplierWebsite : `https://${supplier.SupplierWebsite}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                            >
                                {supplier.SupplierWebsite}
                            </a>
                        }
                    />
                )}
            </dl>
            <div className="flex justify-end space-x-2 pt-6 border-t border-slate-200 mt-4">
                <Button variant="danger" onClick={handleDelete}>Delete</Button>
                <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
                <Button onClick={onClose}>Close</Button>
            </div>
        </>
    );
  };

  const renderEditView = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {isCreating && (
                 <>
                    <div>
                        <label htmlFor="SupplierNo" className="block text-sm font-medium text-slate-700">Supplier Number</label>
                        {/* fix: formData properties are now valid on the aliased Supplier (SupplierAPI) type. */}
                        <input type="text" name="SupplierNo" id="SupplierNo" value={formData.SupplierNo || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                     <div>
                        <label htmlFor="CAGECodeConcat" className="block text-sm font-medium text-slate-700">CAGE Code</label>
                        <input type="text" name="CAGECodeConcat" id="CAGECodeConcat" value={formData.CAGECodeConcat || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                 </>
            )}
            <div>
                <label htmlFor="SupplierName" className="block text-sm font-medium text-slate-700">Supplier Name</label>
                <input type="text" name="SupplierName" id="SupplierName" value={formData.SupplierName || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
                <label htmlFor="SupplierAddress" className="block text-sm font-medium text-slate-700">Address</label>
                <input type="text" name="SupplierAddress" id="SupplierAddress" value={formData.SupplierAddress || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
                <label htmlFor="City" className="block text-sm font-medium text-slate-700">City</label>
                <input type="text" name="City" id="City" value={formData.City || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
                <label htmlFor="Country" className="block text-sm font-medium text-slate-700">Country</label>
                <input 
                    type="text" 
                    name="Country" 
                    id="Country" 
                    value={formData.CountryList?.Caption || ''} 
                    onChange={e => setFormData(p => (p ? {...p, CountryList: { Caption: e.target.value }} : null))}
                    required 
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
                <label htmlFor="UEID" className="block text-sm font-medium text-slate-700">UEI</label>
                <input type="text" name="UEID" id="UEID" value={formData.UEID || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
                <label htmlFor="SupplierWebsite" className="block text-sm font-medium text-slate-700">Website</label>
                <input type="text" name="SupplierWebsite" id="SupplierWebsite" value={formData.SupplierWebsite || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
        </div>
        <div className="flex justify-end space-x-2 pt-6 border-t border-slate-200 mt-4">
            <Button variant="secondary" type="button" onClick={isCreating ? onClose : () => setIsEditing(false)}>Cancel</Button>
            <Button type="submit">{isCreating ? 'Create' : 'Save Changes'}</Button>
        </div>
    </form>
  );

  return (
    // fix: SupplierName is a valid property on the aliased Supplier (SupplierAPI) type.
    <Modal isOpen={!!supplier || isCreating} onClose={onClose} title={isCreating ? 'Create New Supplier' : (isEditing ? `Editing ${supplier.SupplierName}` : supplier.SupplierName)} size="3xl">
      {isEditing ? renderEditView() : renderReadOnlyView()}
    </Modal>
  );
};

export default SupplierDetailModal;