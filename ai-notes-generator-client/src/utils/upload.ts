import axios from 'axios'

export async function uploadFile(file: File) {
  const { data } = await axios.get(import.meta.env.VITE_API_GATEWAY_URL, {
    params: { filename: file.name }
  })

  await axios.put(data.url, file, {
    headers: { 'Content-Type': file.type }
  })
}