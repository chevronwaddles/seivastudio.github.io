import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Calculator, Clock, CheckSquare, Building, Euro, Save, FileDown, Plus, Trash2 } from 'lucide-react';

// Types
interface Client {
  name: string;
  company: string;
  address: string;
  nif: string;
  nipc: string;
}

interface ProjectParameters {
  plotArea: number;
  perimeter: number;
  soilClassification: string;
  maxFloors: number;
  maxImpermeabilization: number;
  maxUtilization: number;
  maxOccupation: number;
  numberOfUnits: number;
  maxAreaPerUnit: number;
  totalBuildArea: number;
  roadSetback: number;
  sideSetback: number;
  sideSetbackWithOpenings: number;
}

interface Task {
  id: string;
  description: string;
  hours: number;
  responsible: string;
  completed: boolean;
}

interface RIBAStage {
  number: number;
  name: string;
  tasks: Task[];
  totalHours: number;
  status: 'pending' | 'active' | 'completed';
}

interface Project {
  id: string;
  reference: string;
  name: string;
  client: Client;
  parameters: ProjectParameters;
  stages: RIBAStage[];
  category: 'Cat.I' | 'Cat.II' | 'Cat.III';
  estimatedValue: number;
  createdAt: string;
  updatedAt: string;
}

// Default RIBA stages with tasks
const defaultStages: Omit<RIBAStage, 'totalHours'>[] = [
  {
    number: 0,
    name: "Strategic Definition",
    status: 'pending',
    tasks: [
      { id: '0-1', description: 'Preparação de discriminação dos requisitos do projecto', hours: 0, responsible: 'Dono de Obra (+Eq. de Projectistas)', completed: false },
      { id: '0-2', description: 'Desenvolver Modelo de Negócio e revisão de Riscos', hours: 0, responsible: 'Dono de Obra (+Eq. de Projectistas)', completed: false },
      { id: '0-3', description: 'Rectificação das opções para Requisitos do Cliente', hours: 0, responsible: 'Dono de Obra (+Eq. de Projectistas)', completed: false },
      { id: '0-4', description: 'Revisão de Feedback de projectos precedentes', hours: 0, responsible: 'Dono de Obra (+Eq. de Projectistas)', completed: false },
      { id: '0-5', description: 'Realização de avaliações do local da obra', hours: 0, responsible: 'Dono de Obra (+Eq. de Projectistas)', completed: false },
    ]
  },
  {
    number: 1,
    name: "Preparation and Briefing",
    status: 'pending',
    tasks: [
      { id: '1-1', description: 'Cálculo de Estimativa de Valores de Obra', hours: 20, responsible: 'Eq. de Projectistas', completed: false },
      { id: '1-2', description: 'Definição de âmbito dos Trabalhos', hours: 2, responsible: 'Eq. de Projectistas+Dono de Obra', completed: false },
      { id: '1-3', description: 'Acordo sobre Proposta de Honorários', hours: 1, responsible: 'Eq. de Projectistas+Dono de Obra', completed: false },
      { id: '1-4', description: 'Definição de Stakeholders e Matriz', hours: 1, responsible: 'Eq. de Projectistas', completed: false },
      { id: '1-5', description: 'Definição de Programa de Recursos', hours: 20, responsible: 'Eq. de Projectistas', completed: false },
      { id: '1-6', description: 'Draft de Programa de Projecto', hours: 10, responsible: 'Eq. de Projectistas', completed: false },
      { id: '1-7', description: 'Estratégia de Aquisição de Serviços e Execução', hours: 2, responsible: 'Dono de Obra (+Eq. de Projectistas)', completed: false },
    ]
  },
  {
    number: 2,
    name: "Concept Design",
    status: 'pending',
    tasks: [
      { id: '2-1', description: 'Obter Levantamento Topográfico', hours: 0, responsible: 'Eq. de Projectistas + Especialidades', completed: false },
      { id: '2-2', description: 'Consulta às Especialidades', hours: 2, responsible: 'Eq. de Projectistas+Dono de Obra', completed: false },
      { id: '2-3', description: 'Modelo 1 Escala de Implantação c/ Envolvente', hours: 40, responsible: 'Eq. de Projectistas', completed: false },
      { id: '2-4', description: 'Conceito e Esquematização V.1', hours: 45, responsible: 'Eq. de Projectistas', completed: false },
      { id: '2-5', description: 'Modelo 1 Larga Escala (Apresentação)', hours: 40, responsible: 'Eq. de Projectistas+Dono de Obra', completed: false },
      { id: '2-6', description: 'Incorporação das necessidades das especialidades', hours: 9, responsible: 'Eq. de Projectistas + Especialidades', completed: false },
      { id: '2-7', description: 'Conceito e Esquematização V.2 Final', hours: 45, responsible: 'Eq. de Projectistas', completed: false },
      { id: '2-8', description: 'Estratégia de Projecto', hours: 40, responsible: 'Eq. de Projectistas', completed: false },
      { id: '2-9', description: '4 Plantas', hours: 96, responsible: 'Eq. de Projectistas', completed: false },
    ]
  },
  {
    number: 3,
    name: "Spatial Coordination",
    status: 'pending',
    tasks: [
      { id: '3-1', description: 'Análise das Propostas das Especialidades', hours: 20, responsible: 'Eq. de Projectistas', completed: false },
      { id: '3-2', description: 'Revisão de Programa de Recursos', hours: 2, responsible: 'Eq. de Projectistas + Especialidades', completed: false },
      { id: '3-3', description: 'Revisão de Programa de Projecto', hours: 2, responsible: 'Eq. de Projectistas + Dono de Obra', completed: false },
      { id: '3-4', description: 'Reuniões CM', hours: 1, responsible: 'Eq. de Projectistas + Entidades', completed: false },
      { id: '3-5', description: 'Reuniões c/ Especialidades', hours: 9, responsible: 'Eq. de Projectistas + Especialidades', completed: false },
      { id: '3-6', description: 'Memória Descritiva', hours: 20, responsible: 'Eq. de Projectistas', completed: false },
      { id: '3-7', description: '4 Plantas', hours: 160, responsible: 'Eq. de Projectistas', completed: false },
      { id: '3-8', description: '2 Cortes', hours: 40, responsible: 'Eq. de Projectistas', completed: false },
      { id: '3-9', description: '4 Alçados', hours: 160, responsible: 'Eq. de Projectistas', completed: false },
      { id: '3-10', description: 'Detalhe Construtivo 1:20', hours: 10, responsible: 'Eq. de Projectistas', completed: false },
    ]
  },
  {
    number: 4,
    name: "Technical Design",
    status: 'pending',
    tasks: [
      { id: '4-1', description: 'Desenvolvimento do desenho técnico', hours: 0, responsible: 'Eq. de Projectistas', completed: false },
      { id: '4-2', description: 'Coordenação dos Sistemas Construtivos', hours: 4, responsible: 'Eq. de Projectistas + Especialidades', completed: false },
      { id: '4-3', description: 'Preparação de Elementos Construtivos', hours: 4, responsible: 'Eq. de Projectistas + Téc. Execução', completed: false },
      { id: '4-4', description: 'Revisão de Programa de Recursos', hours: 4, responsible: 'Eq. de Projectistas + Dono de Obra', completed: false },
      { id: '4-5', description: '4 Plantas', hours: 640, responsible: 'Eq. de Projectistas', completed: false },
      { id: '4-6', description: '4 Cortes', hours: 640, responsible: 'Eq. de Projectistas', completed: false },
      { id: '4-7', description: '4 Alçados', hours: 640, responsible: 'Eq. de Projectistas', completed: false },
      { id: '4-8', description: 'Pormenorização IS/Cozinhas 1:20', hours: 240, responsible: 'Eq. de Projectistas', completed: false },
      { id: '4-9', description: 'Mapas de Vãos', hours: 40, responsible: 'Eq. de Projectistas', completed: false },
      { id: '4-10', description: 'Prescrição de Sistemas Standard', hours: 20, responsible: 'Eq. de Projectistas', completed: false },
    ]
  },
  {
    number: 5,
    name: "Manufacturing and Construction",
    status: 'pending',
    tasks: [
      { id: '5-1', description: 'Consulta para Adjudicação da Empreitada', hours: 0, responsible: 'Eq. de Projectistas + Dono de Obra', completed: false },
      { id: '5-2', description: 'Definição Logística do Local', hours: 0, responsible: 'Eq. de Projectistas + Téc. Construção', completed: false },
      { id: '5-3', description: 'Acompanhamento do progresso da obra', hours: 100, responsible: 'Eq. de Projectistas + Téc. Construção', completed: false },
      { id: '5-4', description: 'Inspecção da Qualidade', hours: 0, responsible: 'Eq. de Projectistas', completed: false },
      { id: '5-5', description: 'Resolução de dúvidas in-loco', hours: 0, responsible: 'Eq. de Projectistas + Téc. Construção', completed: false },
      { id: '5-6', description: 'Revisão de Informação de Sistemas', hours: 20, responsible: 'Eq. de Projectistas', completed: false },
    ]
  },
  {
    number: 6,
    name: "Handover",
    status: 'pending',
    tasks: [
      { id: '6-1', description: 'Entrega do edifício', hours: 5, responsible: 'Eq. de Projectistas + Dono de Obra', completed: false },
      { id: '6-2', description: 'Revisões de Performance', hours: 0, responsible: 'Eq. de Projectistas', completed: false },
      { id: '6-3', description: 'Levantamento de Defeitos', hours: 0, responsible: 'Eq. de Projectistas', completed: false },
      { id: '6-4', description: 'Feedback sobre Performance', hours: 5, responsible: 'Eq. de Projectistas + Téc. Construção', completed: false },
      { id: '6-5', description: 'Certificados de Conclusão', hours: 0, responsible: 'Eq. de Projectistas + Téc. Construção', completed: false },
      { id: '6-6', description: 'Avaliação Pós-Ocupação', hours: 5, responsible: 'Eq. de Projectistas + Dono de Obra', completed: false },
    ]
  }
];

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'budget' | 'timeline'>('overview');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('archProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('archProjects', JSON.stringify(projects));
  }, [projects]);

  // Create new project
  const createProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      reference: projectData.reference || '',
      name: projectData.name || '',
      client: projectData.client || {
        name: '',
        company: '',
        address: '',
        nif: '',
        nipc: ''
      },
      parameters: projectData.parameters || {
        plotArea: 0,
        perimeter: 0,
        soilClassification: '',
        maxFloors: 2,
        maxImpermeabilization: 0.7,
        maxUtilization: 0.5,
        maxOccupation: 0.5,
        numberOfUnits: 1,
        maxAreaPerUnit: 0,
        totalBuildArea: 0,
        roadSetback: 6,
        sideSetback: 3,
        sideSetbackWithOpenings: 6
      },
      stages: defaultStages.map(stage => ({
        ...stage,
        totalHours: stage.tasks.reduce((sum, task) => sum + task.hours, 0)
      })),
      category: projectData.category || 'Cat.III',
      estimatedValue: projectData.estimatedValue || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setShowNewProjectForm(false);
  };

  // Update project
  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    ));
    if (selectedProject?.id === projectId) {
      setSelectedProject({ ...selectedProject, ...updates });
    }
  };

  // Update task
  const updateTask = (projectId: string, stageNumber: number, taskId: string, updates: Partial<Task>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedStages = project.stages.map(stage => {
      if (stage.number === stageNumber) {
        const updatedTasks = stage.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        );
        return {
          ...stage,
          tasks: updatedTasks,
          totalHours: updatedTasks.reduce((sum, task) => sum + task.hours, 0)
        };
      }
      return stage;
    });

    updateProject(projectId, { stages: updatedStages });
  };

  // Calculate fee based on parameters
  const calculateFee = (project: Project): number => {
    const { parameters, category } = project;
    const buildArea = parameters.totalBuildArea || (parameters.plotArea * parameters.maxUtilization);
    
    // Simplified fee calculation - you can adjust these rates
    const rates: Record<string, number> = {
      'Cat.I': 120, // €/m²
      'Cat.II': 150,
      'Cat.III': 180
    };
    
    return buildArea * rates[category];
  };

  // Export to Excel-like format (CSV)
  const exportProject = (project: Project) => {
    let csv = `Project Export: ${project.name}\n`;
    csv += `Reference: ${project.reference}\n`;
    csv += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    csv += `Client Information\n`;
    csv += `Name,${project.client.name}\n`;
    csv += `Company,${project.client.company}\n`;
    csv += `Address,${project.client.address}\n\n`;
    
    csv += `Project Parameters\n`;
    csv += `Plot Area,${project.parameters.plotArea} m²\n`;
    csv += `Max Build Area,${project.parameters.totalBuildArea} m²\n`;
    csv += `Estimated Value,€${project.estimatedValue.toLocaleString()}\n\n`;
    
    csv += `RIBA Stages\n`;
    csv += `Stage,Task,Hours,Responsible,Status\n`;
    
    project.stages.forEach(stage => {
      stage.tasks.forEach(task => {
        csv += `"${stage.name}","${task.description}",${task.hours},"${task.responsible}",${task.completed ? 'Completed' : 'Pending'}\n`;
      });
    });
    
    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.reference}_export.csv`;
    a.click();
  };

  // New Project Form Component
  const NewProjectForm = () => {
    const [formData, setFormData] = useState({
      reference: '',
      name: '',
      client: {
        name: '',
        company: '',
        address: '',
        nif: '',
        nipc: ''
      },
      parameters: {
        plotArea: 0,
        perimeter: 0,
        soilClassification: '',
        maxFloors: 2,
        maxImpermeabilization: 0.7,
        maxUtilization: 0.5,
        maxOccupation: 0.5,
        numberOfUnits: 1,
        maxAreaPerUnit: 0,
        totalBuildArea: 0,
        roadSetback: 6,
        sideSetback: 3,
        sideSetbackWithOpenings: 6
      },
      category: 'Cat.III' as const,
      estimatedValue: 0
    });

    useEffect(() => {
      // Auto-calculate areas
      const maxAreaPerUnit = formData.parameters.plotArea * formData.parameters.maxUtilization / formData.parameters.numberOfUnits;
      const totalBuildArea = maxAreaPerUnit * formData.parameters.numberOfUnits;
      
      setFormData(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          maxAreaPerUnit,
          totalBuildArea
        }
      }));
    }, [formData.parameters.plotArea, formData.parameters.maxUtilization, formData.parameters.numberOfUnits]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Novo Projecto</h2>
            
            {/* Project Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Informação do Projecto</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Referência (ex: 22.03_ARQ_HAB.UNI)"
                  className="p-2 border rounded"
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Nome do Projecto"
                  className="p-2 border rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Informação do Cliente</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome do Cliente"
                  className="p-2 border rounded"
                  value={formData.client.name}
                  onChange={(e) => setFormData({...formData, client: {...formData.client, name: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Empresa"
                  className="p-2 border rounded"
                  value={formData.client.company}
                  onChange={(e) => setFormData({...formData, client: {...formData.client, company: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Morada"
                  className="p-2 border rounded col-span-2"
                  value={formData.client.address}
                  onChange={(e) => setFormData({...formData, client: {...formData.client, address: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="NIF"
                  className="p-2 border rounded"
                  value={formData.client.nif}
                  onChange={(e) => setFormData({...formData, client: {...formData.client, nif: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="NIPC"
                  className="p-2 border rounded"
                  value={formData.client.nipc}
                  onChange={(e) => setFormData({...formData, client: {...formData.client, nipc: e.target.value}})}
                />
              </div>
            </div>

            {/* Parameters */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Parâmetros do Projecto</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Área do Lote (m²)</label>
                  <input
                    type="number"
                    className="p-2 border rounded w-full"
                    value={formData.parameters.plotArea}
                    onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, plotArea: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Perímetro (m)</label>
                  <input
                    type="number"
                    className="p-2 border rounded w-full"
                    value={formData.parameters.perimeter}
                    onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, perimeter: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">N.º de Pisos</label>
                  <input
                    type="number"
                    className="p-2 border rounded w-full"
                    value={formData.parameters.maxFloors}
                    onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, maxFloors: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Índice Impermeabilização</label>
                  <input
                    type="number"
                    step="0.1"
                    className="p-2 border rounded w-full"
                    value={formData.parameters.maxImpermeabilization}
                    onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, maxImpermeabilization: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Índice Utilização</label>
                  <input
                    type="number"
                    step="0.1"
                    className="p-2 border rounded w-full"
                    value={formData.parameters.maxUtilization}
                    onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, maxUtilization: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Índice Ocupação</label>
                  <input
                    type="number"
                    step="0.1"
                    className="p-2 border rounded w-full"
                    value={formData.parameters.maxOccupation}
                    onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, maxOccupation: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">N.º de Habitações</label>
                  <input
                    type="number"
                    className="p-2 border rounded w-full"
                    value={formData.parameters.numberOfUnits}
                    onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, numberOfUnits: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Categoria</label>
                  <select
                    className="p-2 border rounded w-full"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as 'Cat.I' | 'Cat.II' | 'Cat.III'})}
                  >
                    <option value="Cat.I">Cat.I</option>
                    <option value="Cat.II">Cat.II</option>
                    <option value="Cat.III">Cat.III (Inf.6M€)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Valor Estimado (€)</label>
                  <input
                    type="number"
                    className="p-2 border rounded w-full"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({...formData, estimatedValue: Number(e.target.value)}})}
                  />
                </div>
              </div>
              
              {/* Calculated values */}
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h4 className="font-semibold mb-2">Valores Calculados:</h4>
                <p>Área Máx. por Habitação: {formData.parameters.maxAreaPerUnit.toFixed(2)} m²</p>
                <p>Área Total de Construção: {formData.parameters.totalBuildArea.toFixed(2)} m²</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewProjectForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => createProject(formData)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Criar Projecto
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Gestão de Projectos</h1>
            </div>
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Novo Projecto
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Project List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Projectos</h2>
            <div className="space-y-2">
              {projects.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum projecto criado</p>
              ) : (
                projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedProject?.id === project.id
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <p className="font-medium text-sm">{project.reference}</p>
                    <p className="text-xs text-gray-600">{project.name}</p>
                    <p className="text-xs text-gray-500">{project.client.name}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-3">
            {selectedProject ? (
              <>
                {/* Project Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                      <p className="text-gray-600">{selectedProject.reference}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportProject(selectedProject)}
                        className="p-2 text-gray-600 hover:text-gray-800"
                        title="Exportar"
                      >
                        <FileDown className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setProjects(projects.filter(p => p.id !== selectedProject.id));
                          setSelectedProject(null);
                        }}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium">{selectedProject.client.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Categoria</p>
                      <p className="font-medium">{selectedProject.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Área Total</p>
                      <p className="font-medium">{selectedProject.parameters.totalBuildArea.toFixed(0)} m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Honorários Est.</p>
                      <p className="font-medium">€{calculateFee(selectedProject).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="border-b">
                    <nav className="flex -mb-px">
                      {(['overview', 'stages', 'budget', 'timeline'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-2 px-6 text-sm font-medium ${
                            activeTab === tab
                              ? 'border-b-2 border-blue-500 text-blue-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab === 'overview' && 'Visão Geral'}
                          {tab === 'stages' && 'Fases RIBA'}
                          {tab === 'budget' && 'Orçamento'}
                          {tab === 'timeline' && 'Cronograma'}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Parâmetros do Projecto</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-600">Área do Lote</p>
                              <p className="font-medium">{selectedProject.parameters.plotArea} m²</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-600">N.º de Pisos</p>
                              <p className="font-medium">{selectedProject.parameters.maxFloors}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-600">Índice Utilização</p>
                              <p className="font-medium">{selectedProject.parameters.maxUtilization}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-600">N.º Habitações</p>
                              <p className="font-medium">{selectedProject.parameters.numberOfUnits}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-600">Área por Habitação</p>
                              <p className="font-medium">{selectedProject.parameters.maxAreaPerUnit.toFixed(2)} m²</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-600">Afastamento Estrada</p>
                              <p className="font-medium">{selectedProject.parameters.roadSetback} m</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Progresso Geral</h3>
                          <div className="space-y-3">
                            {selectedProject.stages.map(stage => {
                              const completedTasks = stage.tasks.filter(t => t.completed).length;
                              const progress = (completedTasks / stage.tasks.length) * 100;
                              
                              return (
                                <div key={stage.number} className="flex items-center gap-4">
                                  <span className="text-sm font-medium w-32">Stage {stage.number}</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600 w-20 text-right">
                                    {stage.totalHours}h
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stages Tab */}
                    {activeTab === 'stages' && (
                      <div className="space-y-6">
                        {selectedProject.stages.map(stage => (
                          <div key={stage.number} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">
                                Stage {stage.number}: {stage.name}
                              </h3>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                  Total: {stage.totalHours} horas
                                </span>
                                <span className={`px-2 py-1 text-xs rounded ${
                                  stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  stage.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {stage.status === 'completed' ? 'Concluído' :
                                   stage.status === 'active' ? 'Em Progresso' : 'Pendente'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {stage.tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={(e) => updateTask(selectedProject.id, stage.number, task.id, { completed: e.target.checked })}
                                    className="w-4 h-4 text-blue-600"
                                  />
                                  <div className="flex-1">
                                    <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                      {task.description}
                                    </p>
                                    <p className="text-xs text-gray-500">{task.responsible}</p>
                                  </div>
                                  <input
                                    type="number"
                                    value={task.hours}
                                    onChange={(e) => updateTask(selectedProject.id, stage.number, task.id, { hours: Number(e.target.value) })}
                                    className="w-16 p-1 text-sm border rounded text-right"
                                  />
                                  <span className="text-sm text-gray-600">h</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Budget Tab */}
                    {activeTab === 'budget' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 mb-1">Valor Estimado da Obra</p>
                            <p className="text-2xl font-bold text-blue-900">
                              €{selectedProject.estimatedValue.toLocaleString()}
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 mb-1">Honorários Calculados</p>
                            <p className="text-2xl font-bold text-green-900">
                              €{calculateFee(selectedProject).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Distribuição por Fase</h3>
                          <div className="space-y-2">
                            {selectedProject.stages.map(stage => {
                              const stagePercentage = (stage.totalHours / selectedProject.stages.reduce((sum, s) => sum + s.totalHours, 0)) * 100;
                              const stageFee = (calculateFee(selectedProject) * stagePercentage) / 100;
                              
                              return (
                                <div key={stage.number} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                  <span className="font-medium">Stage {stage.number}</span>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">{stage.totalHours}h</span>
                                    <span className="text-sm text-gray-600">({stagePercentage.toFixed(1)}%)</span>
                                    <span className="font-medium">€{stageFee.toLocaleString()}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timeline Tab */}
                    {activeTab === 'timeline' && (
                      <div className="space-y-6">
                        <p className="text-gray-600">
                          Funcionalidade de cronograma em desenvolvimento...
                        </p>
                        <div className="space-y-2">
                          {selectedProject.stages.map((stage, index) => (
                            <div key={stage.number} className="flex items-center gap-4">
                              <div className="w-20 text-sm font-medium">Stage {stage.number}</div>
                              <div className="flex-1 bg-gray-100 rounded-lg p-3">
                                <div className="font-medium text-sm">{stage.name}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {stage.totalHours} horas • {stage.tasks.length} tarefas
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selecione um projecto ou crie um novo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Project Form Modal */}
      {showNewProjectForm && <NewProjectForm />}
    </div>
  );
}

export default App;
