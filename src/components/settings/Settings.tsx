import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import '../../styles/modern-forms.css';
import '../../styles/modern-tables.css';
import '../../styles/modern-settings.css';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Palette, 
  Layout, 
  Server, 
  Shield,
  Database,
  Zap,
  Monitor,
  Mail,
  Bell,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Save,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  X
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { settingsAPI, API_CONFIG } from '@/utils/api';
import usePageTitle from '@/hooks/usePageTitle';

interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  file_path?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const Settings: React.FC = () => {
  // Set page title
  usePageTitle();

  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    setting_key: '',
    setting_value: '',
    setting_type: 'text',
    description: ''
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { toast } = useToast();

  const settingCategories = [
    { id: 'all', label: 'All Settings', icon: <SettingsIcon className="h-4 w-4" />, count: 0 },
    { id: 'website', label: 'Website', icon: <Globe className="h-4 w-4" />, count: 0 },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" />, count: 0 },
    { id: 'sidebar', label: 'Layout', icon: <Layout className="h-4 w-4" />, count: 0 },
    { id: 'system', label: 'System', icon: <Server className="h-4 w-4" />, count: 0 },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" />, count: 0 },
    { id: 'database', label: 'Database', icon: <Database className="h-4 w-4" />, count: 0 },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, count: 0 }
  ];

  const settingTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'color', label: 'Color' },
    { value: 'url', label: 'URL' },
    { value: 'email', label: 'Email' },
    { value: 'json', label: 'JSON' },
    { value: 'file', label: 'File' }
  ];

  const getSettingIcon = (key: string) => {
    if (key.includes('website') || key.includes('company')) return <Globe className="h-4 w-4" />;
    if (key.includes('theme') || key.includes('color')) return <Palette className="h-4 w-4" />;
    if (key.includes('sidebar') || key.includes('layout')) return <Layout className="h-4 w-4" />;
    if (key.includes('backup') || key.includes('version')) return <Server className="h-4 w-4" />;
    if (key.includes('security') || key.includes('auth')) return <Shield className="h-4 w-4" />;
    if (key.includes('database') || key.includes('db')) return <Database className="h-4 w-4" />;
    if (key.includes('notification') || key.includes('mail')) return <Bell className="h-4 w-4" />;
    return <SettingsIcon className="h-4 w-4" />;
  };

  const getSettingStatus = (setting: Setting) => {
    if (!setting.setting_value) return { status: 'empty', color: 'gray', label: 'Not Set' };
    if (setting.setting_key.includes('backup') && new Date(setting.updated_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return { status: 'warning', color: 'orange', label: 'Outdated' };
    }
    return { status: 'active', color: 'green', label: 'Active' };
  };

  // CRUD Operations
  const loadSettings = async () => {
    setLoading(true);
    try {
      console.log('🔗 Loading settings using unified API...');
      console.log('🌐 API Config:', API_CONFIG);
      
      const data = await settingsAPI.getAll();
      console.log('✅ Settings loaded:', data);
      
      setSettings(data);
      
      toast({
        title: "Settings Loaded",
        description: `Successfully loaded ${data.length} settings`,
      });
      
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      toast({
        title: "Error",
        description: `Failed to load settings: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSetting = async () => {
    if (!formData.setting_key.trim()) {
      toast({
        title: "Validation Error",
        description: "Setting key is required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // If it's a file type and we have a selected file, upload it
      if (formData.setting_type === 'file' && selectedFile) {
        setUploading(true);
        const uploadResult = await settingsAPI.uploadFile(
          selectedFile,
          formData.setting_key.trim(),
          formData.description.trim()
        );
        
        toast({
          title: "Setting Created",
          description: `File uploaded and setting created: ${formData.setting_key}`,
        });
      } else {
        // Regular setting creation
        await settingsAPI.create(
          formData.setting_key.trim(),
          formData.setting_value.trim(),
          formData.setting_type,
          formData.description.trim()
        );

        toast({
          title: "Setting Created",
          description: `Successfully created setting: ${formData.setting_key}`,
        });
      }

      setIsCreateDialogOpen(false);
      resetForm();
      await loadSettings();
    } catch (error) {
      console.error('❌ Error creating setting:', error);
      toast({
        title: "Error",
        description: `Failed to create setting: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const updateSetting = async () => {
    if (!selectedSetting || !formData.setting_key.trim()) {
      return;
    }

    setSaving(true);
    try {
      // If it's a file type and we have a new file, upload it
      if (formData.setting_type === 'file' && selectedFile) {
        setUploading(true);
        const uploadResult = await settingsAPI.uploadFile(
          selectedFile,
          selectedSetting.setting_key,
          formData.description.trim()
        );
        
        toast({
          title: "Setting Updated",
          description: `File uploaded and setting updated: ${selectedSetting.setting_key}`,
        });
      } else {
        // Regular setting update
        await settingsAPI.update(
          selectedSetting.setting_key,
          formData.setting_value.trim(),
          formData.setting_type,
          formData.description.trim()
        );

        toast({
          title: "Setting Updated",
          description: `Successfully updated setting: ${selectedSetting.setting_key}`,
        });
      }

      setIsEditDialogOpen(false);
      setSelectedSetting(null);
      resetForm();
      await loadSettings();
    } catch (error) {
      console.error('❌ Error updating setting:', error);
      toast({
        title: "Error",
        description: `Failed to update setting: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const deleteSetting = async (setting: Setting) => {
    try {
      await settingsAPI.delete(setting.setting_key);

      toast({
        title: "Setting Deleted",
        description: `Successfully deleted setting: ${setting.setting_key}`,
      });

      await loadSettings();
    } catch (error) {
      console.error('❌ Error deleting setting:', error);
      toast({
        title: "Error",
        description: `Failed to delete setting: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const exportSettings = async () => {
    setExporting(true);
    try {
      const exportData = await settingsAPI.export();
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${exportData.settingsCount} settings`,
      });
    } catch (error) {
      console.error('❌ Error exporting settings:', error);
      toast({
        title: "Export Failed",
        description: `Failed to export settings: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        setImporting(true);
        const result = await settingsAPI.import(importData);
        
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.successful} settings`,
        });

        setIsImportDialogOpen(false);
        await loadSettings();
      } catch (error) {
        console.error('❌ Error importing settings:', error);
        toast({
          title: "Import Failed",
          description: `Failed to import settings: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setImporting(false);
      }
    };
    
    reader.readAsText(file);
  };

  // Helper functions
  const resetForm = () => {
    setFormData({
      setting_key: '',
      setting_value: '',
      setting_type: 'text',
      description: ''
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
      
      // Auto-set the setting value to the filename
      setFormData(prev => ({
        ...prev,
        setting_value: file.name
      }));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData(prev => ({
      ...prev,
      setting_value: ''
    }));
  };

  const getFileDisplayValue = (setting: Setting) => {
    if (setting.setting_type === 'file' && setting.file_path) {
      const filename = setting.file_path.split(/[/\\]/).pop() || setting.setting_value;
      return filename;
    }
    return setting.setting_value || '(empty)';
  };

  const getFileUrl = (setting: Setting) => {
    if (setting.setting_type === 'file' && setting.file_path) {
      const filename = setting.file_path.split(/[/\\]/).pop();
      return settingsAPI.getFileUrl(filename || '');
    }
    return null;
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (setting: Setting) => {
    setSelectedSetting(setting);
    setFormData({
      setting_key: setting.setting_key,
      setting_value: setting.setting_value || '',
      setting_type: setting.setting_type || 'text',
      description: setting.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (setting: Setting) => {
    setSelectedSetting(setting);
    setIsViewDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const formatValue = (setting: Setting) => {
    if (setting.setting_type === 'file' && setting.file_path) {
      return `${setting.setting_value} (${setting.file_path})`;
    }
    return setting.setting_value || '(empty)';
  };

  const getCategorySettings = (category: string) => {
    if (category === 'all') return settings;
    
    const categoryMap: { [key: string]: string[] } = {
      website: ['website_title', 'website_favicon', 'company_name', 'company_logo'],
      appearance: ['theme_mode', 'primary_color', 'accent_color', 'border_radius', 'font_family'],
      sidebar: ['sidebar_title', 'sidebar_logo', 'sidebar_width', 'sidebar_position'],
      system: ['app_version', 'backup_frequency', 'last_backup_date', 'system_timezone'],
      security: ['session_timeout', 'password_policy', 'two_factor_auth', 'login_attempts'],
      database: ['db_host', 'db_port', 'db_name', 'connection_pool'],
      notifications: ['email_notifications', 'push_notifications', 'sms_notifications']
    };
    
    return settings.filter(s => 
      categoryMap[category]?.some(key => s.setting_key.includes(key)) ||
      s.setting_key.toLowerCase().includes(category)
    );
  };

  const filteredSettings = getCategorySettings(selectedCategory).filter(setting =>
    setting.setting_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modern-container">
      {/* Header Section */}
      <div className="modern-page-header">
        <div className="modern-page-header-content">
          <div className="modern-page-title-section">
            <div className="modern-page-icon">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="modern-page-title">System Settings</h1>
              <p className="modern-page-subtitle">
                Configure and manage your application settings
              </p>
            </div>
          </div>
          
          <div className="modern-page-actions">
            <Button 
              className="modern-btn modern-btn-secondary" 
              onClick={() => setIsImportDialogOpen(true)}
              disabled={importing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import Settings'}
            </Button>
            <Button 
              className="modern-btn modern-btn-secondary" 
              onClick={exportSettings}
              disabled={exporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export Settings'}
            </Button>
            <Button className="global-btn" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Setting
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="modern-stats-grid">
        <div className="modern-stat-card">
          <div className="modern-stat-icon modern-stat-icon-blue">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div className="modern-stat-content">
            <div className="modern-stat-value">{settings.length}</div>
            <div className="modern-stat-label">Total Settings</div>
          </div>
        </div>
        
        <div className="modern-stat-card">
          <div className="modern-stat-icon modern-stat-icon-green">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="modern-stat-content">
            <div className="modern-stat-value">
              {settings.filter(s => s.setting_value).length}
            </div>
            <div className="modern-stat-label">Configured</div>
          </div>
        </div>
        
        <div className="modern-stat-card">
          <div className="modern-stat-icon modern-stat-icon-orange">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="modern-stat-content">
            <div className="modern-stat-value">
              {settings.filter(s => !s.setting_value).length}
            </div>
            <div className="modern-stat-label">Pending</div>
          </div>
        </div>
        
        <div className="modern-stat-card">
          <div className="modern-stat-icon modern-stat-icon-purple">
            <Activity className="h-5 w-5" />
          </div>
          <div className="modern-stat-content">
            <div className="modern-stat-value">
              {new Date().toLocaleDateString()}
            </div>
            <div className="modern-stat-label">Last Updated</div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="modern-controls-section">
        <div className="modern-search-container">
          <div className="modern-search-wrapper">
            <Search className="modern-search-icon" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-search-input"
            />
          </div>
          <Button className="modern-btn modern-btn-outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="modern-btn modern-btn-outline" onClick={loadSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="modern-tabs-container">
          {settingCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`modern-tab ${selectedCategory === category.id ? 'modern-tab-active' : ''}`}
            >
              {category.icon}
              <span>{category.label}</span>
              <Badge className="modern-badge modern-badge-secondary">
                {getCategorySettings(category.id).length}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="modern-loading-container">
          <div className="modern-loading-spinner"></div>
          <p className="modern-loading-text">Loading settings...</p>
        </div>
      ) : (
        <div className="modern-content-grid">
          {filteredSettings.length === 0 ? (
            <div className="modern-empty-state">
              <div className="modern-empty-icon">
                <SettingsIcon className="h-12 w-12" />
              </div>
              <h3 className="modern-empty-title">No Settings Found</h3>
              <p className="modern-empty-description">
                {searchTerm ? 
                  `No settings match "${searchTerm}"` : 
                  `No settings available in ${selectedCategory} category`
                }
              </p>
            </div>
          ) : (
            <div className="modern-settings-grid">
              {filteredSettings.map(setting => {
                const status = getSettingStatus(setting);
                return (
                  <div key={setting.id} className="modern-setting-card">
                    <div className="modern-setting-header">
                      <div className="modern-setting-info">
                        <div className="modern-setting-icon">
                          {getSettingIcon(setting.setting_key)}
                        </div>
                        <div>
                          <h3 className="modern-setting-title">
                            {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <p className="modern-setting-description">
                            {setting.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="modern-setting-status">
                        <Badge className={`modern-badge modern-badge-${status.color}`}>
                          {status.label}
                        </Badge>
                        <Button className="modern-btn modern-btn-ghost modern-btn-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="modern-setting-content">
                      <div className="modern-setting-value">
                        <label className="modern-setting-label">Current Value:</label>
                        <div className="modern-setting-display">
                          {setting.setting_type === 'file' && setting.file_path ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">{getFileDisplayValue(setting)}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const fileUrl = getFileUrl(setting);
                                    if (fileUrl) window.open(fileUrl, '_blank');
                                  }}
                                  title="Open file"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                              {/* Show preview for images */}
                              {setting.file_path && setting.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                <div className="mt-2">
                                  <img 
                                    src={getFileUrl(setting) || ''} 
                                    alt={setting.setting_key}
                                    className="max-w-24 max-h-24 object-contain rounded border bg-white"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ) : setting.setting_key.includes('color') && setting.setting_value ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: setting.setting_value }}
                              />
                              <span>{setting.setting_value}</span>
                            </div>
                          ) : (
                            <span className={!setting.setting_value ? 'text-gray-400 italic' : ''}>
                              {formatValue(setting)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="modern-setting-meta">
                        <div className="modern-setting-meta-item">
                          <Clock className="h-3 w-3" />
                          <span>Updated: {new Date(setting.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div className="modern-setting-meta-item">
                          <FileText className="h-3 w-3" />
                          <span>Type: {setting.setting_type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="modern-setting-actions">
                      <Button 
                        className="modern-btn modern-btn-ghost modern-btn-sm"
                        onClick={() => openViewDialog(setting)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        className="modern-btn modern-btn-outline modern-btn-sm"
                        onClick={() => copyToClipboard(setting.setting_value || '')}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        className="global-btn modern-btn-sm"
                        onClick={() => openEditDialog(setting)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            className="modern-btn modern-btn-danger modern-btn-sm"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Setting</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the setting "{setting.setting_key}"? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteSetting(setting)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Setting Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="editpopup form crm-modal-container sm:max-w-[600px]">
          <DialogHeader className="editpopup form crm-modal-header">
            <DialogTitle className="crm-modal-title flex items-center gap-2">
              <div className="crm-modal-icon">
                <Plus className="h-4 w-4" />
              </div>
              Create New Setting
            </DialogTitle>
            <DialogDescription>
              Add a new configuration setting to your system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="editpopup form crm-modal-content space-y-4">
            <div className="editpopup form crm-form-group">
              <Label htmlFor="setting_key" className="editpopup form crm-form-label">
                Setting Key*
              </Label>
              <Input
                id="setting_key"
                placeholder="e.g., app_title, theme_color, max_users"
                value={formData.setting_key}
                onChange={(e) => setFormData({...formData, setting_key: e.target.value})}
                className="editpopup form crm-form-input"
              />
            </div>

            <div className="editpopup form crm-form-group">
              <Label htmlFor="setting_type" className="editpopup form crm-form-label">
                Setting Type
              </Label>
              <Select 
                value={formData.setting_type} 
                onValueChange={(value) => setFormData({...formData, setting_type: value})}
              >
                <SelectTrigger className="editpopup form crm-form-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="editpopup form crm-form-group">
              <Label htmlFor="setting_value" className="editpopup form crm-form-label">
                {formData.setting_type === 'file' ? 'Upload File' : 'Setting Value'}
              </Label>
              {formData.setting_type === 'boolean' ? (
                <Select 
                  value={formData.setting_value} 
                  onValueChange={(value) => setFormData({...formData, setting_value: value})}
                >
                  <SelectTrigger className="editpopup form crm-form-select">
                    <SelectValue placeholder="Select true/false" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              ) : formData.setting_type === 'color' ? (
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.setting_value}
                    onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    placeholder="#000000"
                    value={formData.setting_value}
                    onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                    className="editpopup form crm-form-input flex-1"
                  />
                </div>
              ) : formData.setting_type === 'file' ? (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    {selectedFile || previewUrl ? (
                      <div className="space-y-3">
                        {previewUrl && (
                          <div className="flex justify-center">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="max-w-32 max-h-32 object-contain rounded border"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">
                            {selectedFile?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('create-file-input')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Change File
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeSelectedFile}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Choose file to upload
                          </p>
                          <p className="text-xs text-gray-500">
                            Images, PDFs, and text files (max 5MB)
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('create-file-input')?.click()}
                        >
                          Select File
                        </Button>
                      </div>
                    )}
                    <Input
                      id="create-file-input"
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.txt,.json,.css,.js"
                    />
                  </div>
                  {selectedFile && (
                    <Input
                      placeholder="File description (auto-filled)"
                      value={formData.setting_value}
                      onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                      className="editpopup form crm-form-input"
                      readOnly
                    />
                  )}
                </div>
              ) : (
                <Input
                  id="setting_value"
                  type={formData.setting_type === 'number' ? 'number' : 'text'}
                  placeholder="Enter setting value"
                  value={formData.setting_value}
                  onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                  className="editpopup form crm-form-input"
                />
              )}
            </div>

            <div className="editpopup form crm-form-group">
              <Label htmlFor="description" className="editpopup form crm-form-label">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this setting controls"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="editpopup form crm-form-textarea"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="editpopup form crm-modal-footer">
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              className="editpopup form crm-btn-secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={createSetting}
              disabled={saving || uploading}
              className="editpopup form crm-btn-primary"
            >
              {saving || uploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {uploading ? 'Uploading...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Setting
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Setting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="editpopup form crm-modal-container sm:max-w-[600px]">
          <DialogHeader className="editpopup form crm-modal-header">
            <DialogTitle className="crm-modal-title flex items-center gap-2">
              <div className="crm-modal-icon">
                <Edit className="h-4 w-4" />
              </div>
              Edit Setting
            </DialogTitle>
            <DialogDescription>
              Modify the configuration setting: {selectedSetting?.setting_key}
            </DialogDescription>
          </DialogHeader>
          
          <div className="editpopup form crm-modal-content space-y-4">
            <div className="editpopup form crm-form-group">
              <Label className="editpopup form crm-form-label">
                Setting Key
              </Label>
              <Input
                value={formData.setting_key}
                disabled
                className="editpopup form crm-form-input bg-gray-50"
              />
            </div>

            <div className="editpopup form crm-form-group">
              <Label htmlFor="edit_setting_type" className="editpopup form crm-form-label">
                Setting Type
              </Label>
              <Select 
                value={formData.setting_type} 
                onValueChange={(value) => setFormData({...formData, setting_type: value})}
              >
                <SelectTrigger className="editpopup form crm-form-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="editpopup form crm-form-group">
              <Label htmlFor="edit_setting_value" className="editpopup form crm-form-label">
                {formData.setting_type === 'file' ? 'Upload New File' : 'Setting Value'}
              </Label>
              {formData.setting_type === 'boolean' ? (
                <Select 
                  value={formData.setting_value} 
                  onValueChange={(value) => setFormData({...formData, setting_value: value})}
                >
                  <SelectTrigger className="editpopup form crm-form-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              ) : formData.setting_type === 'color' ? (
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.setting_value}
                    onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    placeholder="#000000"
                    value={formData.setting_value}
                    onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                    className="editpopup form crm-form-input flex-1"
                  />
                </div>
              ) : formData.setting_type === 'file' ? (
                <div className="space-y-3">
                  {/* Show current file if exists */}
                  {selectedSetting && selectedSetting.setting_type === 'file' && selectedSetting.file_path && !selectedFile && (
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-sm font-medium text-gray-900 mb-1">Current File:</p>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{getFileDisplayValue(selectedSetting)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const fileUrl = getFileUrl(selectedSetting);
                            if (fileUrl) window.open(fileUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* File upload area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    {selectedFile || previewUrl ? (
                      <div className="space-y-3">
                        {previewUrl && (
                          <div className="flex justify-center">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="max-w-32 max-h-32 object-contain rounded border"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">
                            {selectedFile?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('edit-file-input')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Change File
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeSelectedFile}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedSetting && selectedSetting.file_path ? 'Replace current file' : 'Choose file to upload'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Images, PDFs, and text files (max 5MB)
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('edit-file-input')?.click()}
                        >
                          Select File
                        </Button>
                      </div>
                    )}
                    <Input
                      id="edit-file-input"
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.txt,.json,.css,.js"
                    />
                  </div>
                  {selectedFile && (
                    <Input
                      placeholder="File description (auto-filled)"
                      value={formData.setting_value}
                      onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                      className="editpopup form crm-form-input"
                      readOnly
                    />
                  )}
                </div>
              ) : (
                <Input
                  id="edit_setting_value"
                  type={formData.setting_type === 'number' ? 'number' : 'text'}
                  placeholder="Enter setting value"
                  value={formData.setting_value}
                  onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                  className="editpopup form crm-form-input"
                />
              )}
            </div>

            <div className="editpopup form crm-form-group">
              <Label htmlFor="edit_description" className="editpopup form crm-form-label">
                Description
              </Label>
              <Textarea
                id="edit_description"
                placeholder="Describe what this setting controls"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="editpopup form crm-form-textarea"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="editpopup form crm-modal-footer">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="editpopup form crm-btn-secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={updateSetting}
              disabled={saving || uploading}
              className="editpopup form crm-btn-primary"
            >
              {saving || uploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {uploading ? 'Uploading...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Setting
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Setting Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="editpopup form crm-modal-container sm:max-w-[600px]">
          <DialogHeader className="editpopup form crm-modal-header">
            <DialogTitle className="crm-modal-title flex items-center gap-2">
              <div className="crm-modal-icon">
                <Eye className="h-4 w-4" />
              </div>
              View Setting Details
            </DialogTitle>
            <DialogDescription>
              {selectedSetting?.setting_key}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSetting && (
            <div className="editpopup form crm-modal-content space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Setting Key</Label>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {selectedSetting.setting_key}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(selectedSetting.setting_key)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Setting Type</Label>
                  <Badge variant="outline">{selectedSetting.setting_type}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Current Value</Label>
                <div className="space-y-2">
                  {selectedSetting.setting_type === 'file' && selectedSetting.file_path ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {getFileDisplayValue(selectedSetting)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(getFileDisplayValue(selectedSetting))}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const fileUrl = getFileUrl(selectedSetting);
                            if (fileUrl) window.open(fileUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      {/* Show image preview */}
                      {selectedSetting.file_path && selectedSetting.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                        <div className="flex justify-center">
                          <img 
                            src={getFileUrl(selectedSetting) || ''} 
                            alt={selectedSetting.setting_key}
                            className="max-w-48 max-h-48 object-contain rounded border bg-white"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>File Path: <code className="bg-gray-100 px-1 rounded">{selectedSetting.file_path}</code></p>
                        {getFileUrl(selectedSetting) && (
                          <p>URL: <code className="bg-gray-100 px-1 rounded">{getFileUrl(selectedSetting)}</code></p>
                        )}
                      </div>
                    </div>
                  ) : selectedSetting.setting_key.includes('color') && selectedSetting.setting_value ? (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: selectedSetting.setting_value }}
                      />
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {selectedSetting.setting_value}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedSetting.setting_value)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : selectedSetting.setting_value ? (
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {selectedSetting.setting_value}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedSetting.setting_value)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No value set</span>
                  )}
                </div>
              </div>

              {selectedSetting.description && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedSetting.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedSetting.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedSetting.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="editpopup form crm-modal-footer">
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
              className="editpopup form crm-btn-secondary"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsViewDialogOpen(false);
                selectedSetting && openEditDialog(selectedSetting);
              }}
              className="editpopup form crm-btn-primary"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Setting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Settings Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="editpopup form crm-modal-container sm:max-w-[500px]">
          <DialogHeader className="editpopup form crm-modal-header">
            <DialogTitle className="crm-modal-title flex items-center gap-2">
              <div className="crm-modal-icon">
                <Upload className="h-4 w-4" />
              </div>
              Import Settings
            </DialogTitle>
            <DialogDescription>
              Upload a JSON file to import settings into your system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="editpopup form crm-modal-content">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  Choose settings file to upload
                </p>
                <p className="text-xs text-gray-500">
                  JSON files only, max 5MB
                </p>
              </div>
              <Input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="mt-4"
                disabled={importing}
              />
            </div>
          </div>
          
          <DialogFooter className="editpopup form crm-modal-footer">
            <Button 
              variant="outline" 
              onClick={() => setIsImportDialogOpen(false)}
              className="editpopup form crm-btn-secondary"
              disabled={importing}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
