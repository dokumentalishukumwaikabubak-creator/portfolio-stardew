// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, Loader2, X, Check } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchCategories()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
  }

  async function fetchCategories() {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) setCategories(data)
    setLoading(false)
  }

  function startEdit(category: Category) {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setShowAddForm(false)
  }

  function cancelEdit() {
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  function startAdd() {
    setShowAddForm(true)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function handleSave() {
    if (!formData.name) {
      alert('Nama category harus diisi!')
      return
    }

    setSaving(true)

    try {
      const slug = formData.slug || generateSlug(formData.name)

      if (editingId) {
        // Update existing
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            slug: slug,
            description: formData.description || null,
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Insert new
        // @ts-ignore - Supabase type inference issue
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: formData.name,
            slug: slug,
            description: formData.description || null,
          }])

        if (error) throw error
      }

      await fetchCategories()
      setEditingId(null)
      setShowAddForm(false)
      setFormData({ name: '', slug: '', description: '' })
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus category ini?')) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setCategories(categories.filter(cat => cat.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin text-accent-500" size={48} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-heading text-primary-900">CATEGORIES</h1>
        {!showAddForm && (
          <button
            onClick={startAdd}
            className="flex items-center gap-2 btn-retro"
          >
            <Plus size={20} /> ADD NEW
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card-vintage mb-8 bg-secondary-50">
          <h2 className="text-2xl font-heading text-primary-900 mb-4">ADD NEW CATEGORY</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-subheading text-lg mb-2">NAME *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })
                }}
                className="input-retro"
                placeholder="e.g., Web Development"
              />
            </div>
            <div>
              <label className="block font-subheading text-lg mb-2">SLUG</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input-retro"
                placeholder="Auto-generated dari name"
              />
            </div>
            <div>
              <label className="block font-subheading text-lg mb-2">DESCRIPTION</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-retro"
                rows={3}
                placeholder="Optional description"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-secondary-500 text-white font-subheading hover:bg-secondary-700 transition-colors pixel-border disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                SAVE
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-500 text-white font-subheading hover:bg-neutral-700 transition-colors pixel-border"
              >
                <X size={20} /> CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="card-vintage hover:shadow-card-hover transition-all">
            {editingId === category.id ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div>
                  <label className="block font-subheading text-base mb-2">NAME *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value)
                      })
                    }}
                    className="input-retro"
                  />
                </div>
                <div>
                  <label className="block font-subheading text-base mb-2">SLUG</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-retro"
                  />
                </div>
                <div>
                  <label className="block font-subheading text-base mb-2">DESCRIPTION</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-retro"
                    rows={2}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white font-subheading hover:bg-secondary-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    SAVE
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-500 text-white font-subheading hover:bg-neutral-700 transition-colors"
                  >
                    <X size={18} /> CANCEL
                  </button>
                </div>
              </div>
            ) : (
              /* Display Mode */
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-subheading text-primary-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-2">Slug: {category.slug}</p>
                  {category.description && (
                    <p className="text-neutral-700 font-body">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="p-2 bg-accent-500 text-white hover:bg-accent-700 transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-semantic-error text-white hover:bg-semantic-error/80 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && !showAddForm && (
        <div className="card-vintage text-center py-16">
          <p className="font-subheading text-xl text-neutral-500 mb-6">
            Belum ada categories
          </p>
          <button onClick={startAdd} className="btn-retro inline-flex items-center gap-2">
            <Plus size={20} /> TAMBAH CATEGORY PERTAMA
          </button>
        </div>
      )}
    </div>
  )
}
