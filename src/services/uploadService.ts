import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const uploadService = {
  async uploadFile(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }
};