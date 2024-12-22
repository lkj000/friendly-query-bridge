export const useToast = () => {
  const toast = (options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => {
    // For now, just console.log the toast message
    console.log(`Toast: ${options.title}${options.description ? ` - ${options.description}` : ''}`);
  };

  return { toast };
};