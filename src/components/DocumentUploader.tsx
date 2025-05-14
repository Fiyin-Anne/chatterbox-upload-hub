
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X } from 'lucide-react';

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF document.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF document.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleSubmit = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  }, [selectedFile, onUpload]);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className="w-full mb-3">
      {!selectedFile ? (
        <div 
          className={`border border-dashed ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
            rounded-lg p-3 transition-colors duration-200 ease-in-out text-center`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="mb-1 h-5 w-5 text-gray-400" />
            <p className="mb-1 text-xs text-gray-700">
              <span className="font-medium">Drop PDF</span> or 
              <span className="text-indigo-500 ml-1 cursor-pointer" 
                onClick={() => document.getElementById('file-upload')?.click()}>
                browse
              </span>
            </p>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleChange}
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-indigo-500 mr-2" />
              <p className="text-xs font-medium text-gray-700 truncate max-w-[120px]">{selectedFile.name}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={removeFile}
              >
                <X className="h-3 w-3" />
              </Button>
              <Button 
                onClick={handleSubmit} 
                size="sm" 
                className="text-xs py-1 h-6 bg-indigo-600 hover:bg-indigo-700"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
