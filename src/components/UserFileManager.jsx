import { useState, useEffect } from 'react'
import { Upload, Trash2, FileText, Image, Calendar, AlertCircle, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabaseAdmin } from '../config/supabase'

const FILE_TYPES = {
  profile_photo: {
    label: 'Profile Photo',
    icon: Image,
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    badge: 'bg-blue-100 text-blue-800',
    required: true
  },
  id_photo: {
    label: 'ID Photo',
    icon: Image,
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    badge: 'bg-green-100 text-green-800',
    required: true
  },
  resume: {
    label: 'Resume',
    icon: FileText,
    accept: '.pdf,.doc,.docx',
    maxSize: 10 * 1024 * 1024, // 10MB
    badge: 'bg-purple-100 text-purple-800',
    required: true
  },
  contract: {
    label: 'Contract',
    icon: FileText,
    accept: '.pdf',
    maxSize: 10 * 1024 * 1024, // 10MB
    badge: 'bg-orange-100 text-orange-800',
    required: true
  },
  certification: {
    label: 'Certification',
    icon: FileText,
    accept: '.pdf,.jpg,.jpeg,.png',
    maxSize: 10 * 1024 * 1024, // 10MB
    badge: 'bg-yellow-100 text-yellow-800',
    required: false
  },
  other: {
    label: 'Other Document',
    icon: FileText,
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    maxSize: 10 * 1024 * 1024, // 10MB
    badge: 'bg-gray-100 text-gray-800',
    required: false
  }
}

function UserFileManager({ userId }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadedFileTypes, setUploadedFileTypes] = useState(new Set())

  useEffect(() => {
    fetchUserFiles()
  }, [userId])

  const fetchUserFiles = async () => {
    try {
      setLoading(true)
      const { data: userFiles, error: userFilesError } = await supabaseAdmin
        .from('user_files')
        .select(`
          id,
          description,
          is_active,
          valid_from,
          valid_until,
          files (
            id,
            file_name,
            file_type,
            file_url,
            file_size,
            mime_type,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (userFilesError) throw userFilesError

      setFiles(userFiles || [])
      
      // Update uploaded file types
      const types = new Set(userFiles?.map(uf => uf.files.file_type) || [])
      setUploadedFileTypes(types)
    } catch (error) {
      console.error('Error fetching user files:', error)
      toast.error('Failed to load user files')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event, fileType) => {
    try {
      const file = event.target.files[0]
      if (!file) return

      // Validate file size
      if (file.size > FILE_TYPES[fileType].maxSize) {
        toast.error(`File size exceeds ${FILE_TYPES[fileType].maxSize / 1024 / 1024}MB limit`)
        return
      }

      setUploading(true)

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${fileType}/${Math.random().toString(36).slice(2)}.${fileExt}`
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from('user-files')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('user-files')
        .getPublicUrl(fileName)

      // Create file record
      const { data: fileRecord, error: fileError } = await supabaseAdmin
        .from('files')
        .insert({
          file_name: file.name,
          file_type: fileType,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single()

      if (fileError) throw fileError

      // Create user_files record
      const { error: userFileError } = await supabaseAdmin
        .from('user_files')
        .insert({
          user_id: userId,
          file_id: fileRecord.id,
          description: `${FILE_TYPES[fileType].label} - ${file.name}`,
          is_active: true
        })

      if (userFileError) throw userFileError

      toast.success('File uploaded successfully')
      fetchUserFiles() // Refresh the list
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteFile = async (userFileId, fileId) => {
    try {
      setLoading(true)

      // Delete user_files record
      const { error: userFileError } = await supabaseAdmin
        .from('user_files')
        .delete()
        .eq('id', userFileId)

      if (userFileError) throw userFileError

      // Delete file record
      const { error: fileError } = await supabaseAdmin
        .from('files')
        .delete()
        .eq('id', fileId)

      if (fileError) throw fileError

      toast.success('File deleted successfully')
      fetchUserFiles() // Refresh the list
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
    } finally {
      setLoading(false)
    }
  }

  const isImageFile = (mimeType) => {
    return mimeType?.startsWith('image/')
  }

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(FILE_TYPES).map(([type, config]) => {
          const isUploaded = uploadedFileTypes.has(type)
          return (
            <div key={type} className="relative">
              <input
                type="file"
                id={`file-${type}`}
                accept={config.accept}
                onChange={(e) => handleFileUpload(e, type)}
                className="hidden"
                disabled={uploading || isUploaded}
              />
              <label
                htmlFor={`file-${type}`}
                className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg transition-colors ${
                  isUploaded 
                    ? 'border-green-300 bg-green-50 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-orange-500 cursor-pointer'
                }`}
              >
                {isUploaded ? (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                ) : null}
                <config.icon className={`w-8 h-8 mb-2 ${isUploaded ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isUploaded ? 'text-green-700' : 'text-gray-700'}`}>
                  {config.label}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {isUploaded ? 'Uploaded' : 'Click to upload'}
                </span>
                {config.required && !isUploaded && (
                  <span className="text-xs text-red-500 mt-1">Required</span>
                )}
              </label>
            </div>
          )
        })}
      </div>

      {/* Files List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Uploaded Files</h3>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-4">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((userFile) => (
                <div
                  key={userFile.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2"
                >
                  <div className="flex items-center space-x-4">
                    {isImageFile(userFile.files.mime_type) ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={userFile.files.file_url} 
                          alt={userFile.files.file_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100">
                        {(() => {
                          const IconComponent = FILE_TYPES[userFile.files.file_type].icon
                          return <IconComponent className="w-6 h-6 text-gray-400" />
                        })()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {userFile.files.file_name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${FILE_TYPES[userFile.files.file_type].badge}`}>
                          {FILE_TYPES[userFile.files.file_type].label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(userFile.files.created_at).toLocaleDateString()}
                        </span>
                        {userFile.valid_from && (
                          <span className="text-xs text-gray-500">
                            Valid from: {new Date(userFile.valid_from).toLocaleDateString()}
                          </span>
                        )}
                        {userFile.valid_until && (
                          <span className="text-xs text-gray-500">
                            Valid until: {new Date(userFile.valid_until).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={userFile.files.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View File
                    </a>
                    <button
                      onClick={() => handleDeleteFile(userFile.id, userFile.files.id)}
                      className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserFileManager 