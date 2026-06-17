"use client";

import { useState } from "react";
import { Faq } from "@prisma/client";
import { H1 } from "@/components/ui/Heading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function FaqsClient({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "", isActive: true, order: 0 });
  const [loading, setLoading] = useState(false);

  const openModal = (faq?: Faq) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({ question: faq.question, answer: faq.answer, isActive: faq.isActive, order: faq.order });
    } else {
      setEditingFaq(null);
      setFormData({ question: "", answer: "", isActive: true, order: faqs.length });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingFaq) {
        const res = await fetch(`/api/faqs/${editingFaq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const updatedFaq = await res.json();
          setFaqs(faqs.map(f => f.id === updatedFaq.id ? updatedFaq : f).sort((a, b) => a.order - b.order));
          closeModal();
        }
      } else {
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const newFaq = await res.json();
          setFaqs([...faqs, newFaq].sort((a, b) => a.order - b.order));
          closeModal();
        }
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs(faqs.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleActive = async (faq: Faq) => {
    try {
      const res = await fetch(`/api/faqs/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !faq.isActive })
      });
      if (res.ok) {
        const updatedFaq = await res.json();
        setFaqs(faqs.map(f => f.id === updatedFaq.id ? updatedFaq : f));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={[{ label: "FAQs" }]} />
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-primary-light">
        <H1 className="text-3xl font-bold text-primary-dark">Manage FAQs</H1>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-sm"
        >
          + Add New FAQ
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-gray-600">Question</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Order</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No FAQs found. Create one to get started!
                  </td>
                </tr>
              )}
              {faqs.map(faq => (
                <tr key={faq.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-800">{faq.question}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{faq.answer}</p>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => toggleActive(faq)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${faq.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {faq.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-700">{faq.order}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(faq)}
                        className="px-3 py-1 bg-primary-light text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(faq.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingFaq ? "Edit FAQ" : "Add New FAQ"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Question</label>
                <input 
                  required 
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Answer</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Order</label>
                  <input 
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={formData.isActive}
                        onChange={() => setFormData({...formData, isActive: true})}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="status" 
                        checked={!formData.isActive}
                        onChange={() => setFormData({...formData, isActive: false})}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
