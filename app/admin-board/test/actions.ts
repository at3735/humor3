'use server'

import { generatePresignedUrl, registerImageUrl, generateCaptionsForImage } from './api'

export async function generateCaptions(
  flavorId: string,
  image: FormData
): Promise<string[]> {
  try {
    const startedAt = Date.now()
    console.log('[test] generateCaptions start', { flavorId })
    const file = image.get('image') as File
    if (!file) throw new Error('No file provided')

    console.log('[test] requesting presigned URL')
    const { presignedUrl, uploadUrl, cdnUrl } = await generatePresignedUrl(file.type)
    const putUrl = presignedUrl || uploadUrl
    if (!putUrl || !cdnUrl) throw new Error('Failed to get upload URL.')

    console.log('[test] uploading image')
    const uploadRes = await fetch(putUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })

    if (!uploadRes.ok) throw new Error('Upload failed')

    console.log('[test] registering image URL')
    const registerRes = await registerImageUrl(cdnUrl)
    const imageId = registerRes?.imageId || registerRes?.image_id || registerRes?.id
    if (!imageId) {
      console.error('Register image response:', registerRes)
      throw new Error('Failed to register image.')
    }

    console.log('[test] generating captions', { imageId })
    const captionsRes = await generateCaptionsForImage(String(imageId), flavorId)
    console.log('[test] captions response', captionsRes)
    console.log('[test] generateCaptions done', { ms: Date.now() - startedAt })
    if (Array.isArray(captionsRes)) {
      return captionsRes.map((caption: any) => (
        typeof caption === 'string' ? caption : (caption?.content ?? String(caption))
      ))
    }
    if (typeof captionsRes === 'string') {
      return captionsRes
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    }

    const captions = captionsRes?.captions
    if (Array.isArray(captions)) {
      return captions.map((caption: any) => (
        typeof caption === 'string' ? caption : (caption?.content ?? String(caption))
      ))
    }

    return []

  } catch (err: any) {
    console.error('Caption generation failed:', err)
    if (err instanceof Error) throw err
    throw new Error(String(err))
  }
}
