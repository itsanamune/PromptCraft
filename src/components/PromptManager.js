
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { PlusCircle, Save, Edit, Trash, ArrowLeftRight } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

let fileHandle = null;

async function saveDataToFile(data) {
  try {
    if (!fileHandle) {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: 'promptcraft-data.json',
        types: [{
          description: 'JSON File',
          accept: { 'application/json': ['.json'] },
        }],
      });
    }
    
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data));
    await writable.close();
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

async function loadDataFromFile() {
  try {
    [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'JSON File',
        accept: { 'application/json': ['.json'] },
      }],
    });
    
    const file = await fileHandle.getFile();
    const contents = await file.text();
    return JSON.parse(contents);
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
}

const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

const PromptManager = () => {
    
    const [prompts, setPrompts] = useState(() => loadFromLocalStorage('prompts') || []);
    const [modules, setModules] = useState(() => loadFromLocalStorage('modules') || []);
    const [promptCategories, setPromptCategories] = useState(() => loadFromLocalStorage('promptCategories') || ['General', 'SEO', 'Marketing']);
    const [moduleCategories, setModuleCategories] = useState(() => loadFromLocalStorage('moduleCategories') || ['General', 'Introduction', 'Conclusion']);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '', category: '', modules: [] });
  const [newModule, setNewModule] = useState({ name: '', content: '', category: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [moduleDialogMode, setModuleDialogMode] = useState('create');
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("create-prompt");

  const promptContentRef = useRef(null);

  useEffect(() => {
    saveToLocalStorage('prompts', prompts);
  }, [prompts]);
  
  useEffect(() => {
    saveToLocalStorage('modules', modules);
  }, [modules]);
  
  useEffect(() => {
    saveToLocalStorage('promptCategories', promptCategories);
  }, [promptCategories]);
  
  useEffect(() => {
    saveToLocalStorage('moduleCategories', moduleCategories);
  }, [moduleCategories]);

  const handleCreatePrompt = () => {
    if (newPrompt.name && newPrompt.content && newPrompt.category) {
      if (editMode) {
        setPrompts(prompts.map(p => p.id === newPrompt.id ? newPrompt : p));
        setEditMode(false);
      } else {
        setPrompts([...prompts, { ...newPrompt, id: Date.now() }]);
      }
      setNewPrompt({ name: '', content: '', category: '', modules: [] });
    }
  };

  const handleLoadPrompt = (promptId) => {
    const promptToLoad = prompts.find(p => p.id === promptId);
    if (promptToLoad) {
      setNewPrompt({ ...promptToLoad });
      setEditMode(true);
      setActiveTab("create-prompt");
    }
  };

  const handleDeletePrompt = (promptId) => {
    setPrompts(prompts.filter(p => p.id !== promptId));
  };

  const handleCreateModule = () => {
    if (newModule.name && newModule.content && newModule.category) {
      if (moduleDialogMode === 'edit') {
        setModules(modules.map(m => m.id === selectedModuleId ? { ...newModule, id: selectedModuleId } : m));
      } else {
        setModules([...modules, { ...newModule, id: Date.now() }]);
      }
      setNewModule({ name: '', content: '', category: '' });
      setShowModuleDialog(false);
    }
  };

  const handleAddModule = () => {
    setModuleDialogMode('select');
    setShowModuleDialog(true);
  };

  const handleEditModule = (moduleId) => {
    const moduleToEdit = modules.find(m => m.id === moduleId);
    if (moduleToEdit) {
      setNewModule({ ...moduleToEdit });
      setSelectedModuleId(moduleId);
      setModuleDialogMode('edit');
      setShowModuleDialog(true);
    }
  };

  const handleDeleteModule = (moduleId) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const handleCreateNewModule = () => {
    setNewModule({ name: '', content: '', category: '' });
    setModuleDialogMode('create');
    setShowModuleDialog(true);
  };

  const handleSelectModule = (moduleId) => {
    const selectedModule = modules.find(m => m.id === moduleId);
    if (selectedModule) {
      const updatedContent = newPrompt.content + `\n[MODULE: ${selectedModule.name}]`;
      setNewPrompt({
        ...newPrompt,
        content: updatedContent,
        modules: [...newPrompt.modules, moduleId]
      });
      setShowModuleDialog(false);
    }
  };
  const handleSaveDataToFile = async () => {
    const dataToSave = {
      prompts,
      modules,
      promptCategories,
      moduleCategories
    };
    await saveDataToFile(dataToSave);
  };
  
  const handleLoadDataFromFile = async () => {
    const loadedData = await loadDataFromFile();
    if (loadedData) {
      setPrompts(loadedData.prompts || []);
      setModules(loadedData.modules || []);
      setPromptCategories(loadedData.promptCategories || ['General', 'SEO', 'Marketing']);
      setModuleCategories(loadedData.moduleCategories || ['General', 'Introduction', 'Conclusion']);
    }
  };

  const handleAddCategory = (type) => {
    if (newCategory) {
      if (type === 'prompt') {
        setPromptCategories([...promptCategories, newCategory]);
        setNewPrompt({...newPrompt, category: newCategory});
      } else if (type === 'module') {
        setModuleCategories([...moduleCategories, newCategory]);
        setNewModule({...newModule, category: newCategory});
      }
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create-prompt">Create Prompt</TabsTrigger>
          <TabsTrigger value="manage-modules">Manage Modules</TabsTrigger>
          <TabsTrigger value="prompt-manager">Prompt Manager</TabsTrigger>
        </TabsList>
  
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={handleSaveDataToFile}>Save to File</Button>
          <Button onClick={handleLoadDataFromFile}>Load from File</Button>
        </div>
  
        <TabsContent value="create-prompt" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-name">Prompt Name</Label>
            <Input
              id="prompt-name"
              value={newPrompt.name}
              onChange={(e) => setNewPrompt({...newPrompt, name: e.target.value})}
              placeholder="Enter prompt name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt-content">Prompt Content</Label>
            <div className="relative">
              <Textarea
                ref={promptContentRef}
                id="prompt-content"
                value={newPrompt.content}
                onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
                placeholder="Write your prompt here"
                rows={10}
              />
              <Button 
                className="absolute bottom-2 right-2" 
                size="sm" 
                onClick={handleAddModule}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt-category">Category</Label>
            <Select
              value={newPrompt.category}
              onValueChange={(value) => {
                if (value === 'new') {
                  setShowNewCategoryInput(true);
                } else {
                  setNewPrompt({...newPrompt, category: value});
                  setShowNewCategoryInput(false);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {promptCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
                <SelectItem value="new">+ Add New Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showNewCategoryInput && (
            <div className="space-y-2">
              <Label htmlFor="new-category">New Category</Label>
              <div className="flex space-x-2">
                <Input
                  id="new-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                />
                <Button onClick={() => handleAddCategory('prompt')}>Add</Button>
              </div>
            </div>
          )}
          <Button onClick={handleCreatePrompt} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {editMode ? 'Update Prompt' : 'Save Prompt'}
          </Button>
        </TabsContent>
  
        <TabsContent value="manage-modules" className="space-y-4">
          <Button onClick={handleCreateNewModule} className="mb-4">Create New Module</Button>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="p-4 border rounded flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{module.name}</h4>
                  <p className="text-sm text-gray-600">{module.category}</p>
                  <p className="mt-2">{module.content}</p>
                </div>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditModule(module.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteModule(module.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
  
        <TabsContent value="prompt-manager" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Saved Prompts</h2>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {promptCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {prompts
            .filter(prompt => selectedCategory === 'All' || prompt.category === selectedCategory)
            .map((prompt) => (
              <div key={prompt.id} className="p-4 border rounded space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{prompt.name}</h3>
                    <p className="text-sm text-gray-600">Category: {prompt.category}</p>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleLoadPrompt(prompt.id)}>
                      <ArrowLeftRight className="w-4 h-4 mr-2" />
                      Load
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeletePrompt(prompt.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p>{prompt.content}</p>
              </div>
            ))}
        </TabsContent>
      </Tabs>
  
      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {moduleDialogMode === 'select' ? 'Add Module' :
               moduleDialogMode === 'edit' ? 'Edit Module' : 'Create New Module'}
            </DialogTitle>
          </DialogHeader>
          {moduleDialogMode === 'select' ? (
            <div className="space-y-4">
              <Button onClick={handleCreateNewModule} className="w-full">Create New Module</Button>
              <div className="space-y-2">
                <Label>Select an existing module:</Label>
                {modules.map((module) => (
                  <Button 
                    key={module.id} 
                    onClick={() => handleSelectModule(module.id)}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    {module.name}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="module-name">Module Name</Label>
                <Input
                  id="module-name"
                  value={newModule.name}
                  onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                  placeholder="Enter module name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-content">Module Content</Label>
                <Textarea
                  id="module-content"
                  value={newModule.content}
                  onChange={(e) => setNewModule({...newModule, content: e.target.value})}
                  placeholder="Write your module content here"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-category">Module Category</Label>
                <Select
                  value={newModule.category}
                  onValueChange={(value) => {
                    if (value === 'new') {
                      setShowNewCategoryInput(true);
                    } else {
                      setNewModule({...newModule, category: value});
                      setShowNewCategoryInput(false);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {moduleCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                    <SelectItem value="new">+ Add New Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showNewCategoryInput && (
                <div className="space-y-2">
                  <Label htmlFor="new-module-category">New Category</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="new-module-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category name"
                    />
                    <Button onClick={() => handleAddCategory('module')}>Add</Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {moduleDialogMode !== 'select' && (
              <Button onClick={handleCreateModule}>
                {moduleDialogMode === 'edit' ? 'Save Changes' : 'Create Module'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PromptManager;