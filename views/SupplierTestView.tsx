import React, { useState, useCallback, useEffect } from 'react';
// fix: Import SupplierMock as this view uses the mock data service.
import { Supplier } from '../types';
import { fetchSuppliers } from '../services/apiService_Supplier';
import DataTable, { Column } from '../components/DataTable';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { ArrowDownTrayIcon } from '../components/icons/ArrowDownTrayIcon';
import { DocumentDuplicateIcon } from '../components/icons/DocumentDuplicateIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TrashIcon } from '../components/icons/TrashIcon';


const SupplierTestView: React.FC = () => {
  // fix: Use SupplierMock for state.
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // fix: Use SupplierMock for state.
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Load data through API
  const loadSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSuppliers(currentPage, debouncedSearchTerm);
      setSuppliers(data.value);
      setTotalCount(data['@odata.count']);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setSuppliers([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // Download data?
  const handleDownload = () => {
    if (!suppliers) return;
    const jsonString = JSON.stringify(suppliers, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // fix: Use SupplierMock for parameter.
  const handleOpenModal = (supplier: Supplier | null = null) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };
  
  // fix: Use SupplierMock for parameter.
  const handleSave = (formData: Omit<Supplier, 'cageCode'> & { CageCodeConcat?: string }) => {
    if (editingSupplier) {
      // Update
      setSuppliers(suppliers.map(s => s.CAGECodeConcat === editingSupplier.CAGECodeConcat ? { ...s, ...formData } as Supplier : s));
    } else {
      // Create
      const newSupplier: Supplier = {
        ...formData,
        CAGECodeConcat: formData.CAGECodeConcat || `NEW-${Date.now()}` // Simple unique ID generation
      };
      setSuppliers([newSupplier, ...suppliers]);
    }
    handleCloseModal();
  };

  const handleDelete = (cageCode: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.CAGECodeConcat !== cageCode));
    }
  };


  // fix: Use SupplierMock for column definitions.
  const columns: Column<Supplier>[] = [
    { header: 'CAGE Code', accessor: 'CAGECodeConcat' },
    { header: 'Supplier Name', accessor: 'SupplierName' },
    { header: 'Address', accessor: 'SupplierAddress' },
    { header: 'City', accessor: 'City' },
    { header: 'US State', accessor: (item: Supplier) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.StateProvince !== null ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.StateProvince.Caption}
        </span>
    )},
    { header: 'Country', accessor: (item: Supplier) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.CountryList !== null ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.CountryList.Caption}
        </span>
    )},
    { header: 'Canada Province', accessor: (item: Supplier) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.Province !== null ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.Province.Caption}
        </span>
    )},
    { header: 'Territory', accessor: (item: Supplier) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.StateProvince2 !== '' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.StateProvince2}
        </span>
    )},
    { header: 'Zip Code', accessor: (item: Supplier) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.ZIPCodeConcat !== '' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.ZIPCodeConcat}
        </span>
    )},
    { header: 'Postal Code', accessor: (item: Supplier) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.PostalCode !== '' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.PostalCode}
        </span>
    )},
    {
      header: 'Actions',
      accessor: (item: Supplier) => (
        <div className="flex space-x-2">
            <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="w-5 h-5" /></button>
            <button onClick={() => handleDelete(item.CAGECodeConcat)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">CAGE Supplier Data</h2>
          <p className="text-slate-500 mt-1">Commercial and Government Entity (CAGE) Code Suppliers</p>
        </div>
        {/*
        <div className="flex space-x-2">
            <Button onClick={() => handleOpenModal()}>Create New Supplier</Button>
            <Button onClick={handleFetch} disabled={loading} leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                {loading ? 'Fetching...' : 'Refetch Data'}
            </Button>
            {suppliers && suppliers.length > 0 && (
                <Button onClick={handleDownload} variant="secondary" leftIcon={<DocumentDuplicateIcon className="w-5 h-5" />}>
                    Download JSON
                </Button>
            )}
        </div>
        */}
      </div>

      {loading && <div className="flex justify-center p-10"><Spinner /></div>}
      {error && <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}
      
      {!loading && !error && suppliers && (
        suppliers.length > 0 ? (
          <DataTable data={suppliers} columns={columns} keyAccessor="CAGECodeConcat" />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-slate-700">No Data Available</h3>
            <p className="text-slate-500 mt-2">The data source did not return any suppliers.</p>
          </div>
        )
      )}
      
      <SupplierFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} supplier={editingSupplier} />
    </div>
  );
};

// ===================
// SupplierFormModel
// ===================
interface SupplierFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    // fix: Use SupplierMock for props.
    onSave: (data: Omit<Supplier, 'CAGECodeConcat'> & { CAGECodeConcat?: string }) => void;
    supplier: Supplier | null;
}

const SupplierFormModal: React.FC<SupplierFormModalProps> = ({ isOpen, onClose, onSave, supplier }) => {
    // fix: Use SupplierMock for form data state.
    const [formData, setFormData] = useState<Omit<Supplier, 'CAGECodeConcat'>>({
      SupplierName: '',
      SupplierNo: '',
      UEID: '',
      SupplierAddress: '',
      City: '',
      StateProvince: null,
      Province: null,
      StateProvince2: '',
      CountryList: null,
      ZIPCodeConcat: '',
      PostalCode: '',
      CAGEStatus: null,
      SupplierWebsite: '',
    });

    useEffect(() => {
      if (supplier) {
        setFormData({
          SupplierName: supplier.SupplierName,
          SupplierNo: supplier.SupplierNo,
          UEID: supplier.UEID,
          SupplierAddress: supplier.SupplierAddress,
          City: supplier.City,
          StateProvince: null,
          Province: null,
          StateProvince2: '',
          CountryList: null,
          ZIPCodeConcat: '',
          PostalCode: '',
          CAGEStatus: null,
          SupplierWebsite: '',
        });
      } else {
        setFormData({
          SupplierName: '',
          SupplierNo: '',
          UEID: '',
          SupplierAddress:'',
          City: '',
          StateProvince: null,
          Province: null,
          StateProvince2: '',
          CountryList: null,
          ZIPCodeConcat: '',
          PostalCode: '',
          CAGEStatus: null,
          SupplierWebsite: '',
      });
      }
    }, [supplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(supplier ? { ...formData, CAGECodeConcat: supplier.CAGECodeConcat } : formData);
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={supplier ? 'Edit Supplier' : 'Create New Supplier'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">Company Name</label>
              <input type="text" name="companyName" id="companyName" value={formData.SupplierName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
            {!supplier && (
              <div>
                  <label htmlFor="cageCode" className="block text-sm font-medium text-slate-700">CAGE Code</label>
                  <input type="text" name="cageCode" id="cageCode" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
          )}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
              <input type="text" name="address" id="address" value={formData.SupplierAddress} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
              <input type="text" name="city" id="city" value={formData.City} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          {/*
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-slate-700">Province/State</label>
              <input type="text" name="province" id="province" value={formData.Province} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
              <label htmlFor="zip" className="block text-sm font-medium text-slate-700">Zip/Postal Code</label>
              <input type="text" name="zip" id="zip" value={formData.PostalCode} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
              <input type="text" name="country" id="country" value={formData.CountryList} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Active</option>
                  <option>Inactive</option>
              </select>
          </div>
          */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    );
}

export default SupplierTestView;