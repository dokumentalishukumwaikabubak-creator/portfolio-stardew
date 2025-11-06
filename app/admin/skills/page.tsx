'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Skill, Database } from '@/types/database.types';

export default function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: 3,
    category: 'Frontend'
  });

  // const supabase = createClient(); // supabase sudah diimport sebagai instance

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await (supabase as any)
        .from('skills')
        .insert([{
          name: formData.name,
          level: formData.level,
          category: formData.category
        }])
        .select();

      if (error) throw error;
      
      setSkills([...skills, data[0]]);
      setFormData({ name: '', level: 3, category: 'Frontend' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Gagal menambah skill');
    }
  };

  const handleEditSkill = async (skill: Skill) => {
    try {
      const { error } = await (supabase as any)
        .from('skills')
        .update({
          name: skill.name,
          level: skill.level,
          category: skill.category
        })
        .eq('id', skill.id);

      if (error) throw error;
      
      setSkills(skills.map(s => s.id === skill.id ? skill : s));
      setEditingSkill(null);
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Gagal mengupdate skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Yakin ingin menghapus skill ini?')) return;
    
    try {
      const { error } = await (supabase as any)
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Gagal menghapus skill');
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Mobile': 'bg-purple-100 text-purple-800',
      'Design': 'bg-pink-100 text-pink-800',
      'Tools': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-stone-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-stone-600">Loading skills...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <AdminHeader title="Skills Management" />
        
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-stone-800">Skills Management</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {showAddForm ? 'Cancel' : '+ Add Skill'}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
              <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                />
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                >
                  <option value={1}>Level 1 - Beginner</option>
                  <option value={2}>Level 2</option>
                  <option value={3}>Level 3 - Intermediate</option>
                  <option value={4}>Level 4</option>
                  <option value={5}>Level 5 - Expert</option>
                </select>
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Skill
                </button>
              </form>
            </div>
          )}

          <div className="grid gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-white rounded-lg p-6 shadow-md">
                {editingSkill?.id === skill.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <input
                      type="text"
                      value={editingSkill.name}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                    <select
                      value={editingSkill.level}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    >
                      <option value={1}>Level 1</option>
                      <option value={2}>Level 2</option>
                      <option value={3}>Level 3</option>
                      <option value={4}>Level 4</option>
                      <option value={5}>Level 5</option>
                    </select>
                    <input
                      type="text"
                      value={editingSkill.category}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSkill(editingSkill)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingSkill(null)}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-stone-800">{skill.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                          {skill.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-600">Level {skill.level}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < skill.level ? getLevelColor(skill.level) : 'bg-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSkill(skill)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {skills.length === 0 && (
            <div className="text-center py-12 text-stone-600">
              <p>No skills found. Add your first skill to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}