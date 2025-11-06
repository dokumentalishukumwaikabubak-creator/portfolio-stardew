// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, uploadImage } from '@/lib/supabase'
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: number
  name: string
}

export default function NewPortfolioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_description: '',
    category_id: '',
    demo_url: '',
    github_url: '',
    is_featured: false,
  })

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
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) setCategories(data)
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload image first if exists
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          throw new Error('Failed to upload image')
        }
      }

      // Insert portfolio item
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([{
          title: formData.title,
          description: formData.description,
          full_description: formData.full_description,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          demo_url: formData.demo_url || null,
          github_url: formData.github_url || null,
          is_featured: formData.is_featured,
          image_url: imageUrl,
        }])
        .select()
        .maybeSingle()

      if (error) throw error

      alert('Portfolio item berhasil ditambahkan!')
      router.push('/admin/portfolio')
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/portfolio"
        className="inline-flex items-center gap-2 font-subheading text-lg text-accent-500 hover:text-accent-700 transition-colors mb-8"
      >
        <ArrowLeft size={20} /> KEMBALI
      </Link>

      <h1 className="text-4xl font-heading text-primary-900 mb-8">ADD NEW PORTFOLIO</h1>

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
            placeholder="Nama project"
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
            placeholder="Deskripsi singkat untuk card display"
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
            placeholder="Deskripsi lengkap untuk detail page"
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
              placeholder="https://demo.com"
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
              placeholder="https://github.com/user/repo"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-subheading text-lg mb-2">
            PROJECT IMAGE
          </label>
          {imagePreview ? (
            <div className="relative">
              <div className="relative w-full h-64 mb-2">
                <Image
                  src={imagePreview}
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
              <p className="text-sm text-neutral-500 mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
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
              FEATURED (tampilkan di home page)
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-retro flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                SAVING...
              </>
            ) : (
              'SAVE PORTFOLIO'
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
