'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const API_BASE_URL = 'https://api.almostcrackd.ai'

async function readJsonOrText(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function getSupabaseAccessToken() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export async function generatePresignedUrl(contentType: string) {
  const token = await getSupabaseAccessToken()
  if (!token) throw new Error('Authentication token not found.')

  console.log('[test] generatePresignedUrl request')
  const response = await fetch(`${API_BASE_URL}/pipeline/generate-presigned-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentType }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Failed to generate presigned URL:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    })
    throw new Error(`Server Error: ${response.status} - ${errorText}`)
  }

  const result = await readJsonOrText(response)
  console.log('[test] generatePresignedUrl response', result)
  if (typeof result === 'string') {
    throw new Error(`Unexpected response: ${result}`)
  }
  return result
}

export async function registerImageUrl(cdnUrl: string) {
  const token = await getSupabaseAccessToken()
  if (!token) throw new Error('Authentication token not found.')

  console.log('[test] registerImageUrl request', { cdnUrl })
  const response = await fetch(`${API_BASE_URL}/pipeline/upload-image-from-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Failed to register image URL:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    })
    throw new Error(`Server Error: ${response.status} - ${errorText}`)
  }

  const result = await readJsonOrText(response)
  console.log('[test] registerImageUrl response', result)
  if (typeof result === 'string') {
    throw new Error(`Unexpected response: ${result}`)
  }
  return result
}

export async function generateCaptionsForImage(imageId: string | number, flavorId?: string) {
  const token = await getSupabaseAccessToken()
  if (!token) throw new Error('Authentication token not found.')

  const startedAt = Date.now()
  console.log('[test] generateCaptionsForImage request', { imageId, flavorId })
  const response = await fetch(`${API_BASE_URL}/pipeline/generate-captions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageId,
      image_id: imageId,
      flavorId,
      flavor_id: flavorId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Failed to generate captions:', {
      status: response.status,
      statusText: response.statusText,
      errorText,
      imageId,
      imageIdType: typeof imageId,
    })
    throw new Error(`Server Error: ${response.status} - ${errorText}`)
  }

  const result = await readJsonOrText(response)
  console.log('[test] generateCaptionsForImage response', { ms: Date.now() - startedAt, result })
  return result
}
