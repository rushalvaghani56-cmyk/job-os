"use client";

import { useState, useCallback } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

interface UseFileUploadOptions {
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: string, fileName: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    acceptedTypes = [],
    onUploadComplete,
    onUploadError,
  } = options;

  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [completedFiles, setCompletedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`;
      }

      if (acceptedTypes.length > 0) {
        const fileType = file.type || "";
        const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
        const isAccepted = acceptedTypes.some(
          (type) =>
            type === fileType ||
            type === fileExt ||
            (type.endsWith("/*") && fileType.startsWith(type.replace("/*", "/")))
        );

        if (!isAccepted) {
          return `File type not accepted. Allowed: ${acceptedTypes.join(", ")}`;
        }
      }

      return null;
    },
    [maxSize, acceptedTypes]
  );

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      const fileId = `upload_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        onUploadError?.(validationError, file.name);
        setUploads((prev) => [
          ...prev,
          {
            fileId,
            fileName: file.name,
            progress: 0,
            status: "error",
            error: validationError,
          },
        ]);
        return null;
      }

      // Add to uploads
      setUploads((prev) => [
        ...prev,
        {
          fileId,
          fileName: file.name,
          progress: 0,
          status: "uploading",
        },
      ]);
      setIsUploading(true);

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) =>
            setTimeout(resolve, 100 + Math.random() * 200)
          );
          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === fileId
                ? { ...u, progress: Math.min(progress, 100) }
                : u
            )
          );
        }

        // Create mock uploaded file
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // Mock URL
          uploadedAt: new Date().toISOString(),
        };

        // Mark as completed
        setUploads((prev) =>
          prev.map((u) =>
            u.fileId === fileId ? { ...u, progress: 100, status: "completed" } : u
          )
        );
        setCompletedFiles((prev) => [...prev, uploadedFile]);
        onUploadComplete?.(uploadedFile);

        return uploadedFile;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploads((prev) =>
          prev.map((u) =>
            u.fileId === fileId
              ? { ...u, status: "error", error: errorMessage }
              : u
          )
        );
        onUploadError?.(errorMessage, file.name);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile, onUploadComplete, onUploadError]
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]): Promise<UploadedFile[]> => {
      const fileArray = Array.from(files);
      const results = await Promise.all(fileArray.map(uploadFile));
      return results.filter((f): f is UploadedFile => f !== null);
    },
    [uploadFile]
  );

  const removeUpload = useCallback((fileId: string) => {
    setUploads((prev) => prev.filter((u) => u.fileId !== fileId));
    setCompletedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);
    setCompletedFiles([]);
  }, []);

  return {
    uploads,
    completedFiles,
    isUploading,
    uploadFile,
    uploadFiles,
    removeUpload,
    clearUploads,
    validateFile,
  };
}
