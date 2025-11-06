// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, uploadImage, deleteImage } from '@/lib/supabase'
import { Save, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'

export default function AdminPersonalInfoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [personalInfoId, setPersonalInfoId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
  })

  useEffect(() => {
    checkAuth()
    fetchPersonalInfo()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
  }

  async function fetchPersonalInfo() {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .maybeSingle()

    if (data) {
      setPersonalInfoId(data.id)
      setFormData({
        name: data.name || '',
        title: data.title || '',
        bio: data.bio || '',
        email: data.email || '',
        github_url: data.github_url || '',
        linkedin_url: data.linkedin_url || '',
        twitter_url: data.twitter_url || '',
      })
      setCurrentImageUrl(data.profile_image_url)
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
      let profileImageUrl = currentImageUrl

      // Upload new image if selected
      if (imageFile) {
        // Delete old image if exists
        if (currentImageUrl) {
          await deleteImage(currentImageUrl)
        }
        
        profileImageUrl = await uploadImage(imageFile)
        if (!profileImageUrl) {
          throw new Error('Failed to upload image')
        }
      }

      const updateData = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        email: formData.email,
        github_url: formData.github_url || null,
        linkedin_url: formData.linkedin_url || null,
        twitter_url: formData.twitter_url || null,
        profile_image_url: profileImageUrl,
        updated_at: new Date().toISOString(),
      }

      if (personalInfoId) {
        // Update existing
        const { error } = await supabase
          .from('personal_info')
          .update(updateData)
          .eq('id', personalInfoId)

        if (error) throw error
      } else {
        // Insert new (first time)
        const { error } = await supabase
          .from('personal_info')
          .insert([updateData])

        if (error) throw error
      }

      alert('Personal info berhasil disimpan!')
      await fetchPersonalInfo()
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
      <h1 className="text-4xl font-heading text-primary-900 mb-8">PERSONAL INFO</h1>

      <form onSubmit={handleSubmit} className="card-vintage max-w-3xl">
        {/* Profile Image */}
        <div className="mb-8">
          <label className="block font-subheading text-lg mb-4">
            PROFILE IMAGE
          </label>
          {(imagePreview || currentImageUrl) ? (
            <div className="relative">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src={imagePreview || currentImageUrl || ''}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="flex items-center gap-2 px-4 py-2 bg-semantic-error text-white hover:bg-semantic-error/80 transition-colors mx-auto"
              >
                <X size={18} /> REMOVE IMAGE
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-neutral-300 p-8 text-center hover:border-accent-500 transition-colors max-w-md mx-auto">
              <Upload className="mx-auto mb-4 text-neutral-400" size={48} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-upload"
              />
              <label
                htmlFor="profile-upload"
                className="cursor-pointer font-subheading text-lg text-accent-500 hover:text-accent-700"
              >
                CLICK TO UPLOAD
              </label>
              <p className="text-sm text-neutral-500 mt-2">
                PNG, JPG up to 5MB
              </p>
            </div>
          )}
        </div>

        <div className="border-t-2 border-neutral-200 pt-8">
          {/* Name */}
          <div className="mb-6">
            <label className="block font-subheading text-lg mb-2">
              FULL NAME *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-retro"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block font-subheading text-lg mb-2">
              TITLE / TAGLINE *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-retro"
              placeholder="Full Stack Developer"
              required
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block font-subheading text-lg mb-2">
              BIO *
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-retro"
              rows={8}
              placeholder="Tell us about yourself..."
              required
            />
            <p className="text-sm text-neutral-500 mt-2">
              Akan ditampilkan di Home page dan About page
            </p>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block font-subheading text-lg mb-2">
              EMAIL *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-retro"
              placeholder="contact@example.com"
              required
            />
          </div>

          {/* Social Links */}
          <div className="border-t-2 border-neutral-200 pt-6 mt-8">
            <h3 className="text-2xl font-heading text-primary-900 mb-6">SOCIAL LINKS</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-subheading text-base mb-2">
                  GITHUB URL
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="input-retro"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block font-subheading text-base mb-2">
                  LINKEDIN URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="input-retro"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block font-subheading text-base mb-2">
                  TWITTER URL
                </label>
                <input
                  type="url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  className="input-retro"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 pt-6 border-t-2 border-neutral-200">
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
              <>
                <Save size={20} />
                SAVE PERSONAL INFO
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
