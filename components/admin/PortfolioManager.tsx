// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Edit, Trash2, Loader2, ExternalLink } from 'lucide-react'
// Using native img for Google Drive URL compatibility
// import Image from 'next/image'

interface PortfolioItem {
  id: number
  title: string
  description: string | null
  image_url: string | null
  is_featured: boolean
  category_id: number | null
  created_at: string
}

interface Category {
  id: number
  name: string
}

export default function PortfolioManager() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    
    const [itemsData, categoriesData] = await Promise.all([
      supabase.from('portfolio_items').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ])

    if (itemsData.data) setItems(itemsData.data)
    if (categoriesData.data) setCategories(categoriesData.data)
    
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus portfolio item ini?')) return

    setDeleting(id)
    
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setItems(items.filter(item => item.id !== id))
    }
    
    setDeleting(null)
  }

  // Toggle featured status for a portfolio item
  const [updatingFeatured, setUpdatingFeatured] = useState<number | null>(null)

  async function toggleFeatured(id: number, current: boolean) {
    setUpdatingFeatured(id)
    const { error, data } = await supabase
      .from('portfolio_items')
      .update({ is_featured: !current })
      .eq('id', id)
      .select()

    if (error) {
      alert('Error updating featured status: ' + error.message)
    } else if (data && data.length > 0) {
      // update local state
      setItems(items.map(i => (i.id === id ? { ...i, is_featured: data[0].is_featured } : i)))
    }

    setUpdatingFeatured(null)
  }

  function getCategoryName(categoryId: number | null) {
    if (!categoryId) return 'Uncategorized'
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-accent-500" size={48} />
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Portfolio Management</h2>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Add New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-stone-600 mb-4">
            Belum ada portfolio items
          </p>
          <Link href="/admin/portfolio/new" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
            <Plus size={20} /> Tambah Portfolio Pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-stone-600">Image</th>
                  <th className="text-left p-4 font-semibold text-stone-600">Title</th>
                  <th className="text-left p-4 font-semibold text-stone-600">Category</th>
                  <th className="text-left p-4 font-semibold text-stone-600">Featured</th>
                  <th className="text-left p-4 font-semibold text-stone-600">Date</th>
                  <th className="text-right p-4 font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="p-4">
                      {item.image_url ? (
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-stone-200 flex items-center justify-center rounded text-stone-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-stone-800">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-stone-500 line-clamp-1">{item.description}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                        {getCategoryName(item.category_id)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {item.is_featured ? (
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            Featured
                          </span>
                        ) : (
                          <span className="text-stone-400 text-sm">-</span>
                        )}
                        <button
                          onClick={() => toggleFeatured(item.id, !!item.is_featured)}
                          disabled={updatingFeatured === item.id}
                          className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                        >
                          {updatingFeatured === item.id ? '...' : (item.is_featured ? 'Unset' : 'Set')}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/portfolio/${item.id}`}
                          target="_blank"
                          className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
                          title="View"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === item.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
