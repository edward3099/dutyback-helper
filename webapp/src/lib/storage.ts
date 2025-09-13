import { supabase } from './supabase';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  path: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class StorageService {
  private static readonly BUCKET_NAME = 'evidence';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  static validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(this.MAX_FILE_SIZE / 1024 / 1024)}MB`
      };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `File type not supported. Accepted types: ${this.ALLOWED_TYPES.join(', ')}`
      };
    }

    return { valid: true };
  }

  static async uploadFile(
    file: File,
    claimId: string,
    evidenceType: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ data: UploadedFile | null; error: string | null }> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { data: null, error: validation.error };
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${claimId}/${evidenceType}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { data: null, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      const uploadedFile: UploadedFile = {
        id: `${claimId}-${evidenceType}-${fileName}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString(),
        path: filePath
      };

      return { data: uploadedFile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Upload failed' };
    }
  }

  static async uploadMultipleFiles(
    files: File[],
    claimId: string,
    evidenceType: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<{ data: UploadedFile[]; errors: string[] }> {
    const results: UploadedFile[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await this.uploadFile(file, claimId, evidenceType, (progress) => {
          onProgress?.(i, progress);
        });

        if (result.data) {
          results.push(result.data);
        } else {
          errors.push(`${file.name}: ${result.error}`);
        }
      } catch (error: any) {
        errors.push(`${file.name}: ${error.message}`);
      }
    }

    return { data: results, errors };
  }

  static async deleteFile(filePath: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message || 'Delete failed' };
    }
  }

  static async getFileUrl(filePath: string): Promise<{ url: string | null; error: string | null }> {
    try {
      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error: any) {
      return { url: null, error: error.message || 'Failed to get file URL' };
    }
  }

  static async listFiles(claimId: string): Promise<{ data: UploadedFile[]; error: string | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(claimId);

      if (error) {
        return { data: [], error: error.message };
      }

      const files: UploadedFile[] = [];
      
      for (const folder of data || []) {
        if (folder.name && folder.metadata) {
          const { data: folderFiles } = await supabase.storage
            .from(this.BUCKET_NAME)
            .list(`${claimId}/${folder.name}`);

          for (const file of folderFiles || []) {
            if (file.name) {
              const filePath = `${claimId}/${folder.name}/${file.name}`;
              const { url } = await this.getFileUrl(filePath);
              
              if (url) {
                files.push({
                  id: filePath,
                  name: file.name,
                  size: file.metadata?.size || 0,
                  type: file.metadata?.mimetype || 'application/octet-stream',
                  url,
                  uploadedAt: file.created_at || new Date().toISOString(),
                  path: filePath
                });
              }
            }
          }
        }
      }

      return { data: files, error: null };
    } catch (error: any) {
      return { data: [], error: error.message || 'Failed to list files' };
    }
  }
}
