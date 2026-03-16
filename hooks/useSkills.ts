"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { toast } from "sonner";
import type { Skill } from "@/types/profiles";

export function useSkills(profileId: string | undefined) {
  return useQuery({
    queryKey: ["skills", profileId],
    queryFn: async (): Promise<Skill[]> => {
      const response = await apiClient.get<{ data: Skill[] }>(
        `/api/v1/skills`,
        { params: { profile_id: profileId } }
      );
      return response.data.data;
    },
    enabled: !!profileId,
  });
}

export function useUpdateSkills() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      profileId,
      skills,
    }: {
      profileId: string;
      skills: Skill[];
    }) => {
      const response = await apiClient.put(`/api/v1/skills`, {
        profile_id: profileId,
        skills,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["skills", variables.profileId],
      });
      toast.success("Skills updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
