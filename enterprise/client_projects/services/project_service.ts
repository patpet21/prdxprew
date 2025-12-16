
import { ProjectEntity, ProjectIntakeData } from "../domain/project.entity";
import { ProjectStatus } from "../domain/project_status.enum";
import { EnterpriseAI } from "../../services/ai/ai_manager";
import { v4 as uuidv4 } from 'uuid';

export class ProjectService {
  private projects: ProjectEntity[] = [];

  constructor() {
    // Seed with a demo project
    this.projects.push({
      id: '1',
      name: 'Alpha Resort',
      ownerId: 'demo-user',
      status: ProjectStatus.INTAKE_COMPLETED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      intake: {
        projectName: 'Alpha Resort',
        assetType: 'Real Estate',
        location: 'Aspen, USA',
        goal: 'Liquidity',
        targetRaise: 5000000,
        targetInvestor: 'Accredited',
        timeline: '3-6 Months',
        description: 'Luxury ski resort tokenization for fractional ownership.'
      },
      summary: {
        executiveSummary: 'High-potential luxury real estate offering targeting accredited investors via Reg D.',
        feasibilityScore: 85,
        keyRisks: ['Seasonality of revenue', 'SEC compliance overhead'],
        recommendedStructure: 'Delaware LLC / Reg D 506(c)'
      }
    });
  }

  async listProjects(filters?: any): Promise<ProjectEntity[]> {
    // Simulate async
    return new Promise(resolve => setTimeout(() => resolve([...this.projects]), 500));
  }

  async getProject(id: string): Promise<ProjectEntity | undefined> {
    return this.projects.find(p => p.id === id);
  }

  async createProject(input: ProjectIntakeData): Promise<ProjectEntity> {
    // 1. Run AI Normalization & Review (Simulated here, would be workflow in real engine)
    const reviewJson = await EnterpriseAI.generateJSON(
      "Senior Tokenization Consultant",
      `Review this project intake: ${JSON.stringify(input)}. Generate a feasibility assessment matching the schema.`,
      {
        executiveSummary: "Summary string",
        feasibilityScore: 85,
        keyRisks: ["Risk 1", "Risk 2"],
        recommendedStructure: "Structure suggestion"
      }
    );

    const newProject: ProjectEntity = {
      id: uuidv4(),
      name: input.projectName,
      ownerId: 'current-user', // Mock
      status: ProjectStatus.INTAKE_COMPLETED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      intake: input,
      summary: reviewJson as any
    };

    this.projects.unshift(newProject);
    return newProject;
  }

  async updateProject(id: string, patch: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Project not found");

    const updated = {
      ...this.projects[idx],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    
    this.projects[idx] = updated;
    return updated;
  }

  async runOnboarding(id: string): Promise<void> {
    console.log(`Triggering onboarding workflow for ${id}...`);
    // In a real system, this triggers the workflow engine
  }
}

export const projectService = new ProjectService();
