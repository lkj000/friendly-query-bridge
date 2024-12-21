import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Settings, Plus, Trash2 } from "lucide-react";

interface ApiIntegration {
  id: string;
  name: string;
  url: string;
  type: string;
  isActive: boolean;
}

export function ApiIntegrationsView() {
  const { toast } = useToast();
  const [newIntegration, setNewIntegration] = React.useState({
    name: '',
    url: '',
    type: 'custom'
  });

  const { data: integrations, isLoading, refetch } = useQuery({
    queryKey: ['api-integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching integrations",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as ApiIntegration[];
    }
  });

  const handleAddIntegration = async () => {
    try {
      const { error } = await supabase
        .from('api_integrations')
        .insert([{
          name: newIntegration.name,
          url: newIntegration.url,
          type: newIntegration.type,
          isActive: true
        }]);

      if (error) throw error;

      toast({
        title: "Integration Added",
        description: `Successfully added ${newIntegration.name} integration.`,
      });

      setNewIntegration({ name: '', url: '', type: 'custom' });
      refetch();
    } catch (error) {
      console.error('Error adding integration:', error);
      toast({
        title: "Error Adding Integration",
        description: "Failed to add integration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Integration Deleted",
        description: "Successfully removed the integration.",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting integration:', error);
      toast({
        title: "Error Deleting Integration",
        description: "Failed to delete integration. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading integrations...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">API Integrations</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configure
        </Button>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Add New Integration</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Integration Name"
              value={newIntegration.name}
              onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="API Endpoint URL"
              value={newIntegration.url}
              onChange={(e) => setNewIntegration(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>
          <Button
            onClick={handleAddIntegration}
            disabled={!newIntegration.name || !newIntegration.url}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {integrations?.map((integration) => (
          <Card key={integration.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{integration.name}</h4>
                <p className="text-sm text-muted-foreground">{integration.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteIntegration(integration.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}