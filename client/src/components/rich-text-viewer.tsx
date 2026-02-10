interface RichTextViewerProps {
  content: string
  className?: string
  maxLines?: number
}

export function RichTextViewer({ content, className = "", maxLines = 3 }: RichTextViewerProps) {
  const maxLinesClass = maxLines > 0 ? `line-clamp-${maxLines}` : ""
  
  return (
    <div 
      className={`prose prose-sm max-w-none text-slate-600 ${maxLinesClass} ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}