import { useState, useRef } from 'react'
import { Upload, X, File, Download, FileText, Eye } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useToast } from '@/hooks/use-toast'

interface FileUploadProps {
  files: string[]
  onChange: (files: string[]) => void
  maxFiles?: number
}

export function FileUpload({ files, onChange, maxFiles = 5 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Upload failed')
        }
        
        const result = await response.json()
        return result.filename
      })
      
      const uploadedFiles = await Promise.all(uploadPromises)
      onChange([...files, ...uploadedFiles])
      
      toast({
        title: "Upload successful",
        description: `${uploadedFiles.length} file(s) uploaded`
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const getFileDisplayName = (filename: string) => {
    // Remove timestamp prefix if present
    const parts = filename.split('-')
    if (parts.length > 1 && /^\d+$/.test(parts[0])) {
      return parts.slice(1).join('-')
    }
    return filename
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <File className="h-4 w-4 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'txt':
      case 'rtf':
        return <FileText className="h-4 w-4 text-gray-500" />
      default:
        return <File className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".doc,.docx,.pdf,.txt,.rtf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className="text-slate-600 mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-slate-500 mb-4">
          Supports DOC, DOCX, PDF, TXT, RTF files (max {maxFiles} files)
        </p>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || files.length >= maxFiles}
        >
          {uploading ? 'Uploading...' : 'Choose Files'}
        </Button>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Uploaded Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-150">
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-700 block truncate">
                    {getFileDisplayName(file)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {file.split('.').pop()?.toUpperCase()} file
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`/api/files/${file}`, '_blank')}
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                  title="View/Download file"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}