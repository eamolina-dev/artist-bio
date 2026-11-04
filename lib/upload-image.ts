import { createClient } from '@supabase/supabase-js'

// Usamos las variables de entorno públicas existentes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Sube un archivo al bucket 'artist-assets' y retorna la URL pública.
 * @param file - Archivo proveniente del <input type="file" />
 * @param folder - Carpeta dentro del bucket (ej: 'avatars', 'covers', 'releases')
 */
export async function uploadImage(file: File, folder: string = 'general'): Promise<string | null> {
  try {
    // 1. Crear un nombre único de archivo para evitar sobreescribir imágenes
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

    // 2. Subir el archivo al bucket 'artist-assets'
    const { error } = await supabase.storage
      .from('artist-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error.message)
      return null
    }

    // 3. Obtener la URL pública del archivo subido
    const { data } = supabase.storage
      .from('artist-assets')
      .getPublicUrl(fileName)

    return data.publicUrl
  } catch (err) {
    console.error('Unexpected error during upload:', err)
    return null
  }
}
