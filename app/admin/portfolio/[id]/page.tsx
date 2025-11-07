// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, uploadImage, deleteImage } from '@/lib/supabase'
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: number
  name: string
}

// Admin pages use dynamic routing and don't need static generation
// generateStaticParams moved to layout for static export compatibility

export default function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [portfolioId, setPortfolioId] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_description: '',
    category_id: '',
    demo_url: '',
    github_url: '',
    is_featured: false,
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    async function init() {
      const resolvedParams = await params
      setPortfolioId(resolvedParams.id)
      await checkAuth()
      await fetchData(resolvedParams.id)
    }
    init()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
  }

  async function fetchData(id: string) {
    const [itemData, categoriesData] = await Promise.all([
      supabase.from('portfolio_items').select('*').eq('id', id).maybeSingle(),
      supabase.from('categories').select('*').order('name')
    ])

    if (categoriesData.data) setCategories(categoriesData.data)

    if (itemData.data) {
      const item = itemData.data
      setFormData({
        title: item.title,
        description: item.description || '',
        full_description: item.full_description || '',
        category_id: item.category_id?.toString() || '',
        demo_url: item.demo_url || '',
        github_url: item.github_url || '',
        is_featured: item.is_featured || false,
        start_date: item.start_date ? item.start_date.split('T')[0] : '',
        end_date: item.end_date ? item.end_date.split('T')[0] : '',
      })
      setCurrentImageUrl(item.image_url)
    }

    setLoading(false)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    setCurrentImageUrl(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl = currentImageUrl

      // Upload new image if selected
      if (imageFile) {
        // Delete old image if exists
        if (currentImageUrl) {
          await deleteImage(currentImageUrl)
        }
        
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          throw new Error('Failed to upload image')
        }
      }

      // Update portfolio item
      const { error } = await supabase
        .from('portfolio_items')
        .update({
          title: formData.title,
          description: formData.description,
          full_description: formData.full_description,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          demo_url: formData.demo_url || null,
          github_url: formData.github_url || null,
          is_featured: formData.is_featured,
          image_url: imageUrl,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', portfolioId)

      if (error) throw error

      alert('Portfolio item berhasil diupdate!')
      router.push('/admin/portfolio')
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
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
      <Link
        href="/admin/portfolio"
        className="inline-flex items-center gap-2 font-subheading text-lg text-accent-500 hover:text-accent-700 transition-colors mb-8"
      >
        <ArrowLeft size={20} /> KEMBALI
      </Link>

      <h1 className="text-4xl font-heading text-primary-900 mb-8">EDIT PORTFOLIO</h1>

      <form onSubmit={handleSubmit} className="card-vintage max-w-3xl">
        {/* Title */}
        <div className="mb-6">
          <label className="block font-subheading text-lg mb-2">
            TITLE *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-retro"
            required
          />
        </div>

        {/* Short Description */}
        <div className="mb-6">
          <label className="block font-subheading text-lg mb-2">
            SHORT DESCRIPTION *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-retro"
            rows={3}
            required
          />
        </div>

        {/* Full Description */}
        <div className="mb-6">
          <label className="block font-subheading text-lg mb-2">
            FULL DESCRIPTION
          </label>
          <textarea
            value={formData.full_description}
            onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
            className="input-retro"
            rows={8}
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block font-subheading text-lg mb-2">
            CATEGORY
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="input-retro"
          >
            <option value="">-- Pilih Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-subheading text-lg mb-2">
              DEMO URL
            </label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              className="input-retro"
            />
          </div>
          <div>
            <label className="block font-subheading text-lg mb-2">
              GITHUB URL
            </label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="input-retro"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-subheading text-lg mb-2">
            PROJECT IMAGE
          </label>
          {(imagePreview || currentImageUrl) ? (
            <div className="relative">
              <div className="relative w-full h-64 mb-2">
                <Image
                  src={imagePreview || currentImageUrl || ''}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="flex items-center gap-2 px-4 py-2 bg-semantic-error text-white hover:bg-semantic-error/80 transition-colors"
              >
                <X size={18} /> REMOVE IMAGE
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-neutral-300 p-8 text-center hover:border-accent-500 transition-colors">
              <Upload className="mx-auto mb-4 text-neutral-400" size={48} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer font-subheading text-lg text-accent-500 hover:text-accent-700"
              >
                CLICK TO UPLOAD IMAGE
              </label>
            </div>
          )}
        </div>

        {/* Project Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-subheading text-lg mb-2">
              START DATE
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="input-retro"
            />
          </div>
          <div>
            <label className="block font-subheading text-lg mb-2">
              END DATE (kosongkan jika masih berjalan)
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="input-retro"
            />
          </div>
        </div>

        {/* Featured */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="font-subheading text-lg">
              FEATURED
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-retro flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                SAVING...
              </>
            ) : (
              'UPDATE PORTFOLIO'
            )}
          </button>
          <Link
            href="/admin/portfolio"
            className="px-6 py-3 font-subheading text-lg pixel-border bg-background-surface hover:bg-primary-100 transition-colors"
          >
            CANCEL
          </Link>
        </div>
      </form>
    </div>
  )
}
