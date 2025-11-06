// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Edit, Trash2, Loader2, ExternalLink } from 'lucide-react'
import Image from 'next/image'

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

export default function AdminPortfolioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
  }

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

  function getCategoryName(categoryId: number | null) {
    if (!categoryId) return 'Uncategorized'
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown'
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
        <h1 className="text-4xl font-heading text-primary-900">PORTFOLIO MANAGEMENT</h1>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center gap-2 btn-retro"
        >
          <Plus size={20} /> ADD NEW
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card-vintage text-center py-16">
          <p className="font-subheading text-xl text-neutral-500 mb-6">
            Belum ada portfolio items
          </p>
          <Link href="/admin/portfolio/new" className="btn-retro inline-flex items-center gap-2">
            <Plus size={20} /> TAMBAH PORTFOLIO PERTAMA
          </Link>
        </div>
      ) : (
        <div className="card-vintage">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-neutral-300">
                  <th className="text-left p-4 font-subheading text-lg">Image</th>
                  <th className="text-left p-4 font-subheading text-lg">Title</th>
                  <th className="text-left p-4 font-subheading text-lg">Category</th>
                  <th className="text-left p-4 font-subheading text-lg">Featured</th>
                  <th className="text-left p-4 font-subheading text-lg">Date</th>
                  <th className="text-right p-4 font-subheading text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-200 hover:bg-primary-50">
                    <td className="p-4">
                      {item.image_url ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-neutral-200 flex items-center justify-center">
                          <span className="text-neutral-400 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-subheading text-base text-primary-900">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-neutral-600 line-clamp-1">{item.description}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-body">
                        {getCategoryName(item.category_id)}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.is_featured ? (
                        <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-sm font-body">
                          Featured
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-neutral-600">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/portfolio/${item.id}`}
                          target="_blank"
                          className="p-2 bg-neutral-500 text-white hover:bg-neutral-700 transition-colors"
                          title="View"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="p-2 bg-accent-500 text-white hover:bg-accent-700 transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="p-2 bg-semantic-error text-white hover:bg-semantic-error/80 transition-colors disabled:opacity-50"
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
