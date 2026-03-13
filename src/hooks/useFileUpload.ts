/**
 * useFileUpload Hook
 * File upload with progress tracking
 */

import { useState, useCallback } from "react";

interface FileUploadState {
  /** Current upload progress (0-100) */
  progress: number;
  /** Whether upload is in progress */
  isUploading: boolean;
  /** Error message if upload failed */
  error: string | null;
  /** Uploaded file URL */
  uploadedUrl: string | null;
}

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface UseFileUploadReturn extends FileUploadState {
  /** Upload a file */
  upload: (file: File) => Promise<FileMetadata | null>;
  /** Reset upload state */
  reset: () => void;
}

/**
 * Mock file upload with progress simulation
 */
export function useFileUpload(): UseFileUploadReturn {
  const [state, setState] = useState<FileUploadState>({
    progress: 0,
    isUploading: false,
    error: null,
    uploadedUrl: null,
  });

  const reset = useCallback(() => {
    setState({
      progress: 0,
      isUploading: false,
      error: null,
      uploadedUrl: null,
    });
  }, []);

  const upload = useCallback(async (file: File): Promise<FileMetadata | null> => {
    setState({
      progress: 0,
      isUploading: true,
      error: null,
      uploadedUrl: null,
    });

    try {
      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setState((prev) => ({ ...prev, progress }));
      }

      // Mock uploaded URL
      const mockUrl = `https://storage.example.com/uploads/${Date.now()}_${file.name}`;

      const metadata: FileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: mockUrl,
        uploadedAt: new Date().toISOString(),
      };

      setState({
        progress: 100,
        isUploading: false,
        error: null,
        uploadedUrl: mockUrl,
      });

      return metadata;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setState((prev) => ({
        ...prev,
        isUploading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  return {
    ...state,
    upload,
    reset,
  };
}

/**
 * Validate file against constraints
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  }
): { valid: boolean; error?: string } {
  const { maxSize, allowedTypes } = options;

  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
    };
  }

  if (allowedTypes && allowedTypes.length > 0) {
    const isAllowed = allowedTypes.some(
      (type) => file.type === type || file.name.endsWith(type.replace("*", ""))
    );
    if (!isAllowed) {
      return {
        valid: false,
        error: `File type not allowed. Accepted types: ${allowedTypes.join(", ")}`,
      };
    }
  }

  return { valid: true };
}
