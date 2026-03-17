"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

// ─── Types ───

export interface ApiFile {
  id: string;
  name: string;
  file_type: string; // "pdf" | "docx" | "png" | "jpg" | "md" etc.
  size: number;
  uploaded_at: string;
  job_id?: string;
  job_name?: string;
  profile_id?: string;
  profile_name?: string;
  quality_score?: number;
  variant?: "A" | "B" | "C";
  folder?: string;
}

export interface FileListParams {
  job_id?: string;
  file_type?: string;
}

interface PresignUploadResponse {
  upload_url: string;
  file_id: string;
  fields?: Record<string, string>;
}

interface DownloadResponse {
  download_url: string;
}

// ─── Hooks ───

/**
 * Fetch all files, optionally filtered by job_id and/or file_type.
 */
export function useFiles(params?: FileListParams) {
  return useQuery({
    queryKey: queryKeys.files.list(
      params ? JSON.stringify(params) : undefined
    ),
    queryFn: async (): Promise<ApiFile[]> => {
      const response = await apiClient.get<{ data: ApiFile[] }>(
        "/api/v1/files",
        { params }
      );
      return response.data.data;
    },
  });
}

/**
 * Delete a file by ID.
 */
export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      await apiClient.delete(`/api/v1/files/${fileId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      toast.success("File deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Get a presigned download URL and trigger the download.
 */
export function useDownloadFile() {
  return useMutation({
    mutationFn: async (fileId: string): Promise<string> => {
      const response = await apiClient.get<DownloadResponse>(
        `/api/v1/files/${fileId}/download`
      );
      return response.data.download_url;
    },
    onSuccess: (downloadUrl) => {
      // Open the presigned URL to trigger download
      window.open(downloadUrl, "_blank");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Two-step presigned upload: get URL, upload, then confirm.
 */
export function usePresignedUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      jobId,
      fileType,
    }: {
      file: File;
      jobId?: string;
      fileType?: string;
    }) => {
      // Step 1: Get presigned URL
      const presign = await apiClient.post<PresignUploadResponse>(
        "/api/v1/files/presign-upload",
        {
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          job_id: jobId,
          file_type: fileType,
        }
      );

      const { upload_url, file_id, fields } = presign.data;

      // Step 2: Upload to presigned URL
      if (fields) {
        // S3-style form upload
        const formData = new FormData();
        Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
        formData.append("file", file);
        await fetch(upload_url, { method: "POST", body: formData });
      } else {
        // Simple PUT
        await fetch(upload_url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
      }

      // Step 3: Confirm upload
      await apiClient.post("/api/v1/files/confirm-upload", { file_id });

      return file_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
